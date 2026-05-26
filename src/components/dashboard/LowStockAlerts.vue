<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <!-- Header remains the same -->
    <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="text-red-600" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10.268 21a2 2 0 0 0 3.464 0"/>
            <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/>
          </svg>
        </div>
        <h3 class="text-sm font-bold text-gray-900">Low Stock Alerts</h3>
        <span v-if="items.length > 0" class="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
          {{ items.length }}
        </span>
      </div>
      <button
        @click="$emit('view-all')"
        class="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
      >
        Manage Inventory
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="m9 18 6-6-6-6"/>
        </svg>
      </button>
    </div>

    <!-- Alerts List -->
    <div class="divide-y divide-gray-50">
      <div
        v-for="item in items.slice(0, 5)"
        :key="item.id"
        class="px-5 py-4 hover:bg-red-50/50 transition-all cursor-pointer"
        @click="$emit('item-click', item)"
      >
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <!-- Icon based on type -->
              <div class="w-6 h-6 rounded-lg flex items-center justify-center" :class="item.type === 'product' ? 'bg-green-100' : 'bg-blue-100'">
                <svg v-if="item.type === 'product'" xmlns="http://www.w3.org/2000/svg" class="text-green-600" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/>
                  <path d="M12 22V12"/>
                  <polyline points="3.29 7 12 12 20.71 7"/>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="text-blue-600" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                </svg>
              </div>
              <!-- Clean product name (no size) -->
              <span class="text-sm font-bold text-gray-900">{{ item.name }}</span>
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold" :class="getStockBadgeClass(item)">
                {{ item.status }}
              </span>
              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold" :class="item.type === 'product' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'">
                {{ item.type === 'product' ? 'Product' : 'Supply' }}
              </span>
            </div>
            <div class="flex items-center gap-3 text-xs text-gray-500">
              <span class="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                </svg>
                Stock: {{ item.stock?.toLocaleString() || 0 }} {{ item.unit }}
              </span>
              <span class="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 8v8"/>
                  <path d="M8 12h8"/>
                </svg>
                Threshold: {{ item.threshold }}
              </span>
              <!-- Show size info if product has multiple sizes -->
              <span v-if="item.type === 'product' && item.sizes && item.sizes.length > 1" class="flex items-center gap-1 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 8v8"/>
                  <path d="M8 12h8"/>
                </svg>
                {{ item.sizes.length }} sizes available
              </span>
            </div>
          </div>
          <div class="flex gap-2">
            <button
              @click.stop="$emit('notify', item)"
              class="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="inline mr-1">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              Notify
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="items.length === 0" class="px-5 py-8 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="mx-auto text-gray-300 mb-3">
          <path d="M10.268 21a2 2 0 0 0 3.464 0"/>
          <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/>
        </svg>
        <p class="text-gray-400 text-sm">No low stock items</p>
        <p class="text-xs text-gray-400 mt-1">All inventory levels are healthy</p>
      </div>
    </div>

    <!-- Footer -->
    <div class="px-5 py-3 bg-gray-50 border-t border-gray-100">
      <button
        @click="$emit('view-all')"
        class="w-full text-center text-xs text-blue-600 hover:text-blue-800 transition-colors flex items-center justify-center gap-1"
      >
        Go to Inventory
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="m9 18 6-6-6-6"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  items: { type: Array, required: true }
})

const emit = defineEmits(['notify', 'view-all', 'item-click'])

function getStockBadgeClass(item) {
  if (item.stock === 0) return 'bg-red-100 text-red-700'
  if (item.stock <= item.threshold) return 'bg-yellow-100 text-yellow-700'
  return 'bg-green-100 text-green-700'
}
</script>