import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { bookingService } from '../api/bookingService';

const CreateBookingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { serviceId, service } = location.state || {};
  
  const [formData, setFormData] = useState({
    service: serviceId || '',
    date: '',
    time: '',
    petName: '',
    petType: 'dog',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!serviceId) {
      navigate('/services');
    }
  }, [serviceId, navigate]);

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ];

  const petTypes = [
    { value: 'dog', label: '狗狗', icon: '🐶' },
    { value: 'cat', label: '猫咪', icon: '🐱' },
    { value: 'rabbit', label: '兔子', icon: '🐰' },
    { value: 'hamster', label: '仓鼠', icon: '🐹' },
    { value: 'bird', label: '鸟类', icon: '🦜' },
    { value: 'other', label: '其他', icon: '🐾' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.date || !formData.time) {
      setError('请选择预约日期和时间');
      return;
    }

    if (!formData.petName.trim()) {
      setError('请输入宠物名称');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      
      const bookingData = {
        ...formData,
        service: serviceId
      };

      await bookingService.createBooking(bookingData);
      
      alert('预约成功！我们会尽快与您联系确认');
      navigate('/services');
    } catch (error) {
      console.error('Failed to create booking:', error);
      setError('预约失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-primary"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            <span>返回</span>
          </button>
          <h1 className="text-2xl font-bold text-text-primary">预约服务</h1>
          <div className="w-16"></div>
        </div>

        {/* Service Info */}
        {service && (
          <div className="card mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                {service.images && service.images.length > 0 ? (
                  <img
                    src={service.images[0]}
                    alt={service.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <span className="text-3xl">🏪</span>
                )}
              </div>
              <div>
                <h3 className="font-bold text-lg">{service.name}</h3>
                {service.location?.city && (
                  <p className="text-sm text-gray-600">📍 {service.location.city}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="card space-y-6">
          {/* Date Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              预约日期 *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              className="input-field w-full"
              required
            />
          </div>

          {/* Time Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              预约时间 *
            </label>
            <div className="grid grid-cols-4 gap-2">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setFormData({ ...formData, time })}
                  className={`px-3 py-2 border rounded-lg text-sm transition-all ${
                    formData.time === time
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-gray-300 hover:border-primary'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* Pet Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              宠物类型 *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {petTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, petType: type.value })}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.petType === type.value
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-200 hover:border-primary/50'
                  }`}
                >
                  <div className="text-2xl mb-1">{type.icon}</div>
                  <div className="text-sm font-medium">{type.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Pet Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              宠物名称 *
            </label>
            <input
              type="text"
              value={formData.petName}
              onChange={(e) => setFormData({ ...formData, petName: e.target.value })}
              placeholder="请输入宠物名称"
              className="input-field w-full"
              required
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              备注说明
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="有什么特殊要求或需要说明的吗？"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              rows="4"
            />
          </div>

          {/* Submit Button */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? '提交中...' : '确认预约'}
            </button>
          </div>
        </form>

        {/* Tips */}
        <div className="mt-6 card bg-gradient-to-r from-primary/5 to-secondary/5">
          <h3 className="font-bold mb-2">预约提示</h3>
          <ul className="space-y-1 text-sm text-gray-700">
            <li>✓ 请提前至少1天预约</li>
            <li>✓ 预约成功后会有专人与您联系确认</li>
            <li>✓ 如需更改预约时间，请提前联系商家</li>
            <li>✓ 首次服务建议提前15分钟到达</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreateBookingPage;
