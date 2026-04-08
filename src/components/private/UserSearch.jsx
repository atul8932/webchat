import { useState, useEffect } from 'react';
import { getAllUsers } from '../../firebase/userService';
import { sendChatRequest } from '../../firebase/privateChatService';
import { useUser } from '../../hooks/useUser';
import Avatar from '../common/Avatar';
import LoadingSpinner from '../common/LoadingSpinner';

export default function UserSearch({ onClose, outgoingRequests = [] }) {
  const { currentUser } = useUser();
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    getAllUsers()
      .then((all) => setUsers(all.filter((u) => u.id !== currentUser?.id)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [currentUser?.id]);

  const filtered = query.trim()
    ? users.filter(
        (u) =>
          u.name.toLowerCase().includes(query.toLowerCase()) ||
          u.branch.toLowerCase().includes(query.toLowerCase())
      )
    : users;

  const getRequestStatus = (userId) => {
    const req = outgoingRequests.find((r) => r.toUserId === userId);
    return req?.status || null;
  };

  const handleSendRequest = async (user) => {
    setSending((prev) => ({ ...prev, [user.id]: true }));
    setError('');
    try {
      await sendChatRequest(currentUser.id, user.id, currentUser.name, currentUser.branch);
    } catch (err) {
      setError(err.message || 'Failed to send request.');
    } finally {
      setSending((prev) => ({ ...prev, [user.id]: false }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-surface-900 border border-white/10 rounded-2xl shadow-2xl animate-slide-up overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
          <div>
            <h3 className="text-white font-semibold">Find People</h3>
            <p className="text-surface-200/60 text-xs">{users.length} users available</p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto w-8 h-8 rounded-lg bg-surface-800 hover:bg-surface-700 flex items-center justify-center text-surface-200 hover:text-white transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="px-5 pt-4 pb-2">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-200/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or branch…"
              className="w-full pl-9 pr-4 py-2.5 bg-surface-800/80 border border-white/10 rounded-xl text-white text-sm placeholder-surface-200/40 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            />
          </div>
        </div>

        {error && (
          <p className="px-5 py-2 text-danger-400 text-xs">{error}</p>
        )}

        {/* Users List */}
        <div className="overflow-y-auto max-h-80 px-3 py-2 scrollbar-thin scrollbar-thumb-surface-700 scrollbar-track-transparent">
          {loading ? (
            <LoadingSpinner size="sm" label="Loading users…" />
          ) : filtered.length === 0 ? (
            <p className="text-center text-surface-200/50 text-sm py-8">No users found</p>
          ) : (
            <div className="space-y-1">
              {filtered.map((user) => {
                const status = getRequestStatus(user.id);
                return (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-800/60 transition-all duration-150 group"
                  >
                    <Avatar name={user.name} size="md" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{user.name}</p>
                      <p className="text-surface-200/50 text-xs">{user.branch}</p>
                    </div>
                    {status === 'pending' ? (
                      <span className="text-xs text-accent-400 bg-accent-500/10 px-2.5 py-1 rounded-lg font-medium">
                        Pending
                      </span>
                    ) : status === 'accepted' ? (
                      <span className="text-xs text-success-400 bg-success-500/10 px-2.5 py-1 rounded-lg font-medium">
                        Connected
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSendRequest(user)}
                        disabled={sending[user.id]}
                        className="
                          text-xs font-medium px-3 py-1.5 rounded-lg
                          bg-brand-500/20 text-brand-400 border border-brand-500/30
                          hover:bg-brand-500/30 hover:text-brand-300
                          disabled:opacity-50 disabled:cursor-not-allowed
                          transition-all duration-150
                        "
                      >
                        {sending[user.id] ? '...' : 'Connect'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
