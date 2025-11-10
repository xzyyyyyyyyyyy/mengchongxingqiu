import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingService } from '../api/bookingService';

const BookingsPage = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoading(true);
        const response = await bookingService.getBookings();
        setBookings(response.data || []);
      } catch (error) {
        console.error('Failed to load bookings:', error);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  const tabs = [
    { id: 'all', name: '全部' },
    { id: 'pending', name: '待确认', status: 'pending' },
    { id: 'confirmed', name: '已确认', status: 'confirmed' },
    { id: 'completed', name: '已完成', status: 'completed' },
    { id: 'cancelled', name: '已取消', status: 'cancelled' }
  ];

  const filteredBookings = activeTab === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.status === tabs.find(t => t.id === activeTab)?.status);

  const getStatusText = (status) => {
    const statusMap = {
      pending: '待确认',
      confirmed: '已确认',
      completed: '已完成',
      cancelled: '已取消'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      pending: 'text-yellow-600 bg-yellow-50',
      confirmed: 'text-blue-600 bg-blue-50',
      completed: 'text-green-600 bg-green-50',
      cancelled: 'text-gray-600 bg-gray-50'
    };
    return colorMap[status] || 'text-gray-600 bg-gray-50';
  };

  const handleCancelBooking = async (bookingId) => {
    if (!confirm('确定要取消预约吗？')) return;
    
    try {
      await bookingService.cancelBooking(bookingId);
      // Reload bookings
      const response = await bookingService.getBookings();
      setBookings(response.data || []);
      alert('预约已取消');
    } catch (error) {
      console.error('Failed to cancel booking:', error);
      alert('取消失败，请重试');
    }
  };

  return (
    <div className="min-h-screen bg-background-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-text-primary mb-2">我的预约</h1>
          <p className="text-text-secondary">查看和管理您的服务预约</p>
        </div>

        {/* Tabs */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex space-x-4 min-w-max border-b">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 px-4 font-medium transition-colors relative whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-primary'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.name}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-12 card">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无预约</h3>
            <p className="text-gray-500 mb-4">快去预约服务吧</p>
            <button
              onClick={() => navigate('/services')}
              className="btn-primary"
            >
              浏览服务
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div key={booking._id} className="card hover:shadow-lg transition-shadow">
                {/* Booking Header */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">
                      预约号: {booking._id.slice(-8)}
                    </span>
                    <span className="text-sm text-gray-500">
                      创建时间: {new Date(booking.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                    {getStatusText(booking.status)}
                  </span>
                </div>

                {/* Booking Details */}
                <div className="flex items-start space-x-4 mb-4">
                  {/* Service Image */}
                  <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    {booking.service?.images && booking.service.images.length > 0 ? (
                      <img
                        src={booking.service.images[0]}
                        alt={booking.service.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">
                        🏪
                      </div>
                    )}
                  </div>

                  {/* Booking Info */}
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2">
                      {booking.service?.name || '服务'}
                    </h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>📅 预约日期: {booking.date}</p>
                      <p>🕐 预约时间: {booking.time}</p>
                      <p>🐾 宠物: {booking.petName} ({booking.petType})</p>
                      {booking.notes && <p>📝 备注: {booking.notes}</p>}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col space-y-2">
                    {booking.status === 'pending' && (
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        className="border border-red-500 text-red-500 px-4 py-2 rounded-lg text-sm hover:bg-red-50"
                      >
                        取消预约
                      </button>
                    )}
                    {booking.status === 'confirmed' && (
                      <button
                        className="border border-primary text-primary px-4 py-2 rounded-lg text-sm hover:bg-primary/10"
                      >
                        联系商家
                      </button>
                    )}
                    {booking.status === 'completed' && (
                      <button
                        className="btn-primary text-sm"
                      >
                        再次预约
                      </button>
                    )}
                  </div>
                </div>

                {/* Service Location */}
                {booking.service?.location && (
                  <div className="pt-4 border-t text-sm text-gray-600">
                    📍 {booking.service.location.address || `${booking.service.location.city}`}
                    {booking.service.contact?.phone && (
                      <span className="ml-4">📞 {booking.service.contact.phone}</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;
