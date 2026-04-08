import { getAvatarGradient, getInitials } from '../../utils/generateAvatar';

export default function Avatar({ name = '', size = 'md', isOnline = false }) {
  const [from, to] = getAvatarGradient(name);
  const initials = getInitials(name);

  const sizes = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl',
  };

  return (
    <div className="relative inline-flex flex-shrink-0">
      <div
        className={`${sizes[size]} rounded-full flex items-center justify-center font-bold text-white shadow-lg select-none`}
        style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
      >
        {initials}
      </div>
      {isOnline && (
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-surface-850 rounded-full" />
      )}
    </div>
  );
}
