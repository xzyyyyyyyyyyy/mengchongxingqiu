import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RemindersPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upcoming');
  
  const upcomingReminders = [
    { id: 1, title: '体内驱虫', petName: '豆豆', daysLeft: 3, icon: '💊', type: 'deworming' },
    { id: 2, title: '疫苗接种', petName: '旺财', daysLeft: 7, icon: '💉', type: 'vaccine' },
    { id: 3, title: '洗澡清洁', petName: '豆豆', daysLeft: 10, icon: '🛁', type: 'grooming' },
  ];

  const basicReminders = [
    { id: 'dr1', icon: '💊', title: '体内驱虫', interval: '每3个月', color: 'bg-blue-100 text-blue-600' },
    { id: 'dr2', icon: '💉', title: '疫苗接种', interval: '每年', color: 'bg-green-100 text-green-600' },
    { id: 'dr3', icon: '🛁', title: '洗澡清洁', interval: '每2周', color: 'bg-purple-100 text-purple-600' },
    { id: 'dr4', icon: '🦟', title: '体外驱虫', interval: '每月', color: 'bg-orange-100 text-orange-600' },
  ];

  const customReminders = [
    { id: 'cr1', icon: '🍖', title: '喂食计划', interval: '每日', color: 'bg-yellow-100 text-yellow-600' },
    { id: 'cr2', icon: '✂️', title: '美容护理', interval: '自定义', color: 'bg-pink-100 text-pink-600' },
    { id: 'cr3', icon: '🐾', title: '训练互动', interval: '自定义', color: 'bg-indigo-100 text-indigo-600' },
    { id: 'cr4', icon: '⛅', title: '季节健康', interval: '换季时', color: 'bg-teal-100 text-teal-600' },
  ];

  const services = [
    { id: 's1', icon: '🎨', title: 'AI扫描定制宠物3D形象', subtitle: '上传宠物照片，生成专属3D萌宠', action: '立即生成', path: '/avatar' },
    { id: 's2', icon: '❤️', title: '健康监测中心', subtitle: '记录饮食饮水，关注健康趋势', action: '查看', path: '/health' },
  ];

  const todayTasks = [
    { id: 't1', icon: '💉', title: '驱虫提醒', desc: '该给波比体内驱虫啦', color: 'bg-purple-50' },
    { id: 't2', icon: '📅', title: '预约进度', desc: '洗护美容已预约，明天下午2点', color: 'bg-blue-50' },
    { id: 't3', icon: '✅', title: '添加新日程', desc: '别忘了把新计划加入日历哦', color: 'bg-green-50' },
  ];

  return (
    <div className="min-h-screen bg-background-light pb-20 sm:pb-6">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-1 sm:mb-2">⏰ 日历提醒</h1>
          <p className="text-sm sm:text-base text-text-secondary">智能管理宠物日程</p>
        </div>

        {/* Tabs */}
        <div className="mb-6 bg-white rounded-lg p-1">
          <div className="flex space-x-2">
            {[
              { id: 'upcoming', label: '即将到来' },
              { id: 'basic', label: '基础提醒' },
              { id: 'services', label: '服务中心' },
              { id: 'today', label: '今日待办' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Upcoming Reminders */}
        {activeTab === 'upcoming' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-3">📍 即将到来</h2>
            {upcomingReminders.map(reminder => (
              <div key={reminder.id} className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">{reminder.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{reminder.title}</h3>
                    <p className="text-gray-600 text-sm">{reminder.petName} - 还有{reminder.daysLeft}天</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    reminder.daysLeft <= 3 ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {reminder.daysLeft}天后
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Basic Reminders */}
        {activeTab === 'basic' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-3">🔔 基础提醒</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {basicReminders.map(reminder => (
                  <div key={reminder.id} className={`${reminder.color} rounded-lg p-4`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-3xl">{reminder.icon}</span>
                        <div>
                          <h3 className="font-bold">{reminder.title}</h3>
                          <p className="text-sm opacity-80">{reminder.interval}</p>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-white/50 rounded-full transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-3">➕ 新增提醒</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {customReminders.map(reminder => (
                  <div key={reminder.id} className={`${reminder.color} rounded-lg p-4`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-3xl">{reminder.icon}</span>
                        <div>
                          <h3 className="font-bold">{reminder.title}</h3>
                          <p className="text-sm opacity-80">{reminder.interval}</p>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-white/50 rounded-full transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button className="w-full py-4 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>添加新提醒</span>
            </button>
          </div>
        )}

        {/* Services */}
        {activeTab === 'services' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-3">🎯 服务中心</h2>
            {services.map(service => (
              <div key={service.id} className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-4xl">{service.icon}</span>
                      <div>
                        <h3 className="font-bold text-lg">{service.title}</h3>
                        <p className="text-gray-600 text-sm">{service.subtitle}</p>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate(service.path)}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-1"
                  >
                    <span>{service.action}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              <button 
                onClick={() => navigate('/health')}
                className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow text-center"
              >
                <div className="text-3xl mb-2">🏥</div>
                <p className="font-medium text-sm">医疗记录</p>
              </button>
              <button 
                onClick={() => navigate('/services')}
                className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow text-center"
              >
                <div className="text-3xl mb-2">🏪</div>
                <p className="font-medium text-sm">附近服务</p>
              </button>
              <button 
                onClick={() => navigate('/services?type=home')}
                className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow text-center"
              >
                <div className="text-3xl mb-2">🚪</div>
                <p className="font-medium text-sm">上门喂养</p>
              </button>
              <button className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow text-center">
                <div className="text-3xl mb-2">⚙️</div>
                <p className="font-medium text-sm">更多功能</p>
              </button>
            </div>
          </div>
        )}

        {/* Today Tasks */}
        {activeTab === 'today' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-3">📋 今日待办</h2>
            {todayTasks.map(task => (
              <div key={task.id} className={`${task.color} rounded-lg p-4 border-l-4 border-primary`}>
                <div className="flex items-start space-x-3">
                  <span className="text-3xl">{task.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-bold mb-1">{task.title}</h3>
                    <p className="text-gray-600 text-sm">{task.desc}</p>
                  </div>
                  <button className="text-primary hover:text-primary/80">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RemindersPage;
