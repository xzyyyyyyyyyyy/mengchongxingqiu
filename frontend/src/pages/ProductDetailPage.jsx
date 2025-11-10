import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../api/productService';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState({});

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const response = await productService.getProduct(id);
        setProduct(response.data.data);
      } catch (error) {
        console.error('Failed to load product:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background-light flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">商品未找到</h2>
          <button onClick={() => navigate('/shop')} className="btn-primary">
            返回商城
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-primary mb-4"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          <span>返回</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div>
            <div className="card p-0 overflow-hidden mb-4">
              <div className="w-full aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0].url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-9xl">📦</span>
                )}
              </div>
            </div>
            
            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(1, 5).map((image, index) => (
                  <div key={index} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                    <img src={image.url} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="card">
              <h1 className="text-2xl font-bold mb-3">{product.name}</h1>
              
              {/* Rating and Sales */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  <span className="text-yellow-400 text-lg">⭐</span>
                  <span className="ml-1 font-medium">{product.rating?.average?.toFixed(1) || '0.0'}</span>
                  <span className="ml-1 text-gray-500 text-sm">({product.rating?.count || 0} 评价)</span>
                </div>
                <span className="text-gray-400">|</span>
                <span className="text-gray-600">已售 {product.salesCount || 0}</span>
              </div>

              {/* Price */}
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4 rounded-lg mb-4">
                <div className="flex items-baseline space-x-3">
                  <span className="text-3xl font-bold text-primary">
                    ¥{product.pricing?.currentPrice}
                  </span>
                  {product.pricing?.originalPrice > product.pricing?.currentPrice && (
                    <span className="text-gray-400 text-lg line-through">
                      ¥{product.pricing?.originalPrice}
                    </span>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {product.isFeatured && (
                  <span className="px-3 py-1 bg-red-500 text-white text-sm rounded-full">
                    热销
                  </span>
                )}
                {product.shipping?.isFreeShipping && (
                  <span className="px-3 py-1 bg-green-500 text-white text-sm rounded-full">
                    包邮
                  </span>
                )}
                {product.certifications?.brandAuthorization && (
                  <span className="px-3 py-1 bg-blue-500 text-white text-sm rounded-full">
                    正品保证
                  </span>
                )}
              </div>

              {/* Variants */}
              {product.variants && product.variants.length > 0 && (
                <div className="mb-4">
                  {product.variants.map((variant, index) => (
                    <div key={index} className="mb-3">
                      <label className="block text-sm font-medium mb-2">{variant.name}</label>
                      <div className="flex flex-wrap gap-2">
                        {variant.options.map((option, optIndex) => (
                          <button
                            key={optIndex}
                            onClick={() => setSelectedVariant({ ...selectedVariant, [variant.name]: option })}
                            className={`px-4 py-2 border rounded-lg transition-all ${
                              selectedVariant[variant.name] === option
                                ? 'border-primary bg-primary/10'
                                : 'border-gray-300 hover:border-primary'
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Quantity */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">数量</label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="text-lg font-medium w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.inventory?.stock || 999, quantity + 1))}
                    className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-100"
                  >
                    +
                  </button>
                  <span className="text-sm text-gray-500">
                    库存: {product.inventory?.stock || 0}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button className="flex-1 btn-primary">
                  立即购买
                </button>
                <button className="flex-1 border-2 border-primary text-primary py-3 rounded-lg font-medium hover:bg-primary/10 transition-all">
                  加入购物车
                </button>
              </div>
            </div>

            {/* Service Features */}
            <div className="card mt-4">
              <h3 className="font-bold mb-3">服务保障</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <span>✓</span>
                  <span>7天无理由退换</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>✓</span>
                  <span>正品保证</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>✓</span>
                  <span>急速发货</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="mt-8 card">
          <h2 className="text-xl font-bold mb-4">商品详情</h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">{product.description}</p>
          </div>

          {/* Specifications */}
          {product.specifications && product.specifications.length > 0 && (
            <div className="mt-6">
              <h3 className="font-bold mb-3">规格参数</h3>
              <div className="grid grid-cols-2 gap-2">
                {product.specifications.map((spec, index) => (
                  <div key={index} className="flex bg-gray-50 p-2 rounded">
                    <span className="text-gray-600 w-1/3">{spec.name}:</span>
                    <span className="font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Reviews */}
        <div className="mt-8 card">
          <h2 className="text-xl font-bold mb-4">用户评价</h2>
          {product.reviews && product.reviews.length > 0 ? (
            <div className="space-y-4">
              {product.reviews.map((review, index) => (
                <div key={index} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-start space-x-3">
                    <img
                      src={review.user?.avatar || '/default-avatar.png'}
                      alt=""
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{review.user?.username || '匿名用户'}</span>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}>
                              ⭐
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 mb-2">{review.content}</p>
                      <span className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">暂无评价</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
