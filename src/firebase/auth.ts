import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from './config';
import { syncUserProfile } from './firestore';

const googleProvider = new GoogleAuthProvider();

export async function loginWithEmail(email: string, pass: string): Promise<User> {
  if (!isFirebaseConfigured) {
    throw new Error('Chưa cấu hình Firebase trong file .env. Vui lòng cập nhật VITE_FIREBASE_API_KEY để đăng nhập.');
  }
  const cred = await signInWithEmailAndPassword(auth, email, pass);
  await syncUserProfile(cred.user);
  return cred.user;
}

export async function registerWithEmail(email: string, pass: string): Promise<User> {
  if (!isFirebaseConfigured) {
    throw new Error('Chưa cấu hình Firebase trong file .env. Vui lòng cập nhật VITE_FIREBASE_API_KEY để tạo tài khoản.');
  }
  const cred = await createUserWithEmailAndPassword(auth, email, pass);
  await syncUserProfile(cred.user);
  return cred.user;
}

export async function loginWithGoogle(): Promise<User> {
  if (!isFirebaseConfigured) {
    throw new Error('Chưa cấu hình Firebase trong file .env. Vui lòng cập nhật VITE_FIREBASE_API_KEY để sử dụng Google Sign-in.');
  }
  const cred = await signInWithPopup(auth, googleProvider);
  await syncUserProfile(cred.user);
  return cred.user;
}

export async function logoutUser(): Promise<void> {
  if (!isFirebaseConfigured) return;
  await firebaseSignOut(auth);
}

export function subscribeAuth(callback: (user: User | null) => void) {
  if (!isFirebaseConfigured) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      syncUserProfile(user).catch(console.error);
    }
    callback(user);
  });
}
