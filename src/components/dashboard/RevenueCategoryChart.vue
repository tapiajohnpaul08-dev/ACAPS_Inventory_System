<template>
  <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
    <h2 class="text-sm font-bold text-gray-900 mb-1 uppercase tracking-wide">Revenue by Category</h2>
    <p class="text-xs text-gray-400 mb-4">Based on inventory revenue data</p>

    <div class=" w-full overflow-x-auto">
      <div class="min-w-[320px]">
        <!-- Y-axis labels + bars -->
        <div class="flex gap-2 h-56">
          <!-- Y labels -->
          <div class="flex flex-col justify-between text-right pr-2 py-1 shrink-0">
            <span v-for="label in yLabels" :key="label" class="text-xs text-slate-400 leading-none">{{ label }}</span>
          </div>

          <!-- Bar area -->
          <div class="flex-1 relative">
            <!-- Grid lines -->
            <div class="absolute inset-0 flex flex-col justify-between pointer-events-none">
              <div v-for="i in 5" :key="i" class="border-t border-dashed border-slate-100 w-full"></div>
            </div>

            <!-- Bars -->
            <div class="absolute inset-0 flex items-end justify-around gap-1 px-2 pb-0">
              <div
                v-for="item in chartData"
                :key="item.label"
                class="flex flex-col items-center gap-1 flex-1"
              >
                <span class="text-xs font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  {{ item.displayValue }}
                </span>
                <div
                  class="w-full rounded-t-lg bg-blue-500 hover:bg-blue-400 transition-all duration-300 cursor-pointer group relative"
                  :style="{ height: item.height }"
                  @mouseenter="hoveredBar = item.label"
                  @mouseleave="hoveredBar = null"
                >
                  <!-- Tooltip -->
                  <div
                    v-if="hoveredBar === item.label"
                    class="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap z-10 pointer-events-none"
                  >
                    {{ item.displayValue }}
                    <div class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- X-axis labels -->
        <div class="flex justify-around mt-2 pl-10">
          <span
            v-for="item in chartData"
            :key="item.label"
            class="text-xs text-slate-400 text-center flex-1 truncate px-0.5"
          >
            {{ item.label }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const hoveredBar = ref(null)

const yLabels = ['160k', '120k', '80k', '40k', '0']

const chartData = [
  { label: 'PET CUPS',        value: 152500, displayValue: '152,500', height: '95%' },
  { label: 'DBL WALL',        value: 131600, displayValue: '131,600', height: '82%' },
  { label: 'HARD CUPS',       value: 126000, displayValue: '126,000', height: '79%' },
  { label: 'SLIM CUPS',       value: 110200, displayValue: '110,200', height: '69%' },
  { label: 'PP U-CUPS',       value: 105000, displayValue: '105,000', height: '66%' },
  { label: 'PP Y-CUPS',       value: 100000, displayValue: '100,000', height: '63%' },
  { label: 'DBL WALL WHT',    value:  86000, displayValue: '86,000',  height: '54%' },
  { label: 'DBL WALL BRN',    value:  84500, displayValue: '84,500',  height: '53%' },
]
</script>