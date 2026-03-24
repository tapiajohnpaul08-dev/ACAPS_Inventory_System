<template>
  <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
    <h2 class="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue Trend</h2>

    <div class="flex gap-6 mb-4">
      <div class="flex items-center gap-1.5 text-xs text-gray-600">
        <div class="w-6 h-0.5 bg-emerald-500 rounded"></div> Revenue (₱)
      </div>
      <div class="flex items-center gap-1.5 text-xs text-gray-600">
        <div class="w-6 h-0.5 bg-blue-500 rounded"></div> Orders
      </div>
    </div>

    <svg :viewBox="`0 0 ${W} ${H}`" class="w-full" :style="{ height: `${H}px` }">
      <defs>
        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#10b981" stop-opacity="0.15"/>
          <stop offset="100%" stop-color="#10b981" stop-opacity="0"/>
        </linearGradient>
        <linearGradient id="ordGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.1"/>
          <stop offset="100%" stop-color="#3b82f6" stop-opacity="0"/>
        </linearGradient>
      </defs>

      <g v-for="tick in yTicks" :key="tick">
        <line :x1="ML" :y1="yPos(tick)" :x2="W - MR" :y2="yPos(tick)"
          stroke="#e5e7eb" stroke-dasharray="3 3"/>
        <text :x="ML - 6" :y="yPos(tick)" text-anchor="end" font-size="11" fill="#9ca3af"
          dominant-baseline="middle">
          {{ tick === 0 ? '0' : `${tick/1000}k` }}
        </text>
      </g>

      <path :d="areaPath(revenuePoints)" fill="url(#revGrad)"/>
      <path :d="areaPath(ordersPoints)" fill="url(#ordGrad)"/>

      <path :d="linePath(revenuePoints)" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round"/>
      <path :d="linePath(ordersPoints)" fill="none" stroke="#3b82f6" stroke-width="2.5" stroke-linecap="round"/>

      <g v-for="(pt, i) in revenuePoints" :key="'r'+i">
        <circle :cx="pt.x" :cy="pt.y" r="4" fill="white" stroke="#10b981" stroke-width="2.5"/>
        <text :x="pt.x" :y="pt.y - 10" text-anchor="middle" font-size="10" fill="#10b981" font-weight="600">
          ₱{{ monthsData[i].revenue / 1000 }}k
        </text>
      </g>

      <circle v-for="(pt, i) in ordersPoints" :key="'o'+i"
        :cx="pt.x" :cy="pt.y" r="4" fill="white" stroke="#3b82f6" stroke-width="2.5"/>

      <text v-for="(m, i) in monthsData" :key="m.month"
        :x="xPos(i)" :y="H - 8"
        text-anchor="middle" font-size="12" fill="#6b7280">
        {{ m.month }}
      </text>
    </svg>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  months: { type: Array, required: true }
})

const monthsData = computed(() => props.months)

const ML = 55
const MR = 20
const MT = 30
const MB = 30
const W = 600
const plotH = 220
const H = plotH + MT + MB

const maxRev = 200000
const yTicks = [0, 50000, 100000, 150000, 200000]

function xPos(i) {
  return ML + (i / (monthsData.value.length - 1)) * (W - ML - MR)
}

function yPos(v) {
  return MT + plotH - (v / maxRev) * plotH
}

const revenuePoints = computed(() =>
  monthsData.value.map((m, i) => ({ x: xPos(i), y: yPos(m.revenue) }))
)

const ordersPoints = computed(() =>
  monthsData.value.map((m, i) => ({ x: xPos(i), y: yPos(m.orders * 200) }))
)

function linePath(pts) {
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
}

function areaPath(pts) {
  if (!pts.length) return ''
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
  const last = pts[pts.length - 1]
  const first = pts[0]
  return `${line} L${last.x},${H - MB} L${first.x},${H - MB} Z`
}
</script>