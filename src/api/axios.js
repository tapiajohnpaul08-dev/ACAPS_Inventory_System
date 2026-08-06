// services/admin/axios.js
import axios from 'axios';
import { useAdminLoading } from '@/composables/useAdminLoading';

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

// ─── Request counter for multiple requests ──────────────────────────────
let requestCount = 0;
let loadingTimeout = null;
// The token for the loading overlay THIS interceptor opened (if any). We
// must hold onto this and hand it back to hideLoading() - calling
// hideLoading() with no token would be a "blind" call that could close a
// completely unrelated operation's loading modal (e.g. a page-level fetch
// that opened its own overlay around several parallel GET requests).
let batchToken = null;

// ─── Request interceptor - Add admin token & show loading ──────────────
adminAxiosInstance.interceptors.request.use(
  (config) => {
    // Add admin token
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Show loading for non-GET requests or when explicitly enabled
    // Skip loading for specific endpoints or when skipLoading is true
    const shouldShowLoading = 
      config.method !== 'get' && 
      !config.skipLoading && 
      !config.url?.includes('/login') &&
      !config.url?.includes('/verify');

    if (shouldShowLoading) {
      requestCount++;
      
      // Use a small delay to prevent flashing for quick requests
      clearTimeout(loadingTimeout);
      loadingTimeout = setTimeout(() => {
        if (requestCount > 0 && !batchToken) {
          const loading = useAdminLoading();
          batchToken = loading.showLoading({
            title: config.loadingTitle || 'Processing...',
            message: config.loadingMessage || 'Please wait...',
            icon: config.loadingIcon || 'process',
            showCancel: false
          });
        }
      }, 300);
    }

    return config;
  },
  (error) => {
    // Hide loading on request error
    clearTimeout(loadingTimeout);
    requestCount = 0;
    if (batchToken) {
      const loading = useAdminLoading();
      loading.hideLoading(batchToken);
      batchToken = null;
    }
    
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// ─── Response interceptor - Handle unauthorized & hide loading ──────────
adminAxiosInstance.interceptors.response.use(
  (response) => {
    // Decrease request counter and hide loading
    requestCount--;
    if (requestCount <= 0) {
      requestCount = 0;
      clearTimeout(loadingTimeout);
      
      // Small delay to ensure UI doesn't flicker
      setTimeout(() => {
        if (batchToken) {
          const loading = useAdminLoading();
          loading.hideLoading(batchToken);
          batchToken = null;
        }
      }, 200);
    }
    
    return response;
  },
  (error) => {
    // Hide loading on response error
    clearTimeout(loadingTimeout);
    requestCount = 0;
    if (batchToken) {
      const loading = useAdminLoading();
      loading.hideLoading(batchToken);
      batchToken = null;
    }

    // Handle 401 errors
    if (error.response?.status === 401) {
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
    }
    
    return Promise.reject(error);
  }
);

// ─── Helper functions for custom loading control ────────────────────────

/**
 * Manually show loading with custom options.
 * Returns a token - hold onto it and pass it to hideLoading(token) when
 * your operation finishes. This keeps manual callers just as safe as the
 * interceptor: nobody can accidentally close someone else's overlay.
 */
adminAxiosInstance.showLoading = (options = {}) => {
  const loading = useAdminLoading();
  return loading.showLoading({
    title: options.title || 'Processing...',
    message: options.message || 'Please wait...',
    icon: options.icon || 'process',
    showProgress: options.showProgress || false,
    progress: options.progress || 0,
    progressLabel: options.progressLabel || 'Progress',
    showCancel: options.showCancel || false,
    cancelText: options.cancelText || 'Cancel',
    duration: options.duration || 0,
    onCancel: options.onCancel || null,
    onComplete: options.onComplete || null
  });
};

/**
 * Manually hide loading. Pass the token you got back from showLoading().
 */
adminAxiosInstance.hideLoading = (token) => {
  const loading = useAdminLoading();
  loading.hideLoading(token);
};

/**
 * Update loading progress
 */
adminAxiosInstance.updateProgress = (progress, label = null) => {
  const loading = useAdminLoading();
  loading.updateProgress(progress, label);
};

/**
 * Reset loading state
 */
adminAxiosInstance.resetLoading = () => {
  const loading = useAdminLoading();
  loading.resetLoading();
  requestCount = 0;
  batchToken = null;
  clearTimeout(loadingTimeout);
};

export default adminAxiosInstance;