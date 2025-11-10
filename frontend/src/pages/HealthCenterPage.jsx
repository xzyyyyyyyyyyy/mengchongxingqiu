import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/common/Layout';

const HealthCenterPage = () => {
  const { petId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [pet, setPet] = useState(null);
  const [todayLog, setTodayLog] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [recentAlerts, setRecentAlerts] = useState([]);

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
          params: {
            startDate: today,
            endDate: today
          }
        });
        if (logsResponse.data.data.length > 0) {
          setTodayLog(logsResponse.data.data[0]);
        }

        // Fetch analytics
        const analyticsResponse = await axios.get(`/api/health/${petId}/analytics`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { days: 30 }
        });
        setAnalytics(analyticsResponse.data.data);
        setRecentAlerts(analyticsResponse.data.data.alerts || []);

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

  const handleGenerateReport = async () => {
    try {
      // TODO: Implement PDF report generation
      alert('PDF报告生成功能即将上线');
    } catch (error) {
      console.error('Error generating report:', error);
    }
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

  const getTrendIcon = (trend) => {
    if (trend === 'increasing') return '📈';
    if (trend === 'decreasing') return '📉';
    return '➡️';
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'critical': return 'bg-red-50 border-red-200 text-red-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'attention': return 'bg-blue-50 border-blue-200 text-blue-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

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
            <h1 className="text-xl font-bold text-center flex-1">AI健康管家</h1>
            <div className="w-8"></div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Pet Info Card */}
          <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={pet.photos?.[0] || `https://ui-avatars.com/api/?name=${pet.name}`}
                  alt={pet.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="text-lg font-bold">{pet.name}</p>
                  <p className="text-sm text-gray-600">
                    {pet.breed} · {pet.age || '未知'}岁 · {pet.gender === 'male' ? '雄性' : pet.gender === 'female' ? '雌性' : '未知'}
                  </p>
                </div>
              </div>
              <Link
                to={`/pets/${petId}`}
                className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/20"
              >
                <span className="material-symbols-outlined text-base">folder_open</span>
                <span>数字档案</span>
              </Link>
            </div>
            <button
              onClick={handleGenerateReport}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-gray-100 hover:bg-gray-200 p-2 text-sm text-gray-800"
            >
              <span className="material-symbols-outlined text-yellow-500">picture_as_pdf</span>
              <span>生成健康报告</span>
            </button>
          </div>

          {/* AI Health Insights */}
          <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-lg font-bold">AI健康洞察</p>
              <p className="text-sm text-gray-500">
                {todayLog ? '今日已记录' : '今日未记录'}
              </p>
            </div>

            {/* Health Metrics Grid */}
            <div className="grid grid-cols-3 gap-3">
              {/* Heart Rate */}
              <div className="flex flex-col items-center gap-1.5 rounded-lg border border-gray-200 bg-white p-3 text-center">
                <span className="material-symbols-outlined text-primary">favorite</span>
                <p className="text-sm font-medium">心率</p>
                <p className="text-xs text-gray-500">
                  {todayLog?.heartRate || '--'} bpm
                </p>
              </div>

              {/* Food Amount */}
              <div className="flex flex-col items-center gap-1.5 rounded-lg border border-gray-200 bg-white p-3 text-center">
                <span className="material-symbols-outlined text-primary">restaurant</span>
                <p className="text-sm font-medium">食量</p>
                <p className="text-xs text-gray-500">
                  {todayLog?.diet?.foodAmount || '--'} g
                </p>
              </div>

              {/* Water Amount */}
              <div className="flex flex-col items-center gap-1.5 rounded-lg border border-gray-200 bg-white p-3 text-center">
                <span className="material-symbols-outlined text-secondary">water_drop</span>
                <p className="text-sm font-medium">饮水</p>
                <p className="text-xs text-gray-500">
                  {todayLog?.diet?.waterAmount || '--'} ml
                </p>
              </div>

              {/* Weight */}
              <div className="flex flex-col items-center gap-1.5 rounded-lg border border-gray-200 bg-white p-3 text-center">
                <span className="material-symbols-outlined text-secondary">weight</span>
                <p className="text-sm font-medium">体重</p>
                <p className="text-xs text-gray-500">
                  {todayLog?.weight || analytics?.weight?.current || '--'} kg
                </p>
              </div>

              {/* Activity */}
              <div className="flex flex-col items-center gap-1.5 rounded-lg border border-gray-200 bg-white p-3 text-center">
                <span className="material-symbols-outlined text-yellow-500">directions_run</span>
                <p className="text-sm font-medium">活动</p>
                <p className="text-xs text-gray-500">
                  {todayLog?.activities?.length || 0} 次
                </p>
              </div>

              {/* Add More */}
              <button
                onClick={handleAddLog}
                className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-3 text-center hover:bg-gray-100"
              >
                <span className="material-symbols-outlined text-gray-500">add_circle_outline</span>
                <p className="text-sm font-medium text-gray-500">添加</p>
              </button>
            </div>

            {/* Health Baseline */}
            <div className="rounded-lg bg-primary/5 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">data_usage</span>
                  <p className="text-base font-bold">个性化健康基线</p>
                </div>
                <span className="material-symbols-outlined text-gray-500 text-xl">expand_more</span>
              </div>
            </div>

            {/* Key Metrics Trend */}
            {analytics && (
              <div>
                <p className="mb-2 text-base font-bold">关键指标趋势 (30天)</p>
                <div className="space-y-3 bg-gray-50 rounded-lg p-3">
                  {analytics.weight && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">体重</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{analytics.weight.current?.toFixed(1)} kg</span>
                        <span>{getTrendIcon(analytics.weight.trend)}</span>
                      </div>
                    </div>
                  )}
                  {analytics.water && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">平均饮水</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{analytics.water.average?.toFixed(0) || '--'} ml</span>
                        <span>{getTrendIcon(analytics.water.trend)}</span>
                      </div>
                    </div>
                  )}
                  {analytics.food && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">平均食量</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{analytics.food.average?.toFixed(0) || '--'} g</span>
                        <span>{getTrendIcon(analytics.food.trend)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* AI Health Alerts */}
          {recentAlerts.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-4 space-y-3">
              <p className="text-lg font-bold">AI健康预警</p>
              {recentAlerts.map((alert, index) => (
                <div
                  key={index}
                  className={`rounded-lg border p-3 ${getAlertColor(alert.type)}`}
                >
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-lg">
                      {alert.type === 'critical' ? 'error' : alert.type === 'warning' ? 'warning' : 'info'}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{alert.message}</p>
                      {alert.suggestion && (
                        <p className="text-xs mt-1 opacity-80">{alert.suggestion}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleAddLog}
              className="flex flex-col items-center justify-center gap-2 rounded-lg bg-primary text-white p-4 hover:bg-primary/90"
            >
              <span className="material-symbols-outlined text-2xl">add</span>
              <span className="font-medium">记录今日健康</span>
            </button>
            <Link
              to={`/pets/${petId}/health/history`}
              className="flex flex-col items-center justify-center gap-2 rounded-lg bg-secondary text-white p-4 hover:bg-secondary/90"
            >
              <span className="material-symbols-outlined text-2xl">history</span>
              <span className="font-medium">查看历史记录</span>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HealthCenterPage;
