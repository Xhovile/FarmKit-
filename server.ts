import "dotenv/config";
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { adminAuth, adminDb } from './server/firebaseAdmin';
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

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
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

  app.post('/api/account/delete', async (req, res) => {
    try {
      const authHeader = req.headers.authorization || '';
      const token = authHeader.startsWith('Bearer ')
        ? authHeader.slice(7)
        : '';

      if (!token) {
        return res.status(401).json({ error: 'Missing auth token' });
      }

      const decoded = await adminAuth.verifyIdToken(token);
      const uid = decoded.uid;

      // Delete Firestore profile first
      await adminDb.collection('users').doc(uid).delete();

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
