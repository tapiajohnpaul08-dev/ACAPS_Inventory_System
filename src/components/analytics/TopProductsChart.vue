<template>
  <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
    <h2 class="text-lg font-semibold text-gray-900 mb-4">Top Selling Products</h2>
    <div class="overflow-x-auto">
      <svg :viewBox="`0 0 ${W} ${H}`" class="w-full" :style="{ height: `${H}px` }">
        <g v-for="tick in xTicks" :key="tick">
          <line :x1="xScale(tick)" y1="0" :x2="xScale(tick)" :y2="plotH"
            stroke="#e5e7eb" stroke-dasharray="3 3"/>
          <text :x="xScale(tick)" :y="H - 4" text-anchor="middle" font-size="11" fill="#9ca3af">
            {{ tick }}
          </text>
        </g>
        <g v-for="(item, i) in products" :key="item.name">
          <rect
            :x="MARGIN_LEFT"
            :y="i * rowH + rowH * 0.2"
            :width="xScale(item.orders)"
            :height="rowH * 0.6"
            rx="3" fill="#3b82f6"
            class="hover:fill-blue-400 transition-colors cursor-pointer"
          />
          <text
            :x="MARGIN_LEFT - 6"
            :y="i * rowH + rowH / 2"
            text-anchor="end" font-size="11" fill="#6b7280"
            dominant-baseline="middle"
          >{{ item.name }}</text>
          <text
            :x="MARGIN_LEFT + xScale(item.orders) + 4"
            :y="i * rowH + rowH / 2"
            font-size="11" fill="#374151" font-weight="600"
            dominant-baseline="middle"
          >{{ item.orders }}</text>
        </g>
      </svg>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  products: { type: Array, required: true }
})

const MARGIN_LEFT = 148
const rowH = 34
const W = 520
const plotH = computed(() => props.products.length * rowH)
const H = computed(() => plotH.value + 24)

const maxOrders = 100
const plotWidth = W - MARGIN_LEFT - 40

const xTicks = [0, 25, 50, 75, 100]

function xScale(v) {
  return (v / maxOrders) * plotWidth
}
</script>