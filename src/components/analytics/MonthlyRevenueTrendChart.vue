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

        <!-- Y-axis Labels -->
        <div class="absolute -left-5 top-0 bottom-0 w-12 flex flex-col justify-between text-right pr-1">
          <div v-for="tick in reversedTicks" :key="'label-' + tick" class="text-xs text-gray-600">
            {{ formatYValue(tick) }}
          </div>
        </div>

        <!-- Grid Lines -->
        <div class="absolute left-10 right-0 top-0 bottom-5">
          <div
            v-for="tick in yTicks"
            :key="'grid-' + tick"
            class="absolute w-full border-t border-gray-200"
            :style="{ top: getYPercent(tick) + '%' }"
          />
        </div>

        <!-- Chart SVG -->
        <svg
          v-if="linePoints && areaPoints && chartPoints.length > 0"
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
          <polygon :points="areaPoints" fill="url(#revenueGradient)" />

          <!-- Line -->
          <polyline
            :points="linePoints"
            fill="none"
            stroke="#3b82f6"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />

          <!-- Data Points -->
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

        <!-- Fallback for no data points -->
        <div v-else class="absolute left-10 right-0 top-0 bottom-5 flex items-center justify-center">
          <p class="text-sm text-gray-400">Insufficient data for chart</p>
        </div>

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
  months: { type: Array, required: true },
  forecast: { type: Array, default: () => [] }
})

const hoveredMonth = ref(null)

// SVG coordinate constants
const svgWidth  = 800
const svgHeight = 280
const padTop    = 16
const padBottom = 16

// Data
const displayMonths = computed(() => {
  const order = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return [...props.months].sort((a, b) => order.indexOf(a.month) - order.indexOf(b.month))
})

const totalRevenue = computed(() => {
  const sum = props.months.reduce((s, m) => s + (m.revenue || 0), 0)
  return isNaN(sum) ? 0 : sum
})

const totalOrders = computed(() => {
  const sum = props.months.reduce((s, m) => s + (m.orders || 0), 0)
  return isNaN(sum) ? 0 : sum
})

const avgMonthlyRevenue = computed(() => {
  const avg = totalRevenue.value / 12
  return isNaN(avg) ? 0 : Math.round(avg)
})

const maxRevenue = computed(() => {
  const max = Math.max(...props.months.map(m => m.revenue || 0), 1)
  return isNaN(max) ? 1 : max
})

const yMax = computed(() => {
  const y = Math.ceil(maxRevenue.value * 1.15)
  return isNaN(y) ? 1000 : y
})

const bestMonth = computed(() => {
  const best = props.months.reduce(
    (best, cur) => (cur.revenue || 0) > (best.revenue || 0) ? cur : best,
    { month: 'N/A', revenue: 0 }
  )
  return best
})

// Y-axis ticks
const yTicks = computed(() => {
  const max = yMax.value
  if (max === 0) return [0]
  const step = Math.ceil(max / 4)
  const ticks = [0, step, step * 2, step * 3, max]
  return ticks.filter(t => !isNaN(t))
})

const reversedTicks = computed(() => [...yTicks.value].reverse())

// Coordinate helpers
function valueToSvgY(value) {
  const safeValue = isNaN(value) ? 0 : value
  const safeMax = yMax.value === 0 ? 1 : yMax.value
  const ratio = safeValue / safeMax
  const y = svgHeight - padBottom - ratio * (svgHeight - padTop - padBottom)
  return isNaN(y) ? svgHeight / 2 : y
}

function getYPercent(value) {
  const safeValue = isNaN(value) ? 0 : value
  const safeMax = yMax.value === 0 ? 1 : yMax.value
  const percent = 100 - (safeValue / safeMax) * 100
  return isNaN(percent) ? 0 : percent
}

// Chart points
const chartPoints = computed(() => {
  const count = displayMonths.value.length
  if (count === 0) return []
  
  const slotWidth = svgWidth / count
  
  return displayMonths.value.map((month, i) => {
    const revenue = month.revenue || 0
    const x = slotWidth * i + slotWidth / 2
    const y = valueToSvgY(revenue)
    return { x, y }
  }).filter(p => !isNaN(p.x) && !isNaN(p.y))
})

const linePoints = computed(() => {
  if (!chartPoints.value.length) return ''
  const points = chartPoints.value.map(p => `${p.x},${p.y}`).join(' ')
  return points || ''
})

const areaPoints = computed(() => {
  if (!chartPoints.value.length) return ''
  const first = chartPoints.value[0]
  const last = chartPoints.value[chartPoints.value.length - 1]
  if (!first || !last) return ''
  const bottom = svgHeight - padBottom
  const points = `${linePoints.value} L${last.x},${bottom} L${first.x},${bottom} Z`
  return points || ''
})

function clampTooltipX(x) {
  if (isNaN(x)) return 10
  return Math.max(2, Math.min(x, svgWidth - 92))
}

function formatYValue(value) {
  const safeValue = isNaN(value) ? 0 : value
  if (safeValue >= 1_000_000) return `${(safeValue / 1_000_000).toFixed(1)}M`
  if (safeValue >= 1_000) return `${(safeValue / 1_000).toFixed(0)}k`
  return safeValue.toString()
}

function showMonthDetail(month) {
  const revenue = month.revenue || 0
  const orders = month.orders || 0
  alert(
    `${month.month} ${month.year || new Date().getFullYear()}\n` +
    `Revenue: ₱${revenue.toLocaleString()}\n` +
    `Orders: ${orders.toLocaleString()}\n` +
    `Avg per order: ₱${orders > 0 ? Math.round(revenue / orders).toLocaleString() : 0}`
  )
}
</script>