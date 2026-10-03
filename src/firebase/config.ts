import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer, type Firestore } from 'firebase/firestore';

// 1. Read environment variables from import.meta.env
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY?.trim() || '';
const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN?.trim() || '';
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID?.trim() || '';
const firestoreDatabaseId = import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID?.trim() || '(default)';
const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET?.trim() || '';
const messagingSenderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID?.trim() || '';
const appId = import.meta.env.VITE_FIREBASE_APP_ID?.trim() || '';
const measurementId = import.meta.env.VITE_FIREBASE_MEASUREMENT_ID?.trim() || '';

// 2. Validate configuration
export const isFirebaseConfigured = Boolean(
  apiKey &&
  !apiKey.includes('Placeholder') &&
  !apiKey.includes('YourFirebase') &&
  projectId &&
  !projectId.includes('your-app-project-id') &&
  appId &&
  !appId.includes('abcdef')
);

if (!isFirebaseConfigured) {
  console.warn(
    '[RC4 Lab] Firebase chưa được cấu hình hoặc đang dùng giá trị mẫu trong .env. ' +
    'Tính năng đăng nhập và đồng bộ đám mây sẽ tạm thời bị vô hiệu hóa. ' +
    'Tất cả các tính năng giải thuật, mô phỏng và kiểm thử trên giao diện vẫn hoạt động bình thường.'
  );
}

// 3. Fallback dummy configuration to prevent SDK initialization crash on public pages
const activeConfig = {
  apiKey: isFirebaseConfigured ? apiKey : 'AIzaSyPlaceholderKeyForOfflineMode00000',
  authDomain: isFirebaseConfigured ? authDomain : 'offline.firebaseapp.com',
  projectId: isFirebaseConfigured ? projectId : 'offline-project',
  storageBucket: isFirebaseConfigured ? storageBucket : 'offline.firebasestorage.app',
  messagingSenderId: isFirebaseConfigured ? messagingSenderId : '123456789012',
  appId: isFirebaseConfigured ? appId : '1:123456789012:web:abcdef1234567890',
  ...(measurementId ? { measurementId } : {}),
};

const app: FirebaseApp = !getApps().length ? initializeApp(activeConfig) : getApps()[0];

// Specify firestoreDatabaseId if custom ID provided, otherwise default
export const db: Firestore =
  firestoreDatabaseId && firestoreDatabaseId !== '(default)'
    ? getFirestore(app, firestoreDatabaseId)
    : getFirestore(app);

export const auth: Auth = getAuth(app);

// 4. Test Firestore connection only when properly configured
async function testConnection() {
  if (!isFirebaseConfigured) return;
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('[RC4 Lab] Máy khách đang ở trạng thái offline hoặc cấu hình Firebase chưa hợp lệ.');
    }
  }
}

testConnection();
