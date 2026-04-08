import { createContext, useContext, useState, useEffect } from 'react';
import { createOrGetUser, updatePresence } from '../firebase/userService';

// Generates a stable, consistent ID from name + branch (same result on every device)
function stableId(name, branch) {
  const str = `${name.trim().toLowerCase()}::${branch.trim().toLowerCase()}`;
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) ^ str.charCodeAt(i);
    hash = hash >>> 0; // keep unsigned 32-bit
  }
  return `user_${hash.toString(16).padStart(8, '0')}`;
}

export const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to restore session from localStorage
    const stored = localStorage.getItem('webchat_user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setCurrentUser(parsed);
        updatePresence(parsed.id).catch(console.error);
      } catch {
        localStorage.removeItem('webchat_user');
      }
    }
    setLoading(false);
  }, []);

  // Keep presence fresh every 60 s
  useEffect(() => {
    if (!currentUser) return;
    const interval = setInterval(() => {
      updatePresence(currentUser.id).catch(console.error);
    }, 60_000);
    return () => clearInterval(interval);
  }, [currentUser]);

  const login = async (name, branch) => {
    const id = stableId(name, branch);
    const user = { id, name, branch };
    localStorage.setItem('webchat_user', JSON.stringify(user));
    setCurrentUser(user);
    createOrGetUser(id, name, branch).catch((err) => {
      console.warn('[WebChat] Firestore sync failed (non-blocking):', err.message);
    });
  };

  const logout = () => {
    localStorage.removeItem('webchat_user');
    setCurrentUser(null);
  };

  return (
    <UserContext.Provider value={{ currentUser, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
}
