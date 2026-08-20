// src/admin/api/api.js
// Admin Side API calls - Connected to your Express/MongoDB backend

import adminAxiosInstance from './axios';

// Helper function to handle API responses
const handleResponse = async (request) => {
  try {
    const response = await request;
    return { success: true, ...response.data };
  } catch (error) {
    console.error('Admin API Error:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status
    };
  }
};

// =============================================================================
// AUTHENTICATION
// =============================================================================

export const adminAuthApi = {
  async login(email, password) {
    return handleResponse(
      adminAxiosInstance.post('/admin/login', { email, password })
    );
  },

  async logout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminName');
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminRole');
    
    return handleResponse(
      adminAxiosInstance.post('/admin/logout')
    );
  },

  async verifyToken() {
    return handleResponse(
      adminAxiosInstance.get('/admin/verify')
    );
  },

  async getProfile() {
    return handleResponse(
      adminAxiosInstance.get('/admin/profile')
    );
  },
};

// =============================================================================
// CUSTOMER MANAGEMENT
// =============================================================================

export const adminCustomerApi = {
  async getAllCustomers() {
    return handleResponse(
      adminAxiosInstance.get('/admin/allCustomers')
    );
  },

  async getCustomerById(customerId) {
    return handleResponse(
      adminAxiosInstance.get(`/admin/customer/${customerId}`)
    );
  },

  async deleteCustomer(customerId) {
    return handleResponse(
      adminAxiosInstance.delete(`/admin/customer/${customerId}`)
    );
  },

  async updateCustomer(customerId, data) {
    return handleResponse(
      adminAxiosInstance.put(`/customer/${customerId}`, data)
    );
  },
};

// =============================================================================
// ADMIN MANAGEMENT
// =============================================================================

export const adminManagementApi = {
  async getAllAdmins() {
    return handleResponse(
      adminAxiosInstance.get('/admin/allAdmins')
    );
  },

  async getAdminById(adminId) {
    return handleResponse(
      adminAxiosInstance.get(`/admin/admin/${adminId}`)
    );
  },

  async createAdmin(adminData) {
    return handleResponse(
      adminAxiosInstance.post('/admin/register', adminData)
    );
  },

  async updateAdmin(adminId, adminData) {
    return handleResponse(
      adminAxiosInstance.put(`/admin/admin/${adminId}`, adminData)
    );
  },

  async deleteAdmin(adminId) {
    return handleResponse(
      adminAxiosInstance.delete(`/admin/admin/${adminId}`)
    );
  },
};

// =============================================================================
// PRODUCT MANAGEMENT
// =============================================================================

export const adminProductApi = {
  async getAllProducts() {
    return handleResponse(
      adminAxiosInstance.get('/product')
    );
  },

  async getFeaturedProducts() {
    return handleResponse(
      adminAxiosInstance.get('/product/featured')
    );
  },

  async getPopularProducts() {
    return handleResponse(
      adminAxiosInstance.get('/product/popular')
    );
  },

  async getProductById(productId) {
    return handleResponse(
      adminAxiosInstance.get(`/product/${productId}`)
    );
  },

  async getProductsByCategory(category) {
    return handleResponse(
      adminAxiosInstance.get(`/product/category/${category}`)
    );
  },

  async createProduct(productData) {
    return handleResponse(
      adminAxiosInstance.post('/product/create', productData)
    );
  },

  async updateProduct(productId, productData) {
    return handleResponse(
      adminAxiosInstance.put(`/product/update/${productId}`, productData)
    );
  },

  async deleteProduct(productId) {
    return handleResponse(
      adminAxiosInstance.delete(`/product/delete/${productId}`)
    );
  },

  async updateSizeStock(productId, sizeName, stock) {
    return handleResponse(
      adminAxiosInstance.patch(`/product/${productId}/size/${sizeName}/stock`, { stock })
    );
  },

  async reduceSizeStock(productId, sizeName, quantity) {
    return handleResponse(
      adminAxiosInstance.post(`/product/${productId}/size/${sizeName}/reduce-stock`, { quantity })
    );
  },
};

// =============================================================================
// SIZE MANAGEMENT
// =============================================================================

export const adminSizeApi = {
  async getAllSizes(productId) {
    return handleResponse(
      adminAxiosInstance.get(`/product/${productId}/sizes`)
    );
  },

  async getSizeDetails(productId, sizeName) {
    return handleResponse(
      adminAxiosInstance.get(`/product/${productId}/size/${sizeName}`)
    );
  },

  async addSize(productId, sizeData) {
    return handleResponse(
      adminAxiosInstance.post(`/product/${productId}/size`, sizeData)
    );
  },

  async updateSize(productId, sizeName, sizeData) {
    return handleResponse(
      adminAxiosInstance.put(`/product/${productId}/size/${sizeName}`, sizeData)
    );
  },

  async updateBulkPrices(productId, sizeName, bulkPrices) {
    return handleResponse(
      adminAxiosInstance.patch(`/product/${productId}/size/${sizeName}/bulk-prices`, { bulkPrices })
    );
  },

  async removeSize(productId, sizeName) {
    return handleResponse(
      adminAxiosInstance.delete(`/product/${productId}/size/${sizeName}`)
    );
  },
};

// =============================================================================
// SUPPLY MANAGEMENT
// =============================================================================

export const supplyApi = {
  async getAllSupplies() {
    return handleResponse(
      adminAxiosInstance.get('/supplies')
    );
  },

  async getActiveSupplies() {
    return handleResponse(
      adminAxiosInstance.get('/supplies/active')
    );
  },

  async getSuppliesByCategory(category) {
    return handleResponse(
      adminAxiosInstance.get(`/supplies/category/${category}`)
    );
  },

  async getSupplyById(supplyId) {
    return handleResponse(
      adminAxiosInstance.get(`/supplies/${supplyId}`)
    );
  },

  async createSupply(supplyData) {
    return handleResponse(
      adminAxiosInstance.post('/supplies', supplyData)
    );
  },

  async updateSupply(supplyId, supplyData) {
    return handleResponse(
      adminAxiosInstance.put(`/supplies/${supplyId}`, supplyData)
    );
  },

  async deleteSupply(supplyId) {
    return handleResponse(
      adminAxiosInstance.delete(`/supplies/${supplyId}`)
    );
  },
};

// =============================================================================
// UNIFIED INVENTORY MANAGEMENT
// =============================================================================

export const inventoryApi = {
  async getAllInventory() {
    return handleResponse(
      adminAxiosInstance.get('/inventory')
    );
  },

  async getInventoryByType(type) {
    return handleResponse(
      adminAxiosInstance.get(`/inventory/type/${type}`)
    );
  },

  async getInventoryById(itemId) {
    return handleResponse(
      adminAxiosInstance.get(`/inventory/${itemId}`)
    );
  },

  async addProductToInventory(productId, inventoryData) {
    return handleResponse(
      adminAxiosInstance.post(`/inventory/products/${productId}`, inventoryData)
    );
  },

  async addSupplyToInventory(supplyId, inventoryData) {
    return handleResponse(
      adminAxiosInstance.post(`/inventory/supplies/${supplyId}`, inventoryData)
    );
  },

  async updateInventoryItem(itemId, inventoryData) {
    return handleResponse(
      adminAxiosInstance.put(`/inventory/${itemId}`, inventoryData)
    );
  },

  async updateStock(itemId, quantity, operation = 'set') {
    return handleResponse(
      adminAxiosInstance.patch(`/inventory/${itemId}/stock`, { quantity, operation })
    );
  },

  async deleteInventoryItem(itemId) {
    return handleResponse(
      adminAxiosInstance.delete(`/inventory/${itemId}`)
    );
  },

  async getLowStockItems() {
    return handleResponse(
      adminAxiosInstance.get('/inventory/low-stock')
    );
  },

  async getOutOfStockItems() {
    return handleResponse(
      adminAxiosInstance.get('/inventory/out-of-stock')
    );
  },

  async getInventoryStatistics() {
    return handleResponse(
      adminAxiosInstance.get('/inventory/statistics')
    );
  },
};

// =============================================================================
// ORDER MANAGEMENT
// =============================================================================

export const adminOrderApi = {
  async getAllOrders(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return handleResponse(
      adminAxiosInstance.get(`/order/admin/all${params ? `?${params}` : ''}`)
    );
  },

  async getOrderById(orderId) {
    return handleResponse(
      adminAxiosInstance.get(`/order/admin/orders/${orderId}`)
    );
  },

  updateOrderStatus: async (orderId, data) => {
    return handleResponse(
      adminAxiosInstance.patch(`/order/admin/orders/${orderId}/status`, data)
    );
  },

  async updatePaymentStatus(orderId, paymentData) {
    const paymentStatus = typeof paymentData === 'string' ? paymentData : paymentData.paymentStatus;
    const amountPaid = paymentData.amountPaid || null;
    return handleResponse(
      adminAxiosInstance.patch(`/order/admin/orders/${orderId}/payment`, { paymentStatus, amountPaid })
    );
  },

  async updateOrder(orderId, orderData) {
    return handleResponse(
      adminAxiosInstance.put(`/order/admin/orders/${orderId}`, orderData)
    );
  },

  async deleteOrder(orderId) {
    return handleResponse(
      adminAxiosInstance.delete(`/order/admin/orders/${orderId}`)
    );
  },

  async getOrderStatistics() {
    return handleResponse(
      adminAxiosInstance.get('/order/admin/statistics')
    );
  },

  async getOrdersByDateRange(startDate, endDate) {
    return handleResponse(
      adminAxiosInstance.get(`/order/admin/date-range?startDate=${startDate}&endDate=${endDate}`)
    );
  },

  async getOrdersByCustomer(email) {
    return handleResponse(
      adminAxiosInstance.get(`/order/admin/customers/${email}/orders`)
    );
  },
};

// =============================================================================
// DASHBOARD STATISTICS
// =============================================================================

export const adminDashboardApi = {
  async getStats() {
    return handleResponse(
      adminAxiosInstance.get('/admin/stats')
    );
  },

  async getRecentOrders(limit = 5) {
    return handleResponse(
      adminAxiosInstance.get(`/admin/recent-orders?limit=${limit}`)
    );
  },

  async getLowStockItems() {
    return handleResponse(
      adminAxiosInstance.get('/inventory/low-stock')
    );
  },

  async getRevenueByCategory() {
    return handleResponse(
      adminAxiosInstance.get('/admin/revenue-by-category')
    );
  },

  async getWeeklySales() {
    return handleResponse(
      adminAxiosInstance.get('/admin/weekly-sales')
    );
  },
};

// =============================================================================
// ANALYTICS
// =============================================================================

export const analyticsApi = {
  async getStats(dateFrom, dateTo) {
    const params = new URLSearchParams();
    if (dateFrom) params.set('date_from', dateFrom);
    if (dateTo)   params.set('date_to',   dateTo);
    return handleResponse(adminAxiosInstance.get(`/analytics/stats?${params}`));
  },

  async getTopProducts(limit = 5, dateFrom, dateTo) {
    const params = new URLSearchParams({ limit });
    if (dateFrom) params.set('date_from', dateFrom);
    if (dateTo)   params.set('date_to',   dateTo);
    return handleResponse(adminAxiosInstance.get(`/analytics/top-products?${params}`));
  },

  async getOrderStatusDistribution(dateFrom, dateTo) {
    const params = new URLSearchParams();
    if (dateFrom) params.set('date_from', dateFrom);
    if (dateTo)   params.set('date_to',   dateTo);
    return handleResponse(adminAxiosInstance.get(`/analytics/order-status-distribution?${params}`));
  },

  async getRevenueByCategory(dateFrom, dateTo) {
    const params = new URLSearchParams();
    if (dateFrom) params.set('date_from', dateFrom);
    if (dateTo)   params.set('date_to',   dateTo);
    return handleResponse(adminAxiosInstance.get(`/analytics/revenue-by-category?${params}`));
  },

  async getMonthlyRevenue(months = 12) {
    return handleResponse(adminAxiosInstance.get(`/analytics/monthly-revenue?months=${months}`));
  },

  async getFilteredAnalytics(dateFrom, dateTo, groupBy = 'month') {
    const params = new URLSearchParams({ group_by: groupBy });
    if (dateFrom) params.set('date_from', dateFrom);
    if (dateTo)   params.set('date_to',   dateTo);
    return handleResponse(adminAxiosInstance.get(`/analytics/filter?${params}`));
  },

  async getRevenueForecast() {
    return handleResponse(adminAxiosInstance.get('/analytics/forecast'));
  },

  async getLowStockProducts(threshold = 500) {
    return handleResponse(adminAxiosInstance.get(`/analytics/products/low-stock?threshold=${threshold}`));
  },

  async getTopCustomers(limit = 10) {
    return handleResponse(adminAxiosInstance.get(`/analytics/customers/top?limit=${limit}`));
  },
};

// =============================================================================
// ALERTS
// =============================================================================

export const alertApi = {
  async sendItemAlert(itemId, forceSend = false) {
    return handleResponse(
      adminAxiosInstance.post('/alerts/item', { itemId, forceSend })
    );
  },

  async sendProductSizeAlert(productId, sizeName) {
    return handleResponse(
      adminAxiosInstance.post('/alerts/product-size', { productId, sizeName })
    );
  },

  async scanAndAlertAll() {
    return handleResponse(
      adminAxiosInstance.post('/alerts/scan-all')
    );
  },

  async sendSummaryReport() {
    return handleResponse(
      adminAxiosInstance.post('/alerts/summary')
    );
  },
};

// =============================================================================
// STOCK MOVEMENT
// =============================================================================

export const stockMovementApi = {
  async getMovementHistory(itemId, limit = 50) {
    return handleResponse(
      adminAxiosInstance.get(`/inventory/${itemId}/movements?limit=${limit}`)
    );
  },

  async recordMovement(itemId, movementData) {
    return handleResponse(
      adminAxiosInstance.post(`/inventory/${itemId}/movements`, movementData)
    );
  }
};

// =============================================================================
// CHAT
// =============================================================================

export const adminChatApi = {
  async getConversations(status = null, adminId = null) {
    let url = '/chat/admin/conversations';
    const params = [];
    if (status) params.push(`status=${status}`);
    if (adminId) params.push(`admin_id=${adminId}`);
    if (params.length) url += `?${params.join('&')}`;
    return handleResponse(adminAxiosInstance.get(url));
  },

  async getMessages(conversationId, limit = 50, before = null) {
    let url = `/chat/admin/conversations/${conversationId}/messages?limit=${limit}`;
    if (before) url += `&before=${before}`;
    return handleResponse(adminAxiosInstance.get(url));
  },

  async sendMessage(conversationId, content, attachments = [], replyToMessageId = null) {
    console.log('📨 adminChatApi.sendMessage called with:', { 
      conversationId, 
      content, 
      attachments: attachments?.length || 0,
      replyToMessageId 
    });
    return handleResponse(
      adminAxiosInstance.post('/chat/admin/messages', { 
        conversationId, 
        content, 
        attachments,
        replyToMessageId 
      })
    );
  },

  async assignConversation(conversationId) {
    return handleResponse(
      adminAxiosInstance.patch(`/chat/admin/conversations/${conversationId}/assign`)
    );
  },

  async updateStatus(conversationId, status) {
    return handleResponse(
      adminAxiosInstance.patch(`/chat/admin/conversations/${conversationId}/status`, { status })
    );
  },

  async getUnreadCount() {
    return handleResponse(adminAxiosInstance.get('/chat/admin/unread-count'));
  },

  async unsendMessage(messageId) {
    return handleResponse(
      adminAxiosInstance.delete(`/chat/admin/messages/${messageId}`)
    );
  },
};

// =============================================================================
// DRIVER MANAGEMENT
// =============================================================================

export const adminDriverApi = {
  async getAllDrivers(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return handleResponse(
      adminAxiosInstance.get(`/drivers/all${params ? `?${params}` : ''}`)
    );
  },

  async getAvailableDrivers() {
    return handleResponse(
      adminAxiosInstance.get('/drivers/available')
    );
  },

  async getDriverById(driverId) {
    return handleResponse(
      adminAxiosInstance.get(`/drivers/${driverId}`)
    );
  },

  async createDriver(driverData) {
    return handleResponse(
      adminAxiosInstance.post('/drivers/create', driverData)
    );
  },

  async updateDriver(driverId, driverData) {
    return handleResponse(
      adminAxiosInstance.put(`/drivers/${driverId}`, driverData)
    );
  },

  async deleteDriver(driverId) {
    return handleResponse(
      adminAxiosInstance.delete(`/drivers/${driverId}`)
    );
  },

  async toggleAvailability(driverId) {
    return handleResponse(
      adminAxiosInstance.patch(`/drivers/${driverId}/toggle-availability`)
    );
  },
};

// =============================================================================
// ✅ FEEDBACK API (Customer Insights)
// =============================================================================

export const feedBackApi = {
  // ─── Admin Routes ──────────────────────────────────────────────────────────

  // Get all feedback with filters (admin)
  getAllFeedback: async (filters = {}, limit = 20, page = 1) => {
    return handleResponse(
      adminAxiosInstance.get('/feedback/admin/all', {
        params: { ...filters, limit, page }
      })
    );
  },

  // Get feedback statistics (admin)
  getAdminFeedbackStats: async () => {
    return handleResponse(
      adminAxiosInstance.get('/feedback/admin/stats')
    );
  },

  // Update feedback status (admin)
  updateFeedbackStatus: async (feedbackId, status, adminResponse) => {
    return handleResponse(
      adminAxiosInstance.put(`/feedback/admin/${feedbackId}`, {
        status,
        adminResponse
      })
    );
  },

  // Delete feedback (admin)
  deleteFeedback: async (feedbackId) => {
    return handleResponse(
      adminAxiosInstance.delete(`/feedback/admin/${feedbackId}`)
    );
  },

  // ─── Customer Routes (For reference - these use customer axios instance) ──
  // Note: These are for customer-side use, not admin
  // They are included here for completeness but use customer endpoints

  // Submit feedback for an order (customer)
  submitFeedback: async (data) => {
    // This would use the customer axios instance
    // For admin API, this is just a reference
    return handleResponse(
      adminAxiosInstance.post('/feedback', data)
    );
  },

  // Check if feedback exists for an order
  checkFeedbackExists: async (orderId) => {
    return handleResponse(
      adminAxiosInstance.get(`/feedback/order/${orderId}/check`)
    );
  },

  // Get customer's own feedback
  getMyFeedback: async () => {
    return handleResponse(
      adminAxiosInstance.get('/feedback/my-feedback')
    );
  },

  // Get feedback for a specific order
  getFeedbackByOrder: async (orderId) => {
    return handleResponse(
      adminAxiosInstance.get(`/feedback/order/${orderId}`)
    );
  },

  // Get product feedback (public)
  getProductFeedback: async (productId, limit = 20, page = 1) => {
    return handleResponse(
      adminAxiosInstance.get(`/feedback/product/${productId}`, {
        params: { limit, page }
      })
    );
  },

  // Get product feedback stats (public)
  getProductFeedbackStats: async (productId) => {
    return handleResponse(
      adminAxiosInstance.get(`/feedback/product/${productId}/stats`)
    );
  },

  // Mark feedback as helpful (public)
  markHelpful: async (feedbackId) => {
    return handleResponse(
      adminAxiosInstance.post(`/feedback/${feedbackId}/helpful`)
    );
  },
};

// =============================================================================
// BACKWARD COMPATIBILITY
// =============================================================================

export const productApi = {
  async getAllProducts() {
    return adminProductApi.getAllProducts();
  },
  
  async getProductById(id) {
    return handleResponse(
      adminAxiosInstance.get(`/product/${id}`)
    );
  },
  
  async createProduct(productData) {
    if (productData instanceof FormData) {
      return handleResponse(
        adminAxiosInstance.post('/product/create', productData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      );
    }
    return handleResponse(
      adminAxiosInstance.post('/product/create', productData)
    );
  },
  
  async updateProduct(productId, productData) {
    if (productData instanceof FormData) {
      return handleResponse(
        adminAxiosInstance.put(`/product/update/${productId}`, productData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      );
    }
    return handleResponse(
      adminAxiosInstance.put(`/product/update/${productId}`, productData)
    );
  },
  
  async deleteProduct(id) {
    return adminProductApi.deleteProduct(id);
  },

  async updateSizeStock(productId, sizeName, stock) {
    console.log(`Updating stock for product ${productId}, size ${sizeName} to ${stock}`);
    return handleResponse(
      adminAxiosInstance.patch(`/product/${productId}/size/${sizeName}/stock`, { stock })
    );
  },

  async reduceSizeStock(productId, sizeName, quantity) {
    try {
      const product = await this.getProductById(productId);
      if (product.success && product.data) {
        const size = product.data.sizes?.find(s => s.name === sizeName);
        if (size) {
          const newStock = Math.max(0, (size.stock || 0) - quantity);
          return this.updateSizeStock(productId, sizeName, newStock);
        }
      }
      return { success: false, message: 'Size not found' };
    } catch (error) {
      console.error('Error reducing stock:', error);
      return { success: false, message: error.message };
    }
  },
};

export const legacyInventoryApi = {
  async getAllItems() {
    return inventoryApi.getInventoryByType('supply');
  },
  async getItemById(itemId) {
    return inventoryApi.getInventoryById(itemId);
  },
  async createItem(data) {
    console.warn('createItem is deprecated. Use supplyApi.createSupply() then inventoryApi.addSupplyToInventory()');
    return { success: false, message: 'Use supplyApi.createSupply() instead' };
  },
  async updateItem(itemId, data) {
    return inventoryApi.updateInventoryItem(itemId, data);
  },
  async deleteItem(itemId) {
    return inventoryApi.deleteInventoryItem(itemId);
  },
  async updateStock(itemId, quantity, operation) {
    return inventoryApi.updateStock(itemId, quantity, operation);
  },
  async getLowStockItems() {
    return inventoryApi.getLowStockItems();
  },
  async getOutOfStockItems() {
    return inventoryApi.getOutOfStockItems();
  },
  async getStatistics() {
    return inventoryApi.getInventoryStatistics();
  },
  async notifyLowStock(itemId) {
    return handleResponse(
      adminAxiosInstance.post('/alerts/item', { itemId, forceSend: true })
    );
  }
};

// =============================================================================
// Export all APIs
// =============================================================================

export default {
  auth: adminAuthApi,
  customers: adminCustomerApi,
  admins: adminManagementApi,
  products: adminProductApi,
  sizes: adminSizeApi,
  supplies: supplyApi,
  inventory: inventoryApi,
  orders: adminOrderApi,
  dashboard: adminDashboardApi,
  analytics: analyticsApi,
  alerts: alertApi,
  stockMovement: stockMovementApi,
  legacyInventory: legacyInventoryApi,
  chat: adminChatApi,
  drivers: adminDriverApi,
  feedback: feedBackApi, // ✅ Added feedback
};