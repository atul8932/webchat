import Avatar from '../common/Avatar';
import { formatTime } from '../../utils/formatTime';

export default function PublicMessage({ message, isOwn }) {
  const { name, branch, text, timestamp } = message;

  if (isOwn) {
    return (
      <div className="flex flex-col items-end gap-1 group animate-fade-in">
        <div className="flex items-end gap-2 flex-row-reverse">
          <Avatar name={name} size="sm" />
          <div className="max-w-xs lg:max-w-md">
            <div className="
              px-4 py-2.5 rounded-2xl rounded-tr-sm
              bg-gradient-to-br from-brand-400 to-brand-600
              text-white text-sm shadow-lg shadow-brand-600/20
            ">
              <p className="leading-relaxed break-words">{text}</p>
            </div>
            <p className="text-surface-200/40 text-[11px] mt-1 text-right opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {formatTime(timestamp)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start gap-1 group animate-fade-in">
      <div className="flex items-end gap-2">
        <Avatar name={name} size="sm" />
        <div className="max-w-xs lg:max-w-md">
          <div className="flex items-baseline gap-2 mb-1 ml-1">
            <span className="text-white text-xs font-semibold">{name}</span>
            <span className="text-brand-400/70 text-[10px] font-medium bg-brand-500/10 px-1.5 py-0.5 rounded-full">
              {branch}
            </span>
          </div>
          <div className="
            px-4 py-2.5 rounded-2xl rounded-tl-sm
            bg-surface-800/80 backdrop-blur-sm
            border border-white/5
            text-surface-50 text-sm
          ">
            <p className="leading-relaxed break-words">{text}</p>
          </div>
          <p className="text-surface-200/40 text-[11px] mt-1 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {formatTime(timestamp)}
          </p>
        </div>
      </div>
    </div>
  );
}
