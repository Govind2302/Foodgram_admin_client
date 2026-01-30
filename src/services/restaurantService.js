import axios from "axios";
import { toast } from "react-toastify";
import config from "./config";
import { getAdminToken } from "./authService";
import api from "./apiService";


const API_URL = config.ADMIN_API;

// Get authorization header
const getAuthHeader = () => {
  const token = getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Get all restaurants with pagination and filters
export async function getAllRestaurants(page = 0, size = 10, verificationStatus = null, cuisineType = null) {
  try {
    let url = `${API_URL}/restaurants?page=${page}&size=${size}`;
    if (verificationStatus) url += `&verificationStatus=${verificationStatus}`;
    if (cuisineType) url += `&cuisineType=${cuisineType}`;
    
    const response = await api.get(url, {
      headers: getAuthHeader(),
    });
    return response.data.data; // Page object
  } catch (ex) {
    console.error('Get restaurants error:', ex);
    toast.error(ex.response?.data?.message || 'Failed to fetch restaurants');
    throw ex;
  }
}

// Get pending restaurants
export async function getPendingRestaurants() {
  try {
    const response = await axios.get(`${API_URL}/restaurants/pending`, {
      headers: getAuthHeader(),
    });
    return response.data.data; // Array
  } catch (ex) {
    console.error('Get pending restaurants error:', ex);
    toast.error(ex.response?.data?.message || 'Failed to fetch pending restaurants');
    throw ex;
  }
}

// Get restaurant by ID
export async function getRestaurantById(id) {
  try {
    const response = await axios.get(`${API_URL}/restaurants/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data.data;
  } catch (ex) {
    console.error('Get restaurant error:', ex);
    toast.error(ex.response?.data?.message || 'Failed to fetch restaurant');
    throw ex;
  }
}

// Update verification status
export async function updateRestaurantVerification(id, status) {
  try {
    const response = await axios.patch(
      `${API_URL}/restaurants/${id}/verification?status=${status}`,
      {},
      { headers: getAuthHeader() }
    );
    toast.success(`Restaurant ${status} successfully!`);
    return response.data.data;
  } catch (ex) {
    console.error('Update verification error:', ex);
    toast.error(ex.response?.data?.message || 'Failed to update verification');
    throw ex;
  }
}

// Update restaurant
export async function updateRestaurant(id, data) {
  try {
    const response = await axios.put(
      `${API_URL}/restaurants/${id}`,
      data,
      { headers: getAuthHeader() }
    );
    toast.success('Restaurant updated successfully!');
    return response.data.data;
  } catch (ex) {
    console.error('Update restaurant error:', ex);
    toast.error(ex.response?.data?.message || 'Failed to update restaurant');
    throw ex;
  }
}


// Delete restaurant
export async function deleteRestaurant(id) {
  try {
    const response = await axios.delete(`${API_URL}/restaurants/${id}`, {
      headers: getAuthHeader(),
    });
    toast.success('Restaurant deleted successfully!');
    return response.data;
  } catch (ex) {
    console.error('Delete restaurant error:', ex);
    toast.error(ex.response?.data?.message || 'Failed to delete restaurant');
    throw ex;
  }
}