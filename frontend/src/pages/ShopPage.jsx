import { useState } from 'react';

const ShopPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: '全部', icon: '🛍️' },
    { id: 'food', name: '宠物食品', icon: '🍖' },
    { id: 'supplies', name: '日用品', icon: '🧺' },
    { id: 'toys', name: '玩具', icon: '🎾' },
    { id: 'grooming', name: '美容用品', icon: '✂️' },
    { id: 'health', name: '健康保健', icon: '💊' },
    { id: 'clothing', name: '服饰配件', icon: '👕' },
  ];

  const products = [
    {
      id: 1,
      name: '皇家猫粮 全价成猫粮 2kg',
      category: 'food',
      price: 188,
      originalPrice: 228,
      sales: 1234,
      rating: 4.8,
      image: '/product1.jpg',
      tags: ['热销', '包邮'],
    },
    {
      id: 2,
      name: '宠物自动饮水机 2L大容量',
      category: 'supplies',
      price: 89,
      originalPrice: 129,
      sales: 856,
      rating: 4.9,
      image: '/product2.jpg',
      tags: ['新品', '智能'],
    },
    {
      id: 3,
      name: '逗猫棒羽毛玩具套装',
      category: 'toys',
      price: 29.9,
      originalPrice: 49.9,
      sales: 2341,
      rating: 4.7,
      image: '/product3.jpg',
      tags: ['爆款'],
    },
    {
      id: 4,
      name: '宠物除毛梳 不锈钢针梳',
      category: 'grooming',
      price: 39,
      originalPrice: 59,
      sales: 678,
      rating: 4.6,
      image: '/product4.jpg',
      tags: ['推荐'],
    },
    {
      id: 5,
      name: '狗狗营养膏 120g',
      category: 'health',
      price: 45,
      originalPrice: 68,
      sales: 543,
      rating: 4.8,
      image: '/product5.jpg',
      tags: ['热销'],
    },
    {
      id: 6,
      name: '萌宠卫衣 春秋款',
      category: 'clothing',
      price: 58,
      originalPrice: 88,
      sales: 432,
      rating: 4.9,
      image: '/product6.jpg',
      tags: ['新品'],
    },
  ];

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);

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
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="搜索商品..."
              className="input-field flex-1"
            />
            <button className="btn-primary">
              搜索
            </button>
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="card hover:shadow-xl transition-all cursor-pointer p-0 overflow-hidden"
            >
              {/* Product Image */}
              <div className="w-full aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center relative">
                <span className="text-6xl">
                  {categories.find(c => c.id === product.category)?.icon}
                </span>
                {/* Tags */}
                {product.tags.length > 0 && (
                  <div className="absolute top-2 left-2 flex gap-1">
                    {product.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-red-500 text-white text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-3 space-y-2">
                <h3 className="text-sm font-medium text-text-primary line-clamp-2 h-10">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center text-xs">
                  <span className="text-yellow-400">⭐</span>
                  <span className="ml-1">{product.rating}</span>
                  <span className="ml-2 text-gray-500">已售 {product.sales}</span>
                </div>

                {/* Price */}
                <div className="flex items-baseline space-x-2">
                  <span className="text-primary font-bold text-lg">
                    ¥{product.price}
                  </span>
                  <span className="text-gray-400 text-sm line-through">
                    ¥{product.originalPrice}
                  </span>
                </div>

                {/* Add to Cart Button */}
                <button className="w-full bg-primary text-white py-2 rounded-lg hover:bg-opacity-90 transition-all text-sm font-medium">
                  加入购物车
                </button>
              </div>
            </div>
          ))}
        </div>

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
