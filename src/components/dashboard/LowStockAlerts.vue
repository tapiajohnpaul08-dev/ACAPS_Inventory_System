<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <div class="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Low Stock Alerts
          </h2>
          <p class="text-xs text-gray-400 mt-0.5">{{ items.length }} items below threshold</p>
        </div>
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full animate-pulse">
            {{ items.length }}
          </span>
        </div>
      </div>
    </div>

    <div class="p-5 space-y-2.5 max-h-[400px] overflow-y-auto">
      <div v-if="items.length === 0" class="text-center py-12">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-green-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-gray-400 text-sm">All stock levels are healthy</p>
      </div>
      
      <div
        v-for="item in items"
        :key="item.name"
        class="group p-4 rounded-xl border transition-all duration-300 cursor-pointer transform hover:scale-[1.02]"
        :class="item.severity === 'red'
          ? 'bg-gradient-to-r from-red-50 to-white border-red-200 hover:shadow-md'
          : 'bg-gradient-to-r from-orange-50 to-white border-orange-200 hover:shadow-md'"
        @click="navigateToInventory(item)"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <div class="w-2 h-2 rounded-full animate-pulse" :class="item.severity === 'red' ? 'bg-red-500' : 'bg-orange-500'"></div>
              <p class="text-sm font-semibold text-gray-900">{{ item.name }}</p>
            </div>
            <div class="flex items-center gap-4 text-xs mt-2">
              <div class="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <span class="font-medium" :class="item.severity === 'red' ? 'text-red-600' : 'text-orange-600'">
                  {{ item.stock.toLocaleString() }}
                </span>
                <span class="text-gray-400">units left</span>
              </div>
              <div class="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M6 14h12M6 18h12M5 4h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" />
                </svg>
                <span class="text-gray-600">Threshold: {{ item.threshold.toLocaleString() }}</span>
              </div>
            </div>
            <!-- Progress bar -->
            <div class="mt-3 w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
              <div 
                class="h-1.5 rounded-full transition-all duration-500"
                :class="item.severity === 'red' ? 'bg-red-500' : 'bg-orange-500'"
                :style="{ width: `${Math.min(100, (item.stock / item.threshold) * 100)}%` }"
              ></div>
            </div>
          </div>
          <div class="flex items-center gap-2 ml-3">
            <button
              @click.stop="$emit('notify', item)"
              class="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-100 transition-all opacity-0 group-hover:opacity-100"
              title="Send Notification"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2"
              class="text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all">
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  items: { type: Array, required: true }
})

const emit = defineEmits(['notify'])

const router = useRouter()

function navigateToInventory(item) {
  const activeTab = item.category === 'supplies' ? 'supplies' : 'products'
  router.push({
    path: '/dashboard/inventory',
    query: { 
      search: item.searchTerm || item.name.split(' ')[0],
      tab: activeTab
    }
  })
}
</script>