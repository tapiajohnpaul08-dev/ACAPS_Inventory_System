// src/composables/useDashboard.js - Fixed - only top-level loading management
import { ref, computed } from 'vue'
import { adminDashboardApi, adminOrderApi, inventoryApi } from '@/api/api'
import { useAdminLoading } from '@/composables/useAdminLoading'

export function useDashboard() {
  const stats = ref([])
  const revenueCategories = ref([])
  const weeklySales = ref([])
  const lowStockItems = ref([])
  const recentOrders = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Get user role from localStorage
  const userRole = computed(() => localStorage.getItem('adminRole') || 'production')

  // Get loading functions
  const { showLoading, hideLoading, getLoadingCounter } = useAdminLoading()

  // Load all dashboard data - ONLY place where showLoading/hideLoading is called
  const loadDashboardData = async () => {
    // Prevent multiple simultaneous loads
    if (loading.value) {
      console.log('⏳ Dashboard already loading, skipping...')
      return
    }
    
    loading.value = true
    error.value = null
    
    // ✅ Show loading modal ONCE at the beginning - keep the token, only
    // this exact call is allowed to close it. This is what stops the
    // overlay from being closed early by some unrelated showLoading/
    // hideLoading pair elsewhere in the app.
    const loadingToken = showLoading({
      title: 'Loading Dashboard',
      message: 'Fetching your data...',
      icon: 'process'
    })
    
    try {
      console.log('🚀 Starting dashboard data load...')
      
      // Load all data in parallel
      await Promise.all([
        loadStats(),
        loadRevenueCategories(),
        loadWeeklySales(),
        loadLowStockItems(),
        loadRecentOrders()
      ])
      
      console.log('✅ All dashboard data loaded successfully')
      
    } catch (err) {
      console.error('❌ Error loading dashboard data:', err)
      error.value = err.message
    } finally {
      // ✅ Hide loading modal ONCE, right after all operations actually
      // complete. Hiding it with the matching token (instead of a bare
      // hideLoading() call after an arbitrary delay) guarantees this only
      // closes the dashboard's own operation, not someone else's.
      console.log(`📊 Loading operations still active: ${getLoadingCounter()}`)
      hideLoading(loadingToken)
      loading.value = false
      console.log('✅ Dashboard loading complete')
    }
  }

  // Load stats - NO loading management here
  const loadStats = async () => {
    try {
      const response = await adminOrderApi.getOrderStatistics()
      if (response.success && response.data) {
        const statsData = response.data
        
        const statsArray = []
        
        if (userRole.value === 'sales') {
          statsArray.push({
            label: 'Total Revenue',
            value: `₱${(statsData.totalRevenue || 0).toLocaleString()}`,
            sub: `from ${statsData.completedOrders || 0} completed orders`,
            subColor: 'text-green-600',
            icon: 'dollar',
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600'
          })
        }
        
        statsArray.push(
          {
            label: 'Total Orders',
            value: (statsData.totalOrders || 0).toLocaleString(),
            sub: `${statsData.pendingOrders || 0} pending`,
            subColor: 'text-yellow-600',
            icon: 'cart',
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600'
          },
          {
            label: 'In Production',
            value: (statsData.inProductionOrders || 0).toLocaleString(),
            sub: `${statsData.scheduledOrders || 0} scheduled`,
            subColor: 'text-purple-600',
            icon: 'package',
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-600'
          },
          {
            label: 'Completed',
            value: (statsData.completedOrders || 0).toLocaleString(),
            sub: `${statsData.companyProductOrders || 0} products, ${statsData.ownCupsOrders || 0} own cups`,
            subColor: 'text-green-600',
            icon: 'check',
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600'
          }
        )
        
        stats.value = statsArray
        console.log('✅ Stats loaded:', statsArray.length)
      }
    } catch (err) {
      console.error('❌ Error loading stats:', err)
      stats.value = [
        { label: 'Total Orders', value: '0', sub: '0 pending', subColor: 'text-gray-400', icon: 'cart', iconBg: 'bg-gray-100', iconColor: 'text-gray-400' },
        { label: 'In Production', value: '0', sub: '0 scheduled', subColor: 'text-gray-400', icon: 'package', iconBg: 'bg-gray-100', iconColor: 'text-gray-400' },
        { label: 'Completed', value: '0', sub: '0 completed', subColor: 'text-gray-400', icon: 'check', iconBg: 'bg-gray-100', iconColor: 'text-gray-400' }
      ]
    }
  }

  // Load revenue by category - NO loading management here
  const loadRevenueCategories = async () => {
    try {
      const response = await adminDashboardApi.getRevenueByCategory()
      if (response.success && response.data && response.data.length > 0) {
        revenueCategories.value = response.data
        console.log('✅ Revenue categories loaded:', response.data.length)
      } else {
        revenueCategories.value = []
      }
    } catch (err) {
      console.error('❌ Error loading revenue categories:', err)
      revenueCategories.value = []
    }
  }

  // Load weekly sales - NO loading management here
  const loadWeeklySales = async () => {
    try {
      const response = await adminDashboardApi.getWeeklySales()
      if (response.success && response.data && response.data.length > 0) {
        weeklySales.value = response.data
        console.log('✅ Weekly sales loaded:', response.data.length)
      } else {
        weeklySales.value = [
          { day: 'Mon', value: 0, displayValue: '0k' },
          { day: 'Tue', value: 0, displayValue: '0k' },
          { day: 'Wed', value: 0, displayValue: '0k' },
          { day: 'Thu', value: 0, displayValue: '0k' },
          { day: 'Fri', value: 0, displayValue: '0k' },
          { day: 'Sat', value: 0, displayValue: '0k' },
          { day: 'Sun', value: 0, displayValue: '0k' }
        ]
      }
    } catch (err) {
      console.error('❌ Error loading weekly sales:', err)
      weeklySales.value = []
    }
  }

  // Load low stock items - NO loading management here
  const loadLowStockItems = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        console.log('No admin token found, skipping low stock fetch');
        lowStockItems.value = [];
        return;
      }
      
      console.log('🔍 Fetching low stock items from inventory API...');
      
      const inventoryResponse = await inventoryApi.getAllInventory();
      
      const itemsMap = new Map();
      const PRODUCT_LOW_STOCK_THRESHOLD = 800;
      const SUPPLY_LOW_STOCK_THRESHOLD = 100;
      
      if (inventoryResponse.success && inventoryResponse.data) {
        for (const invItem of inventoryResponse.data) {
          if (!invItem.itemRef) continue;
          
          const isProduct = invItem.itemType === 'product';
          const productId = invItem.itemRef._id || invItem.itemRef.id;
          
          if (itemsMap.has(productId)) continue;
          
          let currentStock = invItem.stock || 0;
          let displayStock = currentStock;
          let threshold = isProduct ? PRODUCT_LOW_STOCK_THRESHOLD : SUPPLY_LOW_STOCK_THRESHOLD;
          let productName = invItem.itemRef.name || 'Unknown';
          
          if (isProduct && invItem.itemRef.sizes && invItem.itemRef.sizes.length > 0) {
            const totalStock = invItem.itemRef.sizes.reduce((sum, size) => sum + (size.stock || 0), 0);
            currentStock = totalStock;
            displayStock = totalStock;
          }
          
          let isLowStock = false;
          if (isProduct) {
            isLowStock = currentStock > 0 && currentStock <= threshold;
          } else {
            isLowStock = currentStock > 0 && currentStock <= threshold;
          }
          
          if (isLowStock) {
            itemsMap.set(productId, {
              id: invItem.itemId,
              name: productName,
              stock: displayStock,
              threshold: threshold,
              unit: isProduct ? 'pcs' : (invItem.unit || 'units'),
              status: currentStock === 0 ? 'Out of Stock' : 'Low Stock',
              type: isProduct ? 'product' : 'supply',
              category: invItem.itemRef.category || (isProduct ? 'Uncategorized' : 'other'),
              supplier: invItem.itemRef.supplier || 'No supplier',
              minOrder: invItem.itemRef.minOrder || 500,
              sizes: invItem.itemRef.sizes,
              lastRestocked: invItem.lastRestocked,
              originalId: isProduct ? invItem.itemRef.id : invItem.itemRef.supplyId
            });
          }
        }
      }
      
      const items = Array.from(itemsMap.values());
      items.sort((a, b) => a.stock - b.stock);
      
      lowStockItems.value = items;
      console.log('✅ Processed low stock items:', lowStockItems.value.length, 'items found');
      
    } catch (err) {
      console.error('❌ Error loading low stock items:', err);
      lowStockItems.value = [];
    }
  }

  // Load recent orders - NO loading management here
  const loadRecentOrders = async () => {
    try {
      const response = await adminDashboardApi.getRecentOrders(5)
      
      if (response.success && response.data) {
        recentOrders.value = response.data.map(order => ({
          id: order.orderId,
          orderId: order.orderId,
          customer: order.customerName || order.customer?.name || 'Guest',
          email: order.customerEmail || order.customer?.email || 'N/A',
          phone: order.customerPhone || order.customer?.phone || 'N/A',
          product: order.productName || 'Custom Order',
          size: order.size || 'N/A',
          qty: order.quantity || 0,
          amount: `₱${(order.amount || 0).toLocaleString()}`,
          rawAmount: order.amount || 0,
          status: order.status || 'Pending',
          payment: (order.paymentStatus || 'Unpaid').toLowerCase(),
          deliveryMethod: order.receivingMode || 'Pick-up',
          address: order.address || '',
          supplyType: order.isProvided ? 'Own Cups' : 'Company Cups',
          date: order.orderedAt ? new Date(order.orderedAt).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A',
          expectedDelivery: order.expectedDelivery ? new Date(order.expectedDelivery).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A',
          notes: order.notes || '',
          statusHistory: order.statusHistory || [],
          items: order.items || []
        }))
        console.log('✅ Recent orders loaded:', recentOrders.value.length)
      } else {
        recentOrders.value = []
      }
    } catch (err) {
      console.error('❌ Error loading recent orders:', err)
      recentOrders.value = []
    }
  }

  return {
    stats,
    revenueCategories,
    weeklySales,
    lowStockItems,
    recentOrders,
    loading,
    error,
    userRole,
    loadDashboardData
  }
}