<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
    <div
      v-for="(stat, index) in stats"
      :key="stat.label"
      class="group relative overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
      :style="{ animationDelay: `${index * 0.1}s` }"
      @click="handleStatClick(stat)"
    >
      <!-- Background Gradient on Hover -->
      <div class="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300"
        :class="getGradientColor(stat.label)"
      ></div>

      <!-- Icon -->
      <div class="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
        :class="getIconBgColor(stat.label)"
      >
        <component :is="getIcon(stat.label)" class="w-5 h-5" :class="getIconColor(stat.label)" />
      </div>

      <!-- Content -->
      <p class="text-sm font-medium text-gray-500 mb-1">{{ stat.label }}</p>
      <p class="text-3xl font-black text-gray-900">{{ formatValue(stat.value) }}</p>

      <!-- Trend Indicator (if available) -->
      <div v-if="stat.trend" class="flex items-center gap-1 mt-2">
        <svg v-if="stat.trend > 0" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-green-500">
          <polyline points="18 15 12 9 6 15"/>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-red-500">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
        <span class="text-xs font-semibold" :class="stat.trend > 0 ? 'text-green-600' : 'text-red-600'">
          {{ Math.abs(stat.trend) }}%
        </span>
        <span class="text-xs text-gray-400">from last month</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { h } from 'vue'

const props = defineProps({
  stats: { type: Array, required: true }
})

const emit = defineEmits(['stat-click'])

function handleStatClick(stat) {
  emit('stat-click', stat)
}

function formatValue(value) {
  if (typeof value === 'number') {
    if (value >= 1000000) return `₱${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `₱${(value / 1000).toFixed(1)}K`
    return value.toLocaleString()
  }
  return value
}

function getIcon(label) {
  const icons = {
    'Total Revenue': () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' }, [
      h('path', { d: 'M12 2v4' }),
      h('path', { d: 'M12 18v4' }),
      h('path', { d: 'M4.93 4.93l2.83 2.83' }),
      h('path', { d: 'M16.24 16.24l2.83 2.83' }),
      h('path', { d: 'M2 12h4' }),
      h('path', { d: 'M18 12h4' }),
      h('path', { d: 'M4.93 19.07l2.83-2.83' }),
      h('path', { d: 'M16.24 7.76l2.83-2.83' }),
      h('circle', { cx: '12', cy: '12', r: '3' })
    ]),
    'Total Orders': () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' }, [
      h('path', { d: 'M3 3h18v18H3z' }),
      h('path', { d: 'M3 9h18' }),
      h('path', { d: 'M9 21V9' })
    ]),
    'Pending Orders': () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' }, [
      h('circle', { cx: '12', cy: '12', r: '10' }),
      h('polyline', { points: '12 6 12 12 16 14' })
    ]),
    'Low Stock Items': () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' }, [
      h('path', { d: 'M10.268 21a2 2 0 0 0 3.464 0' }),
      h('path', { d: 'M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326' })
    ]),
    'Out of Stock': () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' }, [
      h('circle', { cx: '12', cy: '12', r: '10' }),
      h('path', { d: 'm15 9-6 6' }),
      h('path', { d: 'm9 9 6 6' })
    ]),
    'Completed Orders': () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' }, [
      h('path', { d: 'M21.801 10A10 10 0 1 1 17 3.335' }),
      h('path', { d: 'm9 11 3 3L22 4' })
    ])
  }
  return icons[label] || icons['Total Orders']
}

function getIconBgColor(label) {
  const colors = {
    'Total Revenue': 'bg-green-100',
    'Total Orders': 'bg-blue-100',
    'Pending Orders': 'bg-yellow-100',
    'Low Stock Items': 'bg-red-100',
    'Out of Stock': 'bg-orange-100',
    'Completed Orders': 'bg-purple-100'
  }
  return colors[label] || 'bg-gray-100'
}

function getIconColor(label) {
  const colors = {
    'Total Revenue': 'text-green-600',
    'Total Orders': 'text-blue-600',
    'Pending Orders': 'text-yellow-600',
    'Low Stock Items': 'text-red-600',
    'Out of Stock': 'text-orange-600',
    'Completed Orders': 'text-purple-600'
  }
  return colors[label] || 'text-gray-600'
}

function getGradientColor(label) {
  const colors = {
    'Total Revenue': 'from-green-500 to-green-600',
    'Total Orders': 'from-blue-500 to-blue-600',
    'Pending Orders': 'from-yellow-500 to-yellow-600',
    'Low Stock Items': 'from-red-500 to-red-600',
    'Out of Stock': 'from-orange-500 to-orange-600',
    'Completed Orders': 'from-purple-500 to-purple-600'
  }
  return colors[label] || 'from-gray-500 to-gray-600'
}
</script>