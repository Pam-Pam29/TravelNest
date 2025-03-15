import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';

// Import your components
const Login = React.lazy(() => import('./components/Auth/Login'));
const Register = React.lazy(() => import('./components/Auth/Register'));
const Dashboard = React.lazy(() => import('./components/Dashboard/UserDashboard'));
const PackageList = React.lazy(() => import('./components/Packages/PackageList'));
const PackageDetails = React.lazy(() => import('./components/Packages/PackageDetails'));

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <React.Suspense fallback={<div>Loading...</div>}>
          <Routes>
            {/* Authentication Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/packages" 
              element={<PackageList />} 
            />
            <Route 
              path="/packages/:id" 
              element={
                <ProtectedRoute>
                  <PackageDetails />
                </ProtectedRoute>
              } 
            />

            {/* Default Redirect */}
            <Route path="/" element={<Navigate to="/packages" replace />} />
          </Routes>
        </React.Suspense>
      </Router>
    </AuthProvider>
  );
};

export default App;
