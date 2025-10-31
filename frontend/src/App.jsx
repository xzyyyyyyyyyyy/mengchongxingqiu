import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/common/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PetsPage from './pages/PetsPage';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                  <HomePage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/pets"
            element={
              <ProtectedRoute>
                <Layout>
                  <PetsPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/pets/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <div className="p-8 text-center">
                    <h2 className="text-2xl font-bold">宠物详情页</h2>
                    <p className="text-gray-600 mt-2">正在开发中...</p>
                  </div>
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/community"
            element={
              <ProtectedRoute>
                <Layout>
                  <div className="p-8 text-center">
                    <h2 className="text-2xl font-bold">社区</h2>
                    <p className="text-gray-600 mt-2">正在开发中...</p>
                  </div>
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/services"
            element={
              <ProtectedRoute>
                <Layout>
                  <div className="p-8 text-center">
                    <h2 className="text-2xl font-bold">服务</h2>
                    <p className="text-gray-600 mt-2">正在开发中...</p>
                  </div>
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/shop"
            element={
              <ProtectedRoute>
                <Layout>
                  <div className="p-8 text-center">
                    <h2 className="text-2xl font-bold">商城</h2>
                    <p className="text-gray-600 mt-2">正在开发中...</p>
                  </div>
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Layout>
                  <div className="p-8 text-center">
                    <h2 className="text-2xl font-bold">个人中心</h2>
                    <p className="text-gray-600 mt-2">正在开发中...</p>
                  </div>
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
