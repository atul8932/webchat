import { useState, useRef } from 'react';

export default function MessageInput({ onSend, placeholder = 'Type a message…', disabled = false }) {
  const [text, setText] = useState('');
  const inputRef = useRef(null);

  const handleSend = () => {
    if (!text.trim() || disabled) return;
    onSend(text.trim());
    setText('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-end gap-2 p-3 border-t border-white/5 bg-surface-900/50 backdrop-blur-sm">
      <div className="flex-1 relative">
        <textarea
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? 'Accept request to send messages' : placeholder}
          disabled={disabled}
          rows={1}
          className="
            w-full resize-none rounded-xl bg-surface-800/80 border border-white/10
            text-white placeholder-surface-200/50 text-sm px-4 py-3
            focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/40
            disabled:opacity-40 disabled:cursor-not-allowed
            transition-all duration-200
            max-h-32 overflow-y-auto
            scrollbar-thin scrollbar-thumb-surface-700 scrollbar-track-transparent
          "
          style={{ lineHeight: '1.5' }}
        />
      </div>
      <button
        onClick={handleSend}
        disabled={!text.trim() || disabled}
        className="
          flex-shrink-0 w-11 h-11 rounded-xl
          bg-gradient-to-br from-brand-400 to-brand-600
          hover:from-brand-300 hover:to-brand-500
          disabled:opacity-40 disabled:cursor-not-allowed
          flex items-center justify-center
          transition-all duration-200 hover:scale-105 active:scale-95
          shadow-lg shadow-brand-600/30
        "
        aria-label="Send message"
      >
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      </button>
    </div>
  );
}
