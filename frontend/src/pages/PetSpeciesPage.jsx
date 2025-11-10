import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postService } from '../api/postService';
import { getImageUrl, getMediaUrl } from '../utils/imageUtils';

const PetSpeciesPage = () => {
  const { species } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');
  const [sortBy, setSortBy] = useState('latest');

  const speciesInfo = {
    cat: { name: '猫咪', icon: '🐱', color: 'bg-orange-100', description: '优雅独立的小精灵' },
    dog: { name: '狗狗', icon: '🐶', color: 'bg-blue-100', description: '忠诚可爱的好伙伴' },
    rabbit: { name: '兔兔', icon: '🐰', color: 'bg-pink-100', description: '软萌可爱的小天使' },
    bird: { name: '鸟类', icon: '🦜', color: 'bg-green-100', description: '灵动聪慧的飞行者' },
    hamster: { name: '仓鼠', icon: '🐹', color: 'bg-yellow-100', description: '迷你可爱的小团子' },
    other: { name: '其他', icon: '🐾', color: 'bg-purple-100', description: '独特有趣的宠物' },
  };

  const info = speciesInfo[species] || speciesInfo.other;

  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      const params = { species, limit: 20 };
      
      // Apply sorting
      if (sortBy === 'hot') {
        params.sort = '-likesCount';
      } else if (sortBy === 'trending') {
        params.sort = '-views';
      }
      
      const response = await postService.getPosts(params);
      setPosts(response.data || []);
    } catch (error) {
      console.error('Failed to load posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [species, sortBy]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const tabs = [
    { id: 'posts', label: '帖子', icon: '📝' },
    { id: 'ranking', label: '排行榜', icon: '🏆' },
    { id: 'adoption', label: '领养', icon: '🏠' },
  ];

  const renderPosts = () => (
    <div className="space-y-4">
      {/* Sort Options */}
      <div className="flex space-x-2 mb-4">
        {[
          { id: 'latest', label: '最新' },
          { id: 'hot', label: '最热' },
          { id: 'trending', label: '热度' },
        ].map(option => (
          <button
            key={option.id}
            onClick={() => setSortBy(option.id)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              sortBy === option.id
                ? 'bg-primary text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Posts Grid */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map(post => (
            <div
              key={post._id}
              onClick={() => navigate(`/posts/${post._id}`)}
              className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            >
              {/* Post Image */}
              {post.media && post.media.length > 0 && (
                <div className="aspect-square bg-gray-100">
                  <img
                    src={getMediaUrl(post.media[0])}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              {/* Post Content */}
              <div className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <img
                    src={getImageUrl(post.author?.avatar) || '/default-avatar.png'}
                    alt={post.author?.username}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm font-medium">{post.author?.username}</span>
                </div>
                <p className="text-gray-700 line-clamp-2 mb-2">{post.content}</p>
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
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg">
          <div className="text-6xl mb-4">{info.icon}</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">暂无内容</h3>
          <p className="text-gray-500">快来分享你的{info.name}吧！</p>
        </div>
      )}
    </div>
  );

  const renderRanking = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-xl font-bold mb-4">本周{info.name}人气榜</h3>
        <div className="space-y-3">
          {posts.slice(0, 10).sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0)).map((post, index) => (
            <div
              key={post._id}
              onClick={() => navigate(`/posts/${post._id}`)}
              className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
            >
              <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${
                index === 0 ? 'bg-yellow-400 text-white' :
                index === 1 ? 'bg-gray-400 text-white' :
                index === 2 ? 'bg-orange-400 text-white' :
                'bg-gray-100 text-gray-600'
              }`}>
                {index + 1}
              </div>
              <img
                src={getImageUrl(post.author?.avatar) || '/default-avatar.png'}
                alt=""
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <p className="font-medium">{post.author?.username}</p>
                <p className="text-sm text-gray-500">{post.likesCount || 0} 赞</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAdoption = () => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🏠</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{info.name}领养板块</h3>
        <p className="text-gray-500 mb-4">即将上线，敬请期待</p>
        <button
          onClick={() => navigate('/posts/create')}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
        >
          发布领养信息
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className={`${info.color} rounded-lg p-6 mb-6`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/community')}
                className="text-gray-600 hover:text-gray-900"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="text-5xl">{info.icon}</div>
              <div>
                <h1 className="text-3xl font-bold">{info.name}专栏</h1>
                <p className="text-gray-600 mt-1">{info.description}</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/posts/create')}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
            >
              发帖
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-primary shadow-sm'
                  : 'bg-white text-gray-600 hover:text-primary'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : (
          <>
            {activeTab === 'posts' && renderPosts()}
            {activeTab === 'ranking' && renderRanking()}
            {activeTab === 'adoption' && renderAdoption()}
          </>
        )}
      </div>
    </div>
  );
};

export default PetSpeciesPage;
