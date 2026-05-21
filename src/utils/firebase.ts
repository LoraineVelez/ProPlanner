import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore with specific database ID to comply with tool output
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

/**
 * Persists the complete calendar state to Firestore
 */
export async function saveCalendarStateToFirestore(state: any): Promise<void> {
  const docRef = doc(db, 'calendars', 'global');
  await setDoc(docRef, state, { merge: true });
}

/**
 * Subscribes to changes in real-time from the global calendar document
 */
export function subscribeToCalendarState(callback: (data: any) => void, onError: (err: any) => void) {
  const docRef = doc(db, 'calendars', 'global');
  return onSnapshot(docRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data());
    } else {
      callback(null);
    }
  }, onError);
}
