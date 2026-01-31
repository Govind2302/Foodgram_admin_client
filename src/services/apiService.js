import axios from "axios";
import { toast } from "react-toastify";
import config from "./config";
import { getAdminToken, logoutAdmin } from "./authService";

// Create axios instance
const api = axios.create({
    baseURL: config.ADMIN_API,
});

// Add token to every request
api.interceptors.request.use(
    (config) => {
        const token = getAdminToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle response errors
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            toast.error('Session expired. Please login again.');
            logoutAdmin();
        }
        return Promise.reject(error);
    }
);

export default api;