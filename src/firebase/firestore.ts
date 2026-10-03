import {
  collection,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  type Unsubscribe,
} from 'firebase/firestore';
import { db, auth } from './config';
import { handleFirestoreError, OperationType } from './errors';

export interface UserProfile {
  userId: string;
  email: string;
  displayName?: string;
  createdAt: any;
}

export interface EncryptionRunRecord {
  id: string;
  userId: string;
  type: 'encrypt' | 'decrypt';
  inputFormat: 'text' | 'hex' | string;
  outputFormat: 'hex' | 'base64' | string;
  inputLength: number;
  keySnippet: string;
  outputSnippet: string;
  note?: string;
  createdAt: any;
}

export interface ExperimentRunRecord {
  id: string;
  userId: string;
  experimentType: 'bias' | 'key_reuse' | 'drop_n' | 'avalanche';
  title: string;
  summary: string;
  metricValue?: string;
  createdAt: any;
}

export interface QuizScoreRecord {
  id: string;
  userId: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  timeSpentSeconds?: number;
  createdAt: any;
}

// Ensure User Profile exists
export async function syncUserProfile(user: { uid: string; email: string | null; displayName: string | null }) {
  if (!user.uid || !user.email) return;
  const path = `users/${user.uid}`;
  try {
    const userDocRef = doc(db, 'users', user.uid);
    const existingSnap = await getDoc(userDocRef);
    if (!existingSnap.exists()) {
      await setDoc(userDocRef, {
        userId: user.uid,
        email: user.email.slice(0, 256),
        displayName: (user.displayName || user.email.split('@')[0]).slice(0, 128),
        createdAt: serverTimestamp(),
      });
    } else {
      const existingData = existingSnap.data();
      const newDisplayName = (user.displayName || user.email.split('@')[0]).slice(0, 128);
      if (existingData?.displayName !== newDisplayName) {
        await setDoc(
          userDocRef,
          {
            displayName: newDisplayName,
          },
          { merge: true }
        );
      }
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Save Encryption Run
export async function saveEncryptionRun(data: Omit<EncryptionRunRecord, 'id' | 'userId' | 'createdAt'>): Promise<string> {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error('Cần đăng nhập để lưu lịch sử mã hóa.');

  const runId = `enc_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const path = `encryption_runs/${runId}`;
  try {
    const runDocRef = doc(db, 'encryption_runs', runId);
    await setDoc(runDocRef, {
      userId: currentUser.uid,
      type: data.type,
      inputFormat: data.inputFormat,
      outputFormat: data.outputFormat,
      inputLength: data.inputLength || 0,
      keySnippet: data.keySnippet.slice(0, 64),
      outputSnippet: data.outputSnippet.slice(0, 128),
      note: (data.note || '').slice(0, 500),
      createdAt: serverTimestamp(),
    });
    return runId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

// Subscribe to User's Encryption Runs
export function subscribeEncryptionRuns(userId: string, callback: (runs: EncryptionRunRecord[]) => void): Unsubscribe {
  const collectionPath = 'encryption_runs';
  const q = query(collection(db, collectionPath), where('userId', '==', userId));
  return onSnapshot(
    q,
    (snapshot) => {
      const records: EncryptionRunRecord[] = [];
      snapshot.forEach((docSnap) => {
        records.push({ id: docSnap.id, ...(docSnap.data() as Omit<EncryptionRunRecord, 'id'>) });
      });
      // Sort newest first
      records.sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : Date.now();
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : Date.now();
        return timeB - timeA;
      });
      callback(records);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, collectionPath);
    }
  );
}

// Delete an Encryption Run
export async function deleteEncryptionRun(runId: string): Promise<void> {
  const path = `encryption_runs/${runId}`;
  try {
    await deleteDoc(doc(db, 'encryption_runs', runId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Save Experiment Run
export async function saveExperimentRun(data: Omit<ExperimentRunRecord, 'id' | 'userId' | 'createdAt'>): Promise<string> {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error('Cần đăng nhập để lưu kết quả thực nghiệm.');

  const expId = `exp_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const path = `experiment_runs/${expId}`;
  try {
    const expDocRef = doc(db, 'experiment_runs', expId);
    await setDoc(expDocRef, {
      userId: currentUser.uid,
      experimentType: data.experimentType,
      title: data.title.slice(0, 128),
      summary: data.summary.slice(0, 500),
      metricValue: (data.metricValue || '').slice(0, 128),
      createdAt: serverTimestamp(),
    });
    return expId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

// Subscribe to User's Experiment Runs
export function subscribeExperimentRuns(userId: string, callback: (runs: ExperimentRunRecord[]) => void): Unsubscribe {
  const collectionPath = 'experiment_runs';
  const q = query(collection(db, collectionPath), where('userId', '==', userId));
  return onSnapshot(
    q,
    (snapshot) => {
      const records: ExperimentRunRecord[] = [];
      snapshot.forEach((docSnap) => {
        records.push({ id: docSnap.id, ...(docSnap.data() as Omit<ExperimentRunRecord, 'id'>) });
      });
      records.sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : Date.now();
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : Date.now();
        return timeB - timeA;
      });
      callback(records);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, collectionPath);
    }
  );
}

// Delete an Experiment Run
export async function deleteExperimentRun(expId: string): Promise<void> {
  const path = `experiment_runs/${expId}`;
  try {
    await deleteDoc(doc(db, 'experiment_runs', expId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Save Quiz Score
export async function saveQuizScore(data: Omit<QuizScoreRecord, 'id' | 'userId' | 'createdAt'>): Promise<string> {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error('Cần đăng nhập để lưu điểm số trắc nghiệm.');

  const scoreId = `quiz_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const path = `quiz_scores/${scoreId}`;
  try {
    const scoreDocRef = doc(db, 'quiz_scores', scoreId);
    await setDoc(scoreDocRef, {
      userId: currentUser.uid,
      score: data.score,
      totalQuestions: 10,
      percentage: Math.round((data.score / 10) * 100),
      timeSpentSeconds: data.timeSpentSeconds || 0,
      createdAt: serverTimestamp(),
    });
    return scoreId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

// Subscribe to User's Quiz Scores
export function subscribeQuizScores(userId: string, callback: (scores: QuizScoreRecord[]) => void): Unsubscribe {
  const collectionPath = 'quiz_scores';
  const q = query(collection(db, collectionPath), where('userId', '==', userId));
  return onSnapshot(
    q,
    (snapshot) => {
      const records: QuizScoreRecord[] = [];
      snapshot.forEach((docSnap) => {
        records.push({ id: docSnap.id, ...(docSnap.data() as Omit<QuizScoreRecord, 'id'>) });
      });
      records.sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : Date.now();
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : Date.now();
        return timeB - timeA;
      });
      callback(records);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, collectionPath);
    }
  );
}

// Delete Quiz Score
export async function deleteQuizScore(scoreId: string): Promise<void> {
  const path = `quiz_scores/${scoreId}`;
  try {
    await deleteDoc(doc(db, 'quiz_scores', scoreId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
