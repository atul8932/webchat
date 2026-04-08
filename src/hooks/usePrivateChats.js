import { useState, useEffect } from 'react';
import { subscribeToPrivateChats } from '../firebase/privateChatService';

export function usePrivateChats(userId) {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    const unsubscribe = subscribeToPrivateChats(userId, (data) => {
      setChats(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [userId]);

  return { chats, loading };
}
