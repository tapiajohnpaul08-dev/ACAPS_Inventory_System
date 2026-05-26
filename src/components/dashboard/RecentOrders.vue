<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <!-- Header -->
    <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="text-blue-600" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 3h18v18H3z"/>
            <path d="M3 9h18"/>
            <path d="M9 21V9"/>
          </svg>
        </div>
        <h3 class="text-sm font-bold text-gray-900">Recent Orders</h3>
      </div>
      <button
        @click="$emit('view-all')"
        class="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
      >
        View All
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="m9 18 6-6-6-6"/>
        </svg>
      </button>
    </div>

    <!-- Orders List -->
    <div class="divide-y divide-gray-50">
      <div
        v-for="order in orders.slice(0, 5)"
        :key="order.id"
        class="px-5 py-4 hover:bg-gray-50 transition-all cursor-pointer group"
        @click="$emit('order-click', order)"
      >
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-sm font-bold text-blue-600 group-hover:text-blue-800">{{ order.orderId || order.id }}</span>
              <span
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
                :class="statusBadge(order.status)"
              >
                <span class="w-1.5 h-1.5 rounded-full" :class="statusDot(order.status)"></span>
                {{ order.status }}
              </span>
              <span
                class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold capitalize"
                :class="paymentBadge(order.payment)"
              >
                {{ order.payment }}
              </span>
            </div>
            <div class="flex items-center gap-3 text-xs text-gray-500">
              <span class="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                {{ order.customer }}
              </span>
              <span class="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/>
                  <path d="M12 22V12"/>
                  <polyline points="3.29 7 12 12 20.71 7"/>
                </svg>
                {{ order.product }}
              </span>
              <span class="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                {{ order.date }}
              </span>
            </div>
          </div>
          <div class="text-right">
            <p class="text-sm font-bold text-gray-900">{{ order.amount }}</p>
            <p class="text-xs text-gray-400">{{ order.qty.toLocaleString() }} pcs</p>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="orders.length === 0" class="px-5 py-8 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="mx-auto text-gray-300 mb-3">
          <path d="M3 3h18v18H3z"/>
          <path d="M3 9h18"/>
          <path d="M9 21V9"/>
        </svg>
        <p class="text-gray-400 text-sm">No orders yet</p>
      </div>
    </div>

    <!-- Footer with Refresh -->
    <div class="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
      <p class="text-xs text-gray-500">{{ orders.length }} total orders</p>
      <button
        @click="$emit('refresh')"
        class="text-xs text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
          <path d="M21 3v5h-5"/>
          <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
          <path d="M8 16H3v5"/>
        </svg>
        Refresh
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  orders: { type: Array, required: true }
})

defineEmits(['edit', 'saved', 'refresh', 'view-all', 'order-click'])

function statusBadge(status) {
  const classes = {
    Completed: 'bg-green-100 text-green-700',
    'In Production': 'bg-blue-100 text-blue-700',
    Scheduled: 'bg-purple-100 text-purple-700',
    Pending: 'bg-yellow-100 text-yellow-700',
    'Out for Delivery': 'bg-cyan-100 text-cyan-700',
    Cancelled: 'bg-red-100 text-red-600'
  }
  return classes[status] || 'bg-gray-100 text-gray-500'
}

function statusDot(status) {
  const classes = {
    Completed: 'bg-green-500',
    'In Production': 'bg-blue-500',
    Scheduled: 'bg-purple-500',
    Pending: 'bg-yellow-500',
    'Out for Delivery': 'bg-cyan-500',
    Cancelled: 'bg-red-500'
  }
  return classes[status] || 'bg-gray-400'
}

function paymentBadge(payment) {
  const classes = {
    paid: 'bg-green-100 text-green-700',
    partial: 'bg-orange-100 text-orange-700',
    unpaid: 'bg-red-100 text-red-600'
  }
  return classes[payment] || 'bg-gray-100 text-gray-500'
}
</script>