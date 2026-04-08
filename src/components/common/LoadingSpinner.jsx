export default function LoadingSpinner({ size = 'md', label = 'Loading...' }) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <div
        className={`${sizes[size]} rounded-full border-brand-500/30 border-t-brand-400 animate-spin`}
      />
      {label && (
        <p className="text-surface-200 text-sm animate-pulse">{label}</p>
      )}
    </div>
  );
}
