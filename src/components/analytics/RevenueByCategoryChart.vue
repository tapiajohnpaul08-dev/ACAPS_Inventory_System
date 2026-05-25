<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
    <div class="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Revenue by Category
          </h2>
          <p class="text-xs text-gray-400 mt-0.5">Breakdown by product category</p>
        </div>
        <span class="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
          {{ categories.length }} Categories
        </span>
      </div>
    </div>

    <div v-if="categories.length === 0" class="text-center py-16 text-gray-400">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
      <p class="text-sm">No revenue data available</p>
    </div>

    <div v-else class="divide-y divide-gray-100">
      <div 
        v-for="item in sortedCategories" 
        :key="item.name"
        class="flex items-center justify-between p-4 hover:bg-gray-50 transition-all duration-200 cursor-pointer group"
        @click="handleCategoryClick(item)"
      >
        <div class="flex items-center gap-3 flex-1">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-110 bg-emerald-50">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6h11l-1-6m-8.5 6h11" />
            </svg>
          </div>
          <div class="flex-1">
            <p class="text-sm font-semibold text-gray-800 group-hover:text-emerald-600 transition-colors">
              {{ item.name }}
            </p>
            <div class="flex items-center gap-2 mt-1">
              <div class="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div class="h-full rounded-full transition-all duration-500 bg-emerald-500" 
                    :style="{ width: `${getRevenuePercentage(item.revenue)}%` }"></div>
              </div>
              <span class="text-xs text-gray-500">{{ getRevenuePercentage(item.revenue) }}% of revenue</span>
            </div>
          </div>
        </div>
        <div class="text-right">
          <p class="text-lg font-bold text-emerald-600">₱{{ item.revenue.toLocaleString() }}</p>
          <p class="text-xs text-gray-400">{{ item.orders }} orders</p>
        </div>
      </div>

      <!-- Total row -->
      <div class="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-800">Total Revenue</p>
          </div>
        </div>
        <div class="text-right">
          <p class="text-xl font-bold text-emerald-600">₱{{ totalRevenue.toLocaleString() }}</p>
          <p class="text-xs text-gray-400">across all categories</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  categories: { type: Array, required: true }
})

const totalRevenue = computed(() => {
  return props.categories.reduce((sum, c) => sum + (c.revenue || 0), 0)
})

const sortedCategories = computed(() => {
  return [...props.categories].sort((a, b) => (b.revenue || 0) - (a.revenue || 0))
})

const maxRevenue = computed(() => {
  if (!sortedCategories.value.length) return 1
  return Math.max(...sortedCategories.value.map(c => c.revenue || 0))
})

function getRevenuePercentage(revenue) {
  if (maxRevenue.value === 0) return 0
  return Math.round((revenue / maxRevenue.value) * 100)
}

function handleCategoryClick(item) {
  alert(`Category: ${item.name}\nRevenue: ₱${item.revenue.toLocaleString()}\nOrders: ${item.orders}\nContribution: ${getRevenuePercentage(item.revenue)}% of total revenue`)
}
</script>