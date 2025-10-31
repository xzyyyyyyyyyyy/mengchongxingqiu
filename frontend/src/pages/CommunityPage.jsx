import { useState, useEffect, useCallback } from 'react';
import { postService } from '../api/postService';

const CommunityPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [topPosts, setTopPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTopPosts = useCallback(async () => {
    try {
      setLoading(true);
      const params = { 
        limit: 9,
        sort: 'likes'
      };
      if (selectedCategory !== 'all') {
        params.category = selectedCategory;
      }
      const response = await postService.getPosts(params);
      setTopPosts(response.data.data || []);
    } catch (error) {
      console.error('Failed to load top posts:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    loadTopPosts();
  }, [loadTopPosts]);

  const categories = [
    { id: 'all', name: '全部', icon: '🌟', color: 'bg-gray-100' },
    { id: 'cat', name: '猫咪', icon: '🐱', color: 'bg-orange-100' },
    { id: 'dog', name: '狗狗', icon: '🐶', color: 'bg-blue-100' },
    { id: 'rabbit', name: '兔兔', icon: '🐰', color: 'bg-pink-100' },
    { id: 'bird', name: '鸟类', icon: '🦜', color: 'bg-green-100' },
    { id: 'hamster', name: '仓鼠', icon: '🐹', color: 'bg-yellow-100' },
    { id: 'other', name: '其他', icon: '🐾', color: 'bg-purple-100' },
  ];

  const rankings = [
    { name: '热门榜', icon: '😍', type: 'likes' },
    { name: '互动榜', icon: '😇', type: 'comments' },
    { name: '热度榜', icon: '⚡', type: 'views' },
  ];

  return (
    <div className="min-h-screen bg-background-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-text-primary mb-2">社区广场</h1>
          <p className="text-text-secondary">与同类宠物主人交流分享</p>
        </div>

        {/* Category Selection */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`${category.color} p-4 rounded-xl transition-all ${
                selectedCategory === category.id
                  ? 'ring-2 ring-primary scale-105'
                  : 'hover:scale-105'
              }`}
            >
              <div className="text-4xl mb-2">{category.icon}</div>
              <p className="font-medium text-gray-800">{category.name}</p>
            </button>
          ))}
        </div>

        {/* Rankings Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-text-primary mb-4">热门排行榜</h2>
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {rankings.map((ranking, index) => {
                const sortedPosts = [...topPosts]
                  .sort((a, b) => {
                    if (ranking.type === 'likes') return (b.likesCount || 0) - (a.likesCount || 0);
                    if (ranking.type === 'comments') return (b.commentsCount || 0) - (a.commentsCount || 0);
                    return (b.views || 0) - (a.views || 0);
                  })
                  .slice(0, 3);

                return (
                  <div key={index} className="card">
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-2xl">{ranking.icon}</span>
                      <h3 className="text-xl font-bold">{ranking.name}</h3>
                    </div>
                    <div className="space-y-3">
                      {sortedPosts.length > 0 ? sortedPosts.map((post, postIndex) => (
                        <div
                          key={postIndex}
                          className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                          <div className={`w-8 h-8 flex items-center justify-center rounded-full ${
                            postIndex === 0 ? 'bg-yellow-400 text-white' :
                            postIndex === 1 ? 'bg-gray-400 text-white' :
                            'bg-orange-400 text-white'
                          } font-bold`}>
                            {postIndex + 1}
                          </div>
                          <div className="w-12 h-12 bg-gray-300 rounded-full overflow-hidden">
                            {post.author?.avatar && (
                              <img src={post.author.avatar} alt="" className="w-full h-full object-cover" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium line-clamp-1">{post.author?.username || '未知用户'}</p>
                            <p className="text-sm text-gray-600">
                              {ranking.type === 'likes' && `${post.likesCount || 0} 赞`}
                              {ranking.type === 'comments' && `${post.commentsCount || 0} 评论`}
                              {ranking.type === 'views' && `${post.views || 0} 浏览`}
                            </p>
                          </div>
                        </div>
                      )) : (
                        <p className="text-gray-500 text-center py-4">暂无数据</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Topics Section */}
        <div>
          <h2 className="text-2xl font-bold text-text-primary mb-4">热门话题</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { tag: '新手养宠', posts: 1234, description: '养宠新手交流经验' },
              { tag: '宠物医疗', posts: 892, description: '健康问题咨询讨论' },
              { tag: '美食分享', posts: 756, description: '分享宠物美食食谱' },
              { tag: '训练技巧', posts: 654, description: '宠物训练方法分享' },
              { tag: '萌宠日常', posts: 2341, description: '记录宠物日常生活' },
              { tag: '宠物旅行', posts: 432, description: '带宠物出游攻略' },
            ].map((topic, index) => (
              <div
                key={index}
                className="card hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold text-primary">#{topic.tag}</h3>
                  <span className="text-sm text-gray-500">{topic.posts} 帖</span>
                </div>
                <p className="text-sm text-gray-600">{topic.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Community Guidelines */}
        <div className="mt-8 card bg-gradient-to-r from-primary/5 to-secondary/5">
          <h3 className="text-xl font-bold mb-3">社区公约</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>友善交流，互相尊重</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>分享有价值的养宠经验</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>保护宠物隐私和安全</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>拒绝虚假信息和广告</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
