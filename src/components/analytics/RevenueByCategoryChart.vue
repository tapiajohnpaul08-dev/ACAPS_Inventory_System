<template>
  <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
    <h2 class="text-lg font-semibold text-gray-900 mb-4">Revenue by Category</h2>

    <div class="flex gap-6 mb-4">
      <div class="flex items-center gap-1.5 text-xs text-gray-600">
        <div class="w-3 h-3 rounded-sm bg-emerald-500"></div> Revenue (₱)
      </div>
      <div class="flex items-center gap-1.5 text-xs text-gray-600">
        <div class="w-3 h-3 rounded-sm bg-blue-500"></div> Orders
      </div>
    </div>

    <div class="overflow-x-auto">
      <svg :viewBox="`0 0 ${W} ${H}`" class="w-full" :style="{ height: `${H}px` }" preserveAspectRatio="xMidYMid meet">
        <g v-for="tick in yTicks" :key="tick">
          <line :x1="ML" :y1="yPos(tick)" :x2="W - MR" :y2="yPos(tick)"
            stroke="#e5e7eb" stroke-dasharray="3 3"/>
          <text :x="ML - 6" :y="yPos(tick)" text-anchor="end" font-size="11" fill="#9ca3af"
            dominant-baseline="middle">{{ tick === 0 ? '0' : `${tick/1000}k` }}</text>
        </g>

        <g v-for="(item, i) in categories" :key="item.name">
          <rect
            :x="barX(i, 0)" :y="yPos(item.revenue)"
            :width="BW" :height="Math.max(0, plotH - yPos(item.revenue) + MT)"
            rx="2" fill="#10b981"
            class="hover:opacity-80 transition-opacity cursor-pointer"
          >
            <title>{{ item.name }} — Revenue: ₱{{ item.revenue.toLocaleString() }}</title>
          </rect>
          <rect
            :x="barX(i, 1)" :y="yPos(item.orders * 1600)"
            :width="BW" :height="Math.max(0, plotH - yPos(item.orders * 1600) + MT)"
            rx="2" fill="#3b82f6"
            class="hover:opacity-80 transition-opacity cursor-pointer"
          >
            <title>{{ item.name }} — Orders: {{ item.orders }}</title>
          </rect>
          <text
            :x="barX(i, 0) + BW"
            :y="H - MB + 14"
            text-anchor="end"
            font-size="10"
            fill="#6b7280"
            :transform="`rotate(-40, ${barX(i, 0) + BW}, ${H - MB + 14})`"
          >{{ item.name }}</text>
        </g>
      </svg>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  categories: { type: Array, required: true }
})

const ML = 55
const MR = 10
const MT = 10
const MB = 80
const BW = 14
const GAP = 4
const W = 700
const plotH = 240
const H = plotH + MT + MB

const maxVal = 160000
const yTicks = [0, 40000, 80000, 120000, 160000]
const colW = computed(() => (W - ML - MR) / props.categories.length)

function yPos(v) {
  return MT + plotH - (v / maxVal) * plotH
}

function barX(i, barIndex) {
  const center = ML + i * colW.value + colW.value / 2
  return center - BW + barIndex * (BW + GAP)
}
</script>