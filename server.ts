import "dotenv/config";
import dns from 'dns';

// Force IPv4 resolution early to avoid ECONNREFUSED issues with IPv6
if (typeof dns.setDefaultResultOrder === 'function') {
  dns.setDefaultResultOrder('ipv4first');
}

import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { adminAuth, adminDb } from './server/firebaseAdmin';
import admin from 'firebase-admin';
// import * as db from './server/db';
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

// Helper to convert snake_case object to camelCase
const toCamelCase = (obj: any): any => {
  if (Array.isArray(obj)) return obj.map(toCamelCase);
  if (obj !== null && typeof obj === 'object') {
    // Handle Firestore Timestamp
    if (typeof obj.toDate === 'function') {
      return obj.toDate().toISOString();
    }
    // Handle Date
    if (obj instanceof Date) {
      return obj.toISOString();
    }
    // Handle plain object
    if (obj.constructor === Object) {
      return Object.keys(obj).reduce((acc: any, key) => {
        const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
        acc[camelKey] = toCamelCase(obj[key]);
        return acc;
      }, {});
    }
  }
  return obj;
};

async function startServer() {
  console.log('Starting server...');
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "1mb" }));

  // Logging middleware
  app.use((req, res, next) => {
    console.log(`[Server] ${req.method} ${req.url}`);
    next();
  });

  try {
    // Initialize Firestore collections (optional, but good for structure)
    const db = adminDb();
    console.log('Firestore admin SDK initialized');
  } catch (err) {
    console.error('Failed to initialize Firestore admin SDK:', err);
  }

  // API routes
  app.get("/api/health", async (req, res) => {
    try {
      // Simple check for Firestore
      const db = adminDb();
      await db.collection('health').doc('check').get();
      res.json({ status: "ok", database: "connected" });
    } catch (error: any) {
      res.status(503).json({ status: "error", database: "disconnected", error: error.message });
    }
  });

  // --- User Routes ---
  app.get('/api/users/me', authMiddleware, async (req: AuthRequest, res) => {
    try {
      const db = adminDb();
      const userDoc = await db.collection('users').doc(req.user?.uid!).get();
      if (!userDoc.exists) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(toCamelCase(userDoc.data()));
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/users', authMiddleware, async (req: AuthRequest, res) => {
    const { name, email, phone, location, bio, avatar, primaryRole, roles, status, emailVerified, sellerProfile, organizationProfile } = req.body;
    const uid = req.user?.uid;

    try {
      const db = adminDb();
      const userRef = db.collection('users').doc(uid!);
      const userData = {
        uid, name, email, phone, location, bio, avatar, primaryRole: primaryRole || null, roles: roles || [], status, emailVerified, sellerProfile, organizationProfile,
        updatedAt: new Date().toISOString()
      };
      
      await userRef.set(userData, { merge: true });
      const updatedDoc = await userRef.get();
      res.json(toCamelCase(updatedDoc.data()));
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put('/api/users/me', authMiddleware, async (req: AuthRequest, res) => {
    const uid = req.user?.uid;
    const updates = req.body;
    
    try {
      const userRef = adminDb().collection('users').doc(uid!);
      await userRef.set({ ...updates, updatedAt: new Date().toISOString() }, { merge: true });
      const updatedDoc = await userRef.get();
      res.json(toCamelCase(updatedDoc.data()));
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // --- Market Listing Routes ---
  app.get('/api/market-listings', async (req, res) => {
    console.log('GET /api/market-listings hit');
    try {
      const snapshot = await adminDb().collection('market_listings')
        .where('status', '==', 'active')
        .get();
      
      const listings = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

      // Sort in-memory to avoid composite index requirement
      listings.sort((a: any, b: any) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });

      res.json(toCamelCase(listings));
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/users/me/listings', authMiddleware, async (req: AuthRequest, res) => {
    try {
      const uid = req.user?.uid;
      const snapshot = await adminDb().collection('market_listings')
        .where('sellerId', '==', uid)
        .get();
      
      const listings = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Sort in-memory
      listings.sort((a: any, b: any) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });

      res.json(toCamelCase(listings));
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/market-listings/:id/relist', authMiddleware, async (req: AuthRequest, res) => {
    const sellerId = req.user?.uid;
    const { quantity, price } = req.body;

    try {
      const docRef = adminDb().collection('market_listings').doc(req.params.id);
      const doc = await docRef.get();
      
      if (!doc.exists) return res.status(404).json({ error: 'Listing not found' });
      if (doc.data()?.sellerId !== sellerId) return res.status(403).json({ error: 'Unauthorized' });

      const updates: any = {
        status: 'active',
        updatedAt: new Date().toISOString()
      };

      if (quantity !== undefined) {
        updates.quantity = Number(quantity);
        updates.availableQuantity = Number(quantity);
        updates.soldQuantity = 0;
      }

      if (price !== undefined) {
        updates.price = Number(price);
      }

      await docRef.update(updates);
      const updatedDoc = await docRef.get();
      res.json(toCamelCase({ id: updatedDoc.id, ...updatedDoc.data() }));
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/market-listings/:id', async (req, res) => {
    try {
      const doc = await adminDb().collection('market_listings').doc(req.params.id).get();
      if (!doc.exists) {
        return res.status(404).json({ error: 'Listing not found' });
      }
      res.json(toCamelCase({ id: doc.id, ...doc.data() }));
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/market-listings', authMiddleware, async (req: AuthRequest, res) => {
    const data = req.body;
    const sellerId = req.user?.uid;

    try {
      const listingData = {
        ...data,
        sellerId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        viewsCount: 0,
        sharesCount: 0
      };
      
      const docRef = await adminDb().collection('market_listings').add(listingData);
      const newDoc = await docRef.get();
      res.json(toCamelCase({ id: newDoc.id, ...newDoc.data() }));
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put('/api/market-listings/:id', authMiddleware, async (req: AuthRequest, res) => {
    const updates = req.body;
    const sellerId = req.user?.uid;

    try {
      const docRef = adminDb().collection('market_listings').doc(req.params.id);
      const doc = await docRef.get();
      
      if (!doc.exists) return res.status(404).json({ error: 'Listing not found' });
      if (doc.data()?.sellerId !== sellerId) return res.status(403).json({ error: 'Unauthorized' });

      await docRef.set({ ...updates, updatedAt: new Date().toISOString() }, { merge: true });
      const updatedDoc = await docRef.get();
      res.json(toCamelCase({ id: updatedDoc.id, ...updatedDoc.data() }));
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete('/api/market-listings/:id', authMiddleware, async (req: AuthRequest, res) => {
    const sellerId = req.user?.uid;
    try {
      const docRef = adminDb().collection('market_listings').doc(req.params.id);
      const doc = await docRef.get();
      
      if (!doc.exists) return res.status(404).json({ error: 'Listing not found' });
      if (doc.data()?.sellerId !== sellerId) return res.status(403).json({ error: 'Unauthorized' });

      await docRef.delete();
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // --- Market Demand Routes ---
  app.get('/api/market-demands', async (req, res) => {
    try {
      const snapshot = await adminDb().collection('market_demands')
        .where('status', '==', 'open')
        .get();
      
      const requests = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Sort in-memory to avoid composite index requirement
      requests.sort((a: any, b: any) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });

      res.json(toCamelCase(requests));
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/market-demands', authMiddleware, async (req: AuthRequest, res) => {
    const data = req.body;
    const userId = req.user?.uid;

    try {
      const requestData = {
        ...data,
        userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const docRef = await adminDb().collection('market_demands').add(requestData);
      const newDoc = await docRef.get();
      res.json(toCamelCase({ id: newDoc.id, ...newDoc.data() }));
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put('/api/market-demands/:id', authMiddleware, async (req: AuthRequest, res) => {
    const updates = req.body;
    const userId = req.user?.uid;

    try {
      const docRef = adminDb().collection('market_demands').doc(req.params.id);
      const doc = await docRef.get();
      
      if (!doc.exists) return res.status(404).json({ error: 'Demand not found' });
      if (doc.data()?.userId !== userId) return res.status(403).json({ error: 'Unauthorized' });

      await docRef.set({ ...updates, updatedAt: new Date().toISOString() }, { merge: true });
      const updatedDoc = await docRef.get();
      res.json(toCamelCase({ id: updatedDoc.id, ...updatedDoc.data() }));
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/admin/verify-user/:uid', authMiddleware, async (req: AuthRequest, res) => {
    // Basic admin check
    const isAdmin = req.user?.email === 'isaacmtsiriza310@gmail.com';
    if (!isAdmin) return res.status(403).json({ error: 'Forbidden: Admin access required' });

    const { status, rejectionReason } = req.body;
    const targetUid = req.params.uid;

    try {
      const db = adminDb();
      const userRef = db.collection('users').doc(targetUid);
      
      const verificationUpdate: any = {
        'verification.status': status,
        'verification.reviewedAt': new Date().toISOString()
      };
      if (rejectionReason) verificationUpdate['verification.rejectionReason'] = rejectionReason;

      // If verified, also update the main user status to 'verified'
      if (status === 'verified') {
        verificationUpdate.status = 'verified';
      }

      await userRef.update(verificationUpdate);

      if (status === 'verified') {
        // Update all user's listings to be verified
        const listingsSnapshot = await db.collection('market_listings')
          .where('sellerId', '==', targetUid)
          .get();
        
        const batch = db.batch();
        listingsSnapshot.docs.forEach(doc => {
          batch.update(doc.ref, { verified: true });
        });
        await batch.commit();
      }

      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // --- Saved Listings Routes ---
  app.get('/api/saved-listings', authMiddleware, async (req: AuthRequest, res) => {
    try {
      const uid = req.user?.uid;
      const savedSnapshot = await adminDb().collection('users').doc(uid!).collection('saved_listings').get();
      const listingIds = savedSnapshot.docs.map(doc => doc.data().listingId);
      
      if (listingIds.length === 0) return res.json([]);

      const listingsSnapshot = await adminDb().collection('market_listings')
        .where('__name__', 'in', listingIds)
        .get();
      
      const listings = listingsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      res.json(toCamelCase(listings));
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/saved-listings/:id', authMiddleware, async (req: AuthRequest, res) => {
    try {
      const uid = req.user?.uid;
      await adminDb().collection('users').doc(uid!).collection('saved_listings').doc(req.params.id).set({
        listingId: req.params.id,
        savedAt: new Date().toISOString()
      });
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete('/api/saved-listings/:id', authMiddleware, async (req: AuthRequest, res) => {
    try {
      const uid = req.user?.uid;
      await adminDb().collection('users').doc(uid!).collection('saved_listings').doc(req.params.id).delete();
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/market-listings/:id/increment-views', authMiddleware, async (req: AuthRequest, res) => {
    try {
      const docRef = adminDb().collection('market_listings').doc(req.params.id);
      await docRef.update({
        viewsCount: admin.firestore.FieldValue.increment(1),
        updatedAt: new Date().toISOString()
      });
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/market-listings/:id/increment-shares', authMiddleware, async (req: AuthRequest, res) => {
    try {
      const docRef = adminDb().collection('market_listings').doc(req.params.id);
      await docRef.update({
        sharesCount: admin.firestore.FieldValue.increment(1),
        updatedAt: new Date().toISOString()
      });
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // User Stats
  app.get('/api/users/me/stats', authMiddleware, async (req: any, res) => {
    console.log(`[API] GET /api/users/me/stats - User: ${req.user?.uid}`);
    try {
      const uid = req.user.uid;
      
      console.log(`[API] Fetching stats for user ${uid}...`);
      
      const listingsSnapshot = await adminDb().collection('market_listings')
        .where('sellerId', '==', uid)
        .get();
      
      const demandsSnapshot = await adminDb().collection('market_demands')
        .where('userId', '==', uid)
        .get();
      
      const savedSnapshot = await adminDb().collection('users').doc(uid).collection('saved_listings').get();

      const listings = listingsSnapshot.docs.map(d => d.data());
      const demands = demandsSnapshot.docs.map(d => d.data());

      console.log(`[API] Found ${listings.length} listings and ${demands.length} demands for user ${uid}`);

      const stats = {
        savedCount: savedSnapshot.size,
        totalDemands: demands.length,
        openDemands: demands.filter(r => r.status === 'open').length,
        matchedDemands: demands.filter(r => r.status === 'matched').length,
        closedDemands: demands.filter(r => r.status === 'closed').length,
        totalListings: listings.length,
        activeListings: listings.filter(l => l.status === 'active').length,
        soldListings: listings.filter(l => l.status === 'sold').length,
        hiddenListings: listings.filter(l => l.status === 'hidden').length,
        lowStockListings: listings.filter(l => {
          const available = l.availableQuantity ?? l.quantity ?? 0;
          const total = l.quantity ?? 0;
          return available > 0 && total > 0 && available <= total * 0.2;
        }).length,
      };

      console.log(`[API] Stats calculated for user ${uid}:`, stats);
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

      // Delete from Firestore
      await adminDb().collection('users').doc(uid).delete();
      
      // Note: In a real app, you might want to delete their listings too, 
      // but for now we just delete the user profile.

      // Then delete auth user
      await adminAuth().deleteUser(uid);

      return res.json({ success: true });
    } catch (error: any) {
      console.error('Delete account error:', error);
      return res.status(500).json({
        error: error.message || 'Failed to delete account',
      });
    }
  });

  // Catch-all for API routes to prevent falling through to SPA fallback
  app.all('/api/*', (req, res) => {
    console.warn(`[Server] Unmatched API route: ${req.method} ${req.url}`);
    res.status(404).json({ error: `API route not found: ${req.method} ${req.url}` });
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
