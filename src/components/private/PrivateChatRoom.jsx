import { useEffect, useRef } from 'react';
import { useChatMessages } from '../../hooks/useChatMessages';
import { sendPrivateMessage } from '../../firebase/privateChatService';
import { useUser } from '../../hooks/useUser';
import { useOnlineUsers } from '../../hooks/useOnlineUsers';
import MessageInput from '../common/MessageInput';
import PrivateMessage from './PrivateMessage';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import Avatar from '../common/Avatar';

export default function PrivateChatRoom({ chat, onBack }) {
  const { currentUser } = useUser();
  const { messages, loading } = useChatMessages(chat?.id);
  const { users } = useOnlineUsers();
  const bottomRef = useRef(null);

  const otherId = chat?.participants?.find((p) => p !== currentUser?.id) || '';
  const otherUser = users.find((u) => u.id === otherId);
  const otherName = otherUser?.name || 'User';
  const otherBranch = otherUser?.branch || '';
  const isOtherOnline = otherUser?.isOnline || false;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text) => {
    if (!chat?.id) return;
    try {
      await sendPrivateMessage(chat.id, currentUser.id, text);
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  if (!chat) {
    return (
      <EmptyState
        icon="💬"
        title="Select a conversation"
        description="Choose a chat from the sidebar or start a new one."
      />
    );
  }

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/5 bg-surface-900/30 backdrop-blur-sm flex-shrink-0">
        {/* Mobile back button */}
        {onBack && (
          <button
            onClick={onBack}
            className="lg:hidden w-8 h-8 rounded-lg bg-surface-800 hover:bg-surface-700 flex items-center justify-center text-surface-200"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <Avatar name={otherName} size="md" isOnline={isOtherOnline} />
        <div className="flex-1 min-w-0">
          <h2 className="text-white font-semibold text-sm truncate">{otherName}</h2>
          <p className="text-surface-200/50 text-xs flex items-center gap-1.5">
            {isOtherOnline ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                <span className="text-green-400">Online</span>
                {otherBranch && <span className="text-surface-200/30">· {otherBranch}</span>}
              </>
            ) : (
              otherBranch
            )}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2 scrollbar-thin scrollbar-thumb-surface-700 scrollbar-track-transparent">
        {loading ? (
          <LoadingSpinner label="Loading messages…" />
        ) : messages.length === 0 ? (
          <EmptyState
            icon="👋"
            title={`Say hi to ${otherName}`}
            description="This is the beginning of your private conversation."
          />
        ) : (
          messages.map((msg) => {
            const isOwn = msg.senderId === currentUser?.id;
            const senderName = isOwn ? currentUser.name : otherName;
            return (
              <PrivateMessage
                key={msg.id}
                message={msg}
                isOwn={isOwn}
                senderName={senderName}
              />
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <MessageInput onSend={handleSend} placeholder={`Message ${otherName}…`} />
    </div>
  );
}
