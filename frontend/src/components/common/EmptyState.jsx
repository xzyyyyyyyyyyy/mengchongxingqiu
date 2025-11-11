const EmptyState = ({ 
  icon = '📭', 
  title = '暂无内容', 
  description = '这里还没有任何内容', 
  actionText,
  onAction,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 ${className}`}>
      <div className="text-8xl mb-6 animate-float filter drop-shadow-lg">{icon}</div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-500 text-center mb-6 max-w-sm">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="btn-primary px-8 py-3 text-base"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
