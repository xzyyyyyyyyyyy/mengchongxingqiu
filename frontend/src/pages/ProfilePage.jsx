import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { petService } from '../api/petService';
import { postService } from '../api/postService';
import { orderService } from '../api/orderService';
import { bookingService } from '../api/bookingService';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    pets: 0,
    posts: 0,
    orders: { pending: 0, shipping: 0, delivered: 0, completed: 0 },
    bookings: { pending: 0, ongoing: 0, completed: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserStats();
  }, [user]);

  const loadUserStats = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Load pets count
      const petsResponse = await petService.getPets();
      const petsCount = petsResponse.data?.length || 0;

      // Load posts count
      const postsResponse = await postService.getUserPosts(user._id);
      const postsCount = postsResponse.data?.count || postsResponse.data?.data?.length || 0;

      // Load orders
      const ordersResponse = await orderService.getOrders();
      const orders = ordersResponse.data?.data || [];
      const orderStats = {
        pending: orders.filter(o => o.paymentStatus === 'pending').length,
        shipping: orders.filter(o => o.status === 'processing' || o.status === 'shipped').length,
        delivered: orders.filter(o => o.status === 'delivered').length,
        completed: orders.filter(o => o.status === 'completed').length,
      };

      // Load bookings
      const bookingsResponse = await bookingService.getBookings();
      const bookings = bookingsResponse.data?.data || [];
      const bookingStats = {
        pending: bookings.filter(b => b.status === 'pending').length,
        ongoing: bookings.filter(b => b.status === 'confirmed').length,
        completed: bookings.filter(b => b.status === 'completed').length,
      };

      setStats({
        pets: petsCount,
        posts: postsCount,
        orders: orderStats,
        bookings: bookingStats
      });
    } catch (error) {
      console.error('Failed to load user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    {
      id: 'overview',
      title: '概览',
      icon: '📊',
      items: [
        { name: '我的宠物', count: stats.pets, icon: '🐾', path: '/pets' },
        { name: '我的帖子', count: stats.posts, icon: '📝', path: '#' },
        { name: '我的收藏', count: 0, icon: '⭐', path: '#' },
        { name: '浏览历史', count: 0, icon: '👁️', path: '#' },
      ],
    },
    {
      id: 'orders',
      title: '订单管理',
      icon: '📦',
      items: [
        { name: '待付款', count: stats.orders.pending, icon: '💳', path: '#' },
        { name: '待发货', count: stats.orders.shipping, icon: '📮', path: '#' },
        { name: '待收货', count: stats.orders.delivered, icon: '🚚', path: '#' },
        { name: '已完成', count: stats.orders.completed, icon: '✓', path: '#' },
      ],
    },
    {
      id: 'bookings',
      title: '服务预约',
      icon: '📅',
      items: [
        { name: '待确认', count: stats.bookings.pending, icon: '⏰', path: '#' },
        { name: '进行中', count: stats.bookings.ongoing, icon: '🔄', path: '#' },
        { name: '已完成', count: stats.bookings.completed, icon: '✓', path: '#' },
      ],
    },
  ];

  const quickActions = [
    { name: '宠物证件夹', icon: '📋', path: '/documents' },
    { name: '健康记录导出', icon: '📄', path: '/export' },
    { name: '积分商城', icon: '🎁', path: '/points' },
    { name: '邀请好友', icon: '👥', path: '/invite' },
  ];

  const themes = [
    { id: 'default', name: '默认', color: 'bg-gray-200' },
    { id: 'cute', name: '可爱', color: 'bg-pink-200', locked: false },
    { id: 'simple', name: '简约', color: 'bg-blue-200', locked: false },
    { id: 'dark', name: '暗黑', color: 'bg-gray-800', locked: true },
  ];

  return (
    <div className="min-h-screen bg-background-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* User Profile Header */}
        <div className="card mb-6">
          <div className="flex items-center space-x-6">
            <img
              src={user?.avatar || '/default-avatar.png'}
              alt={user?.username}
              className="w-24 h-24 rounded-full object-cover"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-text-primary mb-1">
                {user?.username}
              </h1>
              <p className="text-text-secondary mb-2">{user?.email}</p>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center">
                  <span className="font-medium mr-1">{user?.points || 0}</span>
                  <span className="text-gray-600">积分</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium mr-1">{user?.following?.length || 0}</span>
                  <span className="text-gray-600">关注</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium mr-1">{user?.followers?.length || 0}</span>
                  <span className="text-gray-600">粉丝</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate('/profile/edit')}
              className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-all"
            >
              编辑资料
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Menu Sections */}
          <div className="lg:col-span-2 space-y-6">
            {menuItems.map((section) => (
              <div key={section.id} className="card">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-2xl">{section.icon}</span>
                  <h2 className="text-xl font-bold">{section.title}</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {section.items.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => item.path && item.path !== '#' && navigate(item.path)}
                      className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center"
                    >
                      <div className="text-2xl mb-2">{item.icon}</div>
                      <p className="font-medium text-sm mb-1">{item.name}</p>
                      {item.count > 0 && (
                        <span className="inline-block px-2 py-0.5 bg-primary text-white text-xs rounded-full">
                          {item.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Quick Actions */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4">快捷工具</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => navigate(action.path)}
                    className="p-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg hover:shadow-md transition-all text-center"
                  >
                    <div className="text-3xl mb-2">{action.icon}</div>
                    <p className="font-medium text-sm">{action.name}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Settings & Actions */}
          <div className="space-y-6">
            {/* Theme Selection */}
            <div className="card">
              <h3 className="text-lg font-bold mb-4">主题皮肤</h3>
              <div className="grid grid-cols-2 gap-3">
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    disabled={theme.locked}
                    className={`relative p-4 rounded-lg border-2 transition-all ${
                      theme.id === 'default'
                        ? 'border-primary'
                        : 'border-gray-200 hover:border-primary'
                    } ${theme.locked ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className={`w-full h-12 ${theme.color} rounded mb-2`}></div>
                    <p className="text-sm font-medium">{theme.name}</p>
                    {theme.locked && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl">🔒</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Settings */}
            <div className="card">
              <h3 className="text-lg font-bold mb-4">设置</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-between">
                  <span>🔔 通知设置</span>
                  <span className="text-gray-400">›</span>
                </button>
                <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-between">
                  <span>🔒 隐私设置</span>
                  <span className="text-gray-400">›</span>
                </button>
                <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-between">
                  <span>❓ 帮助与反馈</span>
                  <span className="text-gray-400">›</span>
                </button>
                <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-between">
                  <span>ℹ️ 关于我们</span>
                  <span className="text-gray-400">›</span>
                </button>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="w-full p-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
            >
              退出登录
            </button>
          </div>
        </div>

        {/* Stats Card */}
        <div className="mt-6 card bg-gradient-to-r from-primary/10 to-secondary/10">
          <h3 className="text-xl font-bold mb-4">数据统计</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold text-primary">{stats.posts}</p>
              <p className="text-sm text-gray-600">发布内容</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-secondary">{stats.pets}</p>
              <p className="text-sm text-gray-600">宠物档案</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-accent">{stats.bookings.completed}</p>
              <p className="text-sm text-gray-600">完成预约</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-purple-500">{user?.points || 0}</p>
              <p className="text-sm text-gray-600">积分</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
