import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { postService } from '../api/postService';
import { productService } from '../api/productService';
import { serviceService } from '../api/serviceService';

const SearchResultsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState({
    posts: [],
    products: [],
    services: []
  });

  const searchAll = useCallback(async () => {
    if (!query.trim()) {
      setResults({ posts: [], products: [], services: [] });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Search posts, products, and services in parallel
      const [postsRes, productsRes, servicesRes] = await Promise.allSettled([
        postService.getPosts({ search: query.trim() }),
        productService.getProducts({ search: query.trim() }),
        serviceService.getServices({ search: query.trim() })
      ]);

      setResults({
        posts: postsRes.status === 'fulfilled' ? (postsRes.value.data.data || []) : [],
        products: productsRes.status === 'fulfilled' ? (productsRes.value.data.data || []) : [],
        services: servicesRes.status === 'fulfilled' ? (servicesRes.value.data.data || []) : []
      });
    } catch (error) {
      console.error('Search failed:', error);
      setResults({ posts: [], products: [], services: [] });
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    searchAll();
  }, [searchAll]);

  const totalResults = results.posts.length + results.products.length + results.services.length;

  const tabs = [
    { id: 'all', name: '全部', count: totalResults },
    { id: 'posts', name: '动态', count: results.posts.length },
    { id: 'products', name: '商品', count: results.products.length },
    { id: 'services', name: '服务', count: results.services.length }
  ];

  const renderPosts = () => {
    if (results.posts.length === 0) return null;
    
    return (
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">动态</h2>
        <div className="space-y-4">
          {results.posts.map((post) => (
            <div
              key={post._id}
              onClick={() => navigate(`/posts/${post._id}`)}
              className="card hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex items-start space-x-3">
                <img
                  src={post.author?.avatar || '/default-avatar.png'}
                  alt={post.author?.username}
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{post.author?.username}</div>
                  <p className="text-gray-700 line-clamp-2 mt-1">{post.content}</p>
                  {post.hashtags && post.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {post.hashtags.map((tag, index) => (
                        <span key={index} className="text-primary text-sm">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                    <span>❤️ {post.likesCount || 0}</span>
                    <span>💬 {post.commentsCount || 0}</span>
                  </div>
                </div>
                {post.media && post.media.length > 0 && (
                  <img
                    src={post.media[0].url}
                    alt=""
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderProducts = () => {
    if (results.products.length === 0) return null;
    
    return (
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">商品</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {results.products.map((product) => (
            <div
              key={product._id}
              onClick={() => navigate(`/shop/${product._id}`)}
              className="card hover:shadow-lg transition-shadow cursor-pointer p-0 overflow-hidden"
            >
              <div className="w-full aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0].url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-6xl">📦</span>
                )}
              </div>
              <div className="p-3">
                <h3 className="font-medium line-clamp-2 mb-2">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-primary font-bold">
                    ¥{product.pricing?.currentPrice}
                  </span>
                  <span className="text-sm text-gray-500">
                    ⭐ {product.rating?.average?.toFixed(1) || '0.0'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderServices = () => {
    if (results.services.length === 0) return null;
    
    return (
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">服务</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.services.map((service) => (
            <div
              key={service._id}
              onClick={() => navigate(`/services/${service._id}`)}
              className="card hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="w-full h-40 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg mb-3 flex items-center justify-center">
                {service.images && service.images.length > 0 ? (
                  <img
                    src={service.images[0]}
                    alt={service.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <span className="text-5xl">🏪</span>
                )}
              </div>
              <h3 className="font-bold mb-2">{service.name}</h3>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  ⭐ {service.rating?.average?.toFixed(1) || '0.0'}
                </span>
                {service.location?.city && (
                  <span className="text-gray-600">📍 {service.location.city}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-primary mb-4"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            <span>返回</span>
          </button>
          <h1 className="text-2xl font-bold text-text-primary">
            搜索结果: &quot;{query}&quot;
          </h1>
          <p className="text-gray-600 mt-1">
            找到 {totalResults} 个结果
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b">
          <div className="flex space-x-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-primary'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.name} ({tab.count})
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : totalResults === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">未找到相关结果</h3>
            <p className="text-gray-500">试试其他关键词吧</p>
          </div>
        ) : (
          <div>
            {(activeTab === 'all' || activeTab === 'posts') && renderPosts()}
            {(activeTab === 'all' || activeTab === 'products') && renderProducts()}
            {(activeTab === 'all' || activeTab === 'services') && renderServices()}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;
