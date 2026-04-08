import { useState, useEffect } from 'react';
import { subscribeToPublicMessages } from '../firebase/publicChatService';

export function usePublicMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const unsubscribe = subscribeToPublicMessages(
      (msgs) => {
        setMessages(msgs);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('[WebChat] Public messages error:', err);
        setError('Could not load messages. Check Firestore rules.');
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  return { messages, loading, error };
}
