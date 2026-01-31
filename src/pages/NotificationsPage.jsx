import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { 
  Bell, 
  Check, 
  Trash2, 
  UtensilsCrossed, 
  Truck, 
  MessageSquare, 
  Star, 
  AlertCircle,
  CheckCheck,
  Filter
} from 'lucide-react';
import { toast } from 'react-toastify';
import './NotificationsPage.css';

function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'new_restaurant',
      title: 'New Restaurant Registration',
      message: 'Spice Garden has registered and is awaiting verification.',
      createdAt: '2 hours ago',
      isRead: false,
    },
    {
      id: 2,
      type: 'new_delivery_person',
      title: 'New Delivery Person',
      message: 'Rajesh Kumar has applied to become a delivery partner.',
      createdAt: '5 hours ago',
      isRead: false,
    },
    {
      id: 3,
      type: 'new_complaint',
      title: 'New Complaint Received',
      message: 'User Sarah Johnson has filed a complaint about Order #12345.',
      createdAt: 'Yesterday at 3:30 PM',
      isRead: true,
    },
    {
      id: 4,
      type: 'new_review',
      title: 'New Review Posted',
      message: 'A 5-star review was posted for The Food Court.',
      createdAt: 'Yesterday at 2:15 PM',
      isRead: true,
    },
    {
      id: 5,
      type: 'system',
      title: 'System Update',
      message: 'Platform maintenance scheduled for this weekend.',
      createdAt: '2 days ago',
      isRead: true,
    },
    {
      id: 6,
      type: 'new_complaint',
      title: 'Complaint Escalated',
      message: 'Complaint #789 has been escalated and requires immediate attention.',
      createdAt: '2 days ago',
      isRead: false,
    },
  ]);

  const [filterType, setFilterType] = useState('all');

  const notificationIcons = {
    new_restaurant: UtensilsCrossed,
    new_delivery_person: Truck,
    new_complaint: MessageSquare,
    new_review: Star,
    system: AlertCircle,
  };

  const notificationColors = {
    new_restaurant: 'warning',
    new_delivery_person: 'info',
    new_complaint: 'danger',
    new_review: 'success',
    system: 'secondary',
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const filteredNotifications = notifications.filter(n => {
    if (filterType === 'all') return true;
    if (filterType === 'unread') return !n.isRead;
    return n.type === filterType;
  });

  const handleMarkAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
    toast.success('Marked as read');
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    toast.success('All notifications marked as read');
  };

  const handleDelete = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.success('Notification deleted');
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all notifications?')) {
      setNotifications([]);
      toast.success('All notifications cleared');
    }
  };

  return (
    <DashboardLayout>
      <div className="notifications-page">
        {/* Header */}
        <div className="page-header mb-4">
          <div>
            <h2 className="page-title">
              <Bell size={28} className="me-2" />
              Notifications
              {unreadCount > 0 && (
                <span className="unread-badge">{unreadCount}</span>
              )}
            </h2>
            <p className="page-subtitle">
              {unreadCount > 0 
                ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                : 'All caught up! No new notifications'}
            </p>
          </div>
          <div className="d-flex gap-2">
            {unreadCount > 0 && (
              <button 
                className="btn btn-outline-primary"
                onClick={handleMarkAllAsRead}
              >
                <CheckCheck size={18} className="me-2" />
                Mark All Read
              </button>
            )}
            {notifications.length > 0 && (
              <button 
                className="btn btn-outline-danger"
                onClick={handleClearAll}
              >
                <Trash2 size={18} className="me-2" />
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="row g-3 mb-4">
          <div className="col-6 col-md-3">
            <div className="notification-stat-card" onClick={() => setFilterType('all')}>
              <div className="stat-icon all">
                <Bell size={20} />
              </div>
              <div className="stat-content">
                <h4>{notifications.length}</h4>
                <p>All</p>
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="notification-stat-card" onClick={() => setFilterType('unread')}>
              <div className="stat-icon unread">
                <AlertCircle size={20} />
              </div>
              <div className="stat-content">
                <h4>{unreadCount}</h4>
                <p>Unread</p>
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="notification-stat-card" onClick={() => setFilterType('new_restaurant')}>
              <div className="stat-icon restaurant">
                <UtensilsCrossed size={20} />
              </div>
              <div className="stat-content">
                <h4>{notifications.filter(n => n.type === 'new_restaurant').length}</h4>
                <p>Restaurants</p>
              </div>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="notification-stat-card" onClick={() => setFilterType('new_complaint')}>
              <div className="stat-icon complaint">
                <MessageSquare size={20} />
              </div>
              <div className="stat-content">
                <h4>{notifications.filter(n => n.type === 'new_complaint').length}</h4>
                <p>Complaints</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="card mb-4">
          <div className="card-body">
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <Filter size={18} className="text-muted" />
              <span className="text-muted me-2">Filter:</span>
              <button
                className={`btn btn-sm ${filterType === 'all' ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setFilterType('all')}
              >
                All
              </button>
              <button
                className={`btn btn-sm ${filterType === 'unread' ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setFilterType('unread')}
              >
                Unread
              </button>
              <button
                className={`btn btn-sm ${filterType === 'new_restaurant' ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setFilterType('new_restaurant')}
              >
                Restaurants
              </button>
              <button
                className={`btn btn-sm ${filterType === 'new_delivery_person' ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setFilterType('new_delivery_person')}
              >
                Delivery
              </button>
              <button
                className={`btn btn-sm ${filterType === 'new_complaint' ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setFilterType('new_complaint')}
              >
                Complaints
              </button>
              <button
                className={`btn btn-sm ${filterType === 'new_review' ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setFilterType('new_review')}
              >
                Reviews
              </button>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="notifications-list">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => {
              const Icon = notificationIcons[notification.type];
              const colorClass = notificationColors[notification.type];

              return (
                <div
                  key={notification.id}
                  className={`notification-card ${!notification.isRead ? 'unread' : ''}`}
                >
                  <div className="notification-indicator"></div>
                  
                  <div className={`notification-icon bg-${colorClass}`}>
                    <Icon size={20} />
                  </div>

                  <div className="notification-content">
                    <div className="notification-header">
                      <h5 className="notification-title">{notification.title}</h5>
                      {!notification.isRead && (
                        <span className="badge bg-primary">New</span>
                      )}
                    </div>
                    <p className="notification-message">{notification.message}</p>
                    <small className="notification-time">{notification.createdAt}</small>
                  </div>

                  <div className="notification-actions">
                    {!notification.isRead && (
                      <button
                        className="btn btn-sm btn-outline-success"
                        onClick={() => handleMarkAsRead(notification.id)}
                        title="Mark as read"
                      >
                        <Check size={16} />
                      </button>
                    )}
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(notification.id)}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="empty-state">
              <Bell size={64} className="text-muted mb-3" />
              <h4 className="text-muted">No notifications</h4>
              <p className="text-muted">
                {filterType === 'all' 
                  ? "You're all caught up!" 
                  : `No ${filterType.replace('_', ' ')} notifications`}
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default NotificationsPage;
