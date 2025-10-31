import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { postService } from '../api/postService';
import { useAuth } from '../contexts/AuthContext';

const MyPostsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, [user]);

  const loadPosts = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await postService.getUserPosts(user._id || user.id);
      setPosts(response.data?.data || []);
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryName = (category) => {
    const names = {
      daily: '日常',
      medical: '医疗',
      training: '训练',
      food: '美食',
      travel: '旅行',
      funny: '搞笑',
      other: '其他',
    };
    return names[category] || category;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center text-gray-600 hover:text-primary mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            返回
          </button>
          <h1 className="text-3xl font-bold text-text-primary">我的帖子</h1>
          <p className="text-text-secondary mt-2">共 {posts.length} 篇</p>
        </div>

        {/* Posts Grid */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div
                key={post._id}
                onClick={() => navigate(`/posts/${post._id}`)}
                className="card hover:shadow-lg transition-shadow cursor-pointer"
              >
                {/* Post Image/Video Preview */}
                {post.media && post.media.length > 0 && (
                  <div className="relative aspect-square mb-3 overflow-hidden rounded-lg">
                    {post.media[0].type === 'video' ? (
                      <video
                        src={post.media[0].url}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={post.media[0].url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    )}
                    {post.media.length > 1 && (
                      <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-sm">
                        +{post.media.length - 1}
                      </div>
                    )}
                  </div>
                )}

                {/* Post Content */}
                <div className="space-y-2">
                  <p className="text-gray-800 line-clamp-3">{post.content}</p>
                  
                  {/* Category & Date */}
                  <div className="flex items-center justify-between text-sm">
                    {post.category && (
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded">
                        {getCategoryName(post.category)}
                      </span>
                    )}
                    <span className="text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString('zh-CN')}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center space-x-4 text-sm text-gray-600 pt-2 border-t">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                      {post.likesCount || 0}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                      </svg>
                      {post.commentsCount || 0}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                      {post.views || 0}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-gray-500 text-lg mb-4">还没有发布任何帖子</p>
            <button
              onClick={() => navigate('/create-post')}
              className="btn-primary"
            >
              发布第一篇帖子
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPostsPage;
