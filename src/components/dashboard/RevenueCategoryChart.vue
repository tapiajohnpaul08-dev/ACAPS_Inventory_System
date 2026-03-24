<template>
  <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
    <h2 class="text-sm font-bold text-gray-900 mb-1 uppercase tracking-wide">Revenue by Category</h2>
    <p class="text-xs text-gray-400 mb-4">Based on inventory revenue data</p>

    <div class="w-full overflow-x-auto">
      <div class="min-w-[320px]">
        <div class="flex gap-2 h-56">
          <div class="flex flex-col justify-between text-right pr-2 py-1 shrink-0">
            <span v-for="label in yLabels" :key="label" class="text-xs text-slate-400 leading-none">{{ label }}</span>
          </div>

          <div class="flex-1 relative">
            <div class="absolute inset-0 flex flex-col justify-between pointer-events-none">
              <div v-for="i in 5" :key="i" class="border-t border-dashed border-slate-100 w-full"></div>
            </div>

            <div class="absolute inset-0 flex items-end justify-around gap-1 px-2">
              <div
                v-for="item in chartData"
                :key="item.label"
                class="flex-1 h-full flex items-end"
              >
                <div
                  class="w-full rounded-t-lg bg-blue-500 hover:bg-blue-400 transition-all duration-300 cursor-pointer relative"
                  :style="{ height: `calc(224px * ${item.ratio})` }"
                  @mouseenter="hoveredBar = item.label"
                  @mouseleave="hoveredBar = null"
                >
                  <div
                    v-if="hoveredBar === item.label"
                    class="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap z-10 pointer-events-none"
                  >
                    {{ item.displayValue }}
                    <div class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

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
import { ref, computed } from 'vue'

const props = defineProps({
  categories: { type: Array, required: true }
})

const hoveredBar = ref(null)

const yLabels = ['160k', '120k', '80k', '40k', '0']
const maxValue = 160000

const chartData = computed(() => {
  if (!props.categories || !props.categories.length) return []
  return props.categories.map(item => ({ 
    ...item, 
    label: item.name,
    displayValue: item.revenue.toLocaleString(),
    ratio: Math.min(1, (item.revenue / maxValue).toFixed(4))
  }))
})
</script>