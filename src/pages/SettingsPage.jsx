import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { 
  Settings, 
  Bell, 
  Shield, 
  Globe, 
  Mail,
  Moon,
  Sun,
  Save,
  Database,
  Palette,
  Lock,
  CheckCircle,
  Users,
  AlertCircle
} from 'lucide-react';
import { toast } from 'react-toastify';
import './SettingsPage.css';

function SettingsPage() {
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'FoodDash Admin',
    siteDescription: 'Food Delivery Management System',
    contactEmail: 'admin@fooddash.com',
    timezone: 'Asia/Kolkata',
    language: 'en',
    dateFormat: 'DD/MM/YYYY',
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    newRestaurantAlert: true,
    newDeliveryPersonAlert: true,
    complaintAlert: true,
    reviewAlert: false,
    
    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: '30',
    passwordExpiry: '90',
    
    // Appearance
    theme: 'light',
    accentColor: '#667eea',
    
    // System Settings
    maintenanceMode: false,
    autoBackup: true,
    backupFrequency: 'daily',
  });

  const [activeTab, setActiveTab] = useState('general');

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = () => {
    toast.success('Settings saved successfully!');
  };

  const handleResetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      toast.success('Settings reset to default');
    }
  };

  return (
    <DashboardLayout>
      <div className="settings-page">
        {/* Header */}
        <div className="page-header mb-4">
          <div>
            <h2 className="page-title">
              <Settings size={28} className="me-2" />
              Settings
            </h2>
            <p className="page-subtitle">Manage your application settings and preferences</p>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-outline-secondary" onClick={handleResetSettings}>
              Reset to Default
            </button>
            <button className="btn btn-primary" onClick={handleSaveSettings}>
              <Save size={18} className="me-2" />
              Save Changes
            </button>
          </div>
        </div>

        <div className="row g-4">
          {/* Settings Navigation */}
          <div className="col-12 col-lg-3">
            <div className="settings-nav">
              <button
                className={`settings-nav-item ${activeTab === 'general' ? 'active' : ''}`}
                onClick={() => setActiveTab('general')}
              >
                <Globe size={20} />
                <span>General</span>
              </button>
              <button
                className={`settings-nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
                onClick={() => setActiveTab('notifications')}
              >
                <Bell size={20} />
                <span>Notifications</span>
              </button>
              <button
                className={`settings-nav-item ${activeTab === 'security' ? 'active' : ''}`}
                onClick={() => setActiveTab('security')}
              >
                <Shield size={20} />
                <span>Security</span>
              </button>
              <button
                className={`settings-nav-item ${activeTab === 'appearance' ? 'active' : ''}`}
                onClick={() => setActiveTab('appearance')}
              >
                <Palette size={20} />
                <span>Appearance</span>
              </button>
              <button
                className={`settings-nav-item ${activeTab === 'system' ? 'active' : ''}`}
                onClick={() => setActiveTab('system')}
              >
                <Database size={20} />
                <span>System</span>
              </button>
            </div>
          </div>

          {/* Settings Content */}
          <div className="col-12 col-lg-9">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="settings-content">
                <div className="card mb-4">
                  <div className="card-header">
                    <h5 className="card-title mb-0">General Settings</h5>
                  </div>
                  <div className="card-body">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">Site Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={settings.siteName}
                          onChange={(e) => handleSettingChange('siteName', e.target.value)}
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Contact Email</label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <Mail size={16} />
                          </span>
                          <input
                            type="email"
                            className="form-control"
                            value={settings.contactEmail}
                            onChange={(e) => handleSettingChange('contactEmail', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="col-12">
                        <label className="form-label">Site Description</label>
                        <textarea
                          className="form-control"
                          rows="3"
                          value={settings.siteDescription}
                          onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
                        ></textarea>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Timezone</label>
                        <select
                          className="form-select"
                          value={settings.timezone}
                          onChange={(e) => handleSettingChange('timezone', e.target.value)}
                        >
                          <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                          <option value="America/New_York">America/New York (EST)</option>
                          <option value="Europe/London">Europe/London (GMT)</option>
                          <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Date Format</label>
                        <select
                          className="form-select"
                          value={settings.dateFormat}
                          onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
                        >
                          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Language</label>
                        <select
                          className="form-select"
                          value={settings.language}
                          onChange={(e) => handleSettingChange('language', e.target.value)}
                        >
                          <option value="en">English</option>
                          <option value="hi">Hindi</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div className="settings-content">
                <div className="card mb-4">
                  <div className="card-header">
                    <h5 className="card-title mb-0">Notification Preferences</h5>
                  </div>
                  <div className="card-body">
                    <div className="setting-item">
                      <div className="setting-info">
                        <h6>Email Notifications</h6>
                        <p className="text-muted small mb-0">Receive notifications via email</p>
                      </div>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={settings.emailNotifications}
                          onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                        />
                      </div>
                    </div>

                    <div className="setting-item">
                      <div className="setting-info">
                        <h6>Push Notifications</h6>
                        <p className="text-muted small mb-0">Receive browser push notifications</p>
                      </div>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={settings.pushNotifications}
                          onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                        />
                      </div>
                    </div>

                    <hr />

                    <h6 className="mb-3">Alert Types</h6>

                    <div className="setting-item">
                      <div className="setting-info">
                        <h6>New Restaurant Alerts</h6>
                        <p className="text-muted small mb-0">Get notified when a new restaurant registers</p>
                      </div>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={settings.newRestaurantAlert}
                          onChange={(e) => handleSettingChange('newRestaurantAlert', e.target.checked)}
                        />
                      </div>
                    </div>

                    <div className="setting-item">
                      <div className="setting-info">
                        <h6>New Delivery Person Alerts</h6>
                        <p className="text-muted small mb-0">Get notified about new delivery person applications</p>
                      </div>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={settings.newDeliveryPersonAlert}
                          onChange={(e) => handleSettingChange('newDeliveryPersonAlert', e.target.checked)}
                        />
                      </div>
                    </div>

                    <div className="setting-item">
                      <div className="setting-info">
                        <h6>Complaint Alerts</h6>
                        <p className="text-muted small mb-0">Get notified about new user complaints</p>
                      </div>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={settings.complaintAlert}
                          onChange={(e) => handleSettingChange('complaintAlert', e.target.checked)}
                        />
                      </div>
                    </div>

                    <div className="setting-item">
                      <div className="setting-info">
                        <h6>Review Alerts</h6>
                        <p className="text-muted small mb-0">Get notified about new reviews</p>
                      </div>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={settings.reviewAlert}
                          onChange={(e) => handleSettingChange('reviewAlert', e.target.checked)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="settings-content">
                <div className="card mb-4">
                  <div className="card-header">
                    <h5 className="card-title mb-0">Security Settings</h5>
                  </div>
                  <div className="card-body">
                    <div className="setting-item">
                      <div className="setting-info">
                        <h6>Two-Factor Authentication</h6>
                        <p className="text-muted small mb-0">Add an extra layer of security to your account</p>
                      </div>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={settings.twoFactorAuth}
                          onChange={(e) => handleSettingChange('twoFactorAuth', e.target.checked)}
                        />
                      </div>
                    </div>

                    <div className="row g-3 mt-3">
                      <div className="col-md-6">
                        <label className="form-label">Session Timeout (minutes)</label>
                        <input
                          type="number"
                          className="form-control"
                          value={settings.sessionTimeout}
                          onChange={(e) => handleSettingChange('sessionTimeout', e.target.value)}
                        />
                        <small className="text-muted">Auto logout after inactivity</small>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Password Expiry (days)</label>
                        <input
                          type="number"
                          className="form-control"
                          value={settings.passwordExpiry}
                          onChange={(e) => handleSettingChange('passwordExpiry', e.target.value)}
                        />
                        <small className="text-muted">Force password change after</small>
                      </div>
                    </div>

                    <div className="alert alert-info mt-4 d-flex align-items-center">
                      <AlertCircle size={20} className="me-2" />
                      <div>
                        <strong>Security Tip:</strong> Enable two-factor authentication for better account security.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance Settings */}
            {activeTab === 'appearance' && (
              <div className="settings-content">
                <div className="card mb-4">
                  <div className="card-header">
                    <h5 className="card-title mb-0">Appearance Settings</h5>
                  </div>
                  <div className="card-body">
                    <div className="mb-4">
                      <label className="form-label">Theme</label>
                      <div className="theme-options">
                        <div
                          className={`theme-option ${settings.theme === 'light' ? 'active' : ''}`}
                          onClick={() => handleSettingChange('theme', 'light')}
                        >
                          <Sun size={24} />
                          <span>Light</span>
                          {settings.theme === 'light' && <CheckCircle className="check-icon" size={20} />}
                        </div>
                        <div
                          className={`theme-option ${settings.theme === 'dark' ? 'active' : ''}`}
                          onClick={() => handleSettingChange('theme', 'dark')}
                        >
                          <Moon size={24} />
                          <span>Dark</span>
                          {settings.theme === 'dark' && <CheckCircle className="check-icon" size={20} />}
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="form-label">Accent Color</label>
                      <div className="color-options">
                        {['#667eea', '#56ab2f', '#f2994a', '#dc3545', '#0dcaf0'].map(color => (
                          <div
                            key={color}
                            className={`color-option ${settings.accentColor === color ? 'active' : ''}`}
                            style={{ backgroundColor: color }}
                            onClick={() => handleSettingChange('accentColor', color)}
                          >
                            {settings.accentColor === color && <CheckCircle size={20} />}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* System Settings */}
            {activeTab === 'system' && (
              <div className="settings-content">
                <div className="card mb-4">
                  <div className="card-header">
                    <h5 className="card-title mb-0">System Settings</h5>
                  </div>
                  <div className="card-body">
                    <div className="setting-item">
                      <div className="setting-info">
                        <h6>Maintenance Mode</h6>
                        <p className="text-muted small mb-0">Enable maintenance mode to restrict access</p>
                      </div>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={settings.maintenanceMode}
                          onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
                        />
                      </div>
                    </div>

                    <div className="setting-item">
                      <div className="setting-info">
                        <h6>Automatic Backup</h6>
                        <p className="text-muted small mb-0">Automatically backup data</p>
                      </div>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={settings.autoBackup}
                          onChange={(e) => handleSettingChange('autoBackup', e.target.checked)}
                        />
                      </div>
                    </div>

                    <div className="mt-3">
                      <label className="form-label">Backup Frequency</label>
                      <select
                        className="form-select"
                        value={settings.backupFrequency}
                        onChange={(e) => handleSettingChange('backupFrequency', e.target.value)}
                        disabled={!settings.autoBackup}
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>

                    <div className="alert alert-warning mt-4 d-flex align-items-center">
                      <AlertCircle size={20} className="me-2" />
                      <div>
                        <strong>Warning:</strong> Enabling maintenance mode will make the site inaccessible to users.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default SettingsPage;
