<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
    <div class="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex items-center justify-between">
      <div>
        <h2 class="text-sm font-bold text-gray-900 uppercase tracking-wide">Low Stock Alert</h2>
        <p class="text-xs text-gray-400 mt-0.5">Products needing attention</p>
      </div>
      <span class="px-2.5 py-1 rounded-full text-xs font-bold"
        :class="criticalCount > 0 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'">
        {{ items.length }} items
      </span>
    </div>

    <div v-if="!items.length" class="text-center py-12 text-gray-400">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mx-auto text-green-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      <p class="text-sm font-semibold text-green-600">All stocked up!</p>
      <p class="text-xs text-gray-400 mt-1">No items below threshold</p>
    </div>

    <div v-else class="divide-y divide-gray-50 max-h-80 overflow-y-auto">
      <div v-for="item in items" :key="`${item.productId}-${item.sizeName}`"
        class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
        <!-- Status dot -->
        <div class="flex-shrink-0 w-2 h-2 rounded-full"
          :class="item.status === 'out' ? 'bg-red-500' : item.status === 'critical' ? 'bg-red-400' : 'bg-yellow-400'">
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-gray-800 truncate">{{ item.productName }}</p>
          <p class="text-xs text-gray-400">{{ item.sizeName }}</p>
        </div>
        <div class="text-right flex-shrink-0">
          <p class="text-sm font-black"
            :class="item.status === 'out' ? 'text-red-600' : item.status === 'critical' ? 'text-red-500' : 'text-yellow-600'">
            {{ item.stock === 0 ? 'OUT' : item.stock.toLocaleString() }}
          </p>
          <p class="text-xs text-gray-400">{{ item.stock === 0 ? 'out of stock' : 'units left' }}</p>
        </div>
        <!-- Stock bar -->
        <div class="w-16 flex-shrink-0">
          <div class="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div class="h-full rounded-full transition-all"
              :class="item.status === 'out' ? 'bg-red-500' : item.status === 'critical' ? 'bg-red-400' : 'bg-yellow-400'"
              :style="{ width: `${Math.min(100, (item.stock / item.threshold) * 100)}%` }">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({ items: { type: Array, required: true } })
const criticalCount = computed(() => props.items.filter(i => i.status === 'out' || i.status === 'critical').length)
</script>