import { db } from './config';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  serverTimestamp,
  query,
  orderBy,
  limit,
  onSnapshot,
} from 'firebase/firestore';

const USERS_COLLECTION = 'users';

/**
 * Create or update a user document in Firestore.
 */
export async function createOrGetUser(id, name, branch) {
  const userRef = doc(db, USERS_COLLECTION, id);
  const snapshot = await getDoc(userRef);

  const userData = {
    id,
    name,
    branch,
    lastSeen: serverTimestamp(),
  };

  if (!snapshot.exists()) {
    userData.createdAt = serverTimestamp();
  }

  await setDoc(userRef, userData, { merge: true });
  return { id, name, branch };
}

/**
 * Fetch all users for search functionality.
 */
export async function getAllUsers() {
  const q = query(
    collection(db, USERS_COLLECTION),
    orderBy('name'),
    limit(100)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => d.data());
}

/**
 * Update the user's lastSeen timestamp (presence tracking).
 */
export async function updatePresence(userId) {
  const userRef = doc(db, USERS_COLLECTION, userId);
  await setDoc(userRef, { lastSeen: serverTimestamp() }, { merge: true });
}

/**
 * Listen to all users in real time.
 */
export function subscribeToUsers(callback) {
  const q = query(
    collection(db, USERS_COLLECTION),
    orderBy('lastSeen', 'desc'),
    limit(50)
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => d.data()));
  });
}
