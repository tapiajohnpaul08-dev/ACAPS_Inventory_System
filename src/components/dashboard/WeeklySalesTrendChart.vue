<template>
  <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
    <h2 class="text-sm font-bold text-gray-900 mb-1 uppercase tracking-wide">Weekly Sales Trend</h2>
    <p class="text-xs text-gray-400 mb-4">This week's sales performance</p>

    <div class="w-full">
      <div class="flex gap-2 h-56">
        <!-- Y labels -->
        <div class="flex flex-col justify-between text-right pr-2 py-1 shrink-0">
          <span v-for="label in yLabels" :key="label" class="text-xs text-slate-400 leading-none">{{ label }}</span>
        </div>

        <!-- Chart area -->
        <div class="flex-1 relative min-w-0">
          <svg
            class="w-full h-full overflow-visible"
            :viewBox="`0 0 ${svgWidth} ${svgHeight}`"
            preserveAspectRatio="none"
          >
            <!-- Grid lines -->
            <g>
              <line
                v-for="(_, i) in yLabels"
                :key="i"
                x1="0" :y1="(i / (yLabels.length - 1)) * svgHeight"
                :x2="svgWidth" :y2="(i / (yLabels.length - 1)) * svgHeight"
                stroke="#f1f5f9" stroke-dasharray="4 4" stroke-width="1"
              />
            </g>

            <!-- Area fill -->
            <defs>
              <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#10b981" stop-opacity="0.15" />
                <stop offset="100%" stop-color="#10b981" stop-opacity="0" />
              </linearGradient>
            </defs>
            <path :d="areaPath" fill="url(#trendGradient)" />

            <!-- Line -->
            <path
              :d="linePath"
              fill="none"
              stroke="#10b981"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />

            <!-- Dots -->
            <g v-for="(point, i) in points" :key="i">
              <circle
                :cx="point.x" :cy="point.y" r="5"
                fill="white" stroke="#10b981" stroke-width="2.5"
                class="cursor-pointer"
                @mouseenter="hoveredPoint = i"
                @mouseleave="hoveredPoint = null"
              />
              <!-- Tooltip -->
              <g v-if="hoveredPoint === i">
                <rect
                  :x="point.x - 28" :y="point.y - 36"
                  width="56" height="22" rx="6"
                  fill="#111827"
                />
                <text
                  :x="point.x" :y="point.y - 21"
                  text-anchor="middle" fill="white"
                  font-size="10" font-weight="600"
                >
                  ₱{{ chartData[i].displayValue }}
                </text>
              </g>
            </g>
          </svg>
        </div>
      </div>

      <!-- X-axis labels -->
      <div class="flex justify-between mt-2 pl-10">
        <span
          v-for="day in days"
          :key="day"
          class="text-xs text-slate-400 text-center flex-1"
        >
          {{ day }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const hoveredPoint = ref(null)

const svgWidth  = 400
const svgHeight = 200

const yLabels = ['24k', '18k', '12k', '6k', '0']

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const chartData = [
  { value: 12000, displayValue: '12,000' },
  { value: 15000, displayValue: '15,000' },
  { value: 14000, displayValue: '14,000' },
  { value: 18000, displayValue: '18,000' },
  { value: 21000, displayValue: '21,000' },
  { value: 19500, displayValue: '19,500' },
  { value: 17000, displayValue: '17,000' },
]

const maxValue = 24000

const points = computed(() =>
  chartData.map((d, i) => ({
    x: (i / (chartData.length - 1)) * svgWidth,
    y: svgHeight - (d.value / maxValue) * svgHeight,
  }))
)

// Smooth cubic bezier path
function smoothPath(pts) {
  if (pts.length < 2) return ''
  let d = `M${pts[0].x},${pts[0].y}`
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1]
    const curr = pts[i]
    const cpX = (prev.x + curr.x) / 2
    d += ` C${cpX},${prev.y} ${cpX},${curr.y} ${curr.x},${curr.y}`
  }
  return d
}

const linePath = computed(() => smoothPath(points.value))

const areaPath = computed(() => {
  const pts = points.value
  if (!pts.length) return ''
  const line = smoothPath(pts)
  return `${line} L${pts[pts.length - 1].x},${svgHeight} L${pts[0].x},${svgHeight} Z`
})
</script>