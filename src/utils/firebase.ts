import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  onSnapshot, 
  collection, 
  query, 
  where, 
  getDocs, 
  deleteDoc 
} from 'firebase/firestore';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Authentication Helpers
export const googleProvider = new GoogleAuthProvider();

export async function loginWithGoogle() {
  return signInWithPopup(auth, googleProvider);
}

export async function loginWithEmail(email: string, pass: string) {
  return signInWithEmailAndPassword(auth, email, pass);
}

export async function registerWithEmail(email: string, pass: string, name: string) {
  const credential = await createUserWithEmailAndPassword(auth, email, pass);
  if (credential.user) {
    await updateProfile(credential.user, { displayName: name });
  }
  return credential;
}

export async function logoutUser() {
  return signOut(auth);
}

/**
 * Persists a calendar state to Firestore
 */
export async function saveCalendarStateToFirestore(calendarId: string, state: any): Promise<void> {
  const docRef = doc(db, 'calendars', calendarId);
  await setDoc(docRef, state, { merge: true });
}

/**
 * Subscribes to real-time updates for a single calendar
 */
export function subscribeToCalendarState(
  calendarId: string, 
  callback: (data: any) => void, 
  onError: (err: any) => void
) {
  const docRef = doc(db, 'calendars', calendarId);
  return onSnapshot(docRef, (snapshot) => {
    if (snapshot.exists()) {
      callback({ id: snapshot.id, ...snapshot.data() });
    } else {
      callback(null);
    }
  }, onError);
}

/**
 * Retrieves all calendar workspaces in the database
 */
export async function fetchAllCalendars(): Promise<any[]> {
  const calendarsCol = collection(db, 'calendars');
  const querySnapshot = await getDocs(calendarsCol);
  const list: any[] = [];
  querySnapshot.forEach((docSnap) => {
    list.push({ id: docSnap.id, ...docSnap.data() });
  });
  return list.sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });
}

/**
 * Retrieves all calendars belonging to a specific user for their dashboard
 */
export async function fetchUserCalendars(userId: string): Promise<any[]> {
  const calendarsCol = collection(db, 'calendars');
  const q = query(calendarsCol, where('ownerId', '==', userId));
  const querySnapshot = await getDocs(q);
  const list: any[] = [];
  querySnapshot.forEach((docSnap) => {
    list.push({ id: docSnap.id, ...docSnap.data() });
  });
  return list;
}

/**
 * Creates a brand new calendar document with standard defaults for the user
 */
export async function createNewCalendar(managerName: string, title: string, initialPayload: any): Promise<string> {
  const calendarId = 'cal_' + Math.random().toString(36).substr(2, 9);
  const docRef = doc(db, 'calendars', calendarId);
  const newCalendar = {
    ...initialPayload,
    calendarTitle: title,
    managerName: managerName,
    createdAt: new Date().toISOString()
  };
  await setDoc(docRef, newCalendar);
  return calendarId;
}

/**
 * Deletes a specific calendar document
 */
export async function deleteCalendar(calendarId: string): Promise<void> {
  const docRef = doc(db, 'calendars', calendarId);
  await deleteDoc(docRef);
}
