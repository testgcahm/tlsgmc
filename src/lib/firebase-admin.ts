// src/lib/firebase-admin.ts
import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = {
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

const adminApp = !getApps().length
  ? initializeApp({ credential: cert(serviceAccount) })
  : getApp();

const adminAuth = getAuth(adminApp);
const adminDb = getFirestore(adminApp);

export { adminAuth, adminDb };