import React, { useState, useEffect } from 'react';
import { LoginPage } from './components/auth/LoginPage';
import { SignupPage } from './components/auth/SignupPage';
import { DoctorDashboard } from './components/dashboard/DoctorDashboard';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function AppContent() {
  const { user, isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState<'login' | 'signup' | 'dashboard'>('login');

  useEffect(() => {
    if (isAuthenticated && user) {
      setCurrentView('dashboard');
    } else {
      setCurrentView('login');
    }
  }, [isAuthenticated, user]);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'signup':
        return <SignupPage onSwitchToLogin={() => setCurrentView('login')} />;
      case 'dashboard':
        if (!user) return <LoginPage onSwitchToSignup={() => setCurrentView('signup')} />;
        return user.role === 'doctor' ? <DoctorDashboard /> : <AdminDashboard />;
      default:
        return <LoginPage onSwitchToSignup={() => setCurrentView('signup')} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderCurrentView()}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;