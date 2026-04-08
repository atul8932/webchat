import PublicChat from '../public/PublicChat';
import PrivateChatRoom from '../private/PrivateChatRoom';
import EmptyState from '../common/EmptyState';

export default function MainContent({ view, activeChat, onBack, showBackButton }) {
  if (view === 'public') {
    return (
      <div className="flex flex-col h-full">
        <PublicChat onBack={onBack} showBackButton={showBackButton} />
      </div>
    );
  }

  if (view === 'private' && activeChat) {
    return (
      <div className="flex flex-col h-full">
        <PrivateChatRoom chat={activeChat} onBack={onBack} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full items-center justify-center bg-surface-950/30">
      <EmptyState
        icon="💬"
        title="Welcome to WebChat"
        description="Select Public Chat to talk with everyone, or choose a direct message to start a private conversation."
      />
    </div>
  );
}
