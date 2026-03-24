<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100">
    <div class="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
      <div>
        <h2 class="text-sm font-bold text-gray-900 uppercase tracking-wide">Low Stock Alerts</h2>
        <p class="text-xs text-gray-400 mt-0.5">{{ items.length }} items below threshold</p>
      </div>
      <span class="px-2.5 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
        {{ items.length }}
      </span>
    </div>

    <div class="p-5 space-y-2.5">
      <button
        v-for="item in items"
        :key="item.name"
        class="w-full flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer group"
        :class="item.severity === 'red'
          ? 'bg-red-50 hover:bg-red-100 border-red-200'
          : 'bg-orange-50 hover:bg-orange-100 border-orange-200'"
      >
        <div class="text-left">
          <p class="text-sm font-semibold text-gray-900">{{ item.name }}</p>
          <p class="text-xs" :class="item.severity === 'red' ? 'text-red-600' : 'text-orange-600'">
            Stock: {{ item.stock }} · Threshold: {{ item.threshold }}
          </p>
        </div>
        <div class="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            :class="item.severity === 'red' ? 'text-red-500' : 'text-orange-500'">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/>
            <path d="M12 9v4"/><path d="M12 17h.01"/>
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="group-hover:translate-x-1 transition-transform"
            :class="item.severity === 'red' ? 'text-red-400' : 'text-orange-400'">
            <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
          </svg>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  items: { type: Array, required: true }
})
</script>