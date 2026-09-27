import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with specific databaseId as required by Firebase skill
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// Connection test helper according to skill instructions
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes('the client is offline') || message.includes('unavailable') || message.includes('offline')) {
      console.info('Firebase operating with local offline cache fallback.');
    }
  }
}

// Test connection without blocking initialization
if (typeof window !== 'undefined') {
  setTimeout(() => {
    testConnection();
  }, 1000);
}

