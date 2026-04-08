import { db } from './config';
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  limit,
  onSnapshot,
} from 'firebase/firestore';

const PUBLIC_MESSAGES = 'public_messages';

/**
 * Send a message to the public chat room.
 */
export async function sendPublicMessage(userId, name, branch, text) {
  await addDoc(collection(db, PUBLIC_MESSAGES), {
    userId,
    name,
    branch,
    text: text.trim(),
    timestamp: serverTimestamp(),
  });
}

/**
 * Subscribe to public messages in real time (last 100).
 */
export function subscribeToPublicMessages(callback, onError) {
  const q = query(
    collection(db, PUBLIC_MESSAGES),
    orderBy('timestamp', 'asc'),
    limit(100)
  );
  return onSnapshot(
    q,
    (snap) => {
      const messages = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      callback(messages);
    },
    (err) => {
      if (onError) onError(err);
      else console.error('[WebChat] Public messages snapshot error:', err);
    }
  );
}
