/// <reference types="vite/client" />
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser,
  Auth
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
};

export const isFirebaseConfigured = (): boolean => {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

if (isFirebaseConfigured()) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
  } catch (err) {
    console.error('Failed to initialize Firebase Auth:', err);
  }
}

export { auth };

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export async function loginWithEmail(email: string, pass: string): Promise<FirebaseUser> {
  if (!auth) {
    throw new Error('Firebase authentication is not configured yet. Please check your VITE_FIREBASE_* environment variables.');
  }
  const userCred = await signInWithEmailAndPassword(auth, email, pass);
  return userCred.user;
}

export async function registerWithEmail(email: string, pass: string): Promise<FirebaseUser> {
  if (!auth) {
    throw new Error('Firebase authentication is not configured yet. Please check your VITE_FIREBASE_* environment variables.');
  }
  const userCred = await createUserWithEmailAndPassword(auth, email, pass);
  return userCred.user;
}

export async function loginWithGoogle(): Promise<FirebaseUser | null> {
  if (!auth) {
    throw new Error('Firebase authentication is not configured yet. Please check your VITE_FIREBASE_* environment variables.');
  }
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (err: any) {
    const errStr = String(err);
    if (
      err?.code === 'auth/popup-blocked' || 
      err?.code === 'auth/cancelled-popup-request' || 
      errStr.includes('Cross-Origin-Opener-Policy') ||
      errStr.includes('popup')
    ) {
      console.warn('Popup blocked by browser COOP policy, falling back to redirect:', err);
      await signInWithRedirect(auth, googleProvider);
      return null;
    }
    throw err;
  }
}

export async function logoutUser(): Promise<void> {
  if (!auth) return;
  await signOut(auth);
}

export function subscribeToAuthState(callback: (user: FirebaseUser | null) => void) {
  if (!auth) {
    callback(null);
    return () => {};
  }

  // Handle redirect result if user was authenticated via redirect fallback
  getRedirectResult(auth).then(result => {
    if (result && result.user) {
      callback(result.user);
    }
  }).catch(err => {
    console.warn('Redirect result check:', err);
  });

  return onAuthStateChanged(auth, callback);
}
