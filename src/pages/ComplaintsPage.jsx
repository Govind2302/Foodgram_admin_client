import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { 
  Eye, 
  MessageSquare, 
  Search,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Send,
  Loader2,
  Trash2,
  MoreHorizontal,
  Mail,
  Package
} from 'lucide-react';
import { 
  getAllComplaints, 
  getComplaintById,
  addComplaintResponse,
  updateComplaintStatus,
  deleteComplaint
} from '../services/complaintService';
import { toast } from 'react-toastify';
import './ComplaintsPage.css';

function ComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [response, setResponse] = useState('');

  // Fetch complaints
  useEffect(() => {
    fetchComplaints();
  }, [currentPage, statusFilter]);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const status = statusFilter !== 'all' ? statusFilter : null;
      const data = await getAllComplaints(currentPage, 20, status);
      setComplaints(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter by search term (client-side)
  const filteredComplaints = complaints.filter(complaint =>
    complaint.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    complaint.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    complaint.message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleView = async (complaint) => {
    try {
      const data = await getComplaintById(complaint.complaintId);
      setSelectedComplaint(data);
      setResponse(data.adminResponse || '');
      setShowViewModal(true);
    } catch (error) {
      console.error('Error fetching complaint details:', error);
    }
  };

  const handleSendResponse = async () => {
    if (!selectedComplaint || !response.trim()) return;
    try {
      await addComplaintResponse(selectedComplaint.complaintId, response);
      setShowViewModal(false);
      fetchComplaints();
    } catch (error) {
      console.error('Error sending response:', error);
    }
  };

  const handleStatusChange = async (complaintId, newStatus) => {
    try {
      await updateComplaintStatus(complaintId, newStatus);
      setShowViewModal(false);
      fetchComplaints();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDelete = async (complaint) => {
    if (window.confirm(`Are you sure you want to delete complaint #${complaint.complaintId}?`)) {
      try {
        await deleteComplaint(complaint.complaintId);
        fetchComplaints();
      } catch (error) {
        console.error('Error deleting complaint:', error);
      }
    }
  };

  const getStatusBadgeClass = (status) => {
    const badges = {
      new: 'primary',
      in_progress: 'warning',
      resolved: 'success',
      closed: 'secondary',
    };
    return badges[status?.toLowerCase()] || 'secondary';
  };

  const getStatusIcon = (status) => {
    const icons = {
      new: AlertCircle,
      in_progress: Clock,
      resolved: CheckCircle,
      closed: XCircle,
    };
    const Icon = icons[status?.toLowerCase()] || AlertCircle;
    return <Icon size={16} />;
  };

  if (loading && complaints.length === 0) {
    return (
      <DashboardLayout>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <Loader2 size={48} className="text-primary mb-3" style={{ animation: 'spin 1s linear infinite' }} />
            <p className="text-muted">Loading complaints...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Calculate stats
  const totalComplaints = complaints.length;
  const newCount = complaints.filter(c => c.status === 'new').length;
  const inProgressCount = complaints.filter(c => c.status === 'in_progress').length;
  const resolvedCount = complaints.filter(c => c.status === 'resolved').length;

  return (
    <DashboardLayout>
      <div className="complaints-page">
        {/* Header */}
        <div className="page-header mb-4">
          <div>
            <h2 className="page-title">
              <MessageSquare size={28} className="me-2" />
              Complaints Management
            </h2>
            <p className="page-subtitle">Handle user complaints and feedback</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="stats-card stats-card-primary">
              <div className="stats-icon">
                <MessageSquare size={24} />
              </div>
              <div className="stats-content">
                <h3>{totalComplaints}</h3>
                <p>Total Complaints</p>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="stats-card stats-card-warning">
              <div className="stats-icon">
                <AlertCircle size={24} />
              </div>
              <div className="stats-content">
                <h3>{newCount}</h3>
                <p>New Complaints</p>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="stats-card stats-card-info">
              <div className="stats-icon">
                <Clock size={24} />
              </div>
              <div className="stats-content">
                <h3>{inProgressCount}</h3>
                <p>In Progress</p>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="stats-card stats-card-success">
              <div className="stats-icon">
                <CheckCircle size={24} />
              </div>
              <div className="stats-content">
                <h3>{resolvedCount}</h3>
                <p>Resolved</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-4">
          <div className="card-body">
            <div className="row g-3">
              {/* Search */}
              <div className="col-12 col-md-6">
                <div className="search-box">
                  <Search size={18} className="search-icon" />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search complaints..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="col-12 col-md-6">
                <select
                  className="form-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="new">New</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Complaints Table */}
        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>User</th>
                    <th>Email</th>
                    <th>Order ID</th>
                    <th>Message</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredComplaints.length > 0 ? (
                    filteredComplaints.map((complaint) => (
                      <tr key={complaint.complaintId} style={{ cursor: 'pointer' }}>
                        <td onClick={() => handleView(complaint)}>
                          <span className="badge bg-light text-dark">#{complaint.complaintId}</span>
                        </td>
                        <td onClick={() => handleView(complaint)}>
                          <div className="d-flex align-items-center">
                            <div className="avatar-sm bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center me-2">
                              {complaint.userName?.charAt(0).toUpperCase()}
                            </div>
                            <strong>{complaint.userName}</strong>
                          </div>
                        </td>
                        <td onClick={() => handleView(complaint)}>
                          <small className="text-muted">{complaint.userEmail}</small>
                        </td>
                        <td onClick={() => handleView(complaint)}>
                          {complaint.orderId ? (
                            <span className="badge bg-secondary">#{complaint.orderId}</span>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                        <td onClick={() => handleView(complaint)}>
                          <div className="text-truncate" style={{ maxWidth: '250px' }}>
                            {complaint.message}
                          </div>
                        </td>
                        <td onClick={() => handleView(complaint)}>
                          <span className={`badge bg-${getStatusBadgeClass(complaint.status)} d-inline-flex align-items-center gap-1`}>
                            {getStatusIcon(complaint.status)}
                            {complaint.status?.replace('_', ' ')}
                          </span>
                        </td>
                        <td onClick={() => handleView(complaint)}>
                          <small className="text-muted">{complaint.createdAt}</small>
                        </td>
                        <td>
                          <div className="d-flex gap-1 justify-content-center">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleView(complaint)}
                              title="View & Respond"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(complaint)}
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
                        No complaints found
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

        {/* View Complaint Modal */}
        {showViewModal && selectedComplaint && (
          <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content">
                <div className="modal-header border-0 pb-0">
                  <div>
                    <h5 className="modal-title d-flex align-items-center gap-2">
                      <MessageSquare size={24} className="text-primary" />
                      Complaint Details
                    </h5>
                    <small className="text-muted">Complaint #{selectedComplaint.complaintId}</small>
                  </div>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowViewModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  {/* User Info Card */}
                  <div className="card bg-light mb-3">
                    <div className="card-body">
                      <div className="row g-3">
                        <div className="col-md-6">
                          <div className="d-flex align-items-center gap-2 mb-2">
                            <Mail size={16} className="text-muted" />
                            <small className="text-muted">User Information</small>
                          </div>
                          <p className="fw-bold mb-1">{selectedComplaint.userName}</p>
                          <p className="text-muted small mb-0">{selectedComplaint.userEmail}</p>
                        </div>
                        <div className="col-md-3">
                          <small className="text-muted d-block mb-1">Status</small>
                          <span className={`badge bg-${getStatusBadgeClass(selectedComplaint.status)} d-inline-flex align-items-center gap-1`}>
                            {getStatusIcon(selectedComplaint.status)}
                            {selectedComplaint.status?.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="col-md-3">
                          <small className="text-muted d-block mb-1">Created</small>
                          <p className="fw-bold mb-0 small">{selectedComplaint.createdAt}</p>
                        </div>
                        {selectedComplaint.orderId && (
                          <div className="col-md-6">
                            <div className="d-flex align-items-center gap-2 mb-1">
                              <Package size={16} className="text-muted" />
                              <small className="text-muted">Related Order</small>
                            </div>
                            <p className="fw-bold mb-0">Order #{selectedComplaint.orderId}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Complaint Message */}
                  <div className="mb-3">
                    <label className="form-label fw-bold">Complaint Message</label>
                    <div className="p-3 bg-warning bg-opacity-10 border border-warning border-opacity-25 rounded">
                      <p className="mb-0">{selectedComplaint.message}</p>
                    </div>
                  </div>

                  {/* Previous Admin Response */}
                  {selectedComplaint.adminResponse && (
                    <div className="mb-3">
                      <label className="form-label fw-bold">Previous Response</label>
                      <div className="p-3 bg-success bg-opacity-10 border border-success border-opacity-25 rounded">
                        <p className="mb-0">{selectedComplaint.adminResponse}</p>
                      </div>
                    </div>
                  )}

                  {/* Response Input */}
                  {selectedComplaint.status !== 'closed' && (
                    <div className="mb-3">
                      <label className="form-label fw-bold">Your Response</label>
                      <textarea
                        className="form-control"
                        rows="4"
                        placeholder="Type your response to the user..."
                        value={response}
                        onChange={(e) => setResponse(e.target.value)}
                      ></textarea>
                    </div>
                  )}
                </div>
                <div className="modal-footer border-0 pt-0">
                  {selectedComplaint.status !== 'closed' ? (
                    <div className="d-flex gap-2 w-100">
                      <button
                        className="btn btn-primary flex-fill"
                        onClick={handleSendResponse}
                        disabled={!response.trim()}
                      >
                        <Send size={18} className="me-2" />
                        Send Response
                      </button>
                      <select
                        className="form-select"
                        style={{ maxWidth: '180px' }}
                        value={selectedComplaint.status}
                        onChange={(e) => handleStatusChange(selectedComplaint.complaintId, e.target.value)}
                      >
                        <option value="new">New</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                  ) : (
                    <div className="alert alert-secondary mb-0 w-100">
                      <XCircle size={18} className="me-2" />
                      This complaint is closed and cannot be modified.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default ComplaintsPage;
