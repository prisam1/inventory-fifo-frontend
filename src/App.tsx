import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import Spinner from './components/common/Spinner';
import { Toaster } from 'sonner';

function AppContent() {
  const { authState } = useAuth();

  if (authState.loading) {
    return <Spinner />;
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>
      {/* Redirect authenticated users from root to dashboard, others to login */}
      <Route path="/" element={authState.isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
        <Toaster position="top-center" richColors theme="dark" />
      </AuthProvider>
    </Router>
  );
};

export default App;