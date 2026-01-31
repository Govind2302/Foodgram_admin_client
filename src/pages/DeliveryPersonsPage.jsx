import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { Clock } from 'lucide-react';
import { 
  Eye, 
  Pencil, 
  Trash2, 
  Check, 
  X, 
  Star,
  Truck,
  Loader2,
  Search,
  DollarSign,
  MapPin,
  CheckCircle
} from 'lucide-react';
import { 
  getAllDeliveryPersons, 
  getPendingDeliveryPersons,
  getDeliveryPersonById,
  updateDeliveryPersonVerification,
  updateDeliveryPerson,
  deleteDeliveryPerson
} from '../services/deliveryPersonService';
import { toast } from 'react-toastify';
import './DeliveryPersonsPage.css';

function DeliveryPersonsPage() {
  const [deliveryPersons, setDeliveryPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedDP, setSelectedDP] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({});

  // Fetch delivery persons
  useEffect(() => {
    fetchDeliveryPersons();
  }, [currentPage, statusFilter]);

  const fetchDeliveryPersons = async () => {
    setLoading(true);
    try {
      const verificationStatus = statusFilter !== 'all' ? statusFilter : null;
      
      const data = await getAllDeliveryPersons(currentPage, 20, verificationStatus, null);
      setDeliveryPersons(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      console.error('Error fetching delivery persons:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter by search term (client-side)
  const filteredDeliveryPersons = deliveryPersons.filter(dp =>
    dp.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dp.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dp.deliveryPerson?.operatingArea?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleView = async (dp) => {
    try {
      const data = await getDeliveryPersonById(dp.deliveryPersonId);
      setSelectedDP(data);
      setShowViewModal(true);
    } catch (error) {
      console.error('Error fetching delivery person details:', error);
    }
  };

  const handleEdit = (dp) => {
    setEditFormData({
      userId: dp.deliveryPerson?.userId,
      vehicleNumber: dp.deliveryPerson?.vehicleNumber,
      operatingArea: dp.deliveryPerson?.operatingArea,
      status: dp.deliveryPerson?.status,
      earnings: dp.deliveryPerson?.earnings || 0,
    });
    setSelectedDP(dp);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      await updateDeliveryPerson(selectedDP.deliveryPersonId, editFormData);
      setShowEditModal(false);
      fetchDeliveryPersons();
    } catch (error) {
      console.error('Error updating delivery person:', error);
    }
  };

  const handleVerify = async (dp, status) => {
    try {
      await updateDeliveryPersonVerification(dp.deliveryPersonId, status);
      fetchDeliveryPersons();
      setShowViewModal(false);
    } catch (error) {
      console.error('Error updating verification:', error);
    }
  };

  const handleDelete = async (dp) => {
    if (window.confirm(`Are you sure you want to delete ${dp.userName}?`)) {
      try {
        await deleteDeliveryPerson(dp.deliveryPersonId);
        fetchDeliveryPersons();
      } catch (error) {
        console.error('Error deleting delivery person:', error);
      }
    }
  };

  const getStatusBadgeClass = (status) => {
    const badges = {
      pending: 'warning',
      verified: 'success',
      rejected: 'danger',
    };
    return badges[status?.toLowerCase()] || 'secondary';
  };

  if (loading && deliveryPersons.length === 0) {
    return (
      <DashboardLayout>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <Loader2 size={48} className="text-primary mb-3" style={{ animation: 'spin 1s linear infinite' }} />
            <p className="text-muted">Loading delivery persons...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Calculate stats
  const totalEarnings = deliveryPersons.reduce((sum, dp) => sum + (dp.deliveryPerson?.earnings || 0), 0);
  const verifiedCount = deliveryPersons.filter(dp => dp.deliveryPerson?.status === 'verified').length;
  const pendingCount = deliveryPersons.filter(dp => dp.deliveryPerson?.status === 'pending').length;

  return (
    <DashboardLayout>
      <div className="delivery-persons-page">
        {/* Header */}
        <div className="page-header mb-4">
          <div>
            <h2 className="page-title">
              <Truck size={28} className="me-2" />
              Delivery Person Management
            </h2>
            <p className="page-subtitle">Manage and verify delivery personnel</p>
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
                    placeholder="Search delivery persons..."
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
                  <option value="pending">Pending</option>
                  <option value="verified">Verified</option>
                  <option value="rejected">Rejected</option>
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
                <Truck size={24} />
              </div>
              <div className="stats-content">
                <h3>{deliveryPersons.length}</h3>
                <p>Total Delivery Persons</p>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="stats-card stats-card-success">
              <div className="stats-icon">
                <CheckCircle size={24} />
              </div>
              <div className="stats-content">
                <h3>{verifiedCount}</h3>
                <p>Verified</p>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="stats-card stats-card-warning">
              <div className="stats-icon">
                <Clock size={24} />
              </div>
              <div className="stats-content">
                <h3>{pendingCount}</h3>
                <p>Pending Verification</p>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="stats-card stats-card-info">
              <div className="stats-icon">
                <DollarSign size={24} />
              </div>
              <div className="stats-content">
                <h3>₹{totalEarnings.toLocaleString()}</h3>
                <p>Total Earnings</p>
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
                    <th>Vehicle Number</th>
                    <th>Operating Area</th>
                    <th>Earnings</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDeliveryPersons.length > 0 ? (
                    filteredDeliveryPersons.map((dp) => (
                      <tr key={dp.deliveryPersonId}>
                        <td className="font-monospace">#{dp.deliveryPersonId}</td>
                        <td className="fw-bold">{dp.userName}</td>
                        <td className="text-muted">{dp.userEmail}</td>
                        <td>
                          <span className="badge bg-secondary">
                            {dp.deliveryPerson?.vehicleNumber || 'N/A'}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-1">
                            <MapPin size={14} className="text-muted" />
                            <span>{dp.deliveryPerson?.operatingArea || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="fw-bold text-success">
                          ₹{dp.deliveryPerson?.earnings || 0}
                        </td>
                        <td>
                          <span className={`badge bg-${getStatusBadgeClass(dp.deliveryPerson?.status)}`}>
                            {dp.deliveryPerson?.status || 'N/A'}
                          </span>
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <button
                              className="btn btn-outline-primary"
                              onClick={() => handleView(dp)}
                              title="View Details"
                            >
                              <Eye size={16} />
                            </button>
                            {dp.deliveryPerson?.status === 'pending' && (
                              <>
                                <button
                                  className="btn btn-outline-success"
                                  onClick={() => handleVerify(dp, 'verified')}
                                  title="Approve"
                                >
                                  <Check size={16} />
                                </button>
                                <button
                                  className="btn btn-outline-danger"
                                  onClick={() => handleVerify(dp, 'rejected')}
                                  title="Reject"
                                >
                                  <X size={16} />
                                </button>
                              </>
                            )}
                            <button
                              className="btn btn-outline-secondary"
                              onClick={() => handleEdit(dp)}
                              title="Edit"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              className="btn btn-outline-danger"
                              onClick={() => handleDelete(dp)}
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
                        No delivery persons found
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
        {showViewModal && selectedDP && (
          <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Delivery Person Details</h5>
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
                      <p className="fw-bold">{selectedDP.userName}</p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted mb-1 small">Email</p>
                      <p className="fw-bold">{selectedDP.userEmail}</p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted mb-1 small">Vehicle Number</p>
                      <p className="fw-bold">{selectedDP.deliveryPerson?.vehicleNumber || 'N/A'}</p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted mb-1 small">Operating Area</p>
                      <p className="fw-bold">{selectedDP.deliveryPerson?.operatingArea || 'N/A'}</p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted mb-1 small">Total Earnings</p>
                      <p className="fw-bold text-success">₹{selectedDP.deliveryPerson?.earnings || 0}</p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted mb-1 small">Status</p>
                      <span className={`badge bg-${getStatusBadgeClass(selectedDP.deliveryPerson?.status)}`}>
                        {selectedDP.deliveryPerson?.status || 'N/A'}
                      </span>
                    </div>
                  </div>

                  {selectedDP.deliveryPerson?.status === 'pending' && (
                    <div className="d-flex gap-2 mt-4 pt-3 border-top">
                      <button
                        className="btn btn-success flex-fill"
                        onClick={() => handleVerify(selectedDP, 'verified')}
                      >
                        <Check size={18} className="me-1" />
                        Approve
                      </button>
                      <button
                        className="btn btn-danger flex-fill"
                        onClick={() => handleVerify(selectedDP, 'rejected')}
                      >
                        <X size={18} className="me-1" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && selectedDP && (
          <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Delivery Person</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowEditModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Vehicle Number</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editFormData.vehicleNumber || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, vehicleNumber: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Operating Area</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editFormData.operatingArea || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, operatingArea: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Earnings</label>
                    <input
                      type="number"
                      className="form-control"
                      value={editFormData.earnings || 0}
                      onChange={(e) => setEditFormData({ ...editFormData, earnings: parseFloat(e.target.value) })}
                    />
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

export default DeliveryPersonsPage;