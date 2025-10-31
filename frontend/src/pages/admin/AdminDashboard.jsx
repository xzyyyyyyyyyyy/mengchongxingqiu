import { useState, useEffect } from 'react';
import { statsService } from '../../api/statsService';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await statsService.getStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`text-5xl ${color}`}>{icon}</div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">无法加载统计数据</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">仪表盘</h1>
        <p className="text-gray-600 mt-1">欢迎回到管理后台</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="总用户数"
          value={stats.counts?.users || 0}
          icon="👥"
          color="text-blue-500"
        />
        <StatCard
          title="宠物档案"
          value={stats.counts?.pets || 0}
          icon="🐾"
          color="text-green-500"
        />
        <StatCard
          title="帖子内容"
          value={stats.counts?.posts || 0}
          icon="📝"
          color="text-purple-500"
        />
        <StatCard
          title="商品数量"
          value={stats.counts?.products || 0}
          icon="🛍️"
          color="text-orange-500"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">快捷操作</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors">
            <div className="text-3xl mb-2">➕</div>
            <div className="text-sm font-medium">添加商品</div>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors">
            <div className="text-3xl mb-2">🏥</div>
            <div className="text-sm font-medium">添加服务</div>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-sm font-medium">查看报表</div>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors">
            <div className="text-3xl mb-2">⚙️</div>
            <div className="text-sm font-medium">系统设置</div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Posts */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">最新帖子</h2>
          <div className="space-y-3">
            {stats.recent?.posts?.length > 0 ? (
              stats.recent.posts.map((post) => (
                <div key={post._id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <img
                    src={post.author?.avatar || '/default-avatar.png'}
                    alt={post.author?.username}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {post.author?.username}
                    </p>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                      {post.content}
                    </p>
                    <div className="flex items-center space-x-3 mt-2 text-xs text-gray-500">
                      <span>❤️ {post.likesCount}</span>
                      <span>💬 {post.commentsCount}</span>
                      <span>{new Date(post.createdAt).toLocaleDateString('zh-CN')}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">暂无帖子</p>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">最新订单</h2>
          <div className="space-y-3">
            {stats.recent?.orders?.length > 0 ? (
              stats.recent.orders.map((order) => (
                <div key={order._id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {order.orderNumber}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {order.user?.username}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      order.status === 'completed' ? 'bg-green-100 text-green-700' :
                      order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>¥{order.totalAmount}</span>
                    <span>{new Date(order.createdAt).toLocaleDateString('zh-CN')}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">暂无订单</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
