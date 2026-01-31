import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search, AlertCircle } from 'lucide-react';
import './NotFound.css';

function NotFound() {
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname);
  }, [location.pathname]);

  return (
    <div className="notfound-page">
      <div className="notfound-container">
        <div className="notfound-content">
          {/* 404 Animation */}
          <div className="error-code">
            <span className="error-digit">4</span>
            <span className="error-digit error-digit-0">
              <AlertCircle size={120} className="error-icon" />
            </span>
            <span className="error-digit">4</span>
          </div>

          {/* Error Message */}
          <h1 className="error-title">Page Not Found</h1>
          <p className="error-message">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
          <p className="error-path">
            <Search size={16} className="me-2" />
            Attempted path: <code>{location.pathname}</code>
          </p>

          {/* Action Buttons */}
          <div className="error-actions">
            <button 
              className="btn btn-primary btn-lg"
              onClick={() => navigate('/')}
            >
              <Home size={20} className="me-2" />
              Go to Home
            </button>
            <button 
              className="btn btn-outline-secondary btn-lg"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={20} className="me-2" />
              Go Back
            </button>
          </div>

          {/* Helpful Links */}
          <div className="helpful-links">
            <p className="text-muted mb-3">Or try these helpful links:</p>
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <a href="/dashboard" className="link-item">Dashboard</a>
              <a href="/users" className="link-item">Users</a>
              <a href="/restaurants" className="link-item">Restaurants</a>
              <a href="/delivery-persons" className="link-item">Delivery Persons</a>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="decorative-circles">
          <div className="circle circle-1"></div>
          <div className="circle circle-2"></div>
          <div className="circle circle-3"></div>
          <div className="circle circle-4"></div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
