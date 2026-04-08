import Avatar from '../common/Avatar';
import { formatTime } from '../../utils/formatTime';
import { useOnlineUsers } from '../../hooks/useOnlineUsers';

export default function PrivateChatList({ chats = [], activeChat, onSelect, currentUserId }) {
  const { users } = useOnlineUsers();

  const getOtherParticipant = (chat) => {
    return chat.participants.find((p) => p !== currentUserId) || '';
  };

  const isUserOnline = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user?.isOnline || false;
  };

  const getOtherName = (chat) => {
    const otherId = getOtherParticipant(chat);
    const user = users.find((u) => u.id === otherId);
    return user?.name || 'Unknown User';
  };

  const getOtherBranch = (chat) => {
    const otherId = getOtherParticipant(chat);
    const user = users.find((u) => u.id === otherId);
    return user?.branch || '';
  };

  if (chats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
        <div className="w-12 h-12 rounded-xl bg-surface-800/60 flex items-center justify-center text-xl mb-3">
          💌
        </div>
        <p className="text-surface-200/60 text-xs">No chats yet. Search for people to connect!</p>
      </div>
    );
  }

  return (
    <div className="space-y-0.5 px-2">
      {chats.map((chat) => {
        const otherId = getOtherParticipant(chat);
        const name = getOtherName(chat);
        const branch = getOtherBranch(chat);
        const online = isUserOnline(otherId);
        const isActive = activeChat?.id === chat.id;

        return (
          <button
            key={chat.id}
            onClick={() => onSelect(chat)}
            className={`
              w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left
              transition-all duration-150
              ${isActive
                ? 'bg-brand-500/20 border border-brand-500/30'
                : 'hover:bg-surface-800/60 border border-transparent'
              }
            `}
          >
            <Avatar name={name} size="sm" isOnline={online} />
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-1">
                <p className={`text-sm font-medium truncate ${isActive ? 'text-brand-300' : 'text-white'}`}>
                  {name}
                </p>
                {chat.lastMessageAt && (
                  <span className="text-[10px] text-surface-200/40 flex-shrink-0">
                    {formatTime(chat.lastMessageAt)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-brand-400/60">{branch}</span>
                {chat.lastMessage && (
                  <>
                    <span className="text-surface-200/30 text-[10px]">·</span>
                    <p className="text-surface-200/50 text-xs truncate">{chat.lastMessage}</p>
                  </>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
