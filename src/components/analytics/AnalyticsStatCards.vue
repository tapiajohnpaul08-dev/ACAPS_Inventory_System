<template>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
    <div
      v-for="stat in stats"
      :key="stat.label"
      class="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
    >
      <div class="flex items-center justify-between mb-2">
        <p class="text-sm text-gray-500">{{ stat.label }}</p>
        <svg v-if="stat.icon === 'dollar'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          class="w-5 h-5" :class="stat.iconColor">
          <line x1="12" x2="12" y1="2" y2="22"/>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
        <svg v-else-if="stat.icon === 'package'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          class="w-5 h-5" :class="stat.iconColor">
          <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/>
          <path d="M12 22V12"/><polyline points="3.29 7 12 12 20.71 7"/><path d="m7.5 4.27 9 5.15"/>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          class="w-5 h-5" :class="stat.iconColor">
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
          <polyline points="16 7 22 7 22 13"/>
        </svg>
      </div>

      <p class="text-2xl font-bold text-gray-900">{{ stat.value }}</p>

      <div class="flex items-center gap-1 mt-2">
        <svg v-if="stat.trend === 'up'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          class="w-4 h-4 text-green-600">
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
        </svg>
        <svg v-else-if="stat.trend === 'down'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          class="w-4 h-4 text-red-600">
          <polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/>
        </svg>
        <span class="text-xs" :class="stat.trend === 'up' ? 'text-green-600' : stat.trend === 'down' ? 'text-red-600' : 'text-gray-500'">
          {{ stat.sub }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  stats: { type: Array, required: true }
})
</script>