import { useState, useEffect } from 'react';
import { subscribeToChatMessages } from '../firebase/privateChatService';

export function useChatMessages(chatId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!chatId) {
      setMessages([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsubscribe = subscribeToChatMessages(chatId, (msgs) => {
      setMessages(msgs);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [chatId]);

  return { messages, loading };
}
