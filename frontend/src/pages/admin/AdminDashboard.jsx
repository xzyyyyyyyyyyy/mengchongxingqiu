import { useState, useEffect } from 'react';
import { authService } from '../../api/authService';
import { petService } from '../../api/petService';
import { postService } from '../../api/postService';
import { productService } from '../../api/productService';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    pets: 0,
    posts: 0,
    products: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      // Load basic stats from APIs
      const [petsRes, postsRes, productsRes] = await Promise.all([
        petService.getPets(),
        postService.getPosts({ limit: 1 }),
        productService.getProducts({ limit: 1 }),
      ]);

      setStats({
        users: 0, // We'll need an admin API to get user count
        pets: petsRes.data.data?.length || 0,
        posts: postsRes.data.total || 0,
        products: productsRes.data.total || 0,
      });
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
          value={stats.users}
          icon="👥"
          color="text-blue-500"
        />
        <StatCard
          title="宠物档案"
          value={stats.pets}
          icon="🐾"
          color="text-green-500"
        />
        <StatCard
          title="帖子内容"
          value={stats.posts}
          icon="📝"
          color="text-purple-500"
        />
        <StatCard
          title="商品数量"
          value={stats.products}
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
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">最近活动</h2>
        <div className="space-y-4">
          <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl">📝</div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">新帖子发布</p>
              <p className="text-xs text-gray-600 mt-1">用户分享了新的宠物日常</p>
              <p className="text-xs text-gray-500 mt-1">5分钟前</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl">🛍️</div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">新订单创建</p>
              <p className="text-xs text-gray-600 mt-1">用户购买了宠物用品</p>
              <p className="text-xs text-gray-500 mt-1">15分钟前</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl">👤</div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">新用户注册</p>
              <p className="text-xs text-gray-600 mt-1">新用户加入萌宠星球</p>
              <p className="text-xs text-gray-500 mt-1">1小时前</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
