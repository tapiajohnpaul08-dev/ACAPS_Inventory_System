<template>
  <div class="p-8">
    <div class="mb-8">
      <h1 class="text-2xl font-black text-gray-900">Dashboard</h1>
      <p class="text-sm text-gray-500 mt-1">Welcome to ACAPSHOP Inventory System</p>
    </div>

    <StatsGrid :stats="dashboardStats" />

    <div v-if="userRole === 'sales'" class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <RevenueCategoryChart :categories="revenueCategories" />
      <WeeklySalesTrendChart :sales-data="weeklySales" />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <LowStockAlerts :items="lowStockItems" />
      <RecentOrders :orders="recentOrders" />
    </div>
  </div>
</template>

<script setup>
import StatsGrid from '@/components/dashboard/StatsGrid.vue'
import RevenueCategoryChart from '@/components/dashboard/RevenueCategoryChart.vue'
import WeeklySalesTrendChart from '@/components/dashboard/WeeklySalesTrendChart.vue'
import LowStockAlerts from '@/components/dashboard/LowStockAlerts.vue'
import RecentOrders from '@/components/dashboard/RecentOrders.vue'
import { dashboardStats, revenueCategories, weeklySales, lowStockItems, recentOrders } from '@/data/dummyData'

// Get user role from localStorage
const userRole = localStorage.getItem('userRole') || 'production'
</script>