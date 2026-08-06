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
import { getStatusBadgeClass } from '@/composables/useOrderStatus'

const props = defineProps({
  search: { type: String, required: true },
  statusFilter: { type: String, required: true },
  counts: { type: Object, required: true },
})

const emit = defineEmits(['update:search', 'update:statusFilter'])

// "out-for-delivery" also covers pickup orders currently displayed as
// "Ready to Pick-up" - counts.outForDelivery (from useOrders' statusCounts)
// already accounts for both, so this label reflects that.
const statusOptions = [
  { value: 'all', label: 'All Orders' },
  { value: 'pending', label: 'Pending' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'in-production', label: 'In Production' },
  { value: 'out-for-delivery', label: 'Out for Delivery / Pick-up' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

// Maps a filter value to the display-status key used by the shared badge
// classes, so button colors always match the badges shown in the table.
const FILTER_TO_DISPLAY_STATUS = {
  pending: 'Pending',
  scheduled: 'Scheduled',
  'in-production': 'In Production',
  'out-for-delivery': 'Out for Delivery',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

function getStatusCount(status) {
  const countMap = {
    pending: props.counts.pending || 0,
    scheduled: props.counts.scheduled || 0,
    'in-production': props.counts.inProduction || 0,
    'out-for-delivery': props.counts.outForDelivery || 0,
    completed: props.counts.completed || 0,
    cancelled: props.counts.cancelled || 0,
  }
  return countMap[status] || 0
}

function getStatusButtonClass(status) {
  const displayStatus = FILTER_TO_DISPLAY_STATUS[status]
  if (!displayStatus) return 'bg-gray-100 text-gray-600'
  // Reuse the exact same badge classes as the table so filter buttons and
  // status badges are always visually consistent, then add a hover state.
  return `${getStatusBadgeClass(displayStatus)} hover:opacity-80`
}

function setStatusFilter(value) {
  emit('update:statusFilter', value)
}
</script>