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

// Get all reviews with pagination and filters
export async function getAllReviews(page = 0, size = 10, restaurantId = null, deliveryPersonId = null) {
  try {
    let url = `${API_URL}/reviews?page=${page}&size=${size}`;
    if (restaurantId) url += `&restaurantId=${restaurantId}`;
    if (deliveryPersonId) url += `&deliveryPersonId=${deliveryPersonId}`;
    
    const response = await axios.get(url, {
      headers: getAuthHeader(),
    });
    return response.data.data; // Page object
  } catch (ex) {
    console.error('Get reviews error:', ex);
    toast.error(ex.response?.data?.message || 'Failed to fetch reviews');
    throw ex;
  }
}

// Get review by ID
export async function getReviewById(id) {
  try {
    const response = await axios.get(`${API_URL}/reviews/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data.data;
  } catch (ex) {
    console.error('Get review error:', ex);
    toast.error(ex.response?.data?.message || 'Failed to fetch review');
    throw ex;
  }
}

// Get reviews by restaurant
export async function getReviewsByRestaurant(restaurantId) {
  try {
    const response = await axios.get(`${API_URL}/reviews/restaurant/${restaurantId}`, {
      headers: getAuthHeader(),
    });
    return response.data.data; // Array
  } catch (ex) {
    console.error('Get restaurant reviews error:', ex);
    toast.error(ex.response?.data?.message || 'Failed to fetch restaurant reviews');
    throw ex;
  }
}

// Get reviews by delivery person
export async function getReviewsByDeliveryPerson(deliveryPersonId) {
  try {
    const response = await axios.get(`${API_URL}/reviews/delivery-person/${deliveryPersonId}`, {
      headers: getAuthHeader(),
    });
    return response.data.data; // Array
  } catch (ex) {
    console.error('Get delivery person reviews error:', ex);
    toast.error(ex.response?.data?.message || 'Failed to fetch delivery person reviews');
    throw ex;
  }
}

// Get average rating for restaurant
export async function getRestaurantAverageRating(restaurantId) {
  try {
    const response = await axios.get(`${API_URL}/reviews/restaurant/${restaurantId}/rating`, {
      headers: getAuthHeader(),
    });
    return response.data.data;
  } catch (ex) {
    console.error('Get restaurant rating error:', ex);
    throw ex;
  }
}

// Get average rating for delivery person
export async function getDeliveryPersonAverageRating(deliveryPersonId) {
  try {
    const response = await axios.get(`${API_URL}/reviews/delivery-person/${deliveryPersonId}/rating`, {
      headers: getAuthHeader(),
    });
    return response.data.data;
  } catch (ex) {
    console.error('Get delivery person rating error:', ex);
    throw ex;
  }
}

// Delete review
export async function deleteReview(id) {
  try {
    const response = await axios.delete(`${API_URL}/reviews/${id}`, {
      headers: getAuthHeader(),
    });
    toast.success('Review deleted successfully!');
    return response.data;
  } catch (ex) {
    console.error('Delete review error:', ex);
    toast.error(ex.response?.data?.message || 'Failed to delete review');
    throw ex;
  }
}