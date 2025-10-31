import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { petService } from '../api/petService';
import { healthService } from '../api/healthService';

const PetDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [healthLogs, setHealthLogs] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [activeTab, setActiveTab] = useState('info');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPetData();
  }, [id]);

  const loadPetData = async () => {
    try {
      setLoading(true);
      const [petResponse, logsResponse, analyticsResponse] = await Promise.all([
        petService.getPet(id),
        healthService.getHealthLogs(id, { limit: 7 }),
        healthService.getHealthAnalytics(id, 30)
      ]);
      setPet(petResponse.data);
      setHealthLogs(logsResponse.data);
      setAnalytics(analyticsResponse.data);
    } catch (error) {
      console.error('Failed to load pet data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">宠物不存在</p>
      </div>
    );
  }

  const speciesNames = {
    cat: '猫',
    dog: '狗',
    rabbit: '兔子',
    hamster: '仓鼠',
    bird: '鸟',
    fish: '鱼',
    other: '其他',
  };

  return (
    <div className="min-h-screen bg-background-light pb-8">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate('/pets')}
            className="flex items-center text-gray-600 hover:text-primary mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            返回
          </button>

          <div className="flex items-center space-x-6">
            <img
              src={pet.avatar || '/default-pet.png'}
              alt={pet.name}
              className="w-24 h-24 rounded-full object-cover"
            />
            <div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">{pet.name}</h1>
              <p className="text-text-secondary">
                {speciesNames[pet.species]} · {pet.breed}
              </p>
              {pet.birthDate && (
                <p className="text-text-secondary text-sm mt-1">
                  {calculateAge(pet.birthDate)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'info', label: '基本信息' },
              { id: 'health', label: '健康记录' },
              { id: 'photos', label: '相册' },
              { id: 'reminders', label: '提醒事项' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'info' && (
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="card">
              <h3 className="text-xl font-bold mb-4">基本信息</h3>
              <div className="grid grid-cols-2 gap-4">
                <InfoItem label="性别" value={pet.gender === 'male' ? '雄性' : pet.gender === 'female' ? '雌性' : '未知'} />
                <InfoItem label="品种" value={pet.breed} />
                <InfoItem label="颜色" value={pet.appearance?.color || '-'} />
                <InfoItem label="体重" value={pet.appearance?.weight ? `${pet.appearance.weight} kg` : '-'} />
              </div>
            </div>

            {/* Personality */}
            {pet.personality && (
              <div className="card">
                <h3 className="text-xl font-bold mb-4">性格特征</h3>
                <p className="text-gray-700">{pet.personality.temperament || '暂无描述'}</p>
                {pet.personality.traits && pet.personality.traits.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {pet.personality.traits.map((trait, index) => (
                      <span key={index} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                        {trait}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Health Summary */}
            <div className="card">
              <h3 className="text-xl font-bold mb-4">健康摘要</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">
                    {pet.health?.vaccinations?.length || 0}
                  </p>
                  <p className="text-sm text-gray-600">疫苗记录</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">
                    {pet.health?.checkups?.length || 0}
                  </p>
                  <p className="text-sm text-gray-600">体检记录</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <p className="text-2xl font-bold text-yellow-600">
                    {pet.health?.medications?.length || 0}
                  </p>
                  <p className="text-sm text-gray-600">用药记录</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'health' && (
          <div className="space-y-6">
            {/* Health Analytics */}
            {analytics && (
              <div className="card">
                <h3 className="text-xl font-bold mb-4">健康趋势（最近30天）</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-primary/5 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">体重</p>
                    <p className="text-2xl font-bold text-primary">
                      {analytics.weight?.current ? `${analytics.weight.current} kg` : '-'}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      趋势: {analytics.weight?.trend === 'increasing' ? '↗️ 上升' : analytics.weight?.trend === 'decreasing' ? '↘️ 下降' : '→ 稳定'}
                    </p>
                  </div>
                  <div className="p-4 bg-secondary/5 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">饮水量（平均）</p>
                    <p className="text-2xl font-bold text-secondary">
                      {analytics.water?.average ? `${analytics.water.average.toFixed(0)} ml` : '-'}
                    </p>
                  </div>
                  <div className="p-4 bg-accent/5 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">食量（平均）</p>
                    <p className="text-2xl font-bold text-accent">
                      {analytics.food?.average ? `${analytics.food.average.toFixed(0)} g` : '-'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Health Logs */}
            <div className="card">
              <h3 className="text-xl font-bold mb-4">最近记录</h3>
              {healthLogs.length > 0 ? (
                <div className="space-y-3">
                  {healthLogs.map((log) => (
                    <div key={log._id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium">
                          {new Date(log.date).toLocaleDateString('zh-CN')}
                        </span>
                        {log.alerts && log.alerts.length > 0 && (
                          <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded">
                            {log.alerts.length} 个警告
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                        {log.weight && <p>体重: {log.weight} kg</p>}
                        {log.diet?.waterAmount && <p>饮水: {log.diet.waterAmount} ml</p>}
                        {log.diet?.foodAmount && <p>食量: {log.diet.foodAmount} g</p>}
                        {log.energy?.level && <p>精神: {log.energy.level}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">暂无健康记录</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'photos' && (
          <div className="card">
            <h3 className="text-xl font-bold mb-4">照片相册</h3>
            <p className="text-gray-500 text-center py-8">功能开发中...</p>
          </div>
        )}

        {activeTab === 'reminders' && (
          <div className="card">
            <h3 className="text-xl font-bold mb-4">提醒事项</h3>
            {pet.reminders && pet.reminders.length > 0 ? (
              <div className="space-y-3">
                {pet.reminders.map((reminder, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="font-medium">{reminder.type}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(reminder.date).toLocaleDateString('zh-CN')}
                      </p>
                      {reminder.note && <p className="text-sm text-gray-500 mt-1">{reminder.note}</p>}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      reminder.completed ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      {reminder.completed ? '已完成' : '待办'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">暂无提醒事项</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const InfoItem = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-600">{label}</p>
    <p className="font-medium text-gray-900">{value}</p>
  </div>
);

function calculateAge(birthDate) {
  const birth = new Date(birthDate);
  const now = new Date();
  const years = now.getFullYear() - birth.getFullYear();
  const months = now.getMonth() - birth.getMonth();

  if (years > 0) {
    return `${years}岁${months > 0 ? months + '个月' : ''}`;
  } else {
    return `${months}个月`;
  }
}

export default PetDetailPage;
