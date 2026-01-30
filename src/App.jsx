import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Login from './pages/LoginPage.jsx';
import Dashboard from './pages/DashboardPage.jsx';
import Restaurants from './pages/RestaurantsPage.jsx';
import './App.css';

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

// Public Route Component (redirect to dashboard if already logged in)
function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Default Route - Redirect to Login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Login Route - Public */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        
        {/* Dashboard Route - Protected */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        {/* Restaurants Route - Protected */}
        <Route 
          path="/restaurants" 
          element={
            <ProtectedRoute>
              <Restaurants />
            </ProtectedRoute>
          } 
        />
        
        {/* Catch all - Redirect to Login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;