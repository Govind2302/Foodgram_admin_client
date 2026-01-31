import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { 
  Eye, 
  Pencil, 
  Trash2, 
  UserCheck,
  UserX,
  Users,
  Loader2,
  Search,
  Ban,
  CheckCircle
} from 'lucide-react';
import { 
  getAllUsers, 
  getUserById,
  updateUser,
  updateUserStatus,
  deleteUser
} from '../services/userService';
import { toast } from 'react-toastify';
import './UsersPage.css';

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({});

  // Fetch users
  useEffect(() => {
    fetchUsers();
  }, [currentPage, roleFilter, statusFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const role = roleFilter !== 'all' ? roleFilter : null;
      const status = statusFilter !== 'all' ? statusFilter : null;
      
      const data = await getAllUsers(currentPage, 20, role, status);
      setUsers(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter by search term (client-side)
  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleView = async (user) => {
    try {
      const data = await getUserById(user.userId);
      setSelectedUser(data);
      setShowViewModal(true);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const handleEdit = (user) => {
    setEditFormData({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      await updateUser(selectedUser.userId, editFormData);
      setShowEditModal(false);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleStatusChange = async (user, newStatus) => {
    try {
      await updateUserStatus(user.userId, newStatus);
      fetchUsers();
      setShowViewModal(false);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDelete = async (user) => {
    if (window.confirm(`Are you sure you want to delete ${user.fullName}?`)) {
      try {
        await deleteUser(user.userId);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const getRoleBadgeClass = (role) => {
    const badges = {
      customer: 'primary',
      restaurant_owner: 'success',
      delivery_person: 'info',
      admin: 'danger',
    };
    return badges[role?.toLowerCase()] || 'secondary';
  };

  const getStatusBadgeClass = (status) => {
    const badges = {
      active: 'success',
      inactive: 'secondary',
      suspended: 'danger',
    };
    return badges[status?.toLowerCase()] || 'secondary';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  if (loading && users.length === 0) {
    return (
      <DashboardLayout>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <Loader2 size={48} className="text-primary mb-3" style={{ animation: 'spin 1s linear infinite' }} />
            <p className="text-muted">Loading users...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="users-page">
        {/* Header */}
        <div className="page-header mb-4">
          <div>
            <h2 className="page-title">
              <Users size={28} className="me-2" />
              User Management
            </h2>
            <p className="page-subtitle">Manage all users in the system</p>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-4">
          <div className="card-body">
            <div className="row g-3">
              {/* Search */}
              <div className="col-12 col-md-4">
                <div className="search-box">
                  <Search size={18} className="search-icon" />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Role Filter */}
              <div className="col-12 col-md-4">
                <select
                  className="form-select"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="all">All Roles</option>
                  <option value="customer">Customer</option>
                  <option value="restaurant_owner">Restaurant Owner</option>
                  <option value="delivery_person">Delivery Person</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="col-12 col-md-4">
                <select
                  className="form-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="stats-card stats-card-primary">
              <div className="stats-icon">
                <Users size={24} />
              </div>
              <div className="stats-content">
                <h3>{users.length}</h3>
                <p>Total Users</p>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="stats-card stats-card-success">
              <div className="stats-icon">
                <CheckCircle size={24} />
              </div>
              <div className="stats-content">
                <h3>{users.filter(u => u.status === 'active').length}</h3>
                <p>Active Users</p>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="stats-card stats-card-warning">
              <div className="stats-icon">
                <UserCheck size={24} />
              </div>
              <div className="stats-content">
                <h3>{users.filter(u => u.role === 'restaurant_owner').length}</h3>
                <p>Restaurant Owners</p>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="stats-card stats-card-info">
              <div className="stats-icon">
                <UserX size={24} />
              </div>
              <div className="stats-content">
                <h3>{users.filter(u => u.role === 'delivery_person').length}</h3>
                <p>Delivery Persons</p>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr key={user.userId}>
                        <td className="font-monospace">#{user.userId}</td>
                        <td className="fw-bold">{user.fullName}</td>
                        <td className="text-muted">{user.email}</td>
                        <td>{user.phone || 'N/A'}</td>
                        <td>
                          <span className={`badge bg-${getRoleBadgeClass(user.role)}`}>
                            {user.role?.replace('_', ' ')}
                          </span>
                        </td>
                        <td>
                          <span className={`badge bg-${getStatusBadgeClass(user.status)}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="text-muted small">{formatDate(user.createdAt)}</td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <button
                              className="btn btn-outline-primary"
                              onClick={() => handleView(user)}
                              title="View Details"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              className="btn btn-outline-secondary"
                              onClick={() => handleEdit(user)}
                              title="Edit"
                            >
                              <Pencil size={16} />
                            </button>
                            {user.status === 'active' ? (
                              <button
                                className="btn btn-outline-warning"
                                onClick={() => handleStatusChange(user, 'suspended')}
                                title="Suspend"
                              >
                                <Ban size={16} />
                              </button>
                            ) : (
                              <button
                                className="btn btn-outline-success"
                                onClick={() => handleStatusChange(user, 'active')}
                                title="Activate"
                              >
                                <CheckCircle size={16} />
                              </button>
                            )}
                            <button
                              className="btn btn-outline-danger"
                              onClick={() => handleDelete(user)}
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center text-muted py-4">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav className="mt-3">
                <ul className="pagination justify-content-center">
                  <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 0}
                    >
                      Previous
                    </button>
                  </li>
                  {[...Array(totalPages)].map((_, index) => (
                    <li key={index} className={`page-item ${currentPage === index ? 'active' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(index)}
                      >
                        {index + 1}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages - 1}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </div>
        </div>

        {/* View Modal */}
        {showViewModal && selectedUser && (
          <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">User Details</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowViewModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-6">
                      <p className="text-muted mb-1 small">Full Name</p>
                      <p className="fw-bold">{selectedUser.fullName}</p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted mb-1 small">Email</p>
                      <p className="fw-bold">{selectedUser.email}</p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted mb-1 small">Phone</p>
                      <p className="fw-bold">{selectedUser.phone || 'N/A'}</p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted mb-1 small">Role</p>
                      <span className={`badge bg-${getRoleBadgeClass(selectedUser.role)}`}>
                        {selectedUser.role?.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="col-6">
                      <p className="text-muted mb-1 small">Status</p>
                      <span className={`badge bg-${getStatusBadgeClass(selectedUser.status)}`}>
                        {selectedUser.status}
                      </span>
                    </div>
                    <div className="col-6">
                      <p className="text-muted mb-1 small">Created At</p>
                      <p className="fw-bold">{formatDate(selectedUser.createdAt)}</p>
                    </div>
                  </div>

                  <div className="d-flex gap-2 mt-4 pt-3 border-top">
                    <button
                      className="btn btn-outline-primary flex-fill"
                      onClick={() => {
                        setShowViewModal(false);
                        handleEdit(selectedUser);
                      }}
                    >
                      <Pencil size={18} className="me-1" />
                      Edit User
                    </button>
                    {selectedUser.status === 'active' ? (
                      <button
                        className="btn btn-warning flex-fill"
                        onClick={() => handleStatusChange(selectedUser, 'suspended')}
                      >
                        <Ban size={18} className="me-1" />
                        Suspend
                      </button>
                    ) : (
                      <button
                        className="btn btn-success flex-fill"
                        onClick={() => handleStatusChange(selectedUser, 'active')}
                      >
                        <CheckCircle size={18} className="me-1" />
                        Activate
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && selectedUser && (
          <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit User</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowEditModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editFormData.fullName || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={editFormData.email || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Phone</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editFormData.phone || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Role</label>
                    <select
                      className="form-select"
                      value={editFormData.role || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                    >
                      <option value="customer">Customer</option>
                      <option value="restaurant_owner">Restaurant Owner</option>
                      <option value="delivery_person">Delivery Person</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSaveEdit}
                  >
                    Save Changes
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

export default UsersPage;