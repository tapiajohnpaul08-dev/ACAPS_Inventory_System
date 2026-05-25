<template>
  <div class="p-6 lg:p-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
      <p class="text-sm text-gray-500 mt-1">Detailed insights and performance metrics</p>
    </div>

    <!-- Stats Cards - Full Width -->
    <AnalyticsStatCards :stats="analyticsStats" />

    <!-- First Row - Top Products & Order Status (Side by Side) -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <TopProductsChart :products="topProducts" />
      <OrderStatusPieChart :segments="orderStatusData" />
    </div>

    <!-- Second Row - Revenue by Category (Full Width) -->
    <div class="mb-6">
      <RevenueByCategoryChart :categories="revenueCategories" />
    </div>

    <!-- Third Row - Monthly Revenue Trend (Full Width with Line Graph) -->
    <div>
      <MonthlyRevenueTrendChart :months="monthlyData" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AnalyticsStatCards from '@/components/analytics/AnalyticsStatCards.vue'
import TopProductsChart from '@/components/analytics/TopProductsChart.vue'
import OrderStatusPieChart from '@/components/analytics/OrderStatusPieChart.vue'
import RevenueByCategoryChart from '@/components/analytics/RevenueByCategoryChart.vue'
import MonthlyRevenueTrendChart from '@/components/analytics/MonthlyRevenueTrendChart.vue'
import { analyticsApi } from '@/api/api'

const analyticsStats = ref([])
const topProducts = ref([])
const orderStatusData = ref([])
const revenueCategories = ref([])
const monthlyData = ref([])
const loading = ref(true)

async function loadAnalytics() {
  loading.value = true
  try {
    const [statsRes, topProductsRes, statusRes, revenueRes, monthlyRes] = await Promise.all([
      analyticsApi.getStats(),
      analyticsApi.getTopProducts(5),
      analyticsApi.getOrderStatusDistribution(),
      analyticsApi.getRevenueByCategory(),
      analyticsApi.getMonthlyRevenue(12)
    ])
    
    console.log('Monthly revenue response:', monthlyRes)
    
    if (statsRes.success) {
      const data = statsRes.data
      analyticsStats.value = [
        { label: 'Total Revenue', value: `₱${data.revenue.total.toLocaleString()}`, trend: 'up', sub: `+${data.orders.completed} completed`, icon: 'dollar', iconColor: 'text-emerald-600', iconBg: 'bg-emerald-50' },
        { label: 'Total Orders', value: data.orders.total.toLocaleString(), trend: 'up', sub: `${data.orders.pending} pending`, icon: 'package', iconColor: 'text-blue-600', iconBg: 'bg-blue-50' },
        { label: 'Products', value: data.products.total.toLocaleString(), trend: 'down', sub: `${data.products.lowStock} low stock`, icon: 'box', iconColor: 'text-orange-600', iconBg: 'bg-orange-50' },
        { label: 'Customers', value: data.customers.total.toLocaleString(), trend: 'up', sub: 'active customers', icon: 'users', iconColor: 'text-purple-600', iconBg: 'bg-purple-50' }
      ]
    }
    
    if (topProductsRes.success) {
      topProducts.value = topProductsRes.data.map(p => ({
        name: p._id,
        orders: p.totalQuantity
      }))
    }
    
    if (statusRes.success) {
      orderStatusData.value = statusRes.data
    }
    
    if (revenueRes.success) {
      revenueCategories.value = revenueRes.data
    }
    
    if (monthlyRes.success && monthlyRes.data) {
      const currentYear = new Date().getFullYear()
      monthlyData.value = monthlyRes.data.map(month => ({
        ...month,
        year: month.year || currentYear
      }))
      console.log('Processed monthly data:', monthlyData.value)
    }
  } catch (error) {
    console.error('Error loading analytics:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadAnalytics()
})
</script>