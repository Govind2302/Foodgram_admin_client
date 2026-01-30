import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import DashboardLayout from '../components/DashboardLayout.jsx';
import StatCard from '../components/StatCard.jsx';
import DailyNotes from '../components/DailyNotes.jsx';
import {
  Users,
  UtensilsCrossed,
  Truck,
  MessageSquare,
  Star,
  Clock,
  Loader2,
} from 'lucide-react';
import './DashboardPage.css';

function Dashboard() {
  const { admin } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

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

  if (loading) {
    return (
      <DashboardLayout>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <Loader2 size={48} className="text-primary mb-3" style={{ animation: 'spin 1s linear infinite' }} />
            <p className="text-muted">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="dashboard-page">
        {/* Welcome Header with Date & Time */}
        <div className="welcome-section mb-4">
          <div>
            <h1 className="dashboard-title">Welcome back, {admin?.fullName}! 👋</h1>
            <p className="dashboard-subtitle">{formatDate()}</p>
          </div>
          <div className="current-time">
            <Clock size={20} className="me-2" />
            <span className="time-display">{formatTime()}</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="row g-4 mb-4">
          <div className="col-12 col-sm-6 col-lg-3">
            <StatCard
              title="Total Users"
              value="6"
              icon={Users}
              variant="primary"
            />
          </div>
          <div className="col-12 col-sm-6 col-lg-3">
            <StatCard
              title="Restaurants"
              value="2"
              icon={UtensilsCrossed}
              variant="success"
            />
          </div>
          <div className="col-12 col-sm-6 col-lg-3">
            <StatCard
              title="Delivery Persons"
              value="2"
              icon={Truck}
              variant="info"
            />
          </div>
          <div className="col-12 col-sm-6 col-lg-3">
            <StatCard
              title="Pending Verifications"
              value="1"
              icon={Clock}
              variant="warning"
            />
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
            <div className="card dashboard-card h-100">
              <div className="card-body">
                <h5 className="card-title mb-4">⚡ Quick Actions</h5>
                
                <div className="d-grid gap-3">
                  <button className="btn btn-outline-primary text-start">
                    <UtensilsCrossed size={18} className="me-2" />
                    View Pending Restaurants
                    <span className="badge bg-warning float-end">1</span>
                  </button>
                  
                  <button className="btn btn-outline-success text-start">
                    <Truck size={18} className="me-2" />
                    View Delivery Persons
                  </button>
                  
                  <button className="btn btn-outline-info text-start">
                    <Users size={18} className="me-2" />
                    Manage Users
                  </button>
                  
                  <button className="btn btn-outline-warning text-start">
                    <MessageSquare size={18} className="me-2" />
                    View Complaints
                  </button>
                  
                  <button className="btn btn-outline-secondary text-start">
                    <Star size={18} className="me-2" />
                    View Reviews
                  </button>
                </div>

                <hr className="my-4" />

                <div className="system-info">
                  <h6 className="text-muted mb-3">System Info</h6>
                  <div className="d-flex justify-content-between mb-2">
                    <small className="text-muted">Role:</small>
                    <span className="badge bg-primary">{admin?.role}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <small className="text-muted">Status:</small>
                    <span className="badge bg-success">{admin?.status}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <small className="text-muted">Email:</small>
                    <small className="fw-bold">{admin?.email}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="row g-4 mt-2">
          <div className="col-12 col-md-6 col-lg-4">
            <div className="info-card card dashboard-card">
              <div className="card-body text-center">
                <div className="info-icon bg-primary-light mb-3">
                  <UtensilsCrossed size={32} className="text-primary" />
                </div>
                <h6 className="fw-bold">Restaurant Management</h6>
                <p className="text-muted small mb-0">
                  Verify new restaurants and manage existing ones
                </p>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-4">
            <div className="info-card card dashboard-card">
              <div className="card-body text-center">
                <div className="info-icon bg-success-light mb-3">
                  <Truck size={32} className="text-success" />
                </div>
                <h6 className="fw-bold">Delivery Management</h6>
                <p className="text-muted small mb-0">
                  Verify delivery persons and track deliveries
                </p>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-4">
            <div className="info-card card dashboard-card">
              <div className="card-body text-center">
                <div className="info-icon bg-warning-light mb-3">
                  <Users size={32} className="text-warning" />
                </div>
                <h6 className="fw-bold">User Management</h6>
                <p className="text-muted small mb-0">
                  Manage all users and their permissions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;