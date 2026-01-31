import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import DashboardLayout from '../components/DashboardLayout.jsx';
import StatCard from '../components/StatCard.jsx';
import DailyNotes from '../components/DailyNotes.jsx';
import { getDashboardStats } from '../services/dashboardService';
import api from '../services/apiService';
import {
  Users,
  UtensilsCrossed,
  Truck,
  MessageSquare,
  Star,
  Clock,
  Loader2,
  TrendingUp,
  Activity,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import './DashboardPage.css';

function Dashboard() {
  const { admin } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRestaurants: 0,
    pendingRestaurants: 0,
    totalDeliveryPersons: 0,
    pendingDeliveryPersons: 0,
    totalComplaints: 0,
    newComplaints: 0,
    totalReviews: 0,
  });

  const [currentTime, setCurrentTime] = useState(new Date());

  const fetchStats = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error("Dashboard stats load failed:", err);
    }
  };   

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    fetchStats();

    // Simulate loading
    setTimeout(() => setLoading(false), 500);

    return () => clearInterval(timer);
  }, []);

  const formatDate = () => {
    return currentTime.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = () => {
    return currentTime.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <Loader2 size={48} className="text-primary mb-3 spinner" />
            <p className="text-muted">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="dashboard-page">
        {/* Enhanced Welcome Header */}
        <div className="welcome-section mb-4">
          <div className="welcome-content">
            <div className="greeting-badge">
              <Sparkles size={16} />
              <span>{getGreeting()}</span>
            </div>
            <h1 className="dashboard-title">
              Welcome back, {admin?.fullName}! 👋
            </h1>
            <p className="dashboard-subtitle">
              <Clock size={16} className="me-2" />
              {formatDate()} • {formatTime()}
            </p>
          </div>
          <div className="welcome-stats">
            <div className="mini-stat">
              <Activity size={20} />
              <div>
                <div className="mini-stat-value">{stats.totalUsers + stats.totalRestaurants}</div>
                <div className="mini-stat-label">Total Entities</div>
              </div>
            </div>
            <div className="mini-stat">
              <TrendingUp size={20} />
              <div>
                <div className="mini-stat-value">{stats.pendingRestaurants + stats.pendingDeliveryPersons}</div>
                <div className="mini-stat-label">Pending Actions</div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Quick Stats */}
        <div className="row g-4 mb-4">
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="stat-card-enhanced primary">
              <div className="stat-card-icon">
                <Users size={24} />
              </div>
              <div className="stat-card-content">
                <div className="stat-card-value">{stats.totalUsers}</div>
                <div className="stat-card-label">Total Users</div>
                <div className="stat-card-trend">
                  <TrendingUp size={14} />
                  <span>12% from last month</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="stat-card-enhanced success">
              <div className="stat-card-icon">
                <UtensilsCrossed size={24} />
              </div>
              <div className="stat-card-content">
                <div className="stat-card-value">{stats.totalRestaurants}</div>
                <div className="stat-card-label">Restaurants</div>
                <div className="stat-card-trend">
                  <TrendingUp size={14} />
                  <span>8% from last month</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="stat-card-enhanced info">
              <div className="stat-card-icon">
                <Truck size={24} />
              </div>
              <div className="stat-card-content">
                <div className="stat-card-value">{stats.totalDeliveryPersons}</div>
                <div className="stat-card-label">Delivery Persons</div>
                <div className="stat-card-trend">
                  <TrendingUp size={14} />
                  <span>15% from last month</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="stat-card-enhanced warning">
              <div className="stat-card-icon">
                <Clock size={24} />
              </div>
              <div className="stat-card-content">
                <div className="stat-card-value">{stats.pendingRestaurants}</div>
                <div className="stat-card-label">Pending Approvals</div>
                {stats.pendingRestaurants > 0 && (
                  <div className="stat-card-badge">Needs Attention</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Activity Overview */}
        <div className="row g-4 mb-4">
          <div className="col-12 col-md-6 col-lg-3">
            <div className="activity-card">
              <div className="activity-icon bg-primary-gradient">
                <CheckCircle size={20} />
              </div>
              <div className="activity-content">
                <div className="activity-value">{stats.totalRestaurants - stats.pendingRestaurants}</div>
                <div className="activity-label">Approved Restaurants</div>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-3">
            <div className="activity-card">
              <div className="activity-icon bg-success-gradient">
                <Star size={20} />
              </div>
              <div className="activity-content">
                <div className="activity-value">{stats.totalReviews}</div>
                <div className="activity-label">Total Reviews</div>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-3">
            <div className="activity-card">
              <div className="activity-icon bg-warning-gradient">
                <MessageSquare size={20} />
              </div>
              <div className="activity-content">
                <div className="activity-value">{stats.totalComplaints}</div>
                <div className="activity-label">Total Complaints</div>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-3">
            <div className="activity-card">
              <div className="activity-icon bg-danger-gradient">
                <AlertCircle size={20} />
              </div>
              <div className="activity-content">
                <div className="activity-value">{stats.newComplaints || 0}</div>
                <div className="activity-label">New Complaints</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Row */}
        <div className="row g-4">
          {/* Daily Notes - Takes 60% width */}
          <div className="col-12 col-lg-7">
            <DailyNotes />
          </div>

          {/* Quick Actions - Takes 40% width */}
          <div className="col-12 col-lg-5">
            <div className="card dashboard-card-enhanced h-100">
              <div className="card-body">
                <div className="card-header-custom mb-4">
                  <h5 className="card-title-custom">
                    <Sparkles size={20} className="me-2" />
                    Quick Actions
                  </h5>
                  <p className="card-subtitle-custom">Manage your platform efficiently</p>
                </div>
                
                <div className="quick-actions-list">
                  <button className="quick-action-btn primary">
                    <div className="quick-action-icon">
                      <UtensilsCrossed size={20} />
                    </div>
                    <div className="quick-action-content">
                      <div className="quick-action-title">Pending Restaurants</div>
                      <div className="quick-action-subtitle">Review new registrations</div>
                    </div>
                    <div className="quick-action-meta">
                      {stats.pendingRestaurants > 0 && (
                        <span className="action-badge warning">{stats.pendingRestaurants}</span>
                      )}
                      <ArrowRight size={18} />
                    </div>
                  </button>
                  
                  <button className="quick-action-btn success">
                    <div className="quick-action-icon">
                      <Truck size={20} />
                    </div>
                    <div className="quick-action-content">
                      <div className="quick-action-title">Delivery Persons</div>
                      <div className="quick-action-subtitle">Manage delivery partners</div>
                    </div>
                    <div className="quick-action-meta">
                      <ArrowRight size={18} />
                    </div>
                  </button>
                  
                  <button className="quick-action-btn info">
                    <div className="quick-action-icon">
                      <Users size={20} />
                    </div>
                    <div className="quick-action-content">
                      <div className="quick-action-title">User Management</div>
                      <div className="quick-action-subtitle">View all platform users</div>
                    </div>
                    <div className="quick-action-meta">
                      <ArrowRight size={18} />
                    </div>
                  </button>
                  
                  <button className="quick-action-btn warning">
                    <div className="quick-action-icon">
                      <MessageSquare size={20} />
                    </div>
                    <div className="quick-action-content">
                      <div className="quick-action-title">Complaints</div>
                      <div className="quick-action-subtitle">Review user complaints</div>
                    </div>
                    <div className="quick-action-meta">
                      {stats.newComplaints > 0 && (
                        <span className="action-badge danger">{stats.newComplaints}</span>
                      )}
                      <ArrowRight size={18} />
                    </div>
                  </button>
                  
                  <button className="quick-action-btn secondary">
                    <div className="quick-action-icon">
                      <Star size={20} />
                    </div>
                    <div className="quick-action-content">
                      <div className="quick-action-title">Reviews & Ratings</div>
                      <div className="quick-action-subtitle">Monitor feedback</div>
                    </div>
                    <div className="quick-action-meta">
                      <ArrowRight size={18} />
                    </div>
                  </button>
                </div>

                <div className="system-info-card">
                  <h6 className="system-info-title">
                    <Activity size={16} className="me-2" />
                    System Information
                  </h6>
                  <div className="system-info-grid">
                    <div className="system-info-item">
                      <span className="system-info-label">Role</span>
                      <span className="system-badge primary">{admin?.role}</span>
                    </div>
                    <div className="system-info-item">
                      <span className="system-info-label">Status</span>
                      <span className="system-badge success">{admin?.status}</span>
                    </div>
                    <div className="system-info-item full-width">
                      <span className="system-info-label">Email</span>
                      <span className="system-info-value">{admin?.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Info Cards */}
        <div className="row g-4 mt-2">
          <div className="col-12 col-md-6 col-lg-4">
            <div className="feature-card">
              <div className="feature-card-glow primary"></div>
              <div className="feature-icon-wrapper">
                <div className="feature-icon bg-primary-gradient">
                  <UtensilsCrossed size={32} />
                </div>
              </div>
              <h6 className="feature-title">Restaurant Management</h6>
              <p className="feature-description">
                Verify new restaurants, manage menus, and monitor restaurant performance across the platform
              </p>
              <div className="feature-stats">
                <div className="feature-stat">
                  <CheckCircle size={16} />
                  <span>{stats.totalRestaurants - stats.pendingRestaurants} Active</span>
                </div>
                <div className="feature-stat">
                  <Clock size={16} />
                  <span>{stats.pendingRestaurants} Pending</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-4">
            <div className="feature-card">
              <div className="feature-card-glow success"></div>
              <div className="feature-icon-wrapper">
                <div className="feature-icon bg-success-gradient">
                  <Truck size={32} />
                </div>
              </div>
              <h6 className="feature-title">Delivery Management</h6>
              <p className="feature-description">
                Onboard delivery partners, track deliveries in real-time, and ensure efficient order fulfillment
              </p>
              <div className="feature-stats">
                <div className="feature-stat">
                  <CheckCircle size={16} />
                  <span>{stats.totalDeliveryPersons - stats.pendingDeliveryPersons} Active</span>
                </div>
                <div className="feature-stat">
                  <Clock size={16} />
                  <span>{stats.pendingDeliveryPersons} Pending</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-4">
            <div className="feature-card">
              <div className="feature-card-glow warning"></div>
              <div className="feature-icon-wrapper">
                <div className="feature-icon bg-warning-gradient">
                  <Users size={32} />
                </div>
              </div>
              <h6 className="feature-title">User Management</h6>
              <p className="feature-description">
                Manage all platform users, handle permissions, and maintain a secure user ecosystem
              </p>
              <div className="feature-stats">
                <div className="feature-stat">
                  <Users size={16} />
                  <span>{stats.totalUsers} Total Users</span>
                </div>
                <div className="feature-stat">
                  <Activity size={16} />
                  <span>Active Today</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
