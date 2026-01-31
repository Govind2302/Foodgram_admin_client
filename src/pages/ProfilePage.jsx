import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Camera, 
  Save, 
  Key,
  MapPin,
  Calendar,
  Lock,
  Loader2,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from 'react-toastify';
import './ProfilePage.css';

function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profile, setProfile] = useState({
    fullName: 'Admin User',
    email: 'admin@fooddash.com',
    phone: '+91 98765 43210',
    role: 'Super Admin',
    status: 'Active',
    joinedDate: 'January 15, 2024',
    location: 'Mumbai, Maharashtra',
  });

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const handleSaveProfile = () => {
    toast.success('Profile updated successfully!');
    setIsEditing(false);
  };

  const handleChangePassword = () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      toast.error('Please fill all password fields');
      return;
    }
    if (passwords.new !== passwords.confirm) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwords.new.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    toast.success('Password changed successfully!');
    setPasswords({ current: '', new: '', confirm: '' });
    setShowPasswordModal(false);
  };

  const recentActivity = [
    { device: 'Chrome on Windows', location: 'Mumbai, India', time: '2 hours ago', current: true },
    { device: 'Safari on iPhone', location: 'Mumbai, India', time: 'Yesterday at 3:42 PM', current: false },
    { device: 'Chrome on MacBook', location: 'Pune, India', time: '3 days ago', current: false },
  ];

  return (
    <DashboardLayout>
      <div className="profile-page">
        {/* Header */}
        <div className="page-header mb-4">
          <div>
            <h2 className="page-title">
              <User size={28} className="me-2" />
              My Profile
            </h2>
            <p className="page-subtitle">Manage your account information and settings</p>
          </div>
        </div>

        {/* Profile Header Card */}
        <div className="card profile-header-card mb-4">
          <div className="card-body">
            <div className="row align-items-center">
              <div className="col-auto">
                <div className="profile-avatar-wrapper">
                  <div className="profile-avatar">
                    {profile.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                  <button className="avatar-upload-btn" title="Change Avatar">
                    <Camera size={16} />
                  </button>
                </div>
              </div>
              <div className="col">
                <h3 className="profile-name">{profile.fullName}</h3>
                <p className="profile-email">{profile.email}</p>
                <div className="d-flex gap-2 flex-wrap mt-2">
                  <span className="profile-badge role-badge">
                    <Shield size={14} className="me-1" />
                    {profile.role}
                  </span>
                  <span className="profile-badge status-badge">
                    {profile.status}
                  </span>
                </div>
              </div>
              <div className="col-auto">
                <button
                  className={`btn ${isEditing ? 'btn-outline-secondary' : 'btn-primary'}`}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4">
          {/* Personal Information */}
          <div className="col-12 col-lg-8">
            <div className="card h-100">
              <div className="card-header">
                <h5 className="card-title mb-0 d-flex align-items-center">
                  <User size={20} className="text-primary me-2" />
                  Personal Information
                </h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={profile.fullName}
                      onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Email Address</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <Mail size={16} />
                      </span>
                      <input
                        type="email"
                        className="form-control"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Phone Number</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <Phone size={16} />
                      </span>
                      <input
                        type="tel"
                        className="form-control"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Location</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <MapPin size={16} />
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        value={profile.location}
                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Joined Date</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <Calendar size={16} />
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        value={profile.joinedDate}
                        disabled
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Role</label>
                    <input
                      type="text"
                      className="form-control"
                      value={profile.role}
                      disabled
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                    <button
                      className="btn btn-secondary"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={handleSaveProfile}
                    >
                      <Save size={16} className="me-1" />
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Security & Settings */}
          <div className="col-12 col-lg-4">
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="card-title mb-0 d-flex align-items-center">
                  <Key size={20} className="text-primary me-2" />
                  Security
                </h5>
              </div>
              <div className="card-body">
                <button
                  className="btn btn-outline-primary w-100 mb-3"
                  onClick={() => setShowPasswordModal(true)}
                >
                  <Lock size={16} className="me-2" />
                  Change Password
                </button>

                <div className="security-option">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <p className="mb-0 fw-bold">Two-Factor Auth</p>
                      <small className="text-muted">Extra security layer</small>
                    </div>
                    <button className="btn btn-sm btn-outline-secondary">
                      Enable
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">Account Stats</h5>
              </div>
              <div className="card-body">
                <div className="stat-item">
                  <span className="stat-label">Login Sessions</span>
                  <span className="stat-value">3 Active</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Last Login</span>
                  <span className="stat-value">2 hours ago</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Account Status</span>
                  <span className="badge bg-success">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card mt-4">
          <div className="card-header">
            <h5 className="card-title mb-0">Recent Activity</h5>
          </div>
          <div className="card-body">
            <div className="activity-list">
              {recentActivity.map((session, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-info">
                    <p className="activity-device">
                      {session.device}
                      {session.current && (
                        <span className="badge bg-success ms-2">Current</span>
                      )}
                    </p>
                    <p className="activity-details">
                      <MapPin size={14} className="me-1" />
                      {session.location} • {session.time}
                    </p>
                  </div>
                  {!session.current && (
                    <button className="btn btn-sm btn-outline-danger">
                      Revoke
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Change Password Modal */}
        {showPasswordModal && (
          <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <Key size={20} className="me-2" />
                    Change Password
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowPasswordModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Current Password</label>
                    <div className="input-group">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        className="form-control"
                        value={passwords.current}
                        onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                        placeholder="Enter current password"
                      />
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <hr />

                  <div className="mb-3">
                    <label className="form-label">New Password</label>
                    <div className="input-group">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        className="form-control"
                        value={passwords.new}
                        onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                        placeholder="Enter new password"
                      />
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    <small className="text-muted">Must be at least 8 characters</small>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Confirm New Password</label>
                    <div className="input-group">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        className="form-control"
                        value={passwords.confirm}
                        onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                        placeholder="Confirm new password"
                      />
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowPasswordModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleChangePassword}
                  >
                    <Key size={16} className="me-1" />
                    Update Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default ProfilePage;
