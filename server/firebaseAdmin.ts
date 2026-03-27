import 'dotenv/config';
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import firebaseConfig from '../firebase-applet-config.json';

function getServiceAccount() {
  const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  if (json) {
    try {
      const parsed = JSON.parse(json);
      return {
        projectId: parsed.project_id,
        clientEmail: parsed.client_email,
        privateKey: parsed.private_key,
      };
    } catch (e) {
      console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON');
    }
  }

  // Fallback to null to allow default credential usage if possible
  return null;
}

let adminApp: admin.app.App | null = null;

function getAdminApp() {
  if (!adminApp) {
    const serviceAccount = getServiceAccount();
    if (serviceAccount) {
      adminApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } else {
      // Fallback to default credentials
      adminApp = admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      });
    }
  }
  return adminApp;
}

export const adminAuth = () => getAdminApp().auth();
export const adminDb = () => {
  const app = getAdminApp();
  const databaseId = firebaseConfig.firestoreDatabaseId;
  
  if (databaseId && databaseId !== '(default)') {
    return getFirestore(app, databaseId);
  }
  
  return getFirestore(app);
};
