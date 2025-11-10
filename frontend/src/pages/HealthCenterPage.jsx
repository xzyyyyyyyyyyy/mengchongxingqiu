import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/common/Layout';

const EnhancedHealthCenterPage = () => {
  const { petId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [pet, setPet] = useState(null);
  const [todayLog, setTodayLog] = useState(null);

  // Mock data for AI Health Insights
  const healthMetrics = {
    heartRate: { value: 85, unit: 'bpm', icon: '❤️', status: 'normal' },
    foodIntake: { value: 150, unit: 'g', icon: '🍖', status: 'normal' },
    waterIntake: { value: 300, unit: 'ml', icon: '💧', status: 'warning' },
    weight: { value: 12.5, unit: 'kg', icon: '⚖️', status: 'normal' },
    activity: { value: 2.5, unit: 'km', icon: '🏃', status: 'normal' }
  };

  const healthAlerts = [
    {
      id: 1,
      level: 'warning',
      icon: '⚠️',
      title: '饮水量偏低',
      description: '旺财近3日日均饮水量低于健康基线20%，可能存在脱水风险。建议引导其多饮水，并观察排尿情况。'
    },
    {
      id: 2,
      level: 'alert',
      icon: '🚨',
      title: '夜间活动异常',
      description: '昨晚检测到异常高频的夜间活动，结合医疗记录中的关节炎病史，建议关注其是否有关节不适迹象。'
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        // Fetch pet details
        const petResponse = await axios.get(`/api/pets/${petId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPet(petResponse.data.data);

        // Fetch today's health log
        const today = new Date().toISOString().split('T')[0];
        const logsResponse = await axios.get(`/api/health/${petId}`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { startDate: today, endDate: today }
        });
        if (logsResponse.data.data.length > 0) {
          setTodayLog(logsResponse.data.data[0]);
        }
      } catch (error) {
        console.error('Error fetching health data:', error);
        if (error.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [petId, navigate]);

  const handleAddLog = () => {
    navigate(`/pets/${petId}/health/add`);
  };

  const handleGenerateReport = () => {
    alert('PDF报告生成功能开发中...');
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!pet) {
    return (
      <Layout>
        <div className="text-center py-8">
          <p className="text-gray-500">未找到宠物信息</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <img
                src={pet.avatar || '/default-pet.png'}
                alt={pet.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h1 className="text-2xl font-bold">{pet.name}</h1>
                <p className="text-gray-600">{pet.breed} · {pet.age || 3}岁 · {pet.gender === 'male' ? '雄性' : '雌性'}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
                <span>数字档案</span>
              </button>
              <button 
                onClick={handleGenerateReport}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                </svg>
                <span>生成健康报告</span>
              </button>
            </div>
          </div>
        </div>

        {/* AI Health Insights */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <span className="text-2xl mr-2">🤖</span>
            AI健康洞察
          </h2>

          {/* Today's Status */}
          <div className="bg-white/80 backdrop-blur rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-700">今日状态</h3>
              {!todayLog && (
                <button
                  onClick={handleAddLog}
                  className="text-sm text-primary hover:text-primary/80 flex items-center space-x-1"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  <span>记录今日数据</span>
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(healthMetrics).map(([key, metric]) => (
                <div key={key} className="text-center">
                  <div className={`text-3xl mb-1 ${metric.status === 'warning' ? 'animate-pulse' : ''}`}>
                    {metric.icon}
                  </div>
                  <div className="text-sm text-gray-600 mb-1">
                    {key === 'heartRate' && '心率'}
                    {key === 'foodIntake' && '食量'}
                    {key === 'waterIntake' && '饮水'}
                    {key === 'weight' && '体重'}
                    {key === 'activity' && '活动'}
                  </div>
                  <div className="font-bold text-lg">{metric.value} {metric.unit}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Health Baseline */}
          <div className="bg-white/80 backdrop-blur rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-700 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
                个性化健康基线
              </h3>
              <button className="text-sm text-gray-500 hover:text-gray-700">
                查看详情
              </button>
            </div>
            <div className="h-32 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-600">基线图表加载中...</p>
            </div>
          </div>

          {/* Trend Indicators */}
          <div className="bg-white/80 backdrop-blur rounded-lg p-4">
            <button className="w-full flex items-center justify-between">
              <h3 className="font-medium text-gray-700">关键指标趋势</h3>
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* AI Health Alerts */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <span className="text-2xl mr-2">⚕️</span>
            AI健康预警
          </h2>

          <div className="space-y-4">
            {healthAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border-l-4 ${
                  alert.level === 'warning'
                    ? 'bg-yellow-50 border-yellow-500'
                    : 'bg-red-50 border-red-500'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <span className="text-2xl flex-shrink-0">{alert.icon}</span>
                  <div className="flex-1">
                    <h3 className={`font-bold mb-1 ${
                      alert.level === 'warning' ? 'text-yellow-800' : 'text-red-800'
                    }`}>
                      {alert.title}
                    </h3>
                    <p className={`text-sm ${
                      alert.level === 'warning' ? 'text-yellow-700' : 'text-red-700'
                    }`}>
                      {alert.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-4 py-2 text-primary hover:text-primary/80 font-medium flex items-center justify-center space-x-2">
            <span>查看全部健康分析</span>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Link
            to={`/pets/${petId}/health/history`}
            className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow text-center"
          >
            <div className="text-4xl mb-3">📊</div>
            <h3 className="font-bold mb-1">健康历史</h3>
            <p className="text-sm text-gray-600">查看历史记录</p>
          </Link>

          <button
            onClick={handleAddLog}
            className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow text-center"
          >
            <div className="text-4xl mb-3">➕</div>
            <h3 className="font-bold mb-1">添加记录</h3>
            <p className="text-sm text-gray-600">记录今日健康数据</p>
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default EnhancedHealthCenterPage;
