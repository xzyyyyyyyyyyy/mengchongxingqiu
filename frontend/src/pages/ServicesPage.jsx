import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { serviceService } from '../api/serviceService';

const ServicesPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadServices = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory !== 'all') {
        params.category = selectedCategory;
      }
      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }
      const response = await serviceService.getServices(params);
      setServices(response.data || []);
    } catch (error) {
      console.error('Failed to load services:', error);
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchTerm]);

  useEffect(() => {
    // Debounce search to avoid too many API calls
    const timer = setTimeout(() => {
      loadServices();
    }, 300);

    return () => clearTimeout(timer);
  }, [loadServices]);

  const serviceCategories = [
    { id: 'all', name: '全部服务', icon: '🏪' },
    { id: 'hospital', name: '宠物医院', icon: '🏥' },
    { id: 'grooming', name: '美容洗护', icon: '✨' },
    { id: 'boarding', name: '寄养服务', icon: '🏠' },
    { id: 'training', name: '训练学校', icon: '🎓' },
    { id: 'photography', name: '宠物摄影', icon: '📷' },
    { id: 'daycare', name: '日托中心', icon: '🌞' },
  ];

  return (
    <div className="min-h-screen bg-background-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-text-primary mb-2">本地服务</h1>
          <p className="text-text-secondary">发现附近优质宠物服务</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="搜索服务名称或描述..."
                className="input-field w-full pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <button className="btn-primary whitespace-nowrap">
              <span className="mr-2">📍</span>
              定位
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex space-x-4 min-w-max">
            {serviceCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all whitespace-nowrap ${
                  selectedCategory === category.id
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">暂无服务</p>
            <p className="text-gray-400 text-sm mt-2">请尝试其他搜索条件</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service._id}
                onClick={() => navigate(`/services/${service._id}`)}
                className="card hover:shadow-xl transition-all cursor-pointer"
              >
                {/* Service Image */}
                <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg mb-4 flex items-center justify-center">
                  {service.images && service.images.length > 0 ? (
                    <img
                      src={service.images[0]}
                      alt={service.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <span className="text-6xl">
                      {serviceCategories.find(c => c.id === service.category)?.icon}
                    </span>
                  )}
                </div>

                {/* Service Info */}
                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-bold text-text-primary mb-1">
                      {service.name}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm">
                      <div className="flex items-center">
                        <span className="text-yellow-400">⭐</span>
                        <span className="ml-1 font-medium">
                          {service.rating?.average?.toFixed(1) || '0.0'}
                        </span>
                        <span className="ml-1 text-gray-500">
                          ({service.rating?.count || 0})
                        </span>
                      </div>
                      {service.location?.city && (
                        <>
                          <span className="text-gray-300">|</span>
                          <span className="text-gray-600">📍 {service.location.city}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Tags */}
                  {service.features && service.features.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {service.features.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-secondary/10 text-secondary text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Price and Book */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <span className="text-primary font-bold">
                      {service.pricing?.priceRange?.min && service.pricing?.priceRange?.max
                        ? `¥${service.pricing.priceRange.min}-${service.pricing.priceRange.max}`
                        : '价格面议'}
                    </span>
                    <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-all text-sm">
                      预约
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Service Guarantee */}
        <div className="mt-8 card bg-gradient-to-r from-primary/5 to-secondary/5">
          <h3 className="text-xl font-bold mb-4">服务保障</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl mb-2">✓</div>
              <p className="font-medium">资质认证</p>
              <p className="text-sm text-gray-600">严格审核商家资质</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🛡️</div>
              <p className="font-medium">服务保障</p>
              <p className="text-sm text-gray-600">问题协助索赔</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">💰</div>
              <p className="font-medium">退款保证</p>
              <p className="text-sm text-gray-600">不满意可退款</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">📱</div>
              <p className="font-medium">实时追踪</p>
              <p className="text-sm text-gray-600">查看服务进度</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
