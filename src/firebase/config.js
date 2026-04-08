import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Hardcoded config as fallback to rule out env var loading issues
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyA3NKszufveErqGq1YZNCSCggQ1b19Rlxc',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'webchat-9c3b9.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'webchat-9c3b9',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'webchat-9c3b9.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '640710004264',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:640710004264:web:aa12d61dac15fae9632f1d',
};

console.log('[Firebase] Connecting to project:', firebaseConfig.projectId);

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, "default"); // CRITICAL: Explicitly targets the 'default' database instead of '(default)'
export default app;
