import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { historyService } from '../api/historyService';
import { getImageUrl, getMediaUrl } from '../utils/imageUtils';

const BrowsingHistoryPage = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  const loadHistory = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (activeFilter !== 'all') {
        params.itemType = activeFilter;
      }
      const response = await historyService.getHistory(params);
      setHistory(response.data || []);
    } catch (error) {
      console.error('Failed to load history:', error);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }, [activeFilter]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleClearHistory = async () => {
    if (!window.confirm('确定要清除所有浏览记录吗？')) return;
    
    try {
      await historyService.clearHistory(activeFilter !== 'all' ? activeFilter : null);
      setHistory([]);
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  };

  const handleDeleteItem = async (id, e) => {
    e.stopPropagation();
    try {
      await historyService.deleteHistoryItem(id);
      setHistory(prev => prev.filter(item => item._id !== id));
    } catch (error) {
      console.error('Failed to delete history item:', error);
    }
  };

  const handleItemClick = (item) => {
    switch (item.itemType) {
      case 'post':
        navigate(`/posts/${item.itemId}`);
        break;
      case 'pet':
        navigate(`/pets/${item.itemId}`);
        break;
      case 'product':
        navigate(`/shop/${item.itemId}`);
        break;
      case 'service':
        navigate(`/services/${item.itemId}`);
        break;
      default:
        break;
    }
  };

  const renderHistoryItem = (item) => {
    let title, image, subtitle;

    switch (item.itemType) {
      case 'post':
        if (!item.post) return null;
        title = item.post.content?.substring(0, 100);
        image = item.post.media?.[0] ? getMediaUrl(item.post.media[0]) : null;
        subtitle = `作者: ${item.post.author?.username || '未知'}`;
        break;
      case 'pet':
        if (!item.pet) return null;
        title = item.pet.name;
        image = getImageUrl(item.pet.avatar);
        subtitle = item.pet.species;
        break;
      case 'product':
        if (!item.product) return null;
        title = item.product.name;
        image = item.product.images?.[0] ? getMediaUrl(item.product.images[0]) : null;
        subtitle = `¥${item.product.pricing?.currentPrice || item.product.pricing?.originalPrice}`;
        break;
      case 'service':
        if (!item.service) return null;
        title = item.service.name;
        image = item.service.images?.[0] ? getImageUrl(item.service.images[0]) : null;
        subtitle = item.service.location?.address;
        break;
      default:
        return null;
    }

    return (
      <div
        key={item._id}
        onClick={() => handleItemClick(item)}
        className="bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
      >
        <div className="flex items-start space-x-3">
          {image && (
            <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
              <img src={image} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 line-clamp-2 mb-1">{title}</h3>
                <p className="text-sm text-gray-500">{subtitle}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(item.viewedAt).toLocaleString('zh-CN')}
                </p>
              </div>
              <button
                onClick={(e) => handleDeleteItem(item._id, e)}
                className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                title="删除"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const filters = [
    { id: 'all', label: '全部', icon: '📱' },
    { id: 'post', label: '帖子', icon: '📝' },
    { id: 'pet', label: '宠物', icon: '🐾' },
    { id: 'product', label: '商品', icon: '🛒' },
    { id: 'service', label: '服务', icon: '🏥' },
  ];

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
              <h1 className="text-2xl font-bold">浏览历史</h1>
              <span className="px-2 py-1 bg-primary/10 text-primary text-sm rounded-full">
                {history.length}
              </span>
            </div>
            {history.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="text-sm text-red-500 hover:text-red-600"
              >
                清空记录
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex space-x-2 overflow-x-auto">
            {filters.map(filter => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  activeFilter === filter.id
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{filter.icon}</span>
                <span>{filter.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* History List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : history.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">🕐</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无浏览记录</h3>
            <p className="text-gray-500 mb-4">您的浏览历史会显示在这里</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
            >
              去首页看看
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map(item => renderHistoryItem(item))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowsingHistoryPage;
