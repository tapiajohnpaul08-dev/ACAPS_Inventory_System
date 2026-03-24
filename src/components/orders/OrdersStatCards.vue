<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
    <div
      v-for="stat in computedStats"
      :key="stat.label"
      class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100"
    >
      <p class="text-xs text-gray-500 font-medium uppercase tracking-wide">{{ stat.label }}</p>
      <p class="text-2xl font-black mt-1" :class="stat.color">{{ stat.value }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  orders: { type: Array, required: true },
})

const computedStats = computed(() => [
  { label: 'All Orders', value: props.orders.length, color: 'text-blue-600' },
  { label: 'Pending', value: props.orders.filter(o => o.status === 'Pending').length, color: 'text-yellow-600' },
  { label: 'In Production', value: props.orders.filter(o => o.status === 'In Production').length, color: 'text-blue-600' },
  { label: 'Completed', value: props.orders.filter(o => o.status === 'Completed').length, color: 'text-green-600' },
])
</script>