import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { 
  Star, 
  Trash2, 
  Search,
  Eye,
  Loader2,
  Award,
  Users,
  MessageSquare,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { 
  getAllReviews, 
  getReviewById,
  deleteReview
} from '../services/reviewService';
import './ReviewsPage.css';

function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedReview, setSelectedReview] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  // Fetch reviews
  useEffect(() => {
    fetchReviews();
  }, [currentPage, typeFilter, ratingFilter]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const type = typeFilter !== 'all' ? typeFilter : null;
      const data = await getAllReviews(currentPage, 20, type);
      setReviews(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter by search term and rating (client-side)
  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      review.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.restaurantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.deliveryPersonName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRating = ratingFilter === 'all' || review.rating === parseInt(ratingFilter);
    
    return matchesSearch && matchesRating;
  });

  const handleView = async (review) => {
    try {
      const data = await getReviewById(review.reviewId);
      setSelectedReview(data);
      setShowViewModal(true);
    } catch (error) {
      console.error('Error fetching review details:', error);
    }
  };

  const handleDelete = async (review) => {
    if (window.confirm(`Are you sure you want to delete this review by ${review.userName}?`)) {
      try {
        await deleteReview(review.reviewId);
        fetchReviews();
      } catch (error) {
        console.error('Error deleting review:', error);
      }
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="d-flex align-items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={star <= rating ? 'star-filled' : 'star-empty'}
            fill={star <= rating ? '#ffc107' : 'none'}
            stroke={star <= rating ? '#ffc107' : '#dee2e6'}
          />
        ))}
        <span className="ms-2 fw-bold text-warning">{rating}/5</span>
      </div>
    );
  };

  if (loading && reviews.length === 0) {
    return (
      <DashboardLayout>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <Loader2 size={48} className="text-primary mb-3" style={{ animation: 'spin 1s linear infinite' }} />
            <p className="text-muted">Loading reviews...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Calculate stats
  const totalReviews = reviews.length;
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;
  const restaurantReviews = reviews.filter(r => r.restaurantId).length;
  const deliveryReviews = reviews.filter(r => r.deliveryPersonId).length;
  const positiveReviews = reviews.filter(r => r.rating >= 4).length;

  return (
    <DashboardLayout>
      <div className="reviews-page">
        {/* Header */}
        <div className="page-header mb-4">
          <div>
            <h2 className="page-title">
              <Star size={28} className="me-2" />
              Reviews Management
            </h2>
            <p className="page-subtitle">View and moderate user reviews</p>
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
                <h3>{totalReviews}</h3>
                <p>Total Reviews</p>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="stats-card stats-card-warning">
              <div className="stats-icon">
                <Award size={24} />
              </div>
              <div className="stats-content">
                <h3>{averageRating}</h3>
                <p>Average Rating</p>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="stats-card stats-card-info">
              <div className="stats-icon">
                <Users size={24} />
              </div>
              <div className="stats-content">
                <h3>{restaurantReviews}</h3>
                <p>Restaurant Reviews</p>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="stats-card stats-card-success">
              <div className="stats-icon">
                <ThumbsUp size={24} />
              </div>
              <div className="stats-content">
                <h3>{positiveReviews}</h3>
                <p>Positive Reviews (4+)</p>
              </div>
            </div>
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
                    placeholder="Search reviews..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Type Filter */}
              <div className="col-12 col-md-4">
                <select
                  className="form-select"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="restaurant">Restaurant Reviews</option>
                  <option value="delivery">Delivery Reviews</option>
                </select>
              </div>

              {/* Rating Filter */}
              <div className="col-12 col-md-4">
                <select
                  className="form-select"
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(e.target.value)}
                >
                  <option value="all">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="row g-4 mb-4">
          {filteredReviews.length > 0 ? (
            filteredReviews.map((review) => (
              <div key={review.reviewId} className="col-12 col-md-6 col-lg-4">
                <div className="review-card">
                  <div className="review-header">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <div className="avatar-circle">
                        {review.userName?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="mb-0 fw-bold">{review.userName}</h6>
                        <small className="text-muted">{review.createdAt}</small>
                      </div>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(review)}
                        title="Delete Review"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    {renderStars(review.rating)}
                  </div>

                  <div className="review-body">
                    <p className="review-comment">{review.comment}</p>
                  </div>

                  <div className="review-footer">
                    <div className="d-flex gap-2 flex-wrap">
                      {review.restaurantName && (
                        <span className="review-badge restaurant-badge">
                          🍽️ {review.restaurantName}
                        </span>
                      )}
                      {review.deliveryPersonName && (
                        <span className="review-badge delivery-badge">
                          🚚 {review.deliveryPersonName}
                        </span>
                      )}
                    </div>
                    <button
                      className="btn btn-sm btn-outline-primary mt-2 w-100"
                      onClick={() => handleView(review)}
                    >
                      <Eye size={14} className="me-1" />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12">
              <div className="empty-state">
                <Star size={64} className="text-muted mb-3" />
                <h5 className="text-muted">No reviews found</h5>
                <p className="text-muted">Try adjusting your filters</p>
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <nav>
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

        {/* View Review Modal */}
        {showViewModal && selectedReview && (
          <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header border-0 pb-0">
                  <div>
                    <h5 className="modal-title d-flex align-items-center gap-2">
                      <Star size={24} className="text-warning" />
                      Review Details
                    </h5>
                    <small className="text-muted">Review #{selectedReview.reviewId}</small>
                  </div>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowViewModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  {/* User Info */}
                  <div className="card bg-light mb-3">
                    <div className="card-body">
                      <div className="row g-3">
                        <div className="col-md-6">
                          <small className="text-muted d-block mb-1">Reviewed By</small>
                          <div className="d-flex align-items-center gap-2">
                            <div className="avatar-circle-large">
                              {selectedReview.userName?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="fw-bold mb-0">{selectedReview.userName}</p>
                              <small className="text-muted">{selectedReview.userEmail}</small>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <small className="text-muted d-block mb-1">Rating</small>
                          {renderStars(selectedReview.rating)}
                        </div>
                        <div className="col-md-6">
                          <small className="text-muted d-block mb-1">Date</small>
                          <p className="fw-bold mb-0 small">{selectedReview.createdAt}</p>
                        </div>
                        {selectedReview.orderId && (
                          <div className="col-md-6">
                            <small className="text-muted d-block mb-1">Order ID</small>
                            <span className="badge bg-secondary">#{selectedReview.orderId}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Review Target */}
                  <div className="mb-3">
                    <label className="form-label fw-bold">Review For</label>
                    <div className="d-flex gap-2">
                      {selectedReview.restaurantName && (
                        <span className="review-badge restaurant-badge">
                          🍽️ {selectedReview.restaurantName}
                        </span>
                      )}
                      {selectedReview.deliveryPersonName && (
                        <span className="review-badge delivery-badge">
                          🚚 {selectedReview.deliveryPersonName}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Review Comment */}
                  <div className="mb-3">
                    <label className="form-label fw-bold">Comment</label>
                    <div className="p-3 bg-light rounded">
                      <p className="mb-0">{selectedReview.comment}</p>
                    </div>
                  </div>

                  {/* Sentiment Indicator */}
                  <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
                    <span className="text-muted">Sentiment</span>
                    {selectedReview.rating >= 4 ? (
                      <span className="badge bg-success d-inline-flex align-items-center gap-1">
                        <ThumbsUp size={14} />
                        Positive
                      </span>
                    ) : selectedReview.rating >= 3 ? (
                      <span className="badge bg-warning d-inline-flex align-items-center gap-1">
                        Neutral
                      </span>
                    ) : (
                      <span className="badge bg-danger d-inline-flex align-items-center gap-1">
                        <ThumbsDown size={14} />
                        Negative
                      </span>
                    )}
                  </div>
                </div>
                <div className="modal-footer border-0">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowViewModal(false)}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => {
                      handleDelete(selectedReview);
                      setShowViewModal(false);
                    }}
                  >
                    <Trash2 size={16} className="me-1" />
                    Delete Review
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

export default ReviewsPage;
