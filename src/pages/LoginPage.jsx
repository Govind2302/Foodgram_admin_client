import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { toast } from 'react-toastify';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);

    const result = await login(email, password);
    
    setLoading(false);

    if (result.success) {
      toast.success('Welcome back!');
      navigate('/dashboard');
    } else {
      toast.error(result.message || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        {/* Logo Section */}
        <div className="login-logo-section">
          <div className="logo-circle">
            <span className="logo-emoji">🍽️</span>
          </div>
          <h1 className="brand-title">Foodgram Admin</h1>
        </div>

        {/* Login Card */}
        <div className="login-card">
          <div className="login-header">
            <h2>Welcome Back</h2>
            <p className="text-muted">Sign in to your admin account</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <div className="input-with-icon">
                <Mail className="input-icon" size={18} />
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="input-with-icon">
                <Lock className="input-icon" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-end mb-3">
              <a href="#" className="forgot-password">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="btn btn-primary w-100 login-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Footer - Registration Link */}
          <div className="login-card-footer">
            <p className="text-muted">
              Don't have an account?
              Contact Another Admin
              {/* <button 
                type="button"
                className="register-link"
                onClick={() => navigate('/register')}
              >
                Create one
              </button> */}
            </p>
            <p className="text-muted mt-2">
              <small>© 2025 Zomato Admin Panel. All rights reserved.</small>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;