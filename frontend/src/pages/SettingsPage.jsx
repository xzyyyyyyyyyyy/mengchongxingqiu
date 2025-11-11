import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const SettingsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('appearance');
  const [settings, setSettings] = useState({
    theme: 'default',
    notifications: {
      push: true,
      email: true,
      sms: false,
      timeStart: '08:00',
      timeEnd: '22:00',
    },
    privacy: {
      contentVisibility: 'public',
      showLocation: true,
      hidePersonalInfo: false,
    },
  });

  const themes = [
    {
      id: 'default',
      name: '默认皮肤',
      description: '清新简洁的默认主题',
      preview: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      free: true,
    },
    {
      id: 'cute',
      name: '可爱皮肤',
      description: '粉色萌系主题',
      preview: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      free: false,
      points: 1500,
    },
    {
      id: 'simple',
      name: '简约皮肤',
      description: '黑白简约设计',
      preview: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      free: true,
    },
    {
      id: 'dark',
      name: '暗黑皮肤',
      description: '护眼暗黑模式',
      preview: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
      free: false,
      points: 1500,
    },
  ];

  const tabs = [
    { id: 'appearance', name: '外观', icon: '🎨' },
    { id: 'notifications', name: '通知', icon: '🔔' },
    { id: 'privacy', name: '隐私', icon: '🔒' },
    { id: 'account', name: '账号', icon: '👤' },
  ];

  const handleThemeChange = (themeId) => {
    const theme = themes.find(t => t.id === themeId);
    if (!theme.free) {
      if (window.confirm(`使用"${theme.name}"需要消耗 ${theme.points} 积分，确认兑换？`)) {
        setSettings({ ...settings, theme: themeId });
        alert('主题已更换！');
      }
    } else {
      setSettings({ ...settings, theme: themeId });
    }
  };

  const handleNotificationChange = (key, value) => {
    setSettings({
      ...settings,
      notifications: { ...settings.notifications, [key]: value },
    });
  };

  const handlePrivacyChange = (key, value) => {
    setSettings({
      ...settings,
      privacy: { ...settings.privacy, [key]: value },
    });
  };

  return (
    <div className="min-h-screen bg-background-light pb-20 sm:pb-6">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-1 sm:mb-2">⚙️ 设置</h1>
          <p className="text-sm sm:text-base text-text-secondary">个性化您的萌宠星球体验</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card space-y-1 overflow-x-auto">
              <div className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-1 min-w-max lg:min-w-0">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`text-left px-3 py-2 sm:px-4 sm:py-3 rounded-lg transition-colors flex items-center gap-2 sm:gap-3 whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-primary text-white'
                        : 'text-text-secondary hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-lg sm:text-xl">{tab.icon}</span>
                    <span className="font-medium text-sm sm:text-base">{tab.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div className="card">
                  <h2 className="text-xl font-bold text-text-primary mb-4">主题皮肤</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {themes.map((theme) => (
                      <div
                        key={theme.id}
                        className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                          settings.theme === theme.id
                            ? 'border-primary shadow-lg'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleThemeChange(theme.id)}
                      >
                        <div
                          className="w-full h-32 rounded-lg mb-3"
                          style={{ background: theme.preview }}
                        />
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-text-primary">{theme.name}</h3>
                          {settings.theme === theme.id && (
                            <span className="text-primary">✓</span>
                          )}
                        </div>
                        <p className="text-sm text-text-secondary mb-2">{theme.description}</p>
                        {theme.free ? (
                          <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded-full">
                            免费
                          </span>
                        ) : (
                          <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-600 rounded-full">
                            {theme.points} 积分
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card">
                  <h2 className="text-xl font-bold text-text-primary mb-4">自定义布局</h2>
                  <p className="text-sm text-text-secondary mb-4">
                    调整首页模块的显示顺序（功能开发中）
                  </p>
                  <div className="space-y-3 opacity-50 pointer-events-none">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <span className="cursor-move">☰</span>
                      <span>信息流</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <span className="cursor-move">☰</span>
                      <span>社区入口</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <span className="cursor-move">☰</span>
                      <span>服务入口</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="card">
                <h2 className="text-xl font-bold text-text-primary mb-4">通知设置</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <div className="font-medium text-text-primary">APP推送通知</div>
                      <div className="text-sm text-text-secondary">在应用内接收推送通知</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings.notifications.push}
                        onChange={(e) => handleNotificationChange('push', e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <div className="font-medium text-text-primary">邮件通知</div>
                      <div className="text-sm text-text-secondary">通过邮件接收重要通知</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings.notifications.email}
                        onChange={(e) => handleNotificationChange('email', e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <div className="font-medium text-text-primary">短信通知</div>
                      <div className="text-sm text-text-secondary">通过短信接收紧急通知</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings.notifications.sms}
                        onChange={(e) => handleNotificationChange('sms', e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="py-3">
                    <div className="font-medium text-text-primary mb-3">勿扰时间段</div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <label className="text-sm text-text-secondary mb-1 block">开始时间</label>
                        <input
                          type="time"
                          className="input-field w-full"
                          value={settings.notifications.timeStart}
                          onChange={(e) => handleNotificationChange('timeStart', e.target.value)}
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-sm text-text-secondary mb-1 block">结束时间</label>
                        <input
                          type="time"
                          className="input-field w-full"
                          value={settings.notifications.timeEnd}
                          onChange={(e) => handleNotificationChange('timeEnd', e.target.value)}
                        />
                      </div>
                    </div>
                    <p className="text-sm text-text-secondary mt-2">
                      在此时间段内不会收到非紧急通知
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="card">
                <h2 className="text-xl font-bold text-text-primary mb-4">隐私设置</h2>
                <div className="space-y-4">
                  <div className="py-3 border-b">
                    <div className="font-medium text-text-primary mb-3">内容可见范围</div>
                    <select
                      className="input-field w-full"
                      value={settings.privacy.contentVisibility}
                      onChange={(e) => handlePrivacyChange('contentVisibility', e.target.value)}
                    >
                      <option value="public">公开 - 所有人可见</option>
                      <option value="friends">好友 - 仅好友可见</option>
                      <option value="private">私密 - 仅自己可见</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <div className="font-medium text-text-primary">显示位置信息</div>
                      <div className="text-sm text-text-secondary">在帖子中显示您的位置</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings.privacy.showLocation}
                        onChange={(e) => handlePrivacyChange('showLocation', e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div>
                      <div className="font-medium text-text-primary">隐藏个人信息</div>
                      <div className="text-sm text-text-secondary">对其他用户隐藏邮箱和手机号</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={settings.privacy.hidePersonalInfo}
                        onChange={(e) => handlePrivacyChange('hidePersonalInfo', e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'account' && (
              <div className="space-y-6">
                <div className="card">
                  <h2 className="text-xl font-bold text-text-primary mb-4">账号信息</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">用户名</label>
                      <input
                        type="text"
                        className="input-field w-full"
                        defaultValue={user?.username || ''}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">邮箱</label>
                      <input
                        type="email"
                        className="input-field w-full"
                        defaultValue={user?.email || ''}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">个人简介</label>
                      <textarea
                        className="input-field w-full"
                        rows="3"
                        defaultValue={user?.bio || ''}
                      />
                    </div>
                    <button className="btn-primary">保存更改</button>
                  </div>
                </div>

                <div className="card">
                  <h2 className="text-xl font-bold text-text-primary mb-4">修改密码</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">当前密码</label>
                      <input type="password" className="input-field w-full" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">新密码</label>
                      <input type="password" className="input-field w-full" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">确认新密码</label>
                      <input type="password" className="input-field w-full" />
                    </div>
                    <button className="btn-primary">更新密码</button>
                  </div>
                </div>

                <div className="card bg-red-50 border border-red-200">
                  <h2 className="text-xl font-bold text-red-600 mb-4">危险操作</h2>
                  <p className="text-sm text-text-secondary mb-4">
                    删除账号将永久删除您的所有数据，此操作不可恢复
                  </p>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                    删除账号
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
