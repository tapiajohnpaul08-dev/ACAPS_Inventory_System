<template>
  <div class="grid grid-cols-3 gap-3 mb-3">
    <div
      v-for="stat in stats"
      :key="stat.label"
      class="stat-card rounded-2xl px-4 py-3 flex items-center gap-3"
      :style="stat.bg"
    >
      <!-- Icon -->
      <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" :style="stat.iconBg">
        <component :is="stat.icon" class="w-4 h-4" :style="stat.iconColor" />
      </div>
      <div>
        <p class="text-2xl font-bold leading-none" :style="stat.valueColor">{{ stat.value }}</p>
        <p class="text-xs mt-0.5 font-medium" :style="stat.labelColor">{{ stat.label }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, h } from 'vue'

const props = defineProps({
  total:   { type: Number, default: 0 },
  unread:  { type: Number, default: 0 },
  pending: { type: Number, default: 0 },
})

// Inline SVG icon components
const InboxIcon = () => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24',
  stroke: 'currentColor', 'stroke-width': '2'
}, [
  h('polyline', { points: '22 12 16 12 14 15 10 15 8 12 2 12' }),
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z' }),
])

const BellIcon = () => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24',
  stroke: 'currentColor', 'stroke-width': '2'
}, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9' }),
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M13.73 21a2 2 0 0 1-3.46 0' }),
])

const ClockIcon = () => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24',
  stroke: 'currentColor', 'stroke-width': '2'
}, [
  h('circle', { cx: '12', cy: '12', r: '10' }),
  h('polyline', { points: '12 6 12 12 16 14' }),
])

const stats = computed(() => [
  {
    label:      'Total',
    value:      props.total,
    icon:       InboxIcon,
    bg:         'background: #f0f9ff;',
    iconBg:     'background: #bae6fd;',
    iconColor:  'color: #0369a1;',
    valueColor: 'color: #0c4a6e;',
    labelColor: 'color: #0369a1;',
  },
  {
    label:      'Unread',
    value:      props.unread,
    icon:       BellIcon,
    bg:         props.unread > 0 ? 'background: #fef2f2;' : 'background: #f9fafb;',
    iconBg:     props.unread > 0 ? 'background: #fecaca;' : 'background: #e5e7eb;',
    iconColor:  props.unread > 0 ? 'color: #dc2626;' : 'color: #9ca3af;',
    valueColor: props.unread > 0 ? 'color: #7f1d1d;' : 'color: #374151;',
    labelColor: props.unread > 0 ? 'color: #dc2626;' : 'color: #6b7280;',
  },
  {
    label:      'Pending Reply',
    value:      props.pending,
    icon:       ClockIcon,
    bg:         props.pending > 0 ? 'background: #fffbeb;' : 'background: #f9fafb;',
    iconBg:     props.pending > 0 ? 'background: #fde68a;' : 'background: #e5e7eb;',
    iconColor:  props.pending > 0 ? 'color: #d97706;' : 'color: #9ca3af;',
    valueColor: props.pending > 0 ? 'color: #78350f;' : 'color: #374151;',
    labelColor: props.pending > 0 ? 'color: #d97706;' : 'color: #6b7280;',
  },
])
</script>

<style scoped>
.stat-card {
  border: 1px solid rgba(0,0,0,0.05);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.stat-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.07);
}
</style>