import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { 
  Eye, 
  Pencil, 
  Trash2, 
  Check, 
  X, 
  Star,
  UtensilsCrossed,
  Loader2,
  Search,
  Filter
} from 'lucide-react';
import { 
  getAllRestaurants, 
  getPendingRestaurants, 
  getRestaurantById,
  updateRestaurantVerification,
  updateRestaurant,
  deleteRestaurant
} from '../services/restaurantService';
import { toast } from 'react-toastify';
import './RestaurantsPage.css';

function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cuisineFilter, setCuisineFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({});

  // Fetch restaurants
  useEffect(() => {
    fetchRestaurants();
  }, [currentPage, statusFilter, cuisineFilter]);

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const verificationStatus = statusFilter !== 'all' ? statusFilter : null;
      const cuisineType = cuisineFilter !== 'all' ? cuisineFilter : null;
      
      const data = await getAllRestaurants(currentPage, 10, verificationStatus, cuisineType);
      setRestaurants(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter by search term (client-side)
  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    restaurant.cuisineType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get unique cuisines for filter
  const uniqueCuisines = [...new Set(restaurants.map(r => r.cuisineType).filter(Boolean))];

  const handleView = async (restaurant) => {
    try {
      const data = await getRestaurantById(restaurant.restaurantId);
      setSelectedRestaurant(data);
      setShowViewModal(true);
    } catch (error) {
      console.error('Error fetching restaurant details:', error);
    }
  };

  const handleEdit = (restaurant) => {
    setEditFormData({
      name: restaurant.name,
      cuisineType: restaurant.cuisineType,
      contactNumber: restaurant.contactNumber,
      address: restaurant.address,
      openTime: restaurant.openTime,
      closeTime: restaurant.closeTime,
    });
    setSelectedRestaurant(restaurant);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      await updateRestaurant(selectedRestaurant.restaurantId, editFormData);
      setShowEditModal(false);
      fetchRestaurants();
    } catch (error) {
      console.error('Error updating restaurant:', error);
    }
  };

  const handleVerify = async (restaurant, status) => {
    try {
      await updateRestaurantVerification(restaurant.restaurantId, status);
      fetchRestaurants();
      setShowViewModal(false);
    } catch (error) {
      console.error('Error updating verification:', error);
    }
  };

  const handleDelete = async (restaurant) => {
    if (window.confirm(`Are you sure you want to delete ${restaurant.name}?`)) {
      try {
        await deleteRestaurant(restaurant.restaurantId);
        fetchRestaurants();
      } catch (error) {
        console.error('Error deleting restaurant:', error);
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

  if (loading && restaurants.length === 0) {
    return (
      <DashboardLayout>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <Loader2 size={48} className="text-primary mb-3" style={{ animation: 'spin 1s linear infinite' }} />
            <p className="text-muted">Loading restaurants...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="restaurants-page">
        {/* Header */}
        <div className="page-header mb-4 p-4 rounded shadow-sm bg-light border">
  <div>
    <h2 className="page-title mb-1">
      <UtensilsCrossed size={30} className="me-2 text-primary" />
      Restaurant Management
    </h2>
    <p className="page-subtitle mb-0">
      View, verify and manage registered restaurants
    </p>
  </div>
</div>

        {/* Filters */}
        <div className="card mb-4 shadow-sm border-0">
          <div className="card-header bg-white fw-semibold">
  <Filter size={16} className="me-2 text-primary" />
  Filters
</div>
          <div className="card-body">
            <div className="row g-3">

              {/* Search */}
              <div className="col-12 col-md-4">
                <div className="search-box">
                  <Search size={18} className="search-icon" />
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Search restaurants..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="col-12 col-md-4">
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

              {/* Cuisine Filter */}
              <div className="col-12 col-md-4">
                <select
                  className="form-select"
                  value={cuisineFilter}
                  onChange={(e) => setCuisineFilter(e.target.value)}
                >
                  <option value="all">All Cuisines</option>
                  {uniqueCuisines.map((cuisine) => (
                    <option key={cuisine} value={cuisine}>{cuisine}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="card shadow-sm border-0">
          <div className="card-body">
            <div className="table-responsive">
              <div className="d-flex justify-content-between align-items-center mb-3">
  <h5 className="mb-0 fw-semibold">Restaurants List</h5>
  <span className="badge bg-secondary">
    Total: {filteredRestaurants.length}
  </span>
</div>
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Restaurant Name</th>
                    <th>Cuisine Type</th>
                    <th>Contact</th>
                    <th>Rating</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRestaurants.length > 0 ? (
                    filteredRestaurants.map((restaurant) => (
                      <tr key={restaurant.restaurantId}>
                        <td className="font-monospace">#{restaurant.restaurantId}</td>
                        <td className="fw-bold">{restaurant.name}</td>
                        <td>{restaurant.cuisineType || 'N/A'}</td>
                        <td>{restaurant.contactNumber || 'N/A'}</td>
                        <td>
                          <div className="d-flex align-items-center gap-1">
                            <Star size={16} className="text-warning" fill="#ffc107" />
                            <span>{restaurant.rating || '0.0'}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`badge rounded-pill bg-${getStatusBadgeClass(restaurant.verificationStatus)}`}>
                            {restaurant.verificationStatus?.toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <button
                              className="btn btn-outline-primary"
                              onClick={() => handleView(restaurant)}
                              title="View Details"
                            >
                              <Eye size={16} />
                            </button>
                            {restaurant.verificationStatus === 'pending' && (
                              <>
                                <button
                                  className="btn btn-outline-success"
                                  onClick={() => handleVerify(restaurant, 'verified')}
                                  title="Approve"
                                >
                                  <Check size={16} />
                                </button>
                                <button
                                  className="btn btn-outline-danger"
                                  onClick={() => handleVerify(restaurant, 'rejected')}
                                  title="Reject"
                                >
                                  <X size={16} />
                                </button>
                              </>
                            )}
                            <button
                              className="btn btn-outline-secondary"
                              onClick={() => handleEdit(restaurant)}
                              title="Edit"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              className="btn btn-outline-danger"
                              onClick={() => handleDelete(restaurant)}
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
                      <td colSpan="7" className="text-center text-muted py-4">
                        No restaurants found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav className="mt-3">
                <ul className="pagination justify-content-center pagination-sm">
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
        {showViewModal && selectedRestaurant && (
          <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content">
                <div className="modal-header bg-light">
  <h5 className="modal-title fw-semibold">Restaurant Details</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowViewModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-6">
                      <p className="text-muted mb-1 small">Restaurant Name</p>
                      <p className="fw-bold">{selectedRestaurant.name}</p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted mb-1 small">Cuisine Type</p>
                      <p className="fw-bold">{selectedRestaurant.cuisineType || 'N/A'}</p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted mb-1 small">Contact Number</p>
                      <p className="fw-bold">{selectedRestaurant.contactNumber || 'N/A'}</p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted mb-1 small">Rating</p>
                      <div className="d-flex align-items-center gap-1">
                        <Star size={16} className="text-warning" fill="#ffc107" />
                        <span className="fw-bold">{selectedRestaurant.rating || '0.0'}</span>
                      </div>
                    </div>
                    <div className="col-12">
                      <p className="text-muted mb-1 small">Address</p>
                      <p className="fw-bold">{selectedRestaurant.address || 'N/A'}</p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted mb-1 small">Operating Hours</p>
                      <p className="fw-bold">
                        {selectedRestaurant.openTime} - {selectedRestaurant.closeTime}
                      </p>
                    </div>
                    <div className="col-6">
                      <p className="text-muted mb-1 small">Status</p>
                      <span className={`badge bg-${getStatusBadgeClass(selectedRestaurant.verificationStatus)}`}>
                        {selectedRestaurant.verificationStatus}
                      </span>
                    </div>
                  </div>

                  {selectedRestaurant.verificationStatus === 'pending' && (
                    <div className="d-flex gap-2 mt-4 pt-3 border-top">
                      <button
                        className="btn btn-success flex-fill"
                        onClick={() => handleVerify(selectedRestaurant, 'verified')}
                      >
                        <Check size={18} className="me-1" />
                        Approve
                      </button>
                      <button
                        className="btn btn-danger flex-fill"
                        onClick={() => handleVerify(selectedRestaurant, 'rejected')}
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
        {showEditModal && selectedRestaurant && (
          <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Restaurant</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowEditModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Restaurant Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editFormData.name || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Cuisine Type</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editFormData.cuisineType || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, cuisineType: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Contact Number</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editFormData.contactNumber || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, contactNumber: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Address</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      value={editFormData.address || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                    ></textarea>
                  </div>
                  <div className="row">
                    <div className="col-6 mb-3">
                      <label className="form-label">Open Time</label>
                      <input
                        type="time"
                        className="form-control"
                        value={editFormData.openTime || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, openTime: e.target.value })}
                      />
                    </div>
                    <div className="col-6 mb-3">
                      <label className="form-label">Close Time</label>
                      <input
                        type="time"
                        className="form-control"
                        value={editFormData.closeTime || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, closeTime: e.target.value })}
                      />
                    </div>
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

export default RestaurantsPage;