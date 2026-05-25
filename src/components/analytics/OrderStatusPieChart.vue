<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
    <div class="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
      <div class="flex items-center justify-between">
        <h2 class="text-sm font-bold text-gray-900 uppercase tracking-wide">Order Status Distribution</h2>
        <span class="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
          {{ totalOrders }} Total
        </span>
      </div>
    </div>

    <div v-if="segments.length === 0" class="text-center py-16 text-gray-400">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
      <p class="text-sm">No order data available</p>
    </div>

    <div v-else class="divide-y divide-gray-100">
      <div 
        v-for="slice in slices" 
        :key="slice.label"
        class="flex items-center justify-between p-4 hover:bg-gray-50 transition-all duration-200 cursor-pointer group"
        @click="handleStatusClick(slice)"
      >
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-110" 
              :style="{ backgroundColor: `${slice.color}15` }">
            <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: slice.color }"></div>
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-800">{{ slice.label }}</p>
            <div class="flex items-center gap-2 mt-1">
              <div class="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div class="h-full rounded-full transition-all duration-500" 
                    :style="{ width: `${slice.pct}%`, backgroundColor: slice.color }"></div>
              </div>
              <span class="text-xs font-medium" :style="{ color: slice.color }">{{ slice.pct }}%</span>
            </div>
          </div>
        </div>
        <div class="text-right">
          <p class="text-xl font-bold" :style="{ color: slice.color }">{{ slice.value.toLocaleString() }}</p>
          <p class="text-xs text-gray-400">orders</p>
        </div>
      </div>

      <!-- Total row -->
      <div class="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-800">All Orders</p>
          </div>
        </div>
        <div class="text-right">
          <p class="text-xl font-bold text-gray-900">{{ totalOrders.toLocaleString() }}</p>
          <p class="text-xs text-gray-400">total orders</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  segments: { type: Array, required: true }
})

const totalOrders = computed(() => {
  return props.segments.reduce((sum, s) => sum + (s.value || 0), 0)
})

const statusColors = {
  'Pending': '#f59e0b',
  'Scheduled': '#8b5cf6',
  'In Production': '#3b82f6',
  'Out for Delivery': '#06b6d4',
  'Completed': '#10b981',
  'Cancelled': '#ef4444',
  'default': '#6b7280'
}

const displayNames = {
  'Pending': ' Pending',
  'Scheduled': 'Scheduled',
  'In Production': ' In Production',
  'Out for Delivery': ' Out for Delivery',
  'Completed': ' Completed',
  'Cancelled': ' Cancelled'
}

const slices = computed(() => {
  return props.segments.map(seg => {
    const value = seg.value || 0
    const pct = totalOrders.value ? Math.round((value / totalOrders.value) * 100) : 0
    return {
      label: displayNames[seg.label] || seg.label || 'Unknown',
      originalLabel: seg.label,
      value: value,
      color: statusColors[seg.label] || seg.color || statusColors.default,
      pct: pct
    }
  }).filter(s => s.value > 0).sort((a, b) => b.value - a.value)
})

function handleStatusClick(slice) {
  alert(`Status: ${slice.originalLabel}\nOrders: ${slice.value.toLocaleString()}\nPercentage: ${slice.pct}%`)
}
</script>