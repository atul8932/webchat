import { useState } from 'react';
import { useUser } from '../../hooks/useUser';
import { usePrivateChats } from '../../hooks/usePrivateChats';
import { useChatRequests } from '../../hooks/useChatRequests';
import { useOnlineUsers } from '../../hooks/useOnlineUsers';
import Avatar from '../common/Avatar';
import ChatRequests from '../private/ChatRequests';
import PrivateChatList from '../private/PrivateChatList';
import UserSearch from '../private/UserSearch';

export default function Sidebar({ activeView, onSelectPublic, activeChat, onSelectChat }) {
  const { currentUser, logout } = useUser();
  const { chats, loading } = usePrivateChats(currentUser?.id);
  const { incoming, outgoing } = useChatRequests(currentUser?.id);
  const { onlineCount } = useOnlineUsers();
  const [showSearch, setShowSearch] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const pendingCount = incoming.length;

  return (
    <>
      <aside className="flex flex-col h-full bg-surface-900/60 backdrop-blur-xl border-r border-white/5 w-full">
        {/* ── Top bar ── */}
        <div className="flex-shrink-0 px-4 py-4 border-b border-white/5">
          {/* Brand */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-md">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <span className="text-white font-bold text-sm tracking-tight">WebChat</span>
            <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-800/80 border border-green-500/20 text-[11px] text-green-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse border border-green-500/50" />
              {onlineCount} online
            </div>
          </div>

          {/* User profile pill */}
          <div
            className="flex items-center gap-2.5 p-2.5 rounded-xl bg-surface-800/60 border border-white/5 cursor-pointer hover:bg-surface-800 transition-all duration-150"
            onClick={() => setShowProfile(!showProfile)}
          >
            <Avatar name={currentUser?.name} size="sm" isOnline />
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate">{currentUser?.name}</p>
              <p className="text-surface-200/50 text-[10px]">{currentUser?.branch}</p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); logout(); }}
              className="w-6 h-6 rounded-md bg-surface-700/60 hover:bg-danger-500/20 hover:text-danger-400 flex items-center justify-center text-surface-200 transition-all duration-150"
              title="Logout"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Public Chat Button ── */}
        <div className="flex-shrink-0 px-3 pt-3 pb-1">
          <button
            onClick={onSelectPublic}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150
              ${activeView === 'public'
                ? 'bg-brand-500/20 border border-brand-500/30'
                : 'hover:bg-surface-800/60 border border-transparent'
              }
            `}
          >
            <div className={`
              w-8 h-8 rounded-lg flex items-center justify-center
              ${activeView === 'public'
                ? 'bg-gradient-to-br from-accent-400 to-brand-500'
                : 'bg-surface-800/80'
              }
            `}>
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064" />
              </svg>
            </div>
            <span className={`text-sm font-medium ${activeView === 'public' ? 'text-brand-300' : 'text-surface-100'}`}>
              Public Chat
            </span>
            <span className="ml-auto text-[10px] text-surface-200/40 bg-surface-800/60 px-1.5 py-0.5 rounded-md">
              Global
            </span>
          </button>
        </div>

        {/* ── Scrollable content ── */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-surface-700 scrollbar-track-transparent py-1">
          {/* Incoming requests */}
          {pendingCount > 0 && (
            <ChatRequests incoming={incoming} />
          )}

          {/* Direct Messages section */}
          <div className="flex items-center justify-between px-3 py-2 mt-1">
            <span className="text-xs font-semibold text-surface-200/60 uppercase tracking-wider">
              Direct Messages
            </span>
            <button
              onClick={() => setShowSearch(true)}
              className="
                w-6 h-6 rounded-md bg-brand-500/20 text-brand-400
                hover:bg-brand-500/30 flex items-center justify-center
                transition-all duration-150
              "
              title="Find people"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          <PrivateChatList
            chats={chats}
            activeChat={activeChat}
            onSelect={onSelectChat}
            currentUserId={currentUser?.id}
          />
        </div>

        {/* ── Bottom: pending requests badge for tab ── */}
        {pendingCount > 0 && (
          <div className="flex-shrink-0 mx-3 mb-3 px-3 py-2 bg-brand-500/10 border border-brand-500/20 rounded-xl flex items-center gap-2 animate-pulse-dot">
            <svg className="w-3.5 h-3.5 text-brand-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zm0 16a3 3 0 01-2.83-2h5.66A3 3 0 0110 18z" />
            </svg>
            <p className="text-brand-400 text-xs font-medium">
              {pendingCount} pending {pendingCount === 1 ? 'request' : 'requests'}
            </p>
          </div>
        )}
      </aside>

      {/* User search modal */}
      {showSearch && (
        <UserSearch
          onClose={() => setShowSearch(false)}
          outgoingRequests={outgoing}
        />
      )}
    </>
  );
}
