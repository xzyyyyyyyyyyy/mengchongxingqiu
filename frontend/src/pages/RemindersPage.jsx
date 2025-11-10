import { useState, useEffect } from 'react';

const RemindersPage = () => {
  const [reminders, setReminders] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newReminder, setNewReminder] = useState({
    type: 'vaccine',
    title: '',
    date: '',
    notes: '',
    repeat: 'once',
  });

  // Mock reminders data
  const mockReminders = [
    {
      id: 1,
      type: 'vaccine',
      title: '狂犬疫苗加强针',
      petName: '旺财',
      date: '2025-11-15',
      status: 'pending',
      notes: '建议使用进口疫苗',
      icon: '💉',
    },
    {
      id: 2,
      type: 'deworming',
      title: '体内驱虫',
      petName: '小橘',
      date: '2025-11-12',
      status: 'pending',
      notes: '',
      icon: '💊',
    },
    {
      id: 3,
      type: 'grooming',
      title: '美容洗澡',
      petName: '旺财',
      date: '2025-11-18',
      status: 'pending',
      notes: '剪指甲+洗澡',
      icon: '✂️',
    },
    {
      id: 4,
      type: 'checkup',
      title: '年度体检',
      petName: '小橘',
      date: '2025-12-01',
      status: 'pending',
      notes: '全面体检套餐',
      icon: '🏥',
    },
    {
      id: 5,
      type: 'feeding',
      title: '喂食提醒',
      petName: '小橘',
      date: '2025-11-10',
      time: '18:00',
      status: 'completed',
      notes: '晚餐时间',
      icon: '🍖',
      repeat: 'daily',
    },
  ];

  useEffect(() => {
    setReminders(mockReminders);
  }, []);

  const reminderTypes = [
    { id: 'vaccine', name: '疫苗接种', icon: '💉', color: 'bg-blue-100 text-blue-600' },
    { id: 'deworming', name: '驱虫', icon: '💊', color: 'bg-green-100 text-green-600' },
    { id: 'grooming', name: '美容', icon: '✂️', color: 'bg-purple-100 text-purple-600' },
    { id: 'checkup', name: '体检', icon: '🏥', color: 'bg-red-100 text-red-600' },
    { id: 'feeding', name: '喂食', icon: '🍖', color: 'bg-yellow-100 text-yellow-600' },
    { id: 'training', name: '训练', icon: '🎓', color: 'bg-indigo-100 text-indigo-600' },
    { id: 'seasonal', name: '季节性', icon: '🌸', color: 'bg-pink-100 text-pink-600' },
  ];

  const getStatusBadge = (status) => {
    if (status === 'completed') {
      return <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs">已完成</span>;
    }
    return <span className="px-2 py-1 bg-yellow-100 text-yellow-600 rounded-full text-xs">待办</span>;
  };

  const getDaysUntil = (date) => {
    const today = new Date();
    const targetDate = new Date(date);
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return '已过期';
    if (diffDays === 0) return '今天';
    if (diffDays === 1) return '明天';
    return `${diffDays}天后`;
  };

  const handleAddReminder = () => {
    // Add reminder logic here
    setShowAddModal(false);
    alert('提醒已添加！');
  };

  const handleCompleteReminder = (id) => {
    setReminders(prev =>
      prev.map(r => r.id === id ? { ...r, status: 'completed' } : r)
    );
  };

  return (
    <div className="min-h-screen bg-background-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">⏰ 智能提醒</h1>
            <p className="text-text-secondary">从不错过重要的宠物护理时刻</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <span>➕</span>
            <span>添加提醒</span>
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="card text-center bg-gradient-to-br from-red-50 to-orange-50">
            <div className="text-3xl mb-2">🔔</div>
            <div className="text-2xl font-bold text-primary">{reminders.filter(r => r.status === 'pending').length}</div>
            <div className="text-sm text-text-secondary">待办提醒</div>
          </div>
          <div className="card text-center bg-gradient-to-br from-blue-50 to-cyan-50">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-2xl font-bold text-primary">{reminders.filter(r => r.status === 'completed').length}</div>
            <div className="text-sm text-text-secondary">已完成</div>
          </div>
          <div className="card text-center bg-gradient-to-br from-yellow-50 to-amber-50">
            <div className="text-3xl mb-2">⚠️</div>
            <div className="text-2xl font-bold text-primary">
              {reminders.filter(r => {
                const days = new Date(r.date) - new Date();
                return days < 3 * 24 * 60 * 60 * 1000 && days > 0;
              }).length}
            </div>
            <div className="text-sm text-text-secondary">即将到期</div>
          </div>
          <div className="card text-center bg-gradient-to-br from-purple-50 to-pink-50">
            <div className="text-3xl mb-2">🔁</div>
            <div className="text-2xl font-bold text-primary">
              {reminders.filter(r => r.repeat && r.repeat !== 'once').length}
            </div>
            <div className="text-sm text-text-secondary">循环提醒</div>
          </div>
        </div>

        {/* Reminders List */}
        <div className="space-y-4 mb-8">
          {reminders.map((reminder) => (
            <div key={reminder.id} className="card hover:shadow-lg transition-all">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="text-4xl flex-shrink-0">{reminder.icon}</div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-text-primary">{reminder.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-text-secondary mt-1">
                        <span>🐾 {reminder.petName}</span>
                        <span>·</span>
                        <span>📅 {reminder.date}</span>
                        {reminder.time && (
                          <>
                            <span>·</span>
                            <span>🕐 {reminder.time}</span>
                          </>
                        )}
                      </div>
                    </div>
                    {getStatusBadge(reminder.status)}
                  </div>

                  {reminder.notes && (
                    <p className="text-sm text-text-secondary mb-2">
                      📝 {reminder.notes}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-medium ${
                        getDaysUntil(reminder.date) === '今天' || getDaysUntil(reminder.date) === '明天'
                          ? 'text-red-600'
                          : 'text-text-secondary'
                      }`}>
                        {getDaysUntil(reminder.date)}
                      </span>
                      {reminder.repeat && reminder.repeat !== 'once' && (
                        <span className="text-xs px-2 py-1 bg-purple-100 text-purple-600 rounded-full">
                          🔁 {reminder.repeat === 'daily' ? '每天' : reminder.repeat === 'weekly' ? '每周' : '每月'}
                        </span>
                      )}
                    </div>

                    {reminder.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCompleteReminder(reminder.id)}
                          className="px-3 py-1 bg-green-100 text-green-600 rounded-lg text-sm hover:bg-green-200 transition-colors"
                        >
                          完成
                        </button>
                        <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 transition-colors">
                          编辑
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Reminder Settings */}
        <div className="card bg-gradient-to-br from-indigo-50 to-blue-50">
          <h3 className="text-lg font-bold text-text-primary mb-4">⚙️ 提醒设置</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-text-primary">APP推送提醒</div>
                <div className="text-sm text-text-secondary">在应用内接收提醒通知</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-text-primary">短信提醒</div>
                <div className="text-sm text-text-secondary">通过短信接收重要提醒</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-text-primary">日历同步</div>
                <div className="text-sm text-text-secondary">同步到手机日历</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-text-primary">提前提醒</div>
                <div className="text-sm text-text-secondary">在到期前提前通知</div>
              </div>
              <select className="px-3 py-1 border border-gray-300 rounded-lg text-sm">
                <option value="1">提前1天</option>
                <option value="3" selected>提前3天</option>
                <option value="7">提前7天</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Add Reminder Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-text-primary mb-4">添加提醒</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">提醒类型</label>
                <select
                  className="input-field w-full"
                  value={newReminder.type}
                  onChange={(e) => setNewReminder({ ...newReminder, type: e.target.value })}
                >
                  {reminderTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.icon} {type.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">标题</label>
                <input
                  type="text"
                  className="input-field w-full"
                  placeholder="例如：狂犬疫苗"
                  value={newReminder.title}
                  onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">日期</label>
                <input
                  type="date"
                  className="input-field w-full"
                  value={newReminder.date}
                  onChange={(e) => setNewReminder({ ...newReminder, date: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">重复</label>
                <select
                  className="input-field w-full"
                  value={newReminder.repeat}
                  onChange={(e) => setNewReminder({ ...newReminder, repeat: e.target.value })}
                >
                  <option value="once">仅一次</option>
                  <option value="daily">每天</option>
                  <option value="weekly">每周</option>
                  <option value="monthly">每月</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">备注</label>
                <textarea
                  className="input-field w-full"
                  rows="3"
                  placeholder="添加备注信息..."
                  value={newReminder.notes}
                  onChange={(e) => setNewReminder({ ...newReminder, notes: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2 border border-gray-300 rounded-lg text-text-secondary hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleAddReminder}
                className="flex-1 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                添加
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RemindersPage;
