import { useState, useEffect } from 'react';
import {
  subscribeToIncomingRequests,
  subscribeToOutgoingRequests,
} from '../firebase/privateChatService';

export function useChatRequests(userId) {
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);

    const unsubIn = subscribeToIncomingRequests(userId, (data) => {
      setIncoming(data);
      setLoading(false);
    });

    const unsubOut = subscribeToOutgoingRequests(userId, (data) => {
      setOutgoing(data);
    });

    return () => {
      unsubIn();
      unsubOut();
    };
  }, [userId]);

  return { incoming, outgoing, loading };
}
