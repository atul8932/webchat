import { useEffect, useRef } from 'react';
import { usePublicMessages } from '../../hooks/usePublicMessages';
import { sendPublicMessage } from '../../firebase/publicChatService';
import { useUser } from '../../hooks/useUser';
import { useOnlineUsers } from '../../hooks/useOnlineUsers';
import MessageInput from '../common/MessageInput';
import PublicMessage from './PublicMessage';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';

export default function PublicChat({ onBack }) {
  const { currentUser } = useUser();
  const { messages, loading, error } = usePublicMessages();
  const { onlineCount } = useOnlineUsers();
  const bottomRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text) => {
    try {
      await sendPublicMessage(
        currentUser.id,
        currentUser.name,
        currentUser.branch,
        text
      );
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/5 bg-surface-900/30 backdrop-blur-sm flex-shrink-0">
        {/* Mobile back button */}
        {onBack && (
          <button
            onClick={onBack}
            className="lg:hidden w-8 h-8 rounded-lg bg-surface-800 hover:bg-surface-700 flex items-center justify-center text-surface-200 flex-shrink-0 transition-all"
            aria-label="Back to sidebar"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-400 to-brand-500 flex items-center justify-center shadow-lg flex-shrink-0">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
              d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-white font-semibold text-sm">Public Chat</h2>
          <p className="text-surface-200/60 text-xs">
            {onlineCount > 0 ? `${onlineCount} online now` : 'Global campus chat'}
          </p>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-green-400 text-xs font-medium">Live</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-thin scrollbar-thumb-surface-700 scrollbar-track-transparent">
        {loading ? (
          <LoadingSpinner label="Loading messages…" />
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-danger-500/10 flex items-center justify-center text-2xl">⚠️</div>
            <div>
              <p className="text-danger-400 font-semibold text-sm">Firestore not reachable</p>
              <p className="text-surface-200/50 text-xs mt-1 max-w-xs">
                Enable Firestore in your Firebase console and set rules to allow reads.<br />
                Check the browser console for the exact error.
              </p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <EmptyState
            icon="💬"
            title="No messages yet"
            description="Be the first to say something in the public chat!"
          />
        ) : (
          messages.map((msg) => (
            <PublicMessage
              key={msg.id}
              message={msg}
              isOwn={msg.userId === currentUser?.id}
            />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <MessageInput onSend={handleSend} placeholder="Message everyone…" />
    </div>
  );
}
