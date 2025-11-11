import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookmarkService } from '../api/bookmarkService';
import { getImageUrl, getMediaUrl } from '../utils/imageUtils';

const BookmarksPage = () => {
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBookmarks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await bookmarkService.getBookmarks();
      setBookmarks(response.data || []);
    } catch (error) {
      console.error('Failed to load bookmarks:', error);
      setBookmarks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBookmarks();
  }, [loadBookmarks]);

  const handleRemoveBookmark = async (postId, e) => {
    e.stopPropagation();
    try {
      await bookmarkService.removeBookmark(postId);
      setBookmarks(prev => prev.filter(b => b.post._id !== postId));
    } catch (error) {
      console.error('Failed to remove bookmark:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm mb-4 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-gray-900">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold">我的收藏</h1>
              <span className="px-2 py-1 bg-primary/10 text-primary text-sm rounded-full">
                {bookmarks.length}
              </span>
            </div>
          </div>
        </div>

        {/* Bookmarks List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">🔖</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">还没有收藏</h3>
            <p className="text-gray-500 mb-4">快去发现喜欢的内容并收藏吧！</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
            >
              去首页看看
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookmarks.map((bookmark) => {
              const post = bookmark.post;
              if (!post) return null;

              return (
                <div
                  key={bookmark._id}
                  onClick={() => navigate(`/posts/${post._id}`)}
                  className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="p-4">
                    {/* Author Info */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <img
                          src={getImageUrl(post.author?.avatar) || '/default-avatar.png'}
                          alt={post.author?.username}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <div className="font-medium">{post.author?.username}</div>
                          {post.pet && (
                            <div className="text-sm text-gray-500">来自 {post.pet.name}</div>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={(e) => handleRemoveBookmark(post._id, e)}
                        className="text-yellow-500 hover:text-yellow-600 transition-colors"
                        title="取消收藏"
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                      </button>
                    </div>

                    {/* Post Content */}
                    <div className="flex space-x-3">
                      <div className="flex-1">
                        {/* Hashtags */}
                        {post.hashtags && post.hashtags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-2">
                            {post.hashtags.map((tag, index) => (
                              <span key={index} className="text-primary text-sm">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        <p className="text-gray-800 line-clamp-3 mb-2">{post.content}</p>

                        {/* Stats */}
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
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
                          <span className="text-gray-400">
                            {new Date(bookmark.createdAt).toLocaleDateString('zh-CN')}
                          </span>
                        </div>
                      </div>

                      {/* Post Media */}
                      {post.media && post.media.length > 0 && (
                        <div className="w-24 h-24 flex-shrink-0">
                          <img
                            src={getMediaUrl(post.media[0])}
                            alt=""
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookmarksPage;
