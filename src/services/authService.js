import { toast } from "react-toastify";
import config from "./config";
import api from './apiService';

// Admin Login
export async function loginAdmin(email, password) {
    try {
        const adminBody = { email, password };
        const url = config.ADMIN_API + '/auth/login'; 
        const response = await api.post(url, adminBody);
        
        // Return the data object from response
        return response.data.data; // This contains: userId, email, fullName, role, token, status
    } catch (ex) {
        toast.error(ex.response?.data?.message || 'Login failed');
        throw ex;
    }
}

// Admin Register
export async function registerAdmin(fullName, email, password, phone) {
    try {
        const adminBody = { fullName, email, password, phone };
        const url = config.ADMIN_API + '/auth/register';
        const response = await api.post(url, adminBody);
        toast.success('Admin registered successfully!');
        return response.data.data;
    } catch (ex) {
        toast.error(ex.response?.data?.message || 'Registration failed');
        throw ex;
    }
}

// Logout
export function logoutAdmin() {
    localStorage.removeItem('adminData');
    toast.info('Logged out successfully');
    window.location.href = '/login';
}

// Check if admin is logged in
export function isAuthenticated() {
    return localStorage.getItem('adminData') !== null;
}

// Get current admin data
export function getCurrentAdmin() {
    const adminData = localStorage.getItem('adminData');
    return adminData ? JSON.parse(adminData) : null;
}

// Get admin token
export function getAdminToken() {
    const adminData = getCurrentAdmin();
    return adminData?.token || null;
} 