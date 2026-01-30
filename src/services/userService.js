import axios from "axios";
import { toast } from "react-toastify";
import config from "./config";
import { getAdminToken } from "./authService";

const API_URL = config.BASE_URL + '/api/admin'; 

// Get authorization header
const getAuthHeader = () => {
  const token = getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Get all users with pagination and filters
export async function getAllUsers(page = 0, size = 10, role = null, status = null) {
  try {
    let url = `${API_URL}/users?page=${page}&size=${size}`;
    if (role) url += `&role=${role}`;
    if (status) url += `&status=${status}`;
    
    const response = await axios.get(url, {
      headers: getAuthHeader(),
    });
    
    // response.data.data contains the Page object
    return response.data.data;
  } catch (ex) {
    console.error('Get users error:', ex);
    toast.error(ex.response?.data?.message || 'Failed to fetch users');
    throw ex;
  }
}

// Get user by ID
export async function getUserById(id) {
  try {
    const response = await axios.get(`${API_URL}/users/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data.data;
  } catch (ex) {
    console.error('Get user error:', ex);
    toast.error(ex.response?.data?.message || 'Failed to fetch user');
    throw ex;
  }
}

// Get users by role
export async function getUsersByRole(role) {
  try {
    const response = await axios.get(`${API_URL}/users/role/${role}`, {
      headers: getAuthHeader(),
    });
    return response.data.data; // Returns array
  } catch (ex) {
    console.error('Get users by role error:', ex);
    toast.error(ex.response?.data?.message || 'Failed to fetch users');
    throw ex;
  }
}

// Update user
export async function updateUser(id, data) {
  try {
    const response = await axios.put(
      `${API_URL}/users/${id}`,
      data,
      { headers: getAuthHeader() }
    );
    toast.success('User updated successfully!');
    return response.data.data;
  } catch (ex) {
    console.error('Update user error:', ex);
    toast.error(ex.response?.data?.message || 'Failed to update user');
    throw ex;
  }
}

// Update user status
export async function updateUserStatus(id, status) {
  try {
    const response = await axios.patch(
      `${API_URL}/users/${id}/status?status=${status}`,
      {},
      { headers: getAuthHeader() }
    );
    toast.success(`User status updated to ${status}!`);
    return response.data.data;
  } catch (ex) {
    console.error('Update user status error:', ex);
    toast.error(ex.response?.data?.message || 'Failed to update user status');
    throw ex;
  }
}

// Delete user
export async function deleteUser(id) {
  try {
    const response = await axios.delete(`${API_URL}/users/${id}`, {
      headers: getAuthHeader(),
    });
    toast.success('User deleted successfully!');
    return response.data;
  } catch (ex) {
    console.error('Delete user error:', ex);
    toast.error(ex.response?.data?.message || 'Failed to delete user');
    throw ex;
  }
}