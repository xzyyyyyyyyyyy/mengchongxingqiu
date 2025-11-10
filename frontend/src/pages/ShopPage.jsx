import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { productService } from '../api/productService';

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
    <div className="min-h-screen bg-background-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-text-primary mb-2">宠物商城</h1>
          <p className="text-text-secondary">优质商品，放心购买</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索商品名称或描述..."
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
        </div>

        {/* Category Filter */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex space-x-4 min-w-max">
            {categories.map((category) => (
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

        {/* Banner */}
        <div className="mb-6 card bg-gradient-to-r from-primary to-secondary text-white p-6">
          <h2 className="text-2xl font-bold mb-2">新用户专享</h2>
          <p className="mb-4">首单立减50元，更有好礼相送</p>
          <button className="bg-white text-primary px-6 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-all">
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
                      src={product.images[0].url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-6xl">
                      {categories.find(c => c.id === product.category?.main)?.icon}
                    </span>
                  )}
                  {/* Tags */}
                  <div className="absolute top-2 left-2 flex gap-1">
                    {product.isFeatured && (
                      <span className="px-2 py-1 bg-red-500 text-white text-xs rounded">
                        热销
                      </span>
                    )}
                    {product.shipping?.isFreeShipping && (
                      <span className="px-2 py-1 bg-green-500 text-white text-xs rounded">
                        包邮
                      </span>
                    )}
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-3 space-y-2">
                  <h3 className="text-sm font-medium text-text-primary line-clamp-2 h-10">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center text-xs">
                    <span className="text-yellow-400">⭐</span>
                    <span className="ml-1">
                      {product.rating?.average?.toFixed(1) || '0.0'}
                    </span>
                    <span className="ml-2 text-gray-500">
                      已售 {product.salesCount || 0}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline space-x-2">
                    <span className="text-primary font-bold text-lg">
                      ¥{product.pricing?.currentPrice}
                    </span>
                    {product.pricing?.originalPrice > product.pricing?.currentPrice && (
                      <span className="text-gray-400 text-sm line-through">
                        ¥{product.pricing?.originalPrice}
                      </span>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <button className="w-full bg-primary text-white py-2 rounded-lg hover:bg-opacity-90 transition-all text-sm font-medium">
                    加入购物车
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Service Features */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card text-center">
            <div className="text-3xl mb-2">🚚</div>
            <p className="font-medium">7天无理由</p>
            <p className="text-sm text-gray-600">退换货</p>
          </div>
          <div className="card text-center">
            <div className="text-3xl mb-2">✓</div>
            <p className="font-medium">正品保证</p>
            <p className="text-sm text-gray-600">品牌授权</p>
          </div>
          <div className="card text-center">
            <div className="text-3xl mb-2">🔍</div>
            <p className="font-medium">食品溯源</p>
            <p className="text-sm text-gray-600">扫码查询</p>
          </div>
          <div className="card text-center">
            <div className="text-3xl mb-2">💬</div>
            <p className="font-medium">在线咨询</p>
            <p className="text-sm text-gray-600">营养师</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
