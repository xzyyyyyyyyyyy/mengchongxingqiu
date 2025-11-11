const LoadingSkeleton = ({ type = 'post', count = 3 }) => {
  const PostSkeleton = () => (
    <div className="bg-white rounded-xl p-5 mb-4 animate-pulse">
      {/* User info */}
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
        <div className="ml-3 flex-1">
          <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-24"></div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        <div className="h-3 bg-gray-200 rounded w-4/6"></div>
      </div>

      {/* Image placeholder */}
      <div className="h-64 bg-gray-200 rounded-xl mb-4"></div>

      {/* Actions */}
      <div className="flex space-x-6">
        <div className="h-8 bg-gray-200 rounded w-16"></div>
        <div className="h-8 bg-gray-200 rounded w-16"></div>
        <div className="h-8 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
  );

  const CardSkeleton = () => (
    <div className="bg-white rounded-xl overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200"></div>
      <div className="p-4">
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>
  );

  const ListSkeleton = () => (
    <div className="bg-white rounded-xl p-4 mb-3 animate-pulse">
      <div className="flex items-center space-x-3">
        <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );

  const CommentSkeleton = () => (
    <div className="bg-gray-50 rounded-xl p-4 mb-3 animate-pulse">
      <div className="flex items-start space-x-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0"></div>
        <div className="flex-1">
          <div className="h-3 bg-gray-200 rounded w-24 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-4/5"></div>
        </div>
      </div>
    </div>
  );

  const renderSkeleton = () => {
    switch (type) {
      case 'post':
        return <PostSkeleton />;
      case 'card':
        return <CardSkeleton />;
      case 'list':
        return <ListSkeleton />;
      case 'comment':
        return <CommentSkeleton />;
      default:
        return <PostSkeleton />;
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>{renderSkeleton()}</div>
      ))}
    </>
  );
};

export default LoadingSkeleton;
