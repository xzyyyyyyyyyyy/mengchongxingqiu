import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const PointsMallPage = () => {
  // eslint-disable-next-line no-unused-vars
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState('all');
  const [items, setItems] = useState([]);
  const [userPoints, setUserPoints] = useState(5000); // Mock user points

  // Mock mall items
  const mallItems = [
    {
      id: 1,
      name: '商品优惠券',
      description: '全场商品满100减20',
      category: 'coupon',
      points: 500,
      stock: 50,
      icon: '🎫',
      image: 'https://via.placeholder.com/200?text=Coupon',
    },
    {
      id: 2,
      name: '服务折扣券',
      description: '宠物美容8折优惠',
      category: 'coupon',
      points: 800,
      stock: 30,
      icon: '✂️',
      image: 'https://via.placeholder.com/200?text=Service',
    },
    {
      id: 3,
      name: '卡通风格头像',
      description: 'AI生成卡通风格虚拟形象',
      category: 'avatar',
      points: 1000,
      stock: 999,
      icon: '🎨',
      image: 'https://via.placeholder.com/200?text=Avatar',
    },
    {
      id: 4,
      name: 'Q版风格头像',
      description: 'AI生成Q版风格虚拟形象',
      category: 'avatar',
      points: 1000,
      stock: 999,
      icon: '😊',
      image: 'https://via.placeholder.com/200?text=Q-Avatar',
    },
    {
      id: 5,
      name: '可爱皮肤',
      description: '粉色萌系主题皮肤',
      category: 'theme',
      points: 1500,
      stock: 100,
      icon: '🎀',
      image: 'https://via.placeholder.com/200?text=Skin',
    },
    {
      id: 6,
      name: '暗黑皮肤',
      description: '护眼暗黑模式皮肤',
      category: 'theme',
      points: 1500,
      stock: 100,
      icon: '🌙',
      image: 'https://via.placeholder.com/200?text=Dark',
    },
    {
      id: 7,
      name: '专属徽章',
      description: '金色VIP专属徽章',
      category: 'badge',
      points: 2000,
      stock: 20,
      icon: '🏅',
      image: 'https://via.placeholder.com/200?text=Badge',
    },
    {
      id: 8,
      name: '虚拟装饰-花环',
      description: '为虚拟形象添加花环装饰',
      category: 'decoration',
      points: 600,
      stock: 999,
      icon: '🌸',
      image: 'https://via.placeholder.com/200?text=Flower',
    },
    {
      id: 9,
      name: '虚拟装饰-帽子',
      description: '为虚拟形象添加帽子装饰',
      category: 'decoration',
      points: 600,
      stock: 999,
      icon: '🎩',
      image: 'https://via.placeholder.com/200?text=Hat',
    },
    {
      id: 10,
      name: '免费寄养券',
      description: '1天免费宠物寄养服务',
      category: 'coupon',
      points: 3000,
      stock: 10,
      icon: '🏠',
      image: 'https://via.placeholder.com/200?text=Free',
    },
  ];

  const categories = [
    { id: 'all', name: '全部', icon: '🎁' },
    { id: 'coupon', name: '优惠券', icon: '🎫' },
    { id: 'avatar', name: '虚拟形象', icon: '🎨' },
    { id: 'theme', name: '主题皮肤', icon: '🎀' },
    { id: 'badge', name: '徽章', icon: '🏅' },
    { id: 'decoration', name: '装饰品', icon: '🌸' },
  ];

  useEffect(() => {
    const filtered = activeCategory === 'all' 
      ? mallItems 
      : mallItems.filter(item => item.category === activeCategory);
    setItems(filtered);
  }, [activeCategory]);

  const handleExchange = (item) => {
    if (userPoints >= item.points) {
      if (window.confirm(`确认兑换 ${item.name}？将消耗 ${item.points} 积分`)) {
        setUserPoints(prev => prev - item.points);
        alert('兑换成功！请在"我的"页面查看');
      }
    } else {
      alert('积分不足，快去完成任务赚取积分吧！');
    }
  };

  return (
    <div className="min-h-screen bg-background-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header with Points */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">🎁 积分商城</h1>
              <p className="text-text-secondary">用积分兑换精彩好礼</p>
            </div>
            <div className="card text-center bg-gradient-to-br from-yellow-50 to-orange-50">
              <div className="text-sm text-text-secondary mb-1">我的积分</div>
              <div className="text-3xl font-bold text-primary">{userPoints.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-6 flex gap-3 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                activeCategory === cat.id
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white text-text-secondary hover:bg-gray-50'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {items.map((item) => (
            <div key={item.id} className="card hover:shadow-xl transition-all">
              {/* Image */}
              <div className="w-full h-48 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg mb-4 flex items-center justify-center text-6xl">
                {item.icon}
              </div>

              {/* Info */}
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-bold text-text-primary mb-1">
                    {item.name}
                  </h3>
                  <p className="text-sm text-text-secondary">{item.description}</p>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-primary">
                      {item.points}
                    </span>
                    <span className="text-sm text-text-secondary">积分</span>
                  </div>
                  <div className="text-sm text-text-secondary">
                    库存: {item.stock}
                  </div>
                </div>

                <button
                  onClick={() => handleExchange(item)}
                  disabled={userPoints < item.points || item.stock === 0}
                  className={`w-full py-2 rounded-lg font-medium transition-colors ${
                    userPoints < item.points || item.stock === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-primary text-white hover:bg-primary-dark'
                  }`}
                >
                  {item.stock === 0 ? '已售罄' : userPoints < item.points ? '积分不足' : '立即兑换'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* How to Earn Points */}
        <div className="card bg-gradient-to-br from-blue-50 to-purple-50">
          <h3 className="text-lg font-bold text-text-primary mb-4">💡 如何获取积分？</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="text-2xl">✍️</div>
              <div>
                <div className="font-medium text-text-primary">发布内容</div>
                <div className="text-sm text-text-secondary">每发布1篇帖子获得10积分</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl">❤️</div>
              <div>
                <div className="font-medium text-text-primary">互动点赞</div>
                <div className="text-sm text-text-secondary">每天点赞可获得5积分</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl">📝</div>
              <div>
                <div className="font-medium text-text-primary">健康打卡</div>
                <div className="text-sm text-text-secondary">连续7天打卡获得50积分</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl">👥</div>
              <div>
                <div className="font-medium text-text-primary">邀请好友</div>
                <div className="text-sm text-text-secondary">每邀请1位好友获得100积分</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl">🛒</div>
              <div>
                <div className="font-medium text-text-primary">购物消费</div>
                <div className="text-sm text-text-secondary">每消费1元获得1积分</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl">🏆</div>
              <div>
                <div className="font-medium text-text-primary">上榜奖励</div>
                <div className="text-sm text-text-secondary">进入排行榜前三获得500积分</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PointsMallPage;
