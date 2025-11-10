import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { postService } from '../api/postService';

const EnhancedHomePage = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('recommend');
  const [searchQuery, setSearchQuery] = useState('');
  const [location] = useState('上海'); // Static for now, can be made dynamic later

  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await postService.getPosts();
      setPosts(response.data.data || response.data || []);
    } catch (error) {
      console.error('Failed to load posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const quickCategories = [
    { icon: '🍖', label: '宠物粮', path: '/shop?category=food' },
    { icon: '🏠', label: '领养', path: '/category' },
    { icon: '🔍', label: '丢失', path: '/community' },
    { icon: '📍', label: '附近', path: '/services' },
  ];

  const commonSections = [
    { id: 1, name: '#金毛俱乐部', icon: '🐕' },
    { id: 2, name: '#猫咪摄影', icon: '📷' },
    { id: 3, name: '#新手养狗', icon: '🎓' },
    { id: 4, name: '#布偶猫', icon: '😺' },
    { id: 5, name: '#宠物健康', icon: '💊' },
  ];

  const handleLike = async (postId) => {
    try {
      await postService.likePost(postId);
      loadPosts();
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar with Location and Notifications */}
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 cursor-pointer hover:text-primary">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{location}</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>

            <button className="relative p-2 hover:bg-gray-100 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-7xl mx-auto px-4 pb-3">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索宠物/话题/医院/好物"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                }
              }}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 w-5 h-5 text-gray-400 hover:text-gray-600"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-6 border-b">
            {['recommend', 'follow'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 font-medium transition-colors relative ${
                  activeTab === tab
                    ? 'text-primary'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab === 'recommend' && '推荐'}
                {tab === 'follow' && '关注'}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Quick Categories */}
        <div className="flex space-x-3 mb-4 overflow-x-auto pb-2">
          {quickCategories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => navigate(cat.path)}
              className="flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 bg-white rounded-lg hover:shadow-md transition-shadow"
            >
              <span className="text-2xl mb-1">{cat.icon}</span>
              <span className="text-xs text-gray-600">{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Banner */}
        <div className="mb-4 relative overflow-hidden rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 p-6 text-white">
          <h3 className="text-2xl font-bold mb-2">萌宠狂欢节</h3>
          <p className="text-sm opacity-90">全场宠物用品低至5折！</p>
          <div className="absolute right-4 bottom-4 text-6xl opacity-20">🎉</div>
        </div>

        {/* Common Sections */}
        <div className="mb-4 bg-white rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-lg">我的常去板块</h3>
            <button className="text-sm text-primary flex items-center">
              更多
              <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {commonSections.map((section) => (
              <Link
                key={section.id}
                to={`/community/hashtag/${section.name.replace('#', '')}`}
                className="px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors flex items-center space-x-1"
              >
                <span>{section.icon}</span>
                <span>{section.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Posts Feed */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post._id} className="bg-white rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                {/* Post Header */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={post.author?.avatar || '/default-avatar.png'}
                      alt={post.author?.username}
                      className="w-10 h-10 rounded-full cursor-pointer"
                      onClick={() => navigate(`/profile/${post.author?._id}`)}
                    />
                    <div>
                      <div className="font-medium">{post.author?.username}</div>
                      {post.pet && (
                        <div className="text-sm text-gray-500">来自 {post.pet.name}</div>
                      )}
                    </div>
                  </div>
                  <button className="px-4 py-1 bg-primary text-white rounded-full text-sm hover:bg-primary/90">
                    关注
                  </button>
                </div>

                {/* Post Content */}
                <div 
                  className="px-4 pb-3 cursor-pointer"
                  onClick={() => navigate(`/posts/${post._id}`)}
                >
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
                  
                  <p className="text-gray-800 mb-3">{post.content}</p>

                  {/* Media */}
                  {post.media && post.media.length > 0 && (
                    <div className={`grid gap-2 ${
                      post.media.length === 1 ? 'grid-cols-1' :
                      post.media.length === 2 ? 'grid-cols-2' :
                      post.media.length === 3 ? 'grid-cols-3' :
                      'grid-cols-2'
                    }`}>
                      {post.media.slice(0, 4).map((item, index) => (
                        <div key={index} className="relative aspect-square overflow-hidden rounded-lg">
                          {item.type === 'video' ? (
                            <div className="relative w-full h-full bg-black">
                              <video
                                src={item.url}
                                className="w-full h-full object-cover"
                                controls
                                preload="metadata"
                              />
                            </div>
                          ) : (
                            <img
                              src={item.url}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Post Actions */}
                <div className="px-4 py-3 border-t flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(post._id);
                      }}
                      className="flex items-center space-x-1 text-gray-600 hover:text-red-500 transition-colors"
                    >
                      <svg className="w-5 h-5" fill={post.isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span className="text-sm">{post.likesCount || 0}</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/posts/${post._id}#comments`);
                      }}
                      className="flex items-center space-x-1 text-gray-600 hover:text-blue-500 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span className="text-sm">{post.commentsCount || 0}</span>
                    </button>

                    <button className="flex items-center space-x-1 text-gray-600 hover:text-yellow-500 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                      <span className="text-sm">{post.bookmarksCount || 0}</span>
                    </button>
                  </div>

                  <button className="text-gray-600 hover:text-gray-900">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {posts.length === 0 && !loading && (
          <div className="text-center py-12 bg-white rounded-lg">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无内容</h3>
            <p className="text-gray-500">成为第一个分享的人吧！</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedHomePage;
