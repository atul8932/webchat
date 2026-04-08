export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 py-16 px-6 text-center animate-fade-in">
      {icon && (
        <div className="w-16 h-16 rounded-2xl bg-surface-800/60 flex items-center justify-center text-3xl">
          {icon}
        </div>
      )}
      <div>
        <h3 className="text-white font-semibold text-lg">{title}</h3>
        {description && (
          <p className="text-surface-200 text-sm mt-1 max-w-xs">{description}</p>
        )}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
