import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { productService } from '../api/productService';
import { getMediaUrl } from '../utils/imageUtils';

const ShopPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category') || 'all';
  
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory !== 'all') {
        params.category = selectedCategory;
      }
      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }
      const response = await productService.getProducts(params);
      setProducts(response.data || []);
    } catch (error) {
      console.error('Failed to load products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchTerm]);

  useEffect(() => {
    // Update selected category when URL changes
    setSelectedCategory(categoryFromUrl);
  }, [categoryFromUrl]);

  useEffect(() => {
    // Debounce search to avoid too many API calls
    const timer = setTimeout(() => {
      loadProducts();
    }, 300);

    return () => clearTimeout(timer);
  }, [loadProducts]);

  const categories = [
    { id: 'all', name: '全部', icon: '🛍️' },
    { id: 'food', name: '宠物食品', icon: '🍖' },
    { id: 'supplies', name: '日用品', icon: '🧺' },
    { id: 'toys', name: '玩具', icon: '🎾' },
    { id: 'grooming', name: '美容用品', icon: '✂️' },
    { id: 'health', name: '健康保健', icon: '💊' },
    { id: 'clothing', name: '服饰配件', icon: '👕' },
  ];

  return (
    <div className="min-h-screen bg-background-light pb-20 sm:pb-6">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-1 sm:mb-2">宠物商城</h1>
          <p className="text-sm sm:text-base text-text-secondary">优质商品，放心购买</p>
        </div>

        {/* Search Bar */}
        <div className="mb-4 sm:mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索商品名称或描述..."
              className="input-field w-full pl-10 text-sm sm:text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400"
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
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-4 sm:mb-6 -mx-3 sm:mx-0 px-3 sm:px-0 overflow-x-auto scrollbar-hide">
          <div className="flex space-x-2 sm:space-x-4 min-w-max pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 py-2 sm:px-6 sm:py-3 rounded-full font-medium transition-all whitespace-nowrap text-xs sm:text-base ${
                  selectedCategory === category.id
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="mr-1 sm:mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Banner */}
        <div className="mb-4 sm:mb-6 card bg-gradient-to-r from-primary to-secondary text-white p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">新用户专享</h2>
          <p className="mb-3 sm:mb-4 text-sm sm:text-base">首单立减50元，更有好礼相送</p>
          <button className="bg-white text-primary px-4 py-1.5 sm:px-6 sm:py-2 rounded-lg text-sm sm:text-base font-medium hover:bg-opacity-90 transition-all">
            立即领取
          </button>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">暂无商品</p>
            <p className="text-gray-400 text-sm mt-2">请尝试其他搜索条件</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {products.map((product) => (
              <div
                key={product._id}
                onClick={() => navigate(`/shop/${product._id}`)}
                className="card hover:shadow-xl transition-all cursor-pointer p-0 overflow-hidden"
              >
                {/* Product Image */}
                <div className="w-full aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center relative">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={getMediaUrl(product.images[0])}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl sm:text-6xl">
                      {categories.find(c => c.id === product.category?.main)?.icon}
                    </span>
                  )}
                  {/* Tags */}
                  <div className="absolute top-1 left-1 sm:top-2 sm:left-2 flex gap-1 flex-wrap">
                    {product.isFeatured && (
                      <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-red-500 text-white text-xs rounded">
                        热销
                      </span>
                    )}
                    {product.shipping?.isFreeShipping && (
                      <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-green-500 text-white text-xs rounded">
                        包邮
                      </span>
                    )}
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-2 sm:p-3 space-y-1.5 sm:space-y-2">
                  <h3 className="text-xs sm:text-sm font-medium text-text-primary line-clamp-2 min-h-[2.5rem] sm:min-h-[2.5rem]">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center text-xs">
                    <span className="text-yellow-400">⭐</span>
                    <span className="ml-1">
                      {product.rating?.average?.toFixed(1) || '0.0'}
                    </span>
                    <span className="ml-1 sm:ml-2 text-gray-500 text-xs">
                      已售 {product.salesCount || 0}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline space-x-1 sm:space-x-2">
                    <span className="text-primary font-bold text-base sm:text-lg">
                      ¥{product.pricing?.currentPrice}
                    </span>
                    {product.pricing?.originalPrice > product.pricing?.currentPrice && (
                      <span className="text-gray-400 text-xs sm:text-sm line-through">
                        ¥{product.pricing?.originalPrice}
                      </span>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      // Add to cart logic here
                    }}
                    className="w-full bg-primary text-white py-1.5 sm:py-2 rounded-lg hover:bg-opacity-90 transition-all text-xs sm:text-sm font-medium"
                  >
                    加入购物车
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Service Features */}
        <div className="mt-6 sm:mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="card text-center py-3 sm:py-4">
            <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">🚚</div>
            <p className="font-medium text-xs sm:text-base">7天无理由</p>
            <p className="text-xs sm:text-sm text-gray-600">退换货</p>
          </div>
          <div className="card text-center py-3 sm:py-4">
            <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">✓</div>
            <p className="font-medium text-xs sm:text-base">正品保证</p>
            <p className="text-xs sm:text-sm text-gray-600">品牌授权</p>
          </div>
          <div className="card text-center py-3 sm:py-4">
            <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">🔍</div>
            <p className="font-medium text-xs sm:text-base">食品溯源</p>
            <p className="text-xs sm:text-sm text-gray-600">扫码查询</p>
          </div>
          <div className="card text-center py-3 sm:py-4">
            <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">💬</div>
            <p className="font-medium text-xs sm:text-base">在线咨询</p>
            <p className="text-xs sm:text-sm text-gray-600">营养师</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
