import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';

// Firebase Configuration from environment variables
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyDnw7z_yqippFukRCrtkY52wf5DB6snDGY',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'tour-be7bd.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'tour-be7bd',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'tour-be7bd.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '310645502162',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:310645502162:web:7fe3d5d3518a74af277d0b',
};

// Check if Firebase config is properly configured (not using defaults)
const isFirebaseConfigValid = !!(
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
);

// Lazy initialization
let appInstance: FirebaseApp | null = null;
let authInstance: Auth | null = null;

export function initializeFirebase(): { app: FirebaseApp | null; auth: Auth | null } {
  if (!isFirebaseConfigValid) {
    if (typeof window !== 'undefined') {
      console.warn(
        '[Firebase] Configuration incomplete. Please set these environment variables:\n' +
        '• NEXT_PUBLIC_FIREBASE_API_KEY\n' +
        '• NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN\n' +
        '• NEXT_PUBLIC_FIREBASE_PROJECT_ID\n' +
        '• NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET\n' +
        '• NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID\n' +
        '• NEXT_PUBLIC_FIREBASE_APP_ID\n\n' +
        'Using fallback configuration for development.'
      );
    }
    // Continue anyway with fallback config for local development
  }

  try {
    if (!appInstance) {
      if (getApps().length === 0) {
        appInstance = initializeApp(firebaseConfig);
      } else {
        appInstance = getApps()[0];
      }
      authInstance = getAuth(appInstance);
    }
    return { app: appInstance, auth: authInstance };
  } catch (error) {
    if (typeof window !== 'undefined') {
      console.warn('[Firebase] Initialization error (will use fallback auth):', error);
    }
    return { app: null, auth: null };
  }
}

// Getter functions for backward compatibility
export function getFirebaseApp(): FirebaseApp | null {
  if (!appInstance) {
    const { app } = initializeFirebase();
    return app;
  }
  return appInstance;
}

export function getFirebaseAuth(): Auth | null {
  if (!authInstance) {
    const { auth } = initializeFirebase();
    return auth;
  }
  return authInstance;
}

// Export for immediate use (will be null if not configured)
export const app = getFirebaseApp();
export const auth = getFirebaseAuth();
