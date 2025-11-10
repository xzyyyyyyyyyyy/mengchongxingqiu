import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getImageUrl } from '../utils/imageUtils';

const NotificationsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock notifications - in a real app, fetch from API
    const mockNotifications = [
      {
        id: 1,
        type: 'like',
        user: { username: '小明', avatar: null },
        content: '赞了你的帖子',
        post: { id: '1', title: '我家猫咪今天超可爱' },
        time: '2小时前',
        read: false
      },
      {
        id: 2,
        type: 'comment',
        user: { username: '小红', avatar: null },
        content: '评论了你的帖子: "好可爱啊！"',
        post: { id: '1', title: '我家猫咪今天超可爱' },
        time: '3小时前',
        read: false
      },
      {
        id: 3,
        type: 'follow',
        user: { username: '宠物达人', avatar: null },
        content: '关注了你',
        time: '5小时前',
        read: true
      },
      {
        id: 4,
        type: 'system',
        content: '您的订单已发货',
        order: { id: 'ORD123456' },
        time: '1天前',
        read: true
      },
      {
        id: 5,
        type: 'reminder',
        content: '提醒：明天是小橘的疫苗接种日',
        pet: { name: '小橘' },
        time: '2天前',
        read: true
      }
    ];

    setTimeout(() => {
      setNotifications(mockNotifications);
      setLoading(false);
    }, 500);
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return '❤️';
      case 'comment':
        return '💬';
      case 'follow':
        return '👤';
      case 'system':
        return '📢';
      case 'reminder':
        return '⏰';
      default:
        return '🔔';
    }
  };

  const handleNotificationClick = (notification) => {
    // Mark as read
    setNotifications(prev => 
      prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
    );

    // Navigate based on notification type
    if (notification.post) {
      navigate(`/posts/${notification.post.id}`);
    } else if (notification.order) {
      navigate(`/orders`);
    } else if (notification.user && notification.type === 'follow') {
      navigate(`/profile`);
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !n.read;
    return n.type === activeTab;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm mb-4 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-gray-900">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold">通知</h1>
              {unreadCount > 0 && (
                <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <button
              onClick={markAllAsRead}
              className="text-sm text-primary hover:text-primary-dark"
            >
              全部已读
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-2 overflow-x-auto">
            {[
              { id: 'all', label: '全部' },
              { id: 'unread', label: '未读' },
              { id: 'like', label: '赞' },
              { id: 'comment', label: '评论' },
              { id: 'follow', label: '关注' },
              { id: 'system', label: '系统' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-2">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <div className="text-6xl mb-4">🔔</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">暂无通知</h3>
              <p className="text-gray-500">当有新消息时会在这里显示</p>
            </div>
          ) : (
            filteredNotifications.map(notification => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow ${
                  !notification.read ? 'border-l-4 border-primary' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  {/* Icon or Avatar */}
                  <div className="flex-shrink-0">
                    {notification.user ? (
                      <img
                        src={getImageUrl(notification.user.avatar) || '/default-avatar.png'}
                        alt={notification.user.username}
                        className="w-12 h-12 rounded-full"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
                        {getNotificationIcon(notification.type)}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        {notification.user && (
                          <span className="font-medium text-gray-900">
                            {notification.user.username}
                          </span>
                        )}
                        <p className="text-gray-700">{notification.content}</p>
                        {notification.post && (
                          <p className="text-sm text-gray-500 mt-1">
                            《{notification.post.title}》
                          </p>
                        )}
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-red-500 rounded-full ml-2 flex-shrink-0"></div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
