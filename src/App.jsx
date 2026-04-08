import { useState } from 'react';
import { UserProvider } from './context/UserContext';
import { useUser } from './hooks/useUser';
import LoginScreen from './components/auth/LoginScreen';
import Sidebar from './components/layout/Sidebar';
import MainContent from './components/layout/MainContent';
import LoadingSpinner from './components/common/LoadingSpinner';
import './index.css';

function ChatApp() {
  const { currentUser, loading } = useUser();
  const [activeView, setActiveView] = useState('public'); // 'public' | 'private'
  const [activeChat, setActiveChat] = useState(null);
  // On mobile: 'sidebar' shows the left panel, 'chat' shows the right panel
  const [mobilePanel, setMobilePanel] = useState('sidebar');

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-950 flex items-center justify-center">
        <LoadingSpinner size="lg" label="Starting WebChat…" />
      </div>
    );
  }

  if (!currentUser) {
    return <LoginScreen />;
  }

  const handleSelectPublic = () => {
    setActiveView('public');
    setActiveChat(null);
    setMobilePanel('chat'); // On mobile: switch to chat panel
  };

  const handleSelectChat = (chat) => {
    setActiveChat(chat);
    setActiveView('private');
    setMobilePanel('chat'); // On mobile: switch to chat panel
  };

  const handleBack = () => {
    setMobilePanel('sidebar'); // On mobile: go back to sidebar
  };

  const showSidebar = mobilePanel === 'sidebar';
  const showChat = mobilePanel === 'chat';

  return (
    <div className="flex h-screen bg-surface-950 overflow-hidden">
      {/* Background gradient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand-600/10 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent-500/8 rounded-full blur-[150px] translate-x-1/3 translate-y-1/3" />
      </div>

      {/* Sidebar */}
      <div
        className={`
          relative z-10 flex-shrink-0
          w-full lg:w-[300px] xl:w-[320px]
          flex-col
          ${showSidebar ? 'flex' : 'hidden'}
          lg:flex
        `}
      >
        <Sidebar
          activeView={activeView}
          onSelectPublic={handleSelectPublic}
          activeChat={activeChat}
          onSelectChat={handleSelectChat}
        />
      </div>

      {/* Main content */}
      <main
        className={`
          relative z-10 flex-1 min-w-0
          flex-col
          border-l border-white/5
          ${showChat ? 'flex' : 'hidden'}
          lg:flex
        `}
      >
        <MainContent
          view={activeView}
          activeChat={activeChat}
          onBack={handleBack}
          showBackButton={true}
        />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <UserProvider>
      <ChatApp />
    </UserProvider>
  );
}
