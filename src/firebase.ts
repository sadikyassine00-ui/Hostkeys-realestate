/// <reference types="vite/client" />
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
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

export async function loginWithGoogle(): Promise<FirebaseUser> {
  if (!auth) {
    throw new Error('Firebase authentication is not configured yet. Please check your VITE_FIREBASE_* environment variables.');
  }
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
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
  return onAuthStateChanged(auth, callback);
}
