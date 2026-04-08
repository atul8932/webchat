import { db } from './config';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  setDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  getDocs,
} from 'firebase/firestore';

const CHAT_REQUESTS = 'chat_requests';
const PRIVATE_CHATS = 'private_chats';
const MESSAGES = 'messages';

// ─── Chat Requests ────────────────────────────────────────────────────────────

/**
 * Send a chat request from one user to another.
 * Returns early if a request already exists.
 */
export async function sendChatRequest(fromUserId, toUserId, fromName, fromBranch) {
  // Check if request already exists
  const q = query(
    collection(db, CHAT_REQUESTS),
    where('fromUserId', '==', fromUserId),
    where('toUserId', '==', toUserId)
  );
  const existing = await getDocs(q);
  if (!existing.empty) {
    throw new Error('Request already sent.');
  }

  await addDoc(collection(db, CHAT_REQUESTS), {
    fromUserId,
    toUserId,
    fromName,
    fromBranch,
    status: 'pending',
    createdAt: serverTimestamp(),
  });
}

/**
 * Accept a chat request and create a private chat room.
 */
export async function acceptChatRequest(requestId, fromUserId, toUserId) {
  const reqRef = doc(db, CHAT_REQUESTS, requestId);
  await updateDoc(reqRef, { status: 'accepted' });

  // Create chat room with a deterministic chatId
  const participants = [fromUserId, toUserId].sort();
  const chatId = participants.join('_');
  const chatRef = doc(db, PRIVATE_CHATS, chatId);

  await setDoc(chatRef, {
    chatId,
    participants,
    createdAt: serverTimestamp(),
    lastMessage: null,
    lastMessageAt: serverTimestamp(),
  }, { merge: true });

  return chatId;
}

/**
 * Reject a chat request.
 */
export async function rejectChatRequest(requestId) {
  const reqRef = doc(db, CHAT_REQUESTS, requestId);
  await updateDoc(reqRef, { status: 'rejected' });
}

/**
 * Subscribe to incoming pending requests for a user.
 */
export function subscribeToIncomingRequests(userId, callback) {
  const q = query(
    collection(db, CHAT_REQUESTS),
    where('toUserId', '==', userId),
    where('status', '==', 'pending'),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

/**
 * Subscribe to outgoing requests sent by a user.
 */
export function subscribeToOutgoingRequests(userId, callback) {
  const q = query(
    collection(db, CHAT_REQUESTS),
    where('fromUserId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(30)
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

// ─── Private Chats ────────────────────────────────────────────────────────────

/**
 * Subscribe to all private chats where the user is a participant.
 */
export function subscribeToPrivateChats(userId, callback) {
  const q = query(
    collection(db, PRIVATE_CHATS),
    where('participants', 'array-contains', userId),
    orderBy('lastMessageAt', 'desc')
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

// ─── Messages ─────────────────────────────────────────────────────────────────

/**
 * Send a private message in a chat room.
 */
export async function sendPrivateMessage(chatId, senderId, text) {
  // Add message
  await addDoc(collection(db, MESSAGES), {
    chatId,
    senderId,
    text: text.trim(),
    timestamp: serverTimestamp(),
  });

  // Update last message on the chat doc
  const chatRef = doc(db, PRIVATE_CHATS, chatId);
  await updateDoc(chatRef, {
    lastMessage: text.trim(),
    lastMessageAt: serverTimestamp(),
  });
}

/**
 * Subscribe to messages for a specific chat room.
 */
export function subscribeToChatMessages(chatId, callback) {
  const q = query(
    collection(db, MESSAGES),
    where('chatId', '==', chatId),
    orderBy('timestamp', 'asc'),
    limit(200)
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}
