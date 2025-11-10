import { useState, useEffect, useCallback } from 'react';
import { postService } from '../../api/postService';

const AdminPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      const params = { limit: 50 };
      if (selectedCategory !== 'all') {
        params.category = selectedCategory;
      }
      const response = await postService.getPosts(params);
      setPosts(response.data || []);
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleDelete = async (id) => {
    if (!confirm('确定要删除这个帖子吗？')) return;
    try {
      await postService.deletePost(id);
      loadPosts();
    } catch (error) {
      console.error('Failed to delete post:', error);
      alert('删除失败');
    }
  };

  const categories = [
    { id: 'all', name: '全部' },
    { id: 'daily', name: '日常' },
    { id: 'funny', name: '搞笑' },
    { id: 'medical', name: '医疗' },
    { id: 'food', name: '美食' },
    { id: 'training', name: '训练' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">内容管理</h1>
        <p className="text-gray-600 mt-1">管理平台上的所有帖子内容</p>
      </div>

      {/* Category Filter */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex space-x-2 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">暂无帖子</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">内容</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">作者</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">分类</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">互动</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">发布时间</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {posts.map((post) => (
                <tr key={post._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-start space-x-3">
                      {post.media && post.media.length > 0 && (
                        <div className="h-16 w-16 flex-shrink-0 bg-gray-200 rounded">
                          <img 
                            src={post.media[0].url} 
                            alt="" 
                            className="h-16 w-16 rounded object-cover" 
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 line-clamp-2">{post.content}</p>
                        {post.hashtags && post.hashtags.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {post.hashtags.slice(0, 3).map((tag, idx) => (
                              <span key={idx} className="text-xs text-primary">#{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <img
                        src={post.author?.avatar || '/default-avatar.png'}
                        alt=""
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="text-sm text-gray-900">{post.author?.username}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{post.category || '-'}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      <div>❤️ {post.likesCount || 0}</div>
                      <div>💬 {post.commentsCount || 0}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {new Date(post.createdAt).toLocaleDateString('zh-CN')}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      删除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminPosts;
