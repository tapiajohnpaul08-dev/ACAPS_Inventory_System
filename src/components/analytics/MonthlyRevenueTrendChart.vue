<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
    <div class="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-base font-bold text-gray-900 uppercase tracking-wide">
            Monthly Revenue Trend
          </h2>
          <p class="text-xs text-gray-400 mt-1">Revenue performance over the last 12 months</p>
        </div>
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <div class="w-4 h-0.5 bg-blue-500 rounded"></div>
            <span class="text-xs text-gray-600">Revenue (₱)</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!months.length || totalRevenue === 0" class="text-center py-16 text-gray-400">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
      </svg>
      <p class="text-sm">No monthly data available</p>
      <p class="text-xs text-gray-400 mt-1">Complete orders will appear here</p>
    </div>

    <div v-else class="p-6">
      <!-- Line Chart -->
      <div class="relative h-80">

        <!-- Y-axis Labels — iterate reversed copy so max is at top, 0 at bottom -->
        <div class="absolute -left-5 top-0 bottom-0 w-12 flex flex-col justify-between text-right pr-1">
          <div v-for="tick in reversedTicks" :key="'label-' + tick" class="text-xs text-gray-600">
            {{ formatYValue(tick) }}
          </div>
        </div>

        <!-- Grid Lines — use original yTicks order; position from top via getYPercent -->
        <div class="absolute left-10 right-0 top-0 bottom-5">
          <div
            v-for="tick in yTicks"
            :key="'grid-' + tick"
            class="absolute w-full border-t border-gray-200"
            :style="{ top: getYPercent(tick) + '%' }"
          />
        </div>

        <!-- Chart SVG — same coordinate system as getYPercent -->
        <svg
          class="absolute left-10 top-0 bottom-0 w-[calc(100%-2.5rem)] h-full"
          :viewBox="`0 0 ${svgWidth} ${svgHeight}`"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.3"/>
              <stop offset="100%" stop-color="#3b82f6" stop-opacity="0"/>
            </linearGradient>
          </defs>

          <!-- Area under line -->
          <polygon v-if="areaPoints" :points="areaPoints" fill="url(#revenueGradient)" />

          <!-- Line -->
          <polyline
            v-if="linePoints"
            :points="linePoints"
            fill="none"
            stroke="#3b82f6"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />

          <!-- Data Points + Tooltips -->
          <g v-for="(point, i) in chartPoints" :key="i">
            <circle
              :cx="point.x"
              :cy="point.y"
              r="6"
              fill="white"
              stroke="#3b82f6"
              stroke-width="3"
              class="cursor-pointer"
              @click="showMonthDetail(displayMonths[i])"
              @mouseenter="hoveredMonth = i"
              @mouseleave="hoveredMonth = null"
            />

            <g v-if="hoveredMonth === i">
              <rect
                :x="clampTooltipX(point.x - 45)"
                :y="point.y > 40 ? point.y - 38 : point.y + 10"
                width="90"
                height="28"
                rx="6"
                fill="#1f2937"
              />
              <text
                :x="clampTooltipX(point.x - 45) + 45"
                :y="point.y > 40 ? point.y - 20 : point.y + 28"
                text-anchor="middle"
                fill="white"
                font-size="11"
                font-weight="600"
              >
                ₱{{ displayMonths[i].revenue.toLocaleString() }}
              </text>
            </g>
          </g>
        </svg>

        <!-- X-axis Labels -->
        <div class="absolute left-10 right-0 bottom-[-24px] flex">
          <div
            v-for="month in displayMonths"
            :key="month.month"
            class="text-center flex-1"
          >
            <span class="text-xs font-medium text-gray-500">{{ month.month }}</span>
          </div>
        </div>
      </div>

      <!-- Summary Stats -->
      <div class="grid grid-cols-4 gap-4 mt-12 pt-5 border-t border-gray-100">
        <div class="text-center p-3 rounded-lg bg-blue-50">
          <p class="text-xs text-gray-500 uppercase font-medium">Total Revenue</p>
          <p class="text-base font-bold text-blue-600">₱{{ totalRevenue.toLocaleString() }}</p>
        </div>
        <div class="text-center p-3 rounded-lg bg-emerald-50">
          <p class="text-xs text-gray-500 uppercase font-medium">Average Monthly</p>
          <p class="text-base font-bold text-emerald-600">₱{{ avgMonthlyRevenue.toLocaleString() }}</p>
        </div>
        <div class="text-center p-3 rounded-lg bg-amber-50">
          <p class="text-xs text-gray-500 uppercase font-medium">Highest Month</p>
          <p class="text-base font-bold text-amber-600">{{ bestMonth.month }} (₱{{ bestMonth.revenue.toLocaleString() }})</p>
        </div>
        <div class="text-center p-3 rounded-lg bg-purple-50">
          <p class="text-xs text-gray-500 uppercase font-medium">Total Orders</p>
          <p class="text-base font-bold text-purple-600">{{ totalOrders.toLocaleString() }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  months: { type: Array, required: true }
})

const hoveredMonth = ref(null)

// ── SVG coordinate constants ───────────────────────────────────────────────
const svgWidth  = 800
const svgHeight = 280
// Padding keeps points/tooltips from clipping at the very edges
const padTop    = 16   // room for tooltip above highest point
const padBottom = 16   // room so 0-value circle isn't clipped

// ── Data ───────────────────────────────────────────────────────────────────
const displayMonths = computed(() => {
  const order = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return [...props.months].sort((a, b) => order.indexOf(a.month) - order.indexOf(b.month))
})

const totalRevenue    = computed(() => props.months.reduce((s, m) => s + (m.revenue || 0), 0))
const totalOrders     = computed(() => props.months.reduce((s, m) => s + (m.orders  || 0), 0))
const avgMonthlyRevenue = computed(() => Math.round(totalRevenue.value / 12))
const maxRevenue      = computed(() => Math.max(...props.months.map(m => m.revenue || 0), 1))
const yMax            = computed(() => Math.ceil(maxRevenue.value * 1.15))

const bestMonth = computed(() =>
  props.months.reduce(
    (best, cur) => (cur.revenue || 0) > (best.revenue || 0) ? cur : best,
    { month: 'N/A', revenue: 0 }
  )
)

// ── Y-axis ticks — produced lowest→highest, never mutated ─────────────────
const yTicks = computed(() => {
  const max  = yMax.value
  if (max === 0) return [0]
  const step = Math.ceil(max / 4)
  return [0, step, step * 2, step * 3, max]
})

// Reversed copy for the label column (highest label at the top of the flex column)
const reversedTicks = computed(() => [...yTicks.value].reverse())

// ── Coordinate helpers — single source of truth ───────────────────────────
// SVG y for a revenue value: max → padTop, 0 → svgHeight - padBottom
function valueToSvgY(value) {
  const ratio = yMax.value === 0 ? 0 : value / yMax.value
  return svgHeight - padBottom - ratio * (svgHeight - padTop - padBottom)
}

// CSS top% for grid lines (0% = top of container = max value)
function getYPercent(value) {
  return yMax.value === 0 ? 100 : 100 - (value / yMax.value) * 100
}

// ── Chart points ───────────────────────────────────────────────────────────
const chartPoints = computed(() => {
  const count = displayMonths.value.length
  if (count === 0) return []
  // Place each point at the center of its equal-width slot so it lines up
  // with the center of the corresponding flex-1 month label beneath the SVG.
  const slotWidth = svgWidth / count
  return displayMonths.value.map((month, i) => ({
    x: slotWidth * i + slotWidth / 2,
    y: valueToSvgY(month.revenue || 0),
  }))
})

const linePoints = computed(() =>
  chartPoints.value.map(p => `${p.x},${p.y}`).join(' ')
)

const areaPoints = computed(() => {
  if (!chartPoints.value.length) return ''
  const first = chartPoints.value[0]
  const last  = chartPoints.value[chartPoints.value.length - 1]
  const bottom = svgHeight - padBottom
  return `${linePoints.value} L${last.x},${bottom} L${first.x},${bottom} Z`
})

// Prevent tooltip rect from overflowing SVG left/right edge
function clampTooltipX(x) {
  return Math.max(2, Math.min(x, svgWidth - 92))
}

// ── Formatting ─────────────────────────────────────────────────────────────
function formatYValue(value) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000)     return `${(value / 1_000).toFixed(0)}k`
  return value.toString()
}

function showMonthDetail(month) {
  alert(
    `${month.month} ${month.year || new Date().getFullYear()}\n` +
    `Revenue: ₱${(month.revenue || 0).toLocaleString()}\n` +
    `Orders: ${(month.orders || 0).toLocaleString()}\n` +
    `Avg per order: ₱${month.orders > 0 ? Math.round(month.revenue / month.orders).toLocaleString() : 0}`
  )
}
</script>