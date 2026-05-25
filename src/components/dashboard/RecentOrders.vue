<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <div class="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
      <div>
        <h2 class="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Recent Orders
        </h2>
        <p class="text-xs text-gray-400 mt-0.5">{{ orders.length }} latest transactions</p>
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="$emit('refresh')"
          class="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
          title="Refresh"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
        <router-link 
          to="/dashboard/orders"
          class="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs font-medium transition-colors group"
        >
          View all
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2" class="group-hover:translate-x-1 transition-transform">
            <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
          </svg>
        </router-link>
      </div>
    </div>

    <div class="divide-y divide-gray-50">
      <div
        v-for="order in orders"
        :key="order.id"
        class="group hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent transition-all duration-300"
      >
        <div class="px-6 py-4 flex items-center justify-between cursor-pointer" @click="openModal(order)">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-3 flex-wrap">
              <p class="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                {{ order.orderId || order.id }}
              </p>
              <span
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium transition-all"
                :class="statusClass(order.status)"
              >
                <span class="w-1.5 h-1.5 rounded-full" :class="statusDotClass(order.status)"></span>
                {{ order.status }}
              </span>
              <span
                class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                :class="paymentBadgeClass(order.payment)"
              >
                {{ capitalize(order.payment) }}
              </span>
            </div>
            <div class="flex items-center gap-3 mt-1 text-xs text-gray-500">
              <span class="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {{ order.customer }}
              </span>
              <span class="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                {{ order.product }}
              </span>
            </div>
          </div>
          <div class="flex items-center gap-3 ml-4">
            <p class="text-base font-bold text-gray-900">{{ order.amount }}</p>
            <button
              @click.stop="handleEditClick(order)"
              class="p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 text-gray-400 hover:text-blue-600 hover:bg-blue-100"
              title="Edit Order"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>
              </svg>
            </button>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2"
              class="text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all">
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
          </div>
        </div>
      </div>
      
      <div v-if="orders.length === 0" class="text-center py-12">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p class="text-gray-400 text-sm">No recent orders</p>
      </div>
    </div>
  </div>

  <!-- Order Detail Modal -->
  <OrderDetailModal
    v-if="selectedOrder"
    :show="true"
    :order="selectedOrder"
    @close="closeModal"
    @statusUpdate="handleStatusUpdate"
    @paymentUpdate="handlePaymentUpdate"
    @edit="handleEditFromModal"
  />

  <!-- Edit Order Modal -->
  <EditOrderModal
    v-if="editOrderData"
    :show="true"
    :order="editOrderData"
    @close="closeEditModal"
    @saved="handleOrderSaved"
  />
</template>

<script setup>
import { capitalize, h, ref } from 'vue'
import OrderDetailModal from '../../modals/OrderDetailModal.vue'
import EditOrderModal from '../../modals/EditOrderModal.vue'

const props = defineProps({
  orders: { type: Array, required: true },
})

const emit = defineEmits(['edit', 'saved', 'refresh'])

const selectedOrder = ref(null)
const editOrderData = ref(null)

function openModal(order) {
  selectedOrder.value = { ...order }
}

function closeModal() {
  selectedOrder.value = null
}

function handleEditClick(order) {
  emit('edit', order)
}

function handleEditFromModal(order) {
  emit('edit', order)
  closeModal()
}

function handleStatusUpdate(data) {
  emit('statusUpdate', data)
  closeModal()
}

function handlePaymentUpdate(data) {
  emit('paymentUpdate', data)
  closeModal()
}

function handleOrderSaved(updatedOrder) {
  emit('saved', updatedOrder)
  closeEditModal()
}

function closeEditModal() {
  editOrderData.value = null
}

function statusClass(status) {
  const classes = {
    Completed: 'bg-green-100 text-green-700',
    'In Production': 'bg-blue-100 text-blue-700',
    Scheduled: 'bg-purple-100 text-purple-700',
    Pending: 'bg-yellow-100 text-yellow-700',
    'Out for Delivery': 'bg-cyan-100 text-cyan-700',
    Cancelled: 'bg-gray-100 text-gray-500',
  }
  return classes[status] ?? 'bg-gray-100 text-gray-600'
}

function statusDotClass(status) {
  const classes = {
    Completed: 'bg-green-500',
    'In Production': 'bg-blue-500',
    Scheduled: 'bg-purple-500',
    Pending: 'bg-yellow-500',
    'Out for Delivery': 'bg-cyan-500',
    Cancelled: 'bg-gray-500',
  }
  return classes[status] ?? 'bg-gray-400'
}

function paymentBadgeClass(payment) {
  const classes = {
    paid: 'bg-green-100 text-green-700',
    partial: 'bg-orange-100 text-orange-700',
    unpaid: 'bg-red-100 text-red-600',
  }
  return classes[payment] ?? 'bg-gray-100 text-gray-500'
}

// Status icons for quick reference
const CheckIcon = () =>
  h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: 12, height: 12, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }, [
    h('path', { d: 'M20 6L9 17l-5-5' }),
  ])
</script>