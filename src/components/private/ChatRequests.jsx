import { useState } from 'react';
import { acceptChatRequest, rejectChatRequest } from '../../firebase/privateChatService';
import Avatar from '../common/Avatar';
import { formatRelative } from '../../utils/formatTime';

export default function ChatRequests({ incoming = [] }) {
  const [processing, setProcessing] = useState({});

  if (incoming.length === 0) return null;

  const handleAccept = async (req) => {
    setProcessing((p) => ({ ...p, [req.id]: 'accepting' }));
    try {
      await acceptChatRequest(req.id, req.fromUserId, req.toUserId);
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing((p) => ({ ...p, [req.id]: null }));
    }
  };

  const handleReject = async (req) => {
    setProcessing((p) => ({ ...p, [req.id]: 'rejecting' }));
    try {
      await rejectChatRequest(req.id);
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing((p) => ({ ...p, [req.id]: null }));
    }
  };

  return (
    <div className="mb-2">
      <div className="flex items-center gap-2 px-3 py-2">
        <span className="text-xs font-semibold text-surface-200/60 uppercase tracking-wider">Requests</span>
        <span className="w-5 h-5 rounded-full bg-brand-500/20 text-brand-400 text-[10px] font-bold flex items-center justify-center">
          {incoming.length}
        </span>
      </div>
      <div className="space-y-1 px-2">
        {incoming.map((req) => {
          const busy = processing[req.id];
          return (
            <div
              key={req.id}
              className="bg-surface-800/60 border border-white/5 rounded-xl p-3 animate-slide-up"
            >
              <div className="flex items-start gap-2 mb-2">
                <Avatar name={req.fromName} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-semibold truncate">{req.fromName}</p>
                  <p className="text-surface-200/50 text-[11px]">{req.fromBranch}</p>
                </div>
                <p className="text-surface-200/30 text-[10px] flex-shrink-0">
                  {formatRelative(req.createdAt)}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleAccept(req)}
                  disabled={!!busy}
                  className="
                    flex-1 py-1.5 rounded-lg text-xs font-semibold
                    bg-success-500/20 text-success-400 border border-success-500/30
                    hover:bg-success-500/30 transition-all duration-150
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                >
                  {busy === 'accepting' ? '...' : '✓ Accept'}
                </button>
                <button
                  onClick={() => handleReject(req)}
                  disabled={!!busy}
                  className="
                    flex-1 py-1.5 rounded-lg text-xs font-semibold
                    bg-danger-500/10 text-danger-400 border border-danger-500/20
                    hover:bg-danger-500/20 transition-all duration-150
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                >
                  {busy === 'rejecting' ? '...' : '✕ Decline'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
