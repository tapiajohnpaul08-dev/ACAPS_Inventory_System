<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100">
    <div class="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
      <div>
        <h2 class="text-sm font-bold text-gray-900 uppercase tracking-wide">Recent Orders</h2>
        <p class="text-xs text-gray-400 mt-0.5">Click any row for full details</p>
      </div>
      <router-link 
        to="/dashboard/orders"
        class="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs font-medium transition-colors"
      >
        View all
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
        </svg>
      </router-link>
    </div>

    <div class="p-5 space-y-2">
      <button
        v-for="order in orders"
        :key="order.id"
        class="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-blue-50 rounded-xl
               border border-transparent hover:border-blue-200 transition-all cursor-pointer group text-left"
        @click="openModal(order)"
      >
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <p class="text-sm font-bold text-gray-900">{{ order.id }}</p>
            <span
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
              :class="statusClass(order.status)"
            >
              <component :is="statusIcon(order.status)" class="w-3.5 h-3.5" />
              {{ order.status }}
            </span>
          </div>
          <p class="text-xs text-gray-500 truncate">{{ order.product }} · {{ order.customer }}</p>
        </div>
        <div class="flex items-center gap-2 ml-2">
          <p class="text-sm font-bold text-gray-900">{{ order.amount }}</p>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="text-gray-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all">
            <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
          </svg>
        </div>
      </button>
    </div>
  </div>

  <!-- Modal - only render when an order is selected -->
  <OrderDetailModal
    v-if="selectedOrder"
    :show="true"
    :order="selectedOrder"
    @close="closeModal"
  />
</template>

<script setup>
import { h, ref } from 'vue'
import OrderDetailModal from '../../modals/OrderDetailModal.vue'

defineProps({
  orders: { type: Array, required: true },
})

const selectedOrder = ref(null)

function openModal(order) {
  selectedOrder.value = order
}

function closeModal() {
  selectedOrder.value = null
}

const CheckIcon = () =>
  h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
    h('path', { d: 'M21.801 10A10 10 0 1 1 17 3.335' }),
    h('path', { d: 'm9 11 3 3L22 4' }),
  ])

const PackageIcon = () =>
  h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
    h('path', { d: 'M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z' }),
    h('path', { d: 'M12 22V12' }),
    h('polyline', { points: '3.29 7 12 12 20.71 7' }),
    h('path', { d: 'm7.5 4.27 9 5.15' }),
  ])

const ClockIcon = () =>
  h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
    h('circle', { cx: 12, cy: 12, r: 10 }),
    h('polyline', { points: '12 6 12 12 16 14' }),
  ])

function statusClass(status) {
  return {
    Completed:       'bg-green-100 text-green-700',
    'In Production': 'bg-blue-100 text-blue-700',
    Scheduled:       'bg-purple-100 text-purple-700',
    Pending:         'bg-yellow-100 text-yellow-700',
  }[status] ?? 'bg-gray-100 text-gray-600'
}

function statusIcon(status) {
  return {
    Completed:       CheckIcon,
    'In Production': PackageIcon,
    Scheduled:       ClockIcon,
    Pending:         ClockIcon,
  }[status] ?? ClockIcon
}
</script>