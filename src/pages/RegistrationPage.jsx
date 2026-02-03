import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Mail, Lock, Eye, EyeOff, User, Phone, ArrowLeft } from 'lucide-react';
import { registerUser } from '../services/registrationService';
import './Registration.css';

function Registration() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const navigate = useNavigate();

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const validatePassword = (password) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters with uppercase, lowercase, and number';
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Phone validation
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Phone number must be exactly 10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);

    try {
      const result = await registerUser({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone
      });

      if (result.success) {
        toast.success('Registration successful! Please login.');
        navigate('/login');
      } else {
        toast.error(result.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-wrapper">
        {/* Logo Section */}
        <div className="registration-logo-section">
          <div className="logo-circle">
            <span className="logo-emoji">🍽️</span>
          </div>
          <h1 className="brand-title">Foodgram Admin</h1>
        </div>

        {/* Registration Card */}
        <div className="registration-card">
          {/* Back to Login Link */}
          <div className="back-to-login">
            <button 
              type="button" 
              className="back-link"
              onClick={() => navigate('/login')}
            >
              <ArrowLeft size={16} />
              <span>Back to Login</span>
            </button>
          </div>

          <div className="registration-header">
            <h2>Create Account</h2>
            <p className="text-muted">Join our admin platform</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Full Name Field */}
            <div className="mb-3">
              <label htmlFor="fullName" className="form-label">Full Name</label>
              <div className="input-with-icon">
                <User className="input-icon" size={18} />
                <input
                  type="text"
                  className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                  id="fullName"
                  name="fullName"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              {errors.fullName && (
                <div className="invalid-feedback d-block">{errors.fullName}</div>
              )}
            </div>

            {/* Email Field */}
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <div className="input-with-icon">
                <Mail className="input-icon" size={18} />
                <input
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  id="email"
                  name="email"
                  placeholder="admin@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              {errors.email && (
                <div className="invalid-feedback d-block">{errors.email}</div>
              )}
            </div>

            {/* Phone Field */}
            <div className="mb-3">
              <label htmlFor="phone" className="form-label">Phone Number</label>
              <div className="input-with-icon">
                <Phone className="input-icon" size={18} />
                <input
                  type="tel"
                  className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                  id="phone"
                  name="phone"
                  placeholder="1234567890"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={loading}
                  maxLength="10"
                />
              </div>
              {errors.phone && (
                <div className="invalid-feedback d-block">{errors.phone}</div>
              )}
            </div>

            {/* Password Field */}
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="input-with-icon">
                <Lock className="input-icon" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
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
              {errors.password && (
                <div className="invalid-feedback d-block">{errors.password}</div>
              )}
              <small className="form-text text-muted">
                Must contain uppercase, lowercase, number, and be 8+ characters
              </small>
            </div>

            {/* Confirm Password Field */}
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <div className="input-with-icon">
                <Lock className="input-icon" size={18} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex="-1"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <div className="invalid-feedback d-block">{errors.confirmPassword}</div>
              )}
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="btn btn-primary w-100 registration-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="registration-card-footer">
            <p className="text-muted">
              Already have an account? 
              <button 
                type="button"
                className="login-link"
                onClick={() => navigate('/login')}
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Registration;
