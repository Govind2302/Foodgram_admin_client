import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
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
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import './Sidebar.css';
import api from '../services/apiService';

function Sidebar() {
  const { logout, admin } = useAuth();

  const [badgeCounts, setBadgeCounts] = useState({
  restaurants: 0,
  deliveryPersons: 0,
  complaints: 0
});

useEffect(() => {
  fetchBadgeCounts();
}, []);

const fetchBadgeCounts = async () => {
  try {
    const [restaurantsRes, deliveryRes, complaintsRes] = await Promise.all([
      api.get('/admin/restaurants/pending'),
      api.get('/admin/delivery-persons/pending'),
      api.get('/admin/complaints/unresolved')
    ]);

    setBadgeCounts({
      restaurants: restaurantsRes.data.data.length,
      deliveryPersons: deliveryRes.data.data.length,
      complaints: complaintsRes.data.data.length
    });
  } catch (error) {
    console.error('Badge fetch error:', error);
  }
};



  const menuItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/users', icon: Users, label: 'Users' },

  { 
    path: '/restaurants', 
    icon: UtensilsCrossed, 
    label: 'Restaurants', 
    badge: badgeCounts.restaurants 
  },

  { 
    path: '/delivery-persons', 
    icon: Truck, 
    label: 'Delivery Persons', 
    badge: badgeCounts.deliveryPersons 
  },

  { path: '/orders', icon: ShoppingCart, label: 'Orders' },

  { 
    path: '/complaints', 
    icon: MessageSquare, 
    label: 'Complaints', 
    badge: badgeCounts.complaints 
  },

  { path: '/reviews', icon: Star, label: 'Reviews' },
  { path: '/notifications', icon: Bell, label: 'Notifications' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];


  return (
    <div className="sidebar">
      {/* Logo */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="logo-icon">🍽️</span>
          <span className="logo-text">Foodgram</span>
        </div>
        <p className="sidebar-subtitle">Admin Panel</p>
      </div>

      {/* Admin Info */}
      <div className="admin-info">
        <div className="admin-avatar">
          {admin?.fullName?.charAt(0) || 'A'}
        </div>
        <div className="admin-details">
          <p className="admin-name">{admin?.fullName || 'Admin'}</p>
          <p className="admin-email">{admin?.email}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <item.icon className="sidebar-icon" size={20} />
            <span>{item.label}</span>
            {item.badge > 0 && (
  <span className="badge bg-danger">{item.badge}</span>
)}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="sidebar-footer">
        <hr className="sidebar-divider" />
        <button className="sidebar-link logout-btn" onClick={logout}>
          <LogOut className="sidebar-icon" size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;