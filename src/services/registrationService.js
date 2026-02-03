import { toast } from "react-toastify";
import config from "./config";

const API_URL = config.BASE_URL; 

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.fullName - User's full name
 * @param {string} userData.email - User's email
 * @param {string} userData.password - User's password
 * @param {string} userData.phone - User's phone number (10 digits)
 * @returns {Promise<Object>} Registration response
 */
export async function registerUser(userData) {
  try {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: 'include', // Include credentials if needed for CORS
      body: JSON.stringify({
        fullName: userData.fullName,
        email: userData.email,
        password: userData.password,
        phone: userData.phone
      }),
    });

    // Parse response data
    const data = await response.json();

    // Handle different status codes
    if (response.status === 403) {
      throw new Error(data.message || 'Access denied. You may not have permission to register.');
    }

    if (response.status === 409) {
      throw new Error(data.message || 'Email already exists. Please use a different email.');
    }

    if (response.status === 400) {
      throw new Error(data.message || 'Invalid registration data. Please check your inputs.');
    }

    if (!response.ok) {
      throw new Error(data.message || `Registration failed with status ${response.status}`);
    }

    return {
      success: true,
      data: data.data,
      message: data.message || 'Registration successful'
    };
  } catch (error) {
    console.error('Registration error:', error);
    
    // Check if it's a network error
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.'
      };
    }
    
    return {
      success: false,
      message: error.message || 'An error occurred during registration'
    };
  }
}

/**
 * Register via public endpoint (if admin endpoint requires authentication)
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} Registration response
 */
export async function registerUserPublic(userData) {
  try {
    // Try the public registration endpoint
    const response = await fetch(`${API_URL}/api/public/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        fullName: userData.fullName,
        email: userData.email,
        password: userData.password,
        phone: userData.phone
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    return {
      success: true,
      data: data.data,
      message: data.message || 'Registration successful'
    };
  } catch (error) {
    console.error('Public registration error:', error);
    return {
      success: false,
      message: error.message || 'An error occurred during registration'
    };
  }
}

/**
 * Check if email is already registered
 * @param {string} email - Email to check
 * @returns {Promise<boolean>} True if email exists
 */
export async function checkEmailExists(email) {
  try {
    const response = await fetch(`${API_URL}/api/auth/check-email?email=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.exists || false;
  } catch (error) {
    console.error('Check email error:', error);
    return false;
  }
}

/**
 * Validate registration data
 * @param {Object} userData - User registration data
 * @returns {Object} Validation result with errors
 */
export function validateRegistrationData(userData) {
  const errors = {};

  // Full Name validation
  if (!userData.fullName || !userData.fullName.trim()) {
    errors.fullName = 'Full name is required';
  } else if (userData.fullName.trim().length < 2) {
    errors.fullName = 'Name must be at least 2 characters';
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!userData.email) {
    errors.email = 'Email is required';
  } else if (!emailRegex.test(userData.email)) {
    errors.email = 'Invalid email format';
  }

  // Password validation
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!userData.password) {
    errors.password = 'Password is required';
  } else if (!passwordRegex.test(userData.password)) {
    errors.password = 'Password must be at least 8 characters with uppercase, lowercase, and number';
  }

  // Phone validation
  const phoneRegex = /^[0-9]{10}$/;
  if (!userData.phone) {
    errors.phone = 'Phone number is required';
  } else if (!phoneRegex.test(userData.phone)) {
    errors.phone = 'Phone number must be exactly 10 digits';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}