<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
    <!-- Search Bar -->
    <div class="p-5 border-b border-gray-100">
      <div class="relative">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          style="width:18px;height:18px">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
        </svg>
        <input
          :value="search"
          type="text"
          placeholder="Search by order ID, customer name, email, or product..."
          class="w-full pl-10 pr-4 py-2.5 border border-gray-200 bg-gray-50 rounded-xl
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white
                 transition-all text-sm"
          @input="$emit('update:search', $event.target.value)"
        />
      </div>
    </div>

    <!-- Status Filter Buttons -->
    <div class="px-5 py-3 bg-gray-50/50">
      <div class="flex flex-wrap items-center gap-4">
        <span class="text-xs font-medium text-gray-500">Filter by status:</span>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="status in statusOptions"
            :key="status.value"
            @click="setStatusFilter(status.value)"
            class="px-3 py-1.5 text-xs font-medium rounded-lg transition-all"
            :class="statusFilter === status.value
              ? status.value === 'all'
                ? 'bg-blue-600 text-white'
                : getStatusButtonClass(status.value)
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
          >
            {{ status.label }}
            <span v-if="status.value !== 'all'" class="ml-1 px-1.5 py-0.5 rounded-full text-xs"
              :class="statusFilter === status.value ? 'bg-white/20' : 'bg-gray-200'">
              {{ getStatusCount(status.value) }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  search: { type: String, required: true },
  statusFilter: { type: String, required: true },
  counts: { type: Object, required: true },
})

const emit = defineEmits(['update:search', 'update:statusFilter'])

const statusOptions = [
  { value: 'all', label: 'All Orders' },
  { value: 'pending', label: 'Pending' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'in-production', label: 'In Production' },
  { value: 'out-for-delivery', label: 'Out for Delivery' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' }
]

function getStatusCount(status) {
  const countMap = {
    'pending': props.counts.pending,
    'scheduled': props.counts.scheduled,
    'in-production': props.counts.inProduction,
    'out-for-delivery': props.counts.outForDelivery,
    'completed': props.counts.completed,
    'cancelled': props.counts.cancelled
  }
  return countMap[status] || 0
}

function getStatusButtonClass(status) {
  const classMap = {
    'pending': 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
    'scheduled': 'bg-purple-100 text-purple-700 hover:bg-purple-200',
    'in-production': 'bg-blue-100 text-blue-700 hover:bg-blue-200',
    'out-for-delivery': 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200',
    'completed': 'bg-green-100 text-green-700 hover:bg-green-200',
    'cancelled': 'bg-gray-100 text-gray-700 hover:bg-gray-200'
  }
  return classMap[status] || 'bg-gray-100 text-gray-600'
}

function setStatusFilter(value) {
  emit('update:statusFilter', value)
}
</script>