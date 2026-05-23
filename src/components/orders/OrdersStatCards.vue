<template>
  <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
    <div
      v-for="stat in computedStats"
      :key="stat.label"
      class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-1"
    >
      <div class="flex items-center justify-between mb-1">
        <p class="text-xs text-gray-400 font-semibold uppercase tracking-wide leading-tight">{{ stat.label }}</p>
        <div class="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" :class="stat.iconBg">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" :class="stat.iconColor" v-html="stat.icon"></svg>
        </div>
      </div>
      <p class="text-2xl font-black" :class="stat.color">{{ stat.value }}</p>
      <p v-if="stat.sub" class="text-xs text-gray-400">{{ stat.sub }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  orders: { type: Array, required: true },
})

const computedStats = computed(() => {
  const orders = props.orders
  const total = orders.length
  const pending = orders.filter(o => o.status === 'Pending').length
  const inProd = orders.filter(o => o.status === 'In Production').length
  const completed = orders.filter(o => o.status === 'Completed').length
  const cancelled = orders.filter(o => o.status === 'Cancelled').length
  const unpaid = orders.filter(o => o.payment === 'unpaid').length
  const revenue = orders
    .filter(o => o.status === 'Completed')
    .reduce((sum, o) => sum + (o.rawAmount || 0), 0)

  return [
    {
      label: 'Total Orders',
      value: total.toLocaleString(),
      color: 'text-gray-900',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-500',
      icon: '<path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/>',
    },
    {
      label: 'Pending',
      value: pending.toLocaleString(),
      color: 'text-yellow-600',
      iconBg: 'bg-yellow-50',
      iconColor: 'text-yellow-500',
      icon: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
      sub: pending > 0 ? 'Needs attention' : 'All clear',
    },
    {
      label: 'In Production',
      value: inProd.toLocaleString(),
      color: 'text-blue-600',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-500',
      icon: '<path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><polyline points="3.29 7 12 12 20.71 7"/>',
    },
    {
      label: 'Completed',
      value: completed.toLocaleString(),
      color: 'text-green-600',
      iconBg: 'bg-green-50',
      iconColor: 'text-green-500',
      icon: '<path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/>',
      sub: total > 0 ? `${Math.round(completed / total * 100)}% completion` : '',
    },
    {
      label: 'Cancelled',
      value: cancelled.toLocaleString(),
      color: cancelled > 0 ? 'text-red-500' : 'text-gray-400',
      iconBg: 'bg-red-50',
      iconColor: 'text-red-400',
      icon: '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>',
    },
    {
      label: 'Unpaid Orders',
      value: unpaid.toLocaleString(),
      color: unpaid > 0 ? 'text-orange-600' : 'text-gray-400',
      iconBg: 'bg-orange-50',
      iconColor: 'text-orange-400',
      icon: '<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>',
      sub: unpaid > 0 ? 'Awaiting payment' : 'All paid',
    },
  ]
})
</script>