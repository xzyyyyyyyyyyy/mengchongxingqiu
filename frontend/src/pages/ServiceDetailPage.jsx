import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { serviceService } from '../api/serviceService';

const ServiceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  useEffect(() => {
    const loadService = async () => {
      try {
        setLoading(true);
        const response = await serviceService.getService(id);
        setService(response.data.data);
      } catch (error) {
        console.error('Failed to load service:', error);
      } finally {
        setLoading(false);
      }
    };

    loadService();
  }, [id]);

  const handleBooking = () => {
    // Navigate to booking page or show booking modal
    navigate('/bookings/new', { state: { serviceId: id, service } });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-background-light flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">服务未找到</h2>
          <button onClick={() => navigate('/services')} className="btn-primary">
            返回服务列表
          </button>
        </div>
      </div>
    );
  }

  const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Service Images */}
            <div className="card p-0 overflow-hidden mb-6">
              <div className="w-full h-96 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                {service.images && service.images.length > 0 ? (
                  <img
                    src={service.images[0]}
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-9xl">🏪</span>
                )}
              </div>
            </div>

            {/* Service Info */}
            <div className="card">
              <h1 className="text-3xl font-bold mb-3">{service.name}</h1>
              
              {/* Rating and Location */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  <span className="text-yellow-400 text-lg">⭐</span>
                  <span className="ml-1 font-medium">{service.rating?.average?.toFixed(1) || '0.0'}</span>
                  <span className="ml-1 text-gray-500 text-sm">({service.rating?.count || 0} 评价)</span>
                </div>
                {service.location?.city && (
                  <>
                    <span className="text-gray-400">|</span>
                    <div className="flex items-center text-gray-600">
                      <span className="mr-1">📍</span>
                      <span>{service.location.city}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Category Tag */}
              <div className="mb-4">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  {service.category}
                </span>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-3">服务介绍</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{service.description}</p>
              </div>

              {/* Features */}
              {service.features && service.features.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-3">服务特色</h2>
                  <div className="flex flex-wrap gap-2">
                    {service.features.map((feature, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Opening Hours */}
              {service.hours?.regular && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-3">营业时间</h2>
                  <div className="space-y-2">
                    {Object.entries(service.hours.regular).map(([day, hours]) => (
                      <div key={day} className="flex justify-between">
                        <span className="text-gray-600">{day}:</span>
                        <span className="font-medium">{hours.open} - {hours.close}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold mb-2">联系方式</h3>
                {service.contact?.phone && (
                  <div className="flex items-center space-x-2 mb-2">
                    <span>📞</span>
                    <span>{service.contact.phone}</span>
                  </div>
                )}
                {service.location?.address && (
                  <div className="flex items-start space-x-2">
                    <span>📍</span>
                    <span>{service.location.address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Reviews */}
            <div className="card mt-6">
              <h2 className="text-xl font-bold mb-4">用户评价</h2>
              {service.reviews && service.reviews.length > 0 ? (
                <div className="space-y-4">
                  {service.reviews.map((review, index) => (
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

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="card sticky top-6">
              <h2 className="text-xl font-bold mb-4">预约服务</h2>

              {/* Price Range */}
              {service.pricing?.priceRange && (
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4 rounded-lg mb-4">
                  <div className="text-sm text-gray-600 mb-1">价格区间</div>
                  <div className="text-2xl font-bold text-primary">
                    ¥{service.pricing.priceRange.min} - ¥{service.pricing.priceRange.max}
                  </div>
                </div>
              )}

              {/* Date Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">选择日期</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="input-field w-full"
                />
              </div>

              {/* Time Selection */}
              {selectedDate && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">选择时间</label>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`px-3 py-2 border rounded-lg text-sm transition-all ${
                          selectedTime === time
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-gray-300 hover:border-primary'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Booking Button */}
              <button
                onClick={handleBooking}
                disabled={!selectedDate || !selectedTime}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                立即预约
              </button>

              {/* Service Guarantees */}
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-bold mb-3">服务保障</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-center space-x-2">
                    <span>✓</span>
                    <span>资质认证</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>✓</span>
                    <span>服务保障</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>✓</span>
                    <span>退款保证</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPage;
