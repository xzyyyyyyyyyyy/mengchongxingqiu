import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../api/orderService';

const OrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        const response = await orderService.getOrders();
        setOrders(response.data.data || []);
      } catch (error) {
        console.error('Failed to load orders:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const tabs = [
    { id: 'all', name: '全部' },
    { id: 'pending', name: '待付款', status: 'pending' },
    { id: 'processing', name: '待发货', status: 'processing' },
    { id: 'shipped', name: '待收货', status: 'shipped' },
    { id: 'completed', name: '已完成', status: 'completed' },
    { id: 'cancelled', name: '已取消', status: 'cancelled' }
  ];

  const filteredOrders = activeTab === 'all' 
    ? orders 
    : orders.filter(order => order.status === tabs.find(t => t.id === activeTab)?.status);

  const getStatusText = (status) => {
    const statusMap = {
      pending: '待付款',
      processing: '待发货',
      shipped: '待收货',
      completed: '已完成',
      cancelled: '已取消'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      pending: 'text-yellow-600 bg-yellow-50',
      processing: 'text-blue-600 bg-blue-50',
      shipped: 'text-purple-600 bg-purple-50',
      completed: 'text-green-600 bg-green-50',
      cancelled: 'text-gray-600 bg-gray-50'
    };
    return colorMap[status] || 'text-gray-600 bg-gray-50';
  };

  return (
    <div className="min-h-screen bg-background-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-text-primary mb-2">我的订单</h1>
          <p className="text-text-secondary">查看和管理您的订单</p>
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

        {/* Orders List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12 card">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无订单</h3>
            <p className="text-gray-500 mb-4">快去商城看看吧</p>
            <button
              onClick={() => navigate('/shop')}
              className="btn-primary"
            >
              前往商城
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order._id} className="card hover:shadow-lg transition-shadow">
                {/* Order Header */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">
                      订单号: {order.orderNumber || order._id.slice(-8)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>

                {/* Order Items */}
                <div className="space-y-3 mb-4">
                  {order.items && order.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        {item.product?.images && item.product.images.length > 0 ? (
                          <img
                            src={item.product.images[0].url}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-3xl">
                            📦
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.product?.name || '商品'}</h4>
                        <p className="text-sm text-gray-600">数量: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">¥{item.price}</p>
                        <p className="text-sm text-gray-500">x{item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-gray-600">
                    共 {order.items?.length || 0} 件商品
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">
                      合计: <span className="text-xl font-bold text-primary">¥{order.totalAmount}</span>
                    </span>
                    <div className="flex space-x-2">
                      {order.status === 'pending' && (
                        <button className="btn-primary text-sm">
                          立即付款
                        </button>
                      )}
                      {order.status === 'shipped' && (
                        <button className="btn-primary text-sm">
                          确认收货
                        </button>
                      )}
                      {order.status === 'completed' && (
                        <button className="border border-primary text-primary px-4 py-2 rounded-lg text-sm hover:bg-primary/10">
                          再次购买
                        </button>
                      )}
                      <button
                        onClick={() => navigate(`/orders/${order._id}`)}
                        className="border border-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-50"
                      >
                        查看详情
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
