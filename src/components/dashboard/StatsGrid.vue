<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
    <div
      v-for="stat in stats"
      :key="stat.label"
      class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
    >
      <div class="flex items-center justify-between mb-4">
        <div
          class="w-11 h-11 rounded-xl flex items-center justify-center"
          :class="stat.iconBg"
        >
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
          <svg v-else-if="stat.icon === 'cart'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="w-5 h-5" :class="stat.iconColor">
            <circle cx="8" cy="21" r="1"/>
            <circle cx="19" cy="21" r="1"/>
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="w-5 h-5" :class="stat.iconColor">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/>
            <path d="M12 9v4"/><path d="M12 17h.01"/>
          </svg>
        </div>
      </div>
      <p class="text-xs text-gray-500 font-medium uppercase tracking-wide">{{ stat.label }}</p>
      <p class="text-2xl font-black text-gray-900 mt-1">{{ stat.value }}</p>
      <p class="text-xs mt-2" :class="stat.subColor">{{ stat.sub }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  stats: { type: Array, required: true }
})
</script>