import { useState, useEffect } from 'react';
import { serviceService } from '../../api/serviceService';

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'hospital',
    location: {
      address: '',
      city: '',
      province: '',
      coordinates: [0, 0]
    },
    pricing: {
      priceRange: {
        min: 0,
        max: 0
      }
    },
    features: []
  });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const response = await serviceService.getServices({ limit: 50 });
      setServices(response.data.data || []);
    } catch (error) {
      console.error('Failed to load services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingService) {
        await serviceService.updateService(editingService._id, formData);
      } else {
        await serviceService.createService(formData);
      }
      setShowModal(false);
      setEditingService(null);
      resetForm();
      loadServices();
    } catch (error) {
      console.error('Failed to save service:', error);
      alert('保存失败: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      category: service.category,
      location: service.location,
      pricing: service.pricing,
      features: service.features || []
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('确定要删除这个服务吗？')) return;
    try {
      await serviceService.deleteService(id);
      loadServices();
    } catch (error) {
      console.error('Failed to delete service:', error);
      alert('删除失败');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: 'hospital',
      location: {
        address: '',
        city: '',
        province: '',
        coordinates: [0, 0]
      },
      pricing: {
        priceRange: {
          min: 0,
          max: 0
        }
      },
      features: []
    });
  };

  const categoryLabels = {
    hospital: '宠物医院',
    grooming: '美容洗护',
    boarding: '寄养服务',
    training: '训练学校',
    photography: '宠物摄影',
    daycare: '日托中心'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">服务管理</h1>
          <p className="text-gray-600 mt-1">管理平台上的所有服务</p>
        </div>
        <button
          onClick={() => {
            setEditingService(null);
            resetForm();
            setShowModal(true);
          }}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90"
        >
          ➕ 添加服务
        </button>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">暂无服务</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">服务名称</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">分类</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">地点</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">价格范围</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">评分</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {services.map((service) => (
                <tr key={service._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{service.name}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {categoryLabels[service.category] || service.category}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {service.location?.city || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {service.pricing?.priceRange?.min && service.pricing?.priceRange?.max
                      ? `¥${service.pricing.priceRange.min}-${service.pricing.priceRange.max}`
                      : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    ⭐ {service.rating?.average?.toFixed(1) || '0.0'} ({service.rating?.count || 0})
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      service.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {service.isActive ? '启用' : '禁用'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEdit(service)}
                      className="text-primary hover:text-primary/80"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleDelete(service._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      删除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">
                {editingService ? '编辑服务' : '添加服务'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">服务名称</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">服务描述</label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input-field"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">服务分类</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="input-field"
                  >
                    <option value="hospital">宠物医院</option>
                    <option value="grooming">美容洗护</option>
                    <option value="boarding">寄养服务</option>
                    <option value="training">训练学校</option>
                    <option value="photography">宠物摄影</option>
                    <option value="daycare">日托中心</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">省份</label>
                    <input
                      type="text"
                      value={formData.location.province}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        location: { ...formData.location, province: e.target.value }
                      })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">城市</label>
                    <input
                      type="text"
                      value={formData.location.city}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        location: { ...formData.location, city: e.target.value }
                      })}
                      className="input-field"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">详细地址</label>
                  <input
                    type="text"
                    value={formData.location.address}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      location: { ...formData.location, address: e.target.value }
                    })}
                    className="input-field"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">最低价格</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.pricing.priceRange.min}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        pricing: { 
                          ...formData.pricing, 
                          priceRange: { ...formData.pricing.priceRange, min: parseFloat(e.target.value) || 0 }
                        }
                      })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">最高价格</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.pricing.priceRange.max}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        pricing: { 
                          ...formData.pricing, 
                          priceRange: { ...formData.pricing.priceRange, max: parseFloat(e.target.value) || 0 }
                        }
                      })}
                      className="input-field"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingService(null);
                      resetForm();
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90"
                  >
                    保存
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminServices;
