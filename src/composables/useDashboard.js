// src/composables/useDashboard.js
import { ref, computed } from 'vue'
import { adminDashboardApi, adminOrderApi } from '@/api/api'

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

  // Load all dashboard data
  const loadDashboardData = async () => {
    loading.value = true
    error.value = null
    
    try {
      await Promise.all([
        loadStats(),
        loadRevenueCategories(),
        loadWeeklySales(),
        loadLowStockItems(),
        loadRecentOrders()
      ])
    } catch (err) {
      console.error('Error loading dashboard data:', err)
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  // Load stats from OrderService.getOrderStatistics()
  const loadStats = async () => {
    try {
      const response = await adminOrderApi.getOrderStatistics()
      if (response.success && response.data) {
        const statsData = response.data
        
        const statsArray = []
        
        // Only show revenue stats for sales role
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
      }
    } catch (err) {
      console.error('Error loading stats:', err)
      // Set default stats
      stats.value = [
        { label: 'Total Orders', value: '0', sub: '0 pending', subColor: 'text-gray-400', icon: 'cart', iconBg: 'bg-gray-100', iconColor: 'text-gray-400' },
        { label: 'In Production', value: '0', sub: '0 scheduled', subColor: 'text-gray-400', icon: 'package', iconBg: 'bg-gray-100', iconColor: 'text-gray-400' },
        { label: 'Completed', value: '0', sub: '0 completed', subColor: 'text-gray-400', icon: 'check', iconBg: 'bg-gray-100', iconColor: 'text-gray-400' }
      ]
    }
  }

  // Load revenue by category
  const loadRevenueCategories = async () => {
    try {
      const response = await adminDashboardApi.getRevenueByCategory()
      if (response.success && response.data && response.data.length > 0) {
        revenueCategories.value = response.data
      } else {
        revenueCategories.value = []
      }
    } catch (err) {
      console.error('Error loading revenue categories:', err)
      revenueCategories.value = []
    }
  }

  // Load weekly sales
  const loadWeeklySales = async () => {
    try {
      const response = await adminDashboardApi.getWeeklySales()
      if (response.success && response.data && response.data.length > 0) {
        weeklySales.value = response.data
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
      console.error('Error loading weekly sales:', err)
      weeklySales.value = []
    }
  }

  // Load low stock items from inventory
  const loadLowStockItems = async () => {
  try {
    // Check if token exists
    const token = localStorage.getItem('adminToken');
    if (!token) {
      console.log('No admin token found, skipping low stock fetch');
      lowStockItems.value = [];
      return;
    }
    
    console.log('Fetching low stock items from API...');
    const response = await adminDashboardApi.getLowStockItems()
    console.log('Low stock items API response:', response)
    
    if (response.success && response.data && response.data.length > 0) {
      lowStockItems.value = response.data.map(item => {
        const itemRef = item.itemRef || {}
        
        // Get name from different sources
        let itemName = itemRef.name || item.name || 'Unknown Item'
        
        // For products, include size info in name if needed
        if (item.itemType === 'product' && itemRef.sizes) {
          const lowStockSizes = itemRef.sizes.filter(s => s.stock > 0 && s.stock < 100);
          if (lowStockSizes.length > 0) {
            itemName = `${itemRef.name} (${lowStockSizes.map(s => `${s.name}: ${s.stock}`).join(', ')})`;
          }
        }
        
        return {
          name: itemName,
          stock: item.stock || 0,
          threshold: item.threshold || 100,
          severity: item.stock === 0 ? 'red' : 'orange',
          category: item.itemType === 'product' ? 'products' : 'supplies',
          searchTerm: (itemRef.name || item.name || '').split(' ')[0]
        }
      })
      console.log('Processed low stock items:', lowStockItems.value)
    } else {
      console.log('No low stock items found or API returned empty')
      lowStockItems.value = []
    }
  } catch (err) {
    console.error('Error loading low stock items:', err)
    // Don't set error state for this, just set empty array
    lowStockItems.value = []
  }
}

  // Load recent orders with complete data
  const loadRecentOrders = async () => {
    try {
      const response = await adminDashboardApi.getRecentOrders(5)
      console.log('Recent orders response:', response)
      
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
        console.log('Processed recent orders:', recentOrders.value)
      } else {
        recentOrders.value = []
      }
    } catch (err) {
      console.error('Error loading recent orders:', err)
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