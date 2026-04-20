<template>
  <div class="chart-card">
    <h2 class="chart-title">Order Status Distribution</h2>

    <div class="chart-body">
      <!-- Donut Chart -->
      <div class="chart-wrap">
        <svg :viewBox="`0 0 ${SIZE} ${SIZE}`" class="chart-svg">
          <g :transform="`translate(${CX}, ${CY})`">
            <circle :r="R" fill="none" stroke="#f1f5f9" :stroke-width="THICKNESS" />
            <path
              v-for="slice in slices"
              :key="slice.label"
              :d="slice.path"
              :fill="slice.color"
              class="slice"
            />
            <text text-anchor="middle" dy="-10" class="center-total">{{ total }}</text>
            <text text-anchor="middle" dy="14" class="center-label">Total Orders</text>
          </g>
        </svg>
      </div>

      <!-- Legend -->
      <div class="legend">
        <div
          v-for="slice in slices.filter(s => s.pct > 0)"
          :key="'leg-' + slice.label"
          class="legend-item"
        >
          <div class="legend-dot" :style="{ background: slice.color }"></div>
          <div class="legend-info">
            <span class="legend-name">{{ slice.label }}</span>
            <span class="legend-value">{{ slice.value.toLocaleString() }}</span>
          </div>
          <span class="legend-pct" :style="{ color: slice.color }">{{ slice.pct }}%</span>
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

const SIZE = 260
const CX = SIZE / 2
const CY = SIZE / 2
const R = 100
const THICKNESS = 44

const total = computed(() => props.segments.reduce((s, d) => s + d.value, 0))

function polarToXY(angleDeg, r) {
  const rad = (angleDeg - 90) * (Math.PI / 180)
  return { x: r * Math.cos(rad), y: r * Math.sin(rad) }
}

function donutArcPath(startDeg, endDeg) {
  const outerR = R
  const innerR = R - THICKNESS
  const s_outer = polarToXY(startDeg, outerR)
  const e_outer = polarToXY(endDeg, outerR)
  const s_inner = polarToXY(startDeg, innerR)
  const e_inner = polarToXY(endDeg, innerR)
  const large = endDeg - startDeg > 180 ? 1 : 0
  return [
    `M ${s_outer.x} ${s_outer.y}`,
    `A ${outerR} ${outerR} 0 ${large} 1 ${e_outer.x} ${e_outer.y}`,
    `L ${e_inner.x} ${e_inner.y}`,
    `A ${innerR} ${innerR} 0 ${large} 0 ${s_inner.x} ${s_inner.y}`,
    'Z'
  ].join(' ')
}

const slices = computed(() => {
  let current = 0
  const GAP_DEG = 1.5
  return props.segments.map(seg => {
    const pct = total.value ? Math.round((seg.value / total.value) * 100) : 0
    const startDeg = (current / total.value) * 360 + GAP_DEG / 2
    const endDeg = ((current + seg.value) / total.value) * 360 - GAP_DEG / 2
    current += seg.value
    return {
      ...seg,
      pct,
      path: pct > 0 ? donutArcPath(startDeg, endDeg) : '',
    }
  })
})
</script>

<style scoped>
.chart-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04);
  font-family: 'DM Sans', 'Segoe UI', sans-serif;
  width: 100%;
}

.chart-title {
  font-size: 15px;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 20px 0;
  letter-spacing: -0.01em;
}

.chart-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.chart-wrap {
  width: 220px;
  height: 220px;
  flex-shrink: 0;
}

.chart-svg {
  width: 100%;
  height: 100%;
  display: block;
}

.slice {
  transition: opacity 0.15s ease;
  cursor: pointer;
}
.slice:hover {
  opacity: 0.82;
}

.center-total {
  font-size: 26px;
  font-weight: 700;
  fill: #0f172a;
  font-family: inherit;
}

.center-label {
  font-size: 11px;
  font-weight: 500;
  fill: #94a3b8;
  font-family: inherit;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.legend {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 8px;
  background: #f8fafc;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  gap: 1px;
}

.legend-name {
  font-size: 12px;
  font-weight: 500;
  color: #374151;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.legend-value {
  font-size: 11px;
  color: #9ca3af;
}

.legend-pct {
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0;
  letter-spacing: -0.02em;
}
</style>