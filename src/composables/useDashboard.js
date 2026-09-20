// src/composables/useDashboard.js - Fixed - only top-level loading management
import { ref, computed } from 'vue'
import { adminDashboardApi } from '@/api/api'
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
  // Load all dashboard data in ONE request
  const loadDashboardData = async () => {
    if (loading.value) {
      console.log('⏳ Dashboard already loading, skipping...')
      return
    }

    loading.value = true
    error.value = null

    const loadingToken = showLoading({
      title: 'Loading Dashboard',
      message: 'Fetching your data...',
      icon: 'process',
    })

    try {
      console.log('🚀 Loading dashboard via /admin/summary (single request)...')
      const t0 = performance.now()

      const response = await adminDashboardApi.getSummary()

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to load dashboard')
      }

      const {
        stats: statsData,
        revenueCategories: cats,
        weeklySales: sales,
        lowStockItems: lowStock,
        recentOrders: orders,
      } = response.data

      // ── Build the stats cards ────────────────────────────────
      const statsArray = []

      if (userRole.value === 'sales' || userRole.value === 'Super Admin') {
        statsArray.push({
          label: 'Total Revenue',
          value: `₱${(statsData.totalRevenue || 0).toLocaleString()}`,
          sub: `from ${statsData.completedOrders || 0} completed orders`,
          subColor: 'text-green-600',
          icon: 'dollar',
          iconBg: 'bg-green-100',
          iconColor: 'text-green-600',
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
          iconColor: 'text-blue-600',
        },
        {
          label: 'In Production',
          value: (statsData.inProductionOrders || 0).toLocaleString(),
          sub: `${statsData.scheduledOrders || 0} scheduled`,
          subColor: 'text-purple-600',
          icon: 'package',
          iconBg: 'bg-purple-100',
          iconColor: 'text-purple-600',
        },
        {
          label: 'Completed',
          value: (statsData.completedOrders || 0).toLocaleString(),
          sub: `${statsData.companyProductOrders || 0} products, ${statsData.ownCupsOrders || 0} own cups`,
          subColor: 'text-green-600',
          icon: 'check',
          iconBg: 'bg-green-100',
          iconColor: 'text-green-600',
        },
      )

      stats.value = statsArray
      revenueCategories.value = cats || []
      weeklySales.value = sales || []
      lowStockItems.value = lowStock || []
      recentOrders.value = orders || []

      console.log(
        `✅ Dashboard loaded in ${Math.round(performance.now() - t0)}ms`,
      )
    } catch (err) {
      console.error('❌ Error loading dashboard:', err)
      error.value = err.message

      // Fallback so the UI doesn't break
      stats.value = [
        { label: 'Total Orders', value: '0', sub: '0 pending', subColor: 'text-gray-400', icon: 'cart', iconBg: 'bg-gray-100', iconColor: 'text-gray-400' },
        { label: 'In Production', value: '0', sub: '0 scheduled', subColor: 'text-gray-400', icon: 'package', iconBg: 'bg-gray-100', iconColor: 'text-gray-400' },
        { label: 'Completed', value: '0', sub: '0 completed', subColor: 'text-gray-400', icon: 'check', iconBg: 'bg-gray-100', iconColor: 'text-gray-400' },
      ]
      revenueCategories.value = []
      weeklySales.value = []
      lowStockItems.value = []
      recentOrders.value = []
    } finally {
      console.log(`📊 Loading operations still active: ${getLoadingCounter()}`)
      hideLoading(loadingToken)
      loading.value = false
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