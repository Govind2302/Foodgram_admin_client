import axios from "axios";
import { toast } from "react-toastify";
import config from "./config";
import { getAdminToken } from "./authService";

const API_URL = config.ADMIN_API;

// Get authorization header
const getAuthHeader = () => {
  const token = getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Get all delivery persons with pagination and filters
export async function getAllDeliveryPersons(page = 0, size = 10, verificationStatus = null, operatingArea = null) {
  try {
    let url = `${API_URL}/delivery-persons?page=${page}&size=${size}`;
    if (verificationStatus) url += `&verificationStatus=${verificationStatus}`;
    if (operatingArea) url += `&operatingArea=${operatingArea}`;
    
    const response = await axios.get(url, {
      headers: getAuthHeader(),
    });
    return response.data.data; // Returns Page object
  } catch (ex) {
    console.error('Get delivery persons error:', ex);
    toast.error(ex.response?.data?.message || 'Failed to fetch delivery persons');
    throw ex;
  }
}

// Get pending delivery persons
export async function getPendingDeliveryPersons(page = 0, size = 10) {
  try {
    const response = await axios.get(
      `${API_URL}/delivery-persons/pending?page=${page}&size=${size}`,
      { headers: getAuthHeader() }
    );
    return response.data.data; // Returns array
  } catch (ex) {
    console.error('Get pending delivery persons error:', ex);
    toast.error(ex.response?.data?.message || 'Failed to fetch pending delivery persons');
    throw ex;
  }
}

// Get delivery person by ID
export async function getDeliveryPersonById(id) {
  try {
    const response = await axios.get(`${API_URL}/delivery-persons/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data.data;
  } catch (ex) {
    console.error('Get delivery person error:', ex);
    toast.error(ex.response?.data?.message || 'Failed to fetch delivery person');
    throw ex;
  }
}

// Update verification status
export async function updateDeliveryPersonVerification(id, status) {
  try {
    const response = await axios.patch(
      `${API_URL}/delivery-persons/${id}/verification?status=${status}`,
      {},
      { headers: getAuthHeader() }
    );
    toast.success(`Delivery person ${status} successfully!`);
    return response.data.data;
  } catch (ex) {
    console.error('Update verification error:', ex);
    toast.error(ex.response?.data?.message || 'Failed to update verification');
    throw ex;
  }
}

// Update delivery person
export async function updateDeliveryPerson(id, data) {
  try {
    const response = await axios.put(
      `${API_URL}/delivery-persons/${id}`,
      data,
      { headers: getAuthHeader() }
    );
    toast.success('Delivery person updated successfully!');
    return response.data.data;
  } catch (ex) {
    console.error('Update delivery person error:', ex);
    toast.error(ex.response?.data?.message || 'Failed to update delivery person');
    throw ex;
  }
}

// Delete delivery person
export async function deleteDeliveryPerson(id) {
  try {
    const response = await axios.delete(`${API_URL}/delivery-persons/${id}`, {
      headers: getAuthHeader(),
    });
    toast.success('Delivery person deleted successfully!');
    return response.data;
  } catch (ex) {
    console.error('Delete delivery person error:', ex);
    toast.error(ex.response?.data?.message || 'Failed to delete delivery person');
    throw ex;
  }
}