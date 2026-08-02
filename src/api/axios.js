import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log('API_BASE_URL:', API_BASE_URL);
const adminAxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add admin token
adminAxiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle unauthorized
adminAxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only handle 401 errors, but don't redirect for login requests
    if (error.response?.status === 401) {
      // Check if this is a login request (the URL contains '/login')
      const isLoginRequest = error.config?.url?.includes('/login');
      
      if (!isLoginRequest) {
        // Clear admin session only for non-login requests
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        localStorage.removeItem('adminName');
        localStorage.removeItem('adminEmail');
        localStorage.removeItem('adminRole');
        
        // Only redirect if not already on the login page
        if (window.location.pathname !== '/' && window.location.pathname !== '/login') {
          window.location.href = '/';
        }
      }
      // For login requests, just return the error without redirect
    }
    return Promise.reject(error);
  }
);

export default adminAxiosInstance;