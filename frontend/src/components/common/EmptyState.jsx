const EmptyState = ({ 
  icon = '📦', 
  title = '暂无数据', 
  description = '', 
  actionText,
  onAction 
}) => {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">{icon}</div>
      <p className="text-gray-500 text-lg mb-2">{title}</p>
      {description && (
        <p className="text-gray-400 text-sm mb-4">{description}</p>
      )}
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="btn-primary inline-block"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
