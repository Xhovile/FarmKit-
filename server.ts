import "dotenv/config";
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { adminAuth } from './server/firebaseAdmin';
import * as db from './server/db';
import { authenticate as authMiddleware, AuthRequest } from './server/authMiddleware';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ dest: 'uploads/' });

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: "1mb" }));

  // Initialize PostgreSQL database
  try {
    await db.initDb();
    console.log('PostgreSQL database initialized');
  } catch (error) {
    console.error('Failed to initialize PostgreSQL database:', error);
  }

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // --- User Routes ---
  app.get('/api/users/me', authMiddleware, async (req: AuthRequest, res) => {
    try {
      const result = await db.query('SELECT * FROM users WHERE uid = $1', [req.user?.uid]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(result.rows[0]);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/users', authMiddleware, async (req: AuthRequest, res) => {
    const { name, email, phone, location, bio, avatar, primaryRole, roles, status, emailVerified, sellerProfile, organizationProfile } = req.body;
    const uid = req.user?.uid;

    try {
      const result = await db.query(
        `INSERT INTO users (uid, name, email, phone, location, bio, avatar, primary_role, roles, status, email_verified, seller_profile, organization_profile)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
         ON CONFLICT (uid) DO UPDATE SET
           name = EXCLUDED.name,
           phone = EXCLUDED.phone,
           location = EXCLUDED.location,
           bio = EXCLUDED.bio,
           avatar = EXCLUDED.avatar,
           primary_role = EXCLUDED.primary_role,
           roles = EXCLUDED.roles,
           status = EXCLUDED.status,
           email_verified = EXCLUDED.email_verified,
           seller_profile = EXCLUDED.seller_profile,
           organization_profile = EXCLUDED.organization_profile,
           updated_at = CURRENT_TIMESTAMP
         RETURNING *`,
        [uid, name, email, phone, location, bio, avatar, primaryRole, roles, status, emailVerified, JSON.stringify(sellerProfile), JSON.stringify(organizationProfile)]
      );
      res.json(result.rows[0]);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // --- Market Listing Routes ---
  app.get('/api/market-listings', async (req, res) => {
    try {
      const result = await db.query('SELECT * FROM market_listings WHERE status = \'active\' ORDER BY created_at DESC');
      res.json(result.rows);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/market-listings/:id', async (req, res) => {
    try {
      const result = await db.query('SELECT * FROM market_listings WHERE id = $1', [req.params.id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Listing not found' });
      }
      res.json(result.rows[0]);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/market-listings', authMiddleware, async (req: AuthRequest, res) => {
    const {
      title, category, price, unit, quantity, availableQuantity, soldQuantity,
      location, deliveryMethod, description, businessName, phone,
      sellerName, sellerStatus, verified, imageUrl, imageUrls
    } = req.body;
    const sellerId = req.user?.uid;

    try {
      const result = await db.query(
        `INSERT INTO market_listings (
          title, category, price, unit, quantity, available_quantity, sold_quantity,
          location, delivery_method, description, business_name, phone,
          seller_id, seller_name, seller_status, verified, image_url, image_urls
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
        RETURNING *`,
        [
          title, category, price, unit, quantity, availableQuantity, soldQuantity,
          location, deliveryMethod, description, businessName, phone,
          sellerId, sellerName, sellerStatus, verified, imageUrl, imageUrls
        ]
      );
      res.json(result.rows[0]);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put('/api/market-listings/:id', authMiddleware, async (req: AuthRequest, res) => {
    const {
      title, category, price, unit, quantity, availableQuantity, soldQuantity,
      location, deliveryMethod, description, businessName, phone,
      imageUrl, imageUrls, status
    } = req.body;
    const sellerId = req.user?.uid;

    try {
      // Check ownership
      const check = await db.query('SELECT seller_id FROM market_listings WHERE id = $1', [req.params.id]);
      if (check.rows.length === 0) return res.status(404).json({ error: 'Listing not found' });
      if (check.rows[0].seller_id !== sellerId) return res.status(403).json({ error: 'Unauthorized' });

      const result = await db.query(
        `UPDATE market_listings SET
          title = $1, category = $2, price = $3, unit = $4, quantity = $5,
          available_quantity = $6, sold_quantity = $7, location = $8,
          delivery_method = $9, description = $10, business_name = $11,
          phone = $12, image_url = $13, image_urls = $14, status = $15,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $16 RETURNING *`,
        [
          title, category, price, unit, quantity, availableQuantity, soldQuantity,
          location, deliveryMethod, description, businessName, phone,
          imageUrl, imageUrls, status || 'active', req.params.id
        ]
      );
      res.json(result.rows[0]);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete('/api/market-listings/:id', authMiddleware, async (req: AuthRequest, res) => {
    const sellerId = req.user?.uid;
    try {
      const result = await db.query('DELETE FROM market_listings WHERE id = $1 AND seller_id = $2 RETURNING *', [req.params.id, sellerId]);
      if (result.rows.length === 0) return res.status(404).json({ error: 'Listing not found or unauthorized' });
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // --- Buyer Request Routes ---
  app.get('/api/buyer-requests', async (req, res) => {
    try {
      const result = await db.query('SELECT * FROM buyer_requests WHERE status = \'open\' ORDER BY created_at DESC');
      res.json(result.rows);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/buyer-requests', authMiddleware, async (req: AuthRequest, res) => {
    const {
      commodity, category, quantity, unit, priceRange, location, urgency, buyerName, phone
    } = req.body;
    const buyerId = req.user?.uid;

    try {
      const result = await db.query(
        `INSERT INTO buyer_requests (
          commodity, category, quantity, unit, price_range, location, urgency, buyer_id, buyer_name, phone
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *`,
        [commodity, category, quantity, unit, priceRange, location, urgency, buyerId, buyerName, phone]
      );
      res.json(result.rows[0]);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // --- Saved Listings Routes ---
  app.get('/api/saved-listings', authMiddleware, async (req: AuthRequest, res) => {
    try {
      const result = await db.query(
        `SELECT ml.* FROM market_listings ml
         JOIN saved_listings sl ON ml.id = sl.listing_id
         WHERE sl.user_id = $1`,
        [req.user?.uid]
      );
      res.json(result.rows);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/saved-listings/:id', authMiddleware, async (req: AuthRequest, res) => {
    try {
      await db.query(
        'INSERT INTO saved_listings (user_id, listing_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [req.user?.uid, req.params.id]
      );
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete('/api/saved-listings/:id', authMiddleware, async (req: AuthRequest, res) => {
    try {
      await db.query(
        'DELETE FROM saved_listings WHERE user_id = $1 AND listing_id = $2',
        [req.user?.uid, req.params.id]
      );
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/market-listings/:id/increment-views', authMiddleware, async (req: AuthRequest, res) => {
    try {
      await db.query(
        'UPDATE market_listings SET views_count = views_count + 1, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
        [req.params.id]
      );
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/market-listings/:id/increment-shares', authMiddleware, async (req: AuthRequest, res) => {
    try {
      await db.query(
        'UPDATE market_listings SET shares_count = shares_count + 1, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
        [req.params.id]
      );
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // User Stats
  app.get('/api/users/me/stats', authMiddleware, async (req: any, res) => {
    try {
      const uid = req.user.uid;
      
      const listingsResult = await db.query(
        'SELECT status, available_quantity, quantity FROM market_listings WHERE seller_id = $1',
        [uid]
      );
      
      const requestsResult = await db.query(
        'SELECT status FROM buyer_requests WHERE buyer_id = $1',
        [uid]
      );
      
      const savedResult = await db.query(
        'SELECT COUNT(*) FROM saved_listings WHERE user_id = $1',
        [uid]
      );

      const listings = listingsResult.rows;
      const requests = requestsResult.rows;

      const stats = {
        savedCount: parseInt(savedResult.rows[0].count),
        totalRequests: requests.length,
        openRequests: requests.filter(r => r.status === 'open').length,
        matchedRequests: requests.filter(r => r.status === 'matched').length,
        closedRequests: requests.filter(r => r.status === 'closed').length,
        totalListings: listings.length,
        activeListings: listings.filter(l => l.status === 'active').length,
        soldListings: listings.filter(l => l.status === 'sold').length,
        hiddenListings: listings.filter(l => l.status === 'hidden').length,
        lowStockListings: listings.filter(l => {
          const available = l.available_quantity ?? l.quantity ?? 0;
          const total = l.quantity ?? 0;
          return available > 0 && total > 0 && available <= total * 0.2;
        }).length,
      };

      res.json(stats);
    } catch (error) {
      console.error('Error fetching user stats:', error);
      res.status(500).json({ error: 'Failed to fetch user stats' });
    }
  });

  // Serve Firebase config securely
  app.get('/api/config/firebase', (req, res) => {
    try {
      const configPath = path.join(__dirname, 'firebase-applet-config.json');
      if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        res.json(config);
      } else {
        res.status(404).json({ error: 'Firebase config not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to load Firebase config' });
    }
  });

  // Cloudinary Upload Proxy
  app.post('/api/upload', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'farmkit',
        upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
      });

      // Clean up local file
      fs.unlinkSync(req.file.path);

      res.json({ url: result.secure_url });
    } catch (error: any) {
      console.error('Upload error:', error);
      if (req.file) fs.unlinkSync(req.file.path);
      res.status(500).json({ error: error.message || 'Upload failed' });
    }
  });

  app.post('/api/account/delete', authMiddleware, async (req: any, res) => {
    try {
      const uid = req.user.uid;

      // Delete from PostgreSQL
      await db.query('DELETE FROM users WHERE uid = $1', [uid]);

      // Then delete auth user
      await adminAuth.deleteUser(uid);

      return res.json({ success: true });
    } catch (error: any) {
      console.error('Delete account error:', error);
      return res.status(500).json({
        error: error.message || 'Failed to delete account',
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
