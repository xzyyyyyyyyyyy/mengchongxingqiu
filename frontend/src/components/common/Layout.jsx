import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getImageUrl } from '../../utils/imageUtils';

const Layout = ({ children }) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', label: '首页', icon: '🏠' },
    { path: '/community', label: '社区', icon: '👥' },
    { path: '/pets', label: '宠物', icon: '🐾' },
    { path: '/services', label: '服务', icon: '🏥' },
    { path: '/shop', label: '商城', icon: '🛒' },
  ];

  const mobileNavItems = [
    { path: '/', label: '首页', icon: '🏠' },
    { path: '/community', label: '社区', icon: '👥' },
    { path: '/pets', label: '宠物', icon: '🐾' },
    { path: '/services', label: '服务', icon: '🏥' },
    { path: '/profile', label: '我的', icon: '👤' },
  ];

  return (
    <div className="min-h-screen bg-background-light">
      {/* Top Navigation Bar */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl">🐾</span>
              <span className="text-xl font-bold text-primary">萌宠星球</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'text-primary bg-primary/10'
                      : 'text-gray-700 hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <Link
                to="/profile"
                className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
              >
                <img
                  src={getImageUrl(user?.avatar) || '/default-avatar.png'}
                  alt={user?.username}
                  className="w-8 h-8 rounded-full"
                />
                <span className="hidden md:block font-medium text-gray-700">
                  {user?.username}
                </span>
              </Link>
              <button
                onClick={logout}
                className="text-gray-600 hover:text-red-600 transition-colors"
                title="退出登录"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Floating Action Button */}
      <Link
        to="/posts/create"
        className="fixed bottom-20 md:bottom-8 right-8 w-14 h-14 bg-accent hover:bg-accent/90 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-40"
        title="发布动态"
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </Link>

      {/* Bottom Navigation (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex justify-around items-center h-16">
          {mobileNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center space-y-1 flex-1 ${
                isActive(item.path) ? 'text-primary' : 'text-gray-600'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Add padding at bottom for mobile nav */}
      <div className="md:hidden h-16"></div>
    </div>
  );
};

export default Layout;
