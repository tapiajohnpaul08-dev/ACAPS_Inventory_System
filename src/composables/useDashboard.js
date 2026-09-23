// src/composables/useDashboard.js - Fixed - only top-level loading management
import { ref, computed, onMounted, onUnmounted } from 'vue'
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

      // ── Build the stats cards — "What matters TODAY" ────────────
      // For a business owner opening the dashboard in the morning,
      // these four answer:
      //   1. What's waiting on me?         → Pending Orders
      //   2. What's on the floor today?    → Scheduled Today
      //   3. What's in motion right now?   → Out for Delivery
      //   4. What did we finish today?     → Completed Today
      const statsArray = [
        {
          label: 'Pending Orders',
          value: (statsData.pendingOrders || 0).toLocaleString(),
          sub: `${statsData.unpaidOrders || 0} awaiting payment`,
          subColor: 'text-yellow-600',
          icon: 'clock',                                  // new icon
          iconBg: 'bg-yellow-100',
          iconColor: 'text-yellow-600',
        },
        {
          label: 'Scheduled Today',
          value: (statsData.scheduledToday || 0).toLocaleString(),
          sub: `${statsData.inProductionNow || 0} in production now`,
          subColor: 'text-purple-600',
          icon: 'calendar',                               // new icon
          iconBg: 'bg-purple-100',
          iconColor: 'text-purple-600',
        },
        {
          label: 'Out for Delivery',
          value: (statsData.outForDeliveryOrders || 0).toLocaleString(),
          sub: statsData.pickupsReady > 0
            ? `${statsData.pickupsReady} ready for pickup`
            : 'currently on the road',
          subColor: 'text-blue-600',
          icon: 'truck',
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600',
        },
        {
          label: 'Completed Today',
          value: (statsData.completedToday || 0).toLocaleString(),
          sub: `₱${(statsData.revenueToday || 0).toLocaleString()} revenue`,
          subColor: 'text-green-600',
          icon: 'check',
          iconBg: 'bg-green-100',
          iconColor: 'text-green-600',
        },
      ]

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





  // ── Realtime: refresh when orders or inventory change ──────────────
  const handleOrderChanged = (e) => {
    console.log('📡 [useDashboard] realtime order:changed', e.detail);
    loadDashboardData();
  };
  const handleInventoryChanged = (e) => {
    console.log('📡 [useDashboard] realtime inventory:changed', e.detail);
    loadDashboardData();
  };

  // Guard against overlapping loads (loadDashboardData already self-guards,
  // but we add a tiny debounce so a burst of events doesn't hammer the API).
  let refreshTimer = null;
  const debouncedRefresh = () => {
    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(() => loadDashboardData(), 400);
  };
  const debouncedOrderChanged = () => {
    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(() => loadDashboardData(), 400);
  };

  onMounted(() => {
    window.addEventListener('realtime:order-changed', debouncedOrderChanged);
    window.addEventListener('realtime:inventory-changed', debouncedRefresh);
  });
  onUnmounted(() => {
    window.removeEventListener('realtime:order-changed', debouncedOrderChanged);
    window.removeEventListener('realtime:inventory-changed', debouncedRefresh);
    clearTimeout(refreshTimer);
  });

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