import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Login from './pages/LoginPage.jsx';
import Dashboard from './pages/DashboardPage.jsx';
import Restaurants from './pages/RestaurantsPage.jsx';
import Users from './pages/UsersPage.jsx';
import DeliveryPersons from './pages/DeliveryPersonsPage.jsx';
import ComplaintsPage from './pages/ComplaintsPage.jsx';
import ReviewsPage from './pages/ReviewsPage.jsx';
import './App.css';
import NotificationsPage from './pages/NotificationsPage';
import SettingsPage from './pages/SettingsPage';

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

        {/* Users Route - Protected */}
        <Route 
      path="/users" 
      element={
        <ProtectedRoute>
          <Users />
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

        {/* Delivery Person Route - Protected */}
                <Route 
          path="/delivery-persons" 
          element={
            <ProtectedRoute>
              <DeliveryPersons />
            </ProtectedRoute>
          } 
        />

        {/* Complains Route - Protected */}
        <Route
        path="/complaints"
        element={
          <ProtectedRoute>
            <ComplaintsPage />
          </ProtectedRoute>
        }
        />

        {/* Reviews Route - Protected */}
        <Route
        path="/reviews"
        element={
          <ProtectedRoute>
            <ReviewsPage />
          </ProtectedRoute>
        }
        />

        {/* Notification Route - Protected */}
        <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <NotificationsPage />
          </ProtectedRoute>
        }
        />

        {/* Setting Route - Protected */}
        <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
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