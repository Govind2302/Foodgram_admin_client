import axios from "axios";
import { toast } from "react-toastify";
import config from "./config";
import { getAdminToken } from "./authService";

const API_URL = config.BASE_URL + '/admin';

// Get authorization header
const getAuthHeader = () => {
  const token = getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Get all complaints with pagination and filters
export async function getAllComplaints(page = 0, size = 10, status = null) {
  try {
    let url = `${API_URL}/complaints?page=${page}&size=${size}`;
    if (status) url += `&status=${status}`;
    
    const response = await axios.get(url, {
      headers: getAuthHeader(),
    });
    return response.data.data; // Page object
  } catch (ex) {
    console.error('Get complaints error:', ex);
    toast.error(ex.response?.data?.message || 'Failed to fetch complaints');
    throw ex;
  }
}

// Get new complaints
export async function getNewComplaints() {
  try {
    const response = await axios.get(`${API_URL}/complaints/new`, {
      headers: getAuthHeader(),
    });
    return response.data.data; // Array
  } catch (ex) {
    console.error('Get new complaints error:', ex);
    toast.error(ex.response?.data?.message || 'Failed to fetch new complaints');
    throw ex;
  }
}

// Get complaint by ID
export async function getComplaintById(id) {
  try {
    const response = await axios.get(`${API_URL}/complaints/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data.data;
  } catch (ex) {
    console.error('Get complaint error:', ex);
    toast.error(ex.response?.data?.message || 'Failed to fetch complaint');
    throw ex;
  }
}

// Add response to complaint
export async function addComplaintResponse(id, responseText) {
  try {
    const response = await axios.put(
      `${API_URL}/complaints/${id}/response?response=${encodeURIComponent(responseText)}`,
      {},
      { headers: getAuthHeader() }
    );
    toast.success('Response added successfully!');
    return response.data.data;
  } catch (ex) {
    console.error('Add complaint response error:', ex);
    toast.error(ex.response?.data?.message || 'Failed to add response');
    throw ex;
  }
}

// Update complaint status
export async function updateComplaintStatus(id, status) {
  try {
    const response = await axios.patch(
      `${API_URL}/complaints/${id}/status?status=${status}`,
      {},
      { headers: getAuthHeader() }
    );
    toast.success(`Complaint status updated to ${status}!`);
    return response.data.data;
  } catch (ex) {
    console.error('Update complaint status error:', ex);
    toast.error(ex.response?.data?.message || 'Failed to update status');
    throw ex;
  }
}

// Delete complaint
export async function deleteComplaint(id) {
  try {
    const response = await axios.delete(`${API_URL}/complaints/${id}`, {
      headers: getAuthHeader(),
    });
    toast.success('Complaint deleted successfully!');
    return response.data;
  } catch (ex) {
    console.error('Delete complaint error:', ex);
    toast.error(ex.response?.data?.message || 'Failed to delete complaint');
    throw ex;
  }
}