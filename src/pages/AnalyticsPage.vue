<template>
  <div class="p-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Analytics</h1>
      <p class="text-gray-500 mt-1">Detailed insights and statistics</p>
    </div>

    <AnalyticsStatCards :stats="analyticsStats" />

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <TopProductsChart :products="topProducts" />
      <OrderStatusPieChart :segments="orderStatusData" />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <RevenueByCategoryChart :categories="revenueCategories" />

    <MonthlyRevenueTrendChart :months="monthlyData" />
    </div>
  </div>
</template>

<script setup>
import AnalyticsStatCards from '@/components/analytics/AnalyticsStatCards.vue'
import TopProductsChart from '@/components/analytics/TopProductsChart.vue'
import OrderStatusPieChart from '@/components/analytics/OrderStatusPieChart.vue'
import RevenueByCategoryChart from '@/components/analytics/RevenueByCategoryChart.vue'
import MonthlyRevenueTrendChart from '@/components/analytics/MonthlyRevenueTrendChart.vue'
import { analyticsStats, topProducts, orderStatusData, revenueCategories, monthlyData } from '@/data/dummyData'
</script>