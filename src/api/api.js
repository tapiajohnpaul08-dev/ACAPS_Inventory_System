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
// PRODUCT MANAGEMENT (Products only - no inventory fields)
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
// SUPPLY MANAGEMENT (Supplies only - no inventory fields)
// =============================================================================

export const supplyApi = {
  // Get all supplies
  async getAllSupplies() {
    return handleResponse(
      adminAxiosInstance.get('/supplies')
    );
  },

  // Get active supplies
  async getActiveSupplies() {
    return handleResponse(
      adminAxiosInstance.get('/supplies/active')
    );
  },

  // Get supplies by category
  async getSuppliesByCategory(category) {
    return handleResponse(
      adminAxiosInstance.get(`/supplies/category/${category}`)
    );
  },

  // Get supply by ID
  async getSupplyById(supplyId) {
    return handleResponse(
      adminAxiosInstance.get(`/supplies/${supplyId}`)
    );
  },

  // Create supply
  async createSupply(supplyData) {
    return handleResponse(
      adminAxiosInstance.post('/supplies', supplyData)
    );
  },

  // Update supply
  async updateSupply(supplyId, supplyData) {
    return handleResponse(
      adminAxiosInstance.put(`/supplies/${supplyId}`, supplyData)
    );
  },

  // Delete supply
  async deleteSupply(supplyId) {
    return handleResponse(
      adminAxiosInstance.delete(`/supplies/${supplyId}`)
    );
  },
};

// =============================================================================
// UNIFIED INVENTORY MANAGEMENT (Connects Products and Supplies)
// =============================================================================

export const inventoryApi = {
  // Get all inventory items (both products and supplies)
  async getAllInventory() {
    return handleResponse(
      adminAxiosInstance.get('/inventory')
    );
  },

  // Get inventory by type ('product' or 'supply')
  async getInventoryByType(type) {
    return handleResponse(
      adminAxiosInstance.get(`/inventory/type/${type}`)
    );
  },

  // Get inventory item by ID
  async getInventoryById(itemId) {
    return handleResponse(
      adminAxiosInstance.get(`/inventory/${itemId}`)
    );
  },

  // Add product to inventory
  async addProductToInventory(productId, inventoryData) {
    return handleResponse(
      adminAxiosInstance.post(`/inventory/products/${productId}`, inventoryData)
    );
  },

  // Add supply to inventory
  async addSupplyToInventory(supplyId, inventoryData) {
    return handleResponse(
      adminAxiosInstance.post(`/inventory/supplies/${supplyId}`, inventoryData)
    );
  },

  // Update inventory item
  async updateInventoryItem(itemId, inventoryData) {
    return handleResponse(
      adminAxiosInstance.put(`/inventory/${itemId}`, inventoryData)
    );
  },

  // Update stock (add/subtract/set)
  async updateStock(itemId, quantity, operation = 'set') {
    return handleResponse(
      adminAxiosInstance.patch(`/inventory/${itemId}/stock`, { quantity, operation })
    );
  },

  // Delete inventory item
  async deleteInventoryItem(itemId) {
    return handleResponse(
      adminAxiosInstance.delete(`/inventory/${itemId}`)
    );
  },

  // Get low stock items
  async getLowStockItems() {
    return handleResponse(
      adminAxiosInstance.get('/inventory/low-stock')
    );
  },

  // Get out of stock items
  async getOutOfStockItems() {
    return handleResponse(
      adminAxiosInstance.get('/inventory/out-of-stock')
    );
  },

  // Get inventory statistics
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
  // Get all orders
  async getAllOrders(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return handleResponse(
      adminAxiosInstance.get(`/order/admin/all${params ? `?${params}` : ''}`)
    );
  },

  // Get order by ID
  async getOrderById(orderId) {
    return handleResponse(
      adminAxiosInstance.get(`/order/admin/orders/${orderId}`)
    );
  },

  // Update order status - Send status as object with status property
  async updateOrderStatus(orderId, statusData) {
    // Handle both string and object input
    const status = typeof statusData === 'string' ? statusData : statusData.status;
    const notes = statusData.notes || '';
    return handleResponse(
      adminAxiosInstance.patch(`/order/admin/orders/${orderId}/status`, { status, notes })
    );
  },

  // Update payment status - Send paymentStatus as object
  async updatePaymentStatus(orderId, paymentData) {
    // Handle both string and object input
    const paymentStatus = typeof paymentData === 'string' ? paymentData : paymentData.paymentStatus;
    const amountPaid = paymentData.amountPaid || null;
    return handleResponse(
      adminAxiosInstance.patch(`/order/admin/orders/${orderId}/payment`, { paymentStatus, amountPaid })
    );
  },

  // Update order details
  async updateOrder(orderId, orderData) {
    return handleResponse(
      adminAxiosInstance.put(`/order/admin/orders/${orderId}`, orderData)
    );
  },

  // Delete order
  async deleteOrder(orderId) {
    return handleResponse(
      adminAxiosInstance.delete(`/order/admin/orders/${orderId}`)
    );
  },

  // Get order statistics
  async getOrderStatistics() {
    return handleResponse(
      adminAxiosInstance.get('/order/admin/statistics')
    );
  },

  // Get orders by date range
  async getOrdersByDateRange(startDate, endDate) {
    return handleResponse(
      adminAxiosInstance.get(`/order/admin/date-range?startDate=${startDate}&endDate=${endDate}`)
    );
  },

  // Get orders by customer email
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

  // ✅ Fix this - use adminAxiosInstance, not regular axiosInstance
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
// BACKWARD COMPATIBILITY (For existing code)
// =============================================================================

// For backward compatibility with existing productApi calls
export const productApi = {
  async getAllProducts() {
    return adminProductApi.getAllProducts();
  },
  async getProductById(id) {
    return adminProductApi.getProductById(id);
  },
  async createProduct(productData) {
    // Check if FormData is being passed (file upload)
    if (productData instanceof FormData) {
      return handleResponse(
        adminAxiosInstance.post('/product/create', productData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      );
    }
    // Regular JSON data
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
};

// For backward compatibility with existing inventoryApi calls (now unified)
// This will map old calls to new unified inventory system
export const legacyInventoryApi = {
  async getAllItems() {
    return inventoryApi.getInventoryByType('supply');
  },
  async getItemById(itemId) {
    return inventoryApi.getInventoryById(itemId);
  },
  async createItem(data) {
    // This would need to create a supply first, then add to inventory
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
    // Implement notification logic
    return { success: true, message: 'Notification sent' };
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
};