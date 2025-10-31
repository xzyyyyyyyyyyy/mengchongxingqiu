import { useState } from 'react';

const ServicesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const serviceCategories = [
    { id: 'all', name: '全部服务', icon: '🏪' },
    { id: 'hospital', name: '宠物医院', icon: '🏥' },
    { id: 'grooming', name: '美容洗护', icon: '✨' },
    { id: 'boarding', name: '寄养服务', icon: '🏠' },
    { id: 'training', name: '训练学校', icon: '🎓' },
    { id: 'photography', name: '宠物摄影', icon: '📷' },
    { id: 'daycare', name: '日托中心', icon: '🌞' },
  ];

  const services = [
    {
      id: 1,
      name: '爱宠宠物医院',
      category: 'hospital',
      rating: 4.8,
      reviews: 324,
      distance: '1.2km',
      price: '¥100-500',
      image: '/service-hospital.jpg',
      tags: ['24小时营业', '专业医师', '设备先进'],
    },
    {
      id: 2,
      name: '萌萌宠物美容',
      category: 'grooming',
      rating: 4.9,
      reviews: 567,
      distance: '800m',
      price: '¥80-200',
      image: '/service-grooming.jpg',
      tags: ['专业美容师', '环境舒适', '价格实惠'],
    },
    {
      id: 3,
      name: '安心宠物寄养',
      category: 'boarding',
      rating: 4.7,
      reviews: 189,
      distance: '2.5km',
      price: '¥50-150/天',
      image: '/service-boarding.jpg',
      tags: ['独立空间', '实时监控', '专人照顾'],
    },
    {
      id: 4,
      name: '汪星人训练营',
      category: 'training',
      rating: 4.6,
      reviews: 234,
      distance: '3.1km',
      price: '¥200-800',
      image: '/service-training.jpg',
      tags: ['专业训导', '小班教学', '效果显著'],
    },
    {
      id: 5,
      name: '喵星球摄影工作室',
      category: 'photography',
      rating: 5.0,
      reviews: 156,
      distance: '1.8km',
      price: '¥300-1000',
      image: '/service-photo.jpg',
      tags: ['专业摄影', '精修包邮', '道具丰富'],
    },
    {
      id: 6,
      name: '快乐宠物日托',
      category: 'daycare',
      rating: 4.8,
      reviews: 412,
      distance: '1.5km',
      price: '¥60-120/天',
      image: '/service-daycare.jpg',
      tags: ['社交娱乐', '专业看护', '活动丰富'],
    },
  ];

  const filteredServices = selectedCategory === 'all'
    ? services
    : services.filter(s => s.category === selectedCategory);

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
            <div className="flex-1">
              <input
                type="text"
                placeholder="搜索服务名称..."
                className="input-field"
              />
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="card hover:shadow-xl transition-all cursor-pointer"
            >
              {/* Service Image */}
              <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-6xl">
                  {serviceCategories.find(c => c.id === service.category)?.icon}
                </span>
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
                      <span className="ml-1 font-medium">{service.rating}</span>
                      <span className="ml-1 text-gray-500">({service.reviews})</span>
                    </div>
                    <span className="text-gray-300">|</span>
                    <span className="text-gray-600">📍 {service.distance}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {service.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-secondary/10 text-secondary text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Price and Book */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <span className="text-primary font-bold">{service.price}</span>
                  <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-all text-sm">
                    预约
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

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
