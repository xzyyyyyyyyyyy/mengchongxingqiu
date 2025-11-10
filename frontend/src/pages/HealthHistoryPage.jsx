import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/common/Layout';

const HealthHistoryPage = () => {
  const { petId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [pet, setPet] = useState(null);

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

        // Fetch health logs
        const logsResponse = await axios.get(`/api/health/${petId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLogs(logsResponse.data.data);

      } catch (error) {
        console.error('Error fetching health history:', error);
        if (error.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [petId, navigate]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAppetiteText = (appetite) => {
    const map = {
      'excellent': '极好',
      'good': '良好',
      'fair': '一般',
      'poor': '较差'
    };
    return map[appetite] || appetite;
  };

  const getEnergyText = (level) => {
    const map = {
      'very-high': '非常活跃',
      'high': '活跃',
      'normal': '正常',
      'low': '较低',
      'very-low': '萎靡'
    };
    return map[level] || level;
  };

  const getMoodText = (mood) => {
    const map = {
      'happy': '开心',
      'normal': '正常',
      'anxious': '焦虑',
      'sad': '沮丧',
      'irritable': '烦躁'
    };
    return map[mood] || mood;
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

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="sticky top-16 z-10 bg-white/80 backdrop-blur-sm px-4 py-3 border-b">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:text-gray-900"
            >
              <span className="text-2xl">←</span>
            </button>
            <h1 className="text-xl font-bold text-center flex-1">健康历史记录</h1>
            <Link
              to={`/pets/${petId}/health/add`}
              className="text-primary hover:text-primary/80"
            >
              <span className="material-symbols-outlined">add</span>
            </Link>
          </div>
        </div>

        <div className="p-4">
          {/* Pet Info */}
          {pet && (
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
              <div className="flex items-center gap-3">
                <img
                  src={pet.photos?.[0] || `https://ui-avatars.com/api/?name=${pet.name}`}
                  alt={pet.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="text-lg font-bold">{pet.name}</p>
                  <p className="text-sm text-gray-600">共 {logs.length} 条健康记录</p>
                </div>
              </div>
            </div>
          )}

          {/* Health Logs */}
          {logs.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">
                health_and_safety
              </span>
              <p className="text-gray-500 mb-4">还没有健康记录</p>
              <Link
                to={`/pets/${petId}/health/add`}
                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90"
              >
                <span className="material-symbols-outlined">add</span>
                <span>添加第一条记录</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {logs.map((log) => (
                <div key={log._id} className="bg-white rounded-lg shadow-sm p-4 space-y-3">
                  {/* Date Header */}
                  <div className="flex items-center justify-between pb-2 border-b">
                    <h3 className="text-base font-bold">{formatDate(log.date)}</h3>
                    {log.alerts && log.alerts.length > 0 && (
                      <span className="flex items-center gap-1 text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
                        <span className="material-symbols-outlined text-sm">warning</span>
                        {log.alerts.length} 条预警
                      </span>
                    )}
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {log.weight && (
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-gray-400 text-lg">weight</span>
                        <div>
                          <p className="text-gray-500 text-xs">体重</p>
                          <p className="font-medium">{log.weight} kg</p>
                        </div>
                      </div>
                    )}

                    {log.temperature && (
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-gray-400 text-lg">thermostat</span>
                        <div>
                          <p className="text-gray-500 text-xs">体温</p>
                          <p className="font-medium">{log.temperature} °C</p>
                        </div>
                      </div>
                    )}

                    {log.diet?.foodAmount && (
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-gray-400 text-lg">restaurant</span>
                        <div>
                          <p className="text-gray-500 text-xs">食量</p>
                          <p className="font-medium">{log.diet.foodAmount} g</p>
                        </div>
                      </div>
                    )}

                    {log.diet?.waterAmount && (
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-gray-400 text-lg">water_drop</span>
                        <div>
                          <p className="text-gray-500 text-xs">饮水</p>
                          <p className="font-medium">{log.diet.waterAmount} ml</p>
                        </div>
                      </div>
                    )}

                    {log.diet?.appetite && (
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-gray-400 text-lg">sentiment_satisfied</span>
                        <div>
                          <p className="text-gray-500 text-xs">食欲</p>
                          <p className="font-medium">{getAppetiteText(log.diet.appetite)}</p>
                        </div>
                      </div>
                    )}

                    {log.energy?.level && (
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-gray-400 text-lg">bolt</span>
                        <div>
                          <p className="text-gray-500 text-xs">精力</p>
                          <p className="font-medium">{getEnergyText(log.energy.level)}</p>
                        </div>
                      </div>
                    )}

                    {log.mood && (
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-gray-400 text-lg">mood</span>
                        <div>
                          <p className="text-gray-500 text-xs">心情</p>
                          <p className="font-medium">{getMoodText(log.mood)}</p>
                        </div>
                      </div>
                    )}

                    {log.bowelMovement?.frequency !== undefined && (
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-gray-400 text-lg">assignment</span>
                        <div>
                          <p className="text-gray-500 text-xs">排便</p>
                          <p className="font-medium">{log.bowelMovement.frequency} 次</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Alerts */}
                  {log.alerts && log.alerts.length > 0 && (
                    <div className="space-y-2 pt-2 border-t">
                      {log.alerts.map((alert, idx) => (
                        <div
                          key={idx}
                          className={`text-xs p-2 rounded ${
                            alert.type === 'critical' ? 'bg-red-50 text-red-800' :
                            alert.type === 'warning' ? 'bg-yellow-50 text-yellow-800' :
                            'bg-blue-50 text-blue-800'
                          }`}
                        >
                          <p className="font-medium">{alert.message}</p>
                          {alert.suggestion && (
                            <p className="mt-1 opacity-80">{alert.suggestion}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Notes */}
                  {log.notes && (
                    <div className="pt-2 border-t">
                      <p className="text-sm text-gray-600">{log.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default HealthHistoryPage;
