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
          <component :is="stat.icon" class="w-5 h-5" :class="stat.iconColor" />
        </div>
      </div>
      <p class="text-xs text-gray-500 font-medium uppercase tracking-wide">{{ stat.label }}</p>
      <p class="text-2xl font-black text-gray-900 mt-1">{{ stat.value }}</p>
      <p class="text-xs mt-2" :class="stat.subColor">{{ stat.sub }}</p>
    </div>
  </div>
</template>

<script setup>
import { h } from 'vue'

// Inline SVG icon components
const PackageIcon = () =>
  h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
    h('path', { d: 'M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z' }),
    h('path', { d: 'M12 22V12' }),
    h('polyline', { points: '3.29 7 12 12 20.71 7' }),
    h('path', { d: 'm7.5 4.27 9 5.15' }),
  ])

const CartIcon = () =>
  h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
    h('circle', { cx: 8, cy: 21, r: 1 }),
    h('circle', { cx: 19, cy: 21, r: 1 }),
    h('path', { d: 'M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12' }),
  ])

const DollarIcon = () =>
  h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
    h('line', { x1: 12, x2: 12, y1: 2, y2: 22 }),
    h('path', { d: 'M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' }),
  ])

const AlertIcon = () =>
  h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
    h('path', { d: 'm21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3' }),
    h('path', { d: 'M12 9v4' }),
    h('path', { d: 'M12 17h.01' }),
  ])

const stats = [
  {
    label: 'Total Stock',
    value: '111,500',
    sub: 'Cup units in inventory',
    subColor: 'text-gray-500',
    icon: PackageIcon,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    label: 'Total Orders',
    value: '5',
    sub: '+3 in progress',
    subColor: 'text-emerald-600',
    icon: CartIcon,
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
  },
  {
    label: 'Total Revenue',
    value: '₱5,775',
    sub: 'From completed orders',
    subColor: 'text-gray-500',
    icon: DollarIcon,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  {
    label: 'Low Stock Items',
    value: '8',
    sub: 'Needs restocking',
    subColor: 'text-red-600',
    icon: AlertIcon,
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
  },
]
</script>