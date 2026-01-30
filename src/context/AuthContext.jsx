import React, { createContext, useState, useContext, useEffect } from 'react';
import { loginAdmin, getCurrentAdmin, logoutAdmin } from '../services/authService';
import { toast } from 'react-toastify';

// Create Context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Provider Component
export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if admin is logged in on component mount
  useEffect(() => {
    const adminData = getCurrentAdmin();
    if (adminData) {
      // Verify admin role
      if (adminData.role === 'admin') {
        setAdmin(adminData);
      } else {
        // Not an admin, clear data
        localStorage.removeItem('adminData');
        toast.error('Access denied. Admin privileges required.');
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const data = await loginAdmin(email, password);
      
      // Check if user is admin
      if (data.role !== 'admin') {
        toast.error('Access denied. Admin privileges required.');
        return { 
          success: false, 
          message: 'Access denied. Admin privileges required.' 
        };
      }
      
      // Save admin data to localStorage
      localStorage.setItem('adminData', JSON.stringify(data));
      
      setAdmin(data);
      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  // Logout function
  const logout = () => {
    logoutAdmin();
    setAdmin(null);
  };

  // Context value
  const value = {
    admin,
    login,
    logout,
    isAuthenticated: !!admin,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};