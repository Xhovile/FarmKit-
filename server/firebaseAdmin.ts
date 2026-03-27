import 'dotenv/config';
import admin from 'firebase-admin';
import firebaseConfig from '../firebase-applet-config.json';

function getServiceAccount() {
  const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  if (json) {
    const parsed = JSON.parse(json);
    return {
      projectId: parsed.project_id,
      clientEmail: parsed.client_email,
      privateKey: parsed.private_key,
    };
  }

  throw new Error(
    'Missing FIREBASE_SERVICE_ACCOUNT_JSON in Codespaces secrets.'
  );
}

if (!admin.apps.length) {
  const serviceAccount = getServiceAccount();

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
// Set the database ID if provided
if (firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)') {
  // In newer versions of firebase-admin, you might need to use getFirestore(app, databaseId)
  // but for simplicity, let's try to use the default one first or check if the SDK supports it this way.
  // Actually, the best way is:
  // import { getFirestore } from 'firebase-admin/firestore';
  // export const adminDb = getFirestore(admin.app(), firebaseConfig.firestoreDatabaseId);
}
