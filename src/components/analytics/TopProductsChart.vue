<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
    <div class="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
      <div class="flex items-center justify-between">
        <h2 class="text-sm font-bold text-gray-900 uppercase tracking-wide">Top Selling Products</h2>
        <span class="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
          Top {{ products.length }}
        </span>
      </div>
    </div>

    <div v-if="products.length === 0" class="text-center py-16 text-gray-400">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
      <p class="text-sm">No product sales data available</p>
    </div>

    <div v-else class="divide-y divide-gray-100">
      <div 
        v-for="(item, index) in sortedProducts" 
        :key="item.name"
        class="flex items-center justify-between p-4 hover:bg-gray-50 transition-all duration-200 cursor-pointer group"
        @click="handleProductClick(item, index)"
      >
        <div class="flex items-center gap-4 flex-1">
          <!-- Rank Badge -->
          <div class="flex-shrink-0 w-10">
            <div 
              class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all group-hover:scale-110"
              :class="getRankClass(index)"
            >
              {{ index + 1 }}
            </div>
          </div>
          
          <!-- Product Info -->
          <div class="flex-1">
            <p class="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
              {{ truncateText(item.name, 30) }}
            </p>
            <div class="flex items-center gap-3 mt-1">
              <div class="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span class="text-xs text-gray-500">{{ item.orders.toLocaleString() }} units</span>
              </div>
              <div class="w-1 h-1 rounded-full bg-gray-300"></div>
              <div class="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span class="text-xs text-gray-500">{{ getPercentage(item.orders) }}% of top</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Mini bar -->
        <div class="w-32 ml-4">
          <div class="bg-gray-100 rounded-full h-2 overflow-hidden">
            <div 
              class="h-full rounded-full transition-all duration-500"
              :class="index === 0 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' : 'bg-gradient-to-r from-blue-500 to-blue-400'"
              :style="{ width: `${getPercentage(item.orders)}%` }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Total Summary -->
      <div class="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-800">Total Units Sold</p>
          </div>
        </div>
        <div class="text-right">
          <p class="text-xl font-bold text-blue-600">{{ totalUnits.toLocaleString() }}</p>
          <p class="text-xs text-gray-400">across all products</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  products: { type: Array, required: true }
})

const sortedProducts = computed(() => {
  return [...props.products].sort((a, b) => (b.orders || 0) - (a.orders || 0))
})

const maxOrders = computed(() => {
  if (!sortedProducts.value.length) return 1
  return Math.max(...sortedProducts.value.map(p => p.orders || 0))
})

const totalUnits = computed(() => {
  return sortedProducts.value.reduce((sum, p) => sum + (p.orders || 0), 0)
})

function getRankClass(index) {
  if (index === 0) return 'bg-yellow-100 text-yellow-700 ring-2 ring-yellow-200'
  if (index === 1) return 'bg-gray-100 text-gray-600'
  if (index === 2) return 'bg-orange-100 text-orange-700'
  return 'bg-gray-50 text-gray-400'
}

function getPercentage(orders) {
  if (maxOrders.value === 0) return 0
  return Math.round((orders / maxOrders.value) * 100)
}

function truncateText(text, maxLength) {
  if (!text) return ''
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

function handleProductClick(item, index) {
  alert(`${index === 0 ? '🏆 Top Product!' : '📦 Product'}\n\nName: ${item.name}\nUnits Sold: ${item.orders.toLocaleString()}\nRank: #${index + 1}\nContribution: ${getPercentage(item.orders)}% of top product`)
}
</script>