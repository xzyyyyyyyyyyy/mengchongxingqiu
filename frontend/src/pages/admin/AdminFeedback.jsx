import { useState, useEffect, useCallback } from 'react';
import { feedbackService } from '../../api/feedbackService';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminFeedback = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [response, setResponse] = useState('');
  const [updating, setUpdating] = useState(false);

  const statusOptions = [
    { value: 'all', label: '全部', color: 'bg-gray-100 text-gray-800' },
    { value: 'pending', label: '待处理', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'processing', label: '处理中', color: 'bg-blue-100 text-blue-800' },
    { value: 'resolved', label: '已解决', color: 'bg-green-100 text-green-800' },
    { value: 'closed', label: '已关闭', color: 'bg-gray-100 text-gray-800' },
  ];

  const typeLabels = {
    bug: '问题反馈',
    suggestion: '功能建议',
    question: '咨询问题',
    other: '其他'
  };

  const loadFeedback = useCallback(async () => {
    try {
      setLoading(true);
      const params = selectedStatus !== 'all' ? { status: selectedStatus } : {};
      const response = await feedbackService.getAllFeedback(params);
      setFeedback(response.data || []);
    } catch (error) {
      console.error('Failed to load feedback:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedStatus]);

  useEffect(() => {
    loadFeedback();
  }, [loadFeedback]);

  const handleStatusChange = async (feedbackId, newStatus) => {
    try {
      setUpdating(true);
      await feedbackService.updateFeedback(feedbackId, { status: newStatus });
      await loadFeedback();
      setSelectedFeedback(null);
    } catch (error) {
      console.error('Failed to update feedback:', error);
      alert('更新失败，请重试');
    } finally {
      setUpdating(false);
    }
  };

  const handleSubmitResponse = async (e) => {
    e.preventDefault();
    if (!response.trim()) return;

    try {
      setUpdating(true);
      await feedbackService.updateFeedback(selectedFeedback._id, {
        status: 'resolved',
        response: response.trim()
      });
      await loadFeedback();
      setSelectedFeedback(null);
      setResponse('');
    } catch (error) {
      console.error('Failed to submit response:', error);
      alert('提交失败，请重试');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option?.color || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">用户反馈管理</h1>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">共 {feedback.length} 条反馈</span>
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedStatus(option.value)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedStatus === option.value
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Feedback List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
            <p className="mt-2 text-gray-600">加载中...</p>
          </div>
        ) : feedback.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">暂无反馈</p>
          </div>
        ) : (
          <div className="space-y-4">
            {feedback.map((item) => (
              <div key={item._id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {statusOptions.find(opt => opt.value === item.status)?.label}
                      </span>
                      <span className="text-sm text-gray-600">
                        {typeLabels[item.type] || item.type}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>用户: {item.user?.username || '未知'}</span>
                      <span>·</span>
                      <span>{formatDate(item.createdAt)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedFeedback(item)}
                    className="text-primary hover:text-primary/80 text-sm font-medium"
                  >
                    {item.status === 'pending' ? '处理' : '查看详情'}
                  </button>
                </div>

                <p className="text-gray-800 mb-3 whitespace-pre-wrap">{item.content}</p>

                {item.contact && (
                  <div className="text-sm text-gray-600 mb-3">
                    联系方式: {item.contact}
                  </div>
                )}

                {item.response && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-900 mb-1">回复</p>
                    <p className="text-sm text-blue-800">{item.response}</p>
                  </div>
                )}

                <div className="flex items-center space-x-2 mt-4">
                  {item.status === 'pending' && (
                    <button
                      onClick={() => handleStatusChange(item._id, 'processing')}
                      disabled={updating}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm disabled:opacity-50"
                    >
                      开始处理
                    </button>
                  )}
                  {item.status === 'processing' && (
                    <button
                      onClick={() => setSelectedFeedback(item)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                    >
                      标记已解决
                    </button>
                  )}
                  {(item.status === 'resolved' || item.status === 'processing') && (
                    <button
                      onClick={() => handleStatusChange(item._id, 'closed')}
                      disabled={updating}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm disabled:opacity-50"
                    >
                      关闭
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Response Modal */}
        {selectedFeedback && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">反馈详情与回复</h2>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm font-medium text-gray-700">用户</label>
                  <p className="text-gray-900">{selectedFeedback.user?.username}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">反馈内容</label>
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedFeedback.content}</p>
                </div>

                {selectedFeedback.contact && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">联系方式</label>
                    <p className="text-gray-900">{selectedFeedback.contact}</p>
                  </div>
                )}

                {selectedFeedback.response && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">已有回复</label>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-blue-800">{selectedFeedback.response}</p>
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmitResponse} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    回复内容
                  </label>
                  <textarea
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    rows="4"
                    placeholder="输入回复内容..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFeedback(null);
                      setResponse('');
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    disabled={!response.trim() || updating}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updating ? '提交中...' : '提交回复并标记已解决'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminFeedback;
