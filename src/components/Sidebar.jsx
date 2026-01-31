import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UtensilsCrossed, 
  Truck, 
  ShoppingCart,
  MessageSquare,
  Star,
  Bell,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  User,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import './Sidebar.css';
import api from '../services/apiService';

function Sidebar() {
  const { logout, admin } = useAuth();
  const navigate = useNavigate();
  const [badgeCounts, setBadgeCounts] = useState({
    restaurants: 0,
    deliveryPersons: 0,
    complaints: 0,
    notifications: 0
  });
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState({});

  useEffect(() => {
    fetchBadgeCounts();
    // Refresh badge counts every 30 seconds
    const interval = setInterval(fetchBadgeCounts, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchBadgeCounts = async () => {
    try {
      const [restaurantsRes, deliveryRes, complaintsRes] = await Promise.all([
        api.get('/admin/restaurants/pending'),
        api.get('/admin/delivery-persons/pending'),
        api.get('/admin/complaints/unresolved')
      ]);

      setBadgeCounts({
        restaurants: restaurantsRes.data.data.length || 0,
        deliveryPersons: deliveryRes.data.data.length || 0,
        complaints: complaintsRes.data.data.length || 0,
        notifications: (restaurantsRes.data.data.length || 0) + 
                      (deliveryRes.data.data.length || 0) + 
                      (complaintsRes.data.data.length || 0)
      });
    } catch (error) {
      console.error('Badge fetch error:', error);
    }
  };

  const toggleGroup = (groupName) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  const menuItems = [
    { 
      path: '/dashboard', 
      icon: LayoutDashboard, 
      label: 'Dashboard',
      description: 'Overview & Analytics'
    },
    { 
      path: '/users', 
      icon: Users, 
      label: 'Users',
      description: 'Manage Users'
    },
    { 
      path: '/restaurants', 
      icon: UtensilsCrossed, 
      label: 'Restaurants', 
      badge: badgeCounts.restaurants,
      description: 'Restaurant Management'
    },
    { 
      path: '/delivery-persons', 
      icon: Truck, 
      label: 'Delivery Persons', 
      badge: badgeCounts.deliveryPersons,
      description: 'Delivery Partners'
    },
    { 
      path: '/complaints', 
      icon: MessageSquare, 
      label: 'Complaints', 
      badge: badgeCounts.complaints,
      description: 'User Complaints'
    },
    { 
      path: '/reviews', 
      icon: Star, 
      label: 'Reviews',
      description: 'Customer Reviews'
    },
    { 
      path: '/notifications', 
      icon: Bell, 
      label: 'Notifications',
      badge: badgeCounts.notifications,
      description: 'All Notifications'
    },
    { 
      path: '/settings', 
      icon: Settings, 
      label: 'Settings',
      description: 'System Settings'
    },
  ];

  const handleProfileClick = () => {
    navigate('/profile');
    setIsMobileOpen(false);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  const closeMobileSidebar = () => {
    setIsMobileOpen(false);
  };

  // Calculate total badge count for mobile
  const totalBadgeCount = Object.values(badgeCounts).reduce((sum, count) => sum + count, 0);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        className="mobile-sidebar-toggle"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label="Toggle Menu"
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
        {totalBadgeCount > 0 && (
          <span className="mobile-badge-indicator">{totalBadgeCount}</span>
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="sidebar-overlay"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="logo-icon">🍽️</span>
            <span className="logo-text">Foodgram</span>
          </div>
          <p className="sidebar-subtitle">Admin Panel</p>
        </div>

        {/* Admin Info - Now Clickable */}
        <div 
          className="admin-info" 
          onClick={handleProfileClick}
          role="button"
          tabIndex={0}
        >
          <div className="admin-avatar">
            {admin?.fullName?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="admin-details">
            <p className="admin-name">{admin?.fullName || 'Admin'}</p>
            <p className="admin-email">{admin?.email}</p>
          </div>
          <ChevronRight size={16} className="admin-arrow" />
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="nav-section">
            <span className="nav-section-title">MAIN MENU</span>
            {menuItems.slice(0, 2).map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => 
                  `sidebar-link ${isActive ? 'active' : ''}`
                }
                onClick={closeMobileSidebar}
                title={item.description}
              >
                <item.icon className="sidebar-icon" size={20} />
                <div className="link-content">
                  <span className="link-label">{item.label}</span>
                  <span className="link-description">{item.description}</span>
                </div>
                {item.badge > 0 && (
                  <span className="badge bg-danger pulse">{item.badge}</span>
                )}
              </NavLink>
            ))}
          </div>

          <div className="nav-section">
            <span className="nav-section-title">MANAGEMENT</span>
            {menuItems.slice(2, 6).map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => 
                  `sidebar-link ${isActive ? 'active' : ''}`
                }
                onClick={closeMobileSidebar}
                title={item.description}
              >
                <item.icon className="sidebar-icon" size={20} />
                <div className="link-content">
                  <span className="link-label">{item.label}</span>
                  <span className="link-description">{item.description}</span>
                </div>
                {item.badge > 0 && (
                  <span className="badge bg-danger pulse">{item.badge}</span>
                )}
              </NavLink>
            ))}
          </div>

          <div className="nav-section">
            <span className="nav-section-title">SYSTEM</span>
            {menuItems.slice(6).map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => 
                  `sidebar-link ${isActive ? 'active' : ''}`
                }
                onClick={closeMobileSidebar}
                title={item.description}
              >
                <item.icon className="sidebar-icon" size={20} />
                <div className="link-content">
                  <span className="link-label">{item.label}</span>
                  <span className="link-description">{item.description}</span>
                </div>
                {item.badge > 0 && (
                  <span className="badge bg-warning pulse">{item.badge}</span>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <hr className="sidebar-divider" />
          
          {/* Status Indicator */}
          <div className="status-indicator">
            <span className="status-dot online"></span>
            <span className="status-text">Online</span>
            <span className="status-time">{new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>

          {/* Logout Button */}
          <button 
            className="sidebar-link logout-btn" 
            onClick={handleLogout}
          >
            <LogOut className="sidebar-icon" size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
