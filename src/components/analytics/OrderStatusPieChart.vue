<template>
  <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
    <h2 class="text-lg font-semibold text-gray-900 mb-4">Order Status Distribution</h2>

    <div class="flex flex-col items-center">
      <svg :viewBox="`0 0 ${SIZE} ${SIZE}`" class="w-full max-w-xs">
        <g :transform="`translate(${CX}, ${CY})`">
          <path
            v-for="slice in slices"
            :key="slice.label"
            :d="slice.path"
            :fill="slice.color"
            stroke="white"
            stroke-width="2"
            class="hover:opacity-80 transition-opacity cursor-pointer"
          />
        </g>
        <g v-for="slice in slices.filter(s => s.pct > 0)" :key="'lbl-' + slice.label">
          <text
            :x="slice.labelX"
            :y="slice.labelY"
            :text-anchor="slice.labelAnchor"
            font-size="11"
            :fill="slice.color"
            font-weight="600"
          >{{ slice.label }} {{ slice.pct }}%</text>
        </g>
      </svg>

      <div class="flex flex-wrap justify-center gap-3 mt-4">
        <div v-for="slice in slices.filter(s => s.pct > 0)" :key="'leg-' + slice.label"
          class="flex items-center gap-1.5 text-xs text-gray-600">
          <div class="w-3 h-3 rounded-sm flex-shrink-0" :style="{ background: slice.color }"></div>
          {{ slice.label }} ({{ slice.pct }}%)
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  segments: { type: Array, required: true }
})

const SIZE = 280
const CX = SIZE / 2
const CY = SIZE / 2
const R = 100

const total = computed(() => props.segments.reduce((s, d) => s + d.value, 0))

function polarToXY(angleDeg, r) {
  const rad = (angleDeg - 90) * (Math.PI / 180)
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) }
}

function arcPath(startDeg, endDeg, r) {
  const s = polarToXY(startDeg, r)
  const e = polarToXY(endDeg, r)
  const large = endDeg - startDeg > 180 ? 1 : 0
  return `M ${CX} ${CY} L ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y} Z`
}

const slices = computed(() => {
  let current = 0
  return props.segments.map(seg => {
    const pct = total.value ? Math.round((seg.value / total.value) * 100) : 0
    const startDeg = (current / total.value) * 360
    const endDeg = ((current + seg.value) / total.value) * 360
    current += seg.value
    const midDeg = (startDeg + endDeg) / 2
    const lp = polarToXY(midDeg, R + 24)
    return {
      ...seg,
      pct,
      path: pct > 0 ? arcPath(startDeg, endDeg, R) : '',
      labelX: lp.x,
      labelY: lp.y,
      labelAnchor: lp.x > CX ? 'start' : 'end',
    }
  })
})
</script>