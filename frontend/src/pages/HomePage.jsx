import { useState, useEffect } from 'react';
import { postService } from '../api/postService';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadPosts();
  }, [filter]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const params = filter !== 'all' ? { category: filter } : {};
      const response = await postService.getPosts(params);
      setPosts(response.data);
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      await postService.likePost(postId);
      loadPosts();
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-text-primary mb-2">萌宠星球</h1>
          <p className="text-text-secondary">分享你的宠物日常</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-4 mb-6 overflow-x-auto">
          {['all', 'daily', 'funny', 'medical', 'food', 'training'].map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                filter === category
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category === 'all' && '全部'}
              {category === 'daily' && '日常'}
              {category === 'funny' && '搞笑'}
              {category === 'medical' && '医疗'}
              {category === 'food' && '美食'}
              {category === 'training' && '训练'}
            </button>
          ))}
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post) => (
              <div key={post._id} className="card hover:shadow-lg transition-shadow cursor-pointer">
                {/* Post Image */}
                {post.media && post.media.length > 0 && (
                  <div className="relative mb-3">
                    <img
                      src={post.media[0].url}
                      alt=""
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    {post.mediaType === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-black bg-opacity-50 rounded-full p-3">
                          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Post Content */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <img
                      src={post.author?.avatar || '/default-avatar.png'}
                      alt={post.author?.username}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="font-medium text-sm">{post.author?.username}</span>
                  </div>

                  <p className="text-gray-700 line-clamp-3">{post.content}</p>

                  {/* Tags */}
                  {post.hashtags && post.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.hashtags.map((tag, index) => (
                        <span key={index} className="text-primary text-sm">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center space-x-4 pt-2 text-gray-600">
                    <button
                      onClick={() => handleLike(post._id)}
                      className="flex items-center space-x-1 hover:text-primary transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                      <span>{post.likesCount}</span>
                    </button>
                    <div className="flex items-center space-x-1">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                      </svg>
                      <span>{post.commentsCount}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                      <span>{post.views}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {posts.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">暂无内容</p>
            <p className="text-gray-400 text-sm mt-2">成为第一个分享的人吧！</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
