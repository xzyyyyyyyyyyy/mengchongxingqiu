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
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/30">
      {/* Top Navigation Bar - Enhanced */}
      <header className="bg-white/80 backdrop-blur-md shadow-soft sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2 group">
              <span className="text-3xl transform group-hover:scale-110 transition-transform duration-300">🐾</span>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                萌宠星球
              </span>
            </Link>

            {/* Desktop Navigation - Enhanced */}
            <nav className="hidden md:flex space-x-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-primary'
                      : 'text-gray-700 hover:bg-gray-100 hover:scale-105'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* User Menu - Enhanced */}
            <div className="flex items-center space-x-3">
              <Link
                to="/profile"
                className="flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-all duration-300 hover:scale-105 group"
              >
                <div className="relative">
                  <img
                    src={getImageUrl(user?.avatar) || '/default-avatar.png'}
                    alt={user?.username}
                    className="w-9 h-9 rounded-full ring-2 ring-primary/30 group-hover:ring-primary transition-all duration-300"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                </div>
                <span className="hidden md:block font-medium text-gray-700 group-hover:text-primary transition-colors">
                  {user?.username}
                </span>
              </Link>
              <button
                onClick={logout}
                className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300 hover:scale-110"
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
      <main className="animate-fade-in">{children}</main>

      {/* Floating Action Button - Enhanced */}
      <Link
        to="/posts/create"
        className="fixed bottom-20 md:bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-accent to-accent-dark hover:from-accent-dark hover:to-accent text-white rounded-2xl shadow-large flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-90 z-40 group"
        title="发布动态"
      >
        <svg className="w-8 h-8 transform group-hover:rotate-0 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </Link>

      {/* Mobile Bottom Navigation - Enhanced */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-200 z-50">
        <div className="flex justify-around items-center h-16 px-2">
          {mobileNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 py-2 transition-all duration-300 ${
                isActive(item.path)
                  ? 'text-primary scale-110'
                  : 'text-gray-600 hover:text-primary'
              }`}
            >
              <span className={`text-2xl mb-1 transition-transform duration-300 ${
                isActive(item.path) ? 'animate-float' : ''
              }`}>
                {item.icon}
              </span>
              <span className={`text-xs font-medium ${
                isActive(item.path) ? 'font-bold' : ''
              }`}>
                {item.label}
              </span>
              {isActive(item.path) && (
                <div className="absolute bottom-0 w-12 h-1 bg-gradient-to-r from-primary to-secondary rounded-t-full"></div>
              )}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
