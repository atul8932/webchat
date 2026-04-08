import { useState, useEffect } from 'react';
import { subscribeToUsers } from '../firebase/userService';

const ONLINE_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes

export function useOnlineUsers() {
  const [users, setUsers] = useState([]);
  const [onlineCount, setOnlineCount] = useState(0);

  useEffect(() => {
    const unsubscribe = subscribeToUsers((allUsers) => {
      const now = Date.now();
      const withStatus = allUsers.map((u) => {
        const lastSeen = u.lastSeen?.toDate?.() || new Date(0);
        const isOnline = now - lastSeen.getTime() < ONLINE_THRESHOLD_MS;
        return { ...u, isOnline };
      });
      setUsers(withStatus);
      setOnlineCount(withStatus.filter((u) => u.isOnline).length);
    });
    return () => unsubscribe();
  }, []);

  return { users, onlineCount };
}
