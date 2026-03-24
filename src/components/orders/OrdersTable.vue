<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
    <table class="w-full min-w-[800px]">
      <thead class="bg-gray-50 border-b border-gray-100">
        <tr>
          <th v-for="col in columns" :key="col"
            class="px-5 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
            {{ col }}
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-50">
        <tr
          v-for="order in orders"
          :key="order.id"
          class="cursor-pointer hover:bg-blue-50/50 transition-all group"
          @click="$emit('select', order)"
        >
          <td class="px-5 py-4">
            <p class="text-sm font-bold text-blue-600 group-hover:text-blue-800">{{ order.id }}</p>
          </td>

          <td class="px-5 py-4">
            <div class="flex items-center gap-2">
              <div class="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center
                          text-gray-600 text-xs font-bold flex-shrink-0">
                {{ order.customer[0] }}
              </div>
              <div>
                <p class="text-sm font-semibold text-gray-900">{{ order.customer }}</p>
                <p class="text-xs text-gray-400">{{ order.email }}</p>
              </div>
            </div>
          </td>

          <td class="px-5 py-4">
            <div class="flex items-center gap-2">
              <div class="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                  class="text-blue-600" style="width:13px;height:13px">
                  <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/>
                  <path d="M12 22V12"/>
                  <polyline points="3.29 7 12 12 20.71 7"/>
                  <path d="m7.5 4.27 9 5.15"/>
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">{{ order.product }}</p>
                <p class="text-xs text-gray-400">{{ order.size }}</p>
              </div>
            </div>
          </td>

          <td class="px-5 py-4">
            <p class="text-sm text-gray-700 font-medium">{{ order.qty.toLocaleString() }}</p>
            <p class="text-xs text-gray-400">pcs</p>
          </td>

          <td class="px-5 py-4">
            <p class="text-sm font-bold text-gray-900">{{ order.amount }}</p>
          </td>

          <td class="px-5 py-4">
            <p class="text-sm text-gray-600">{{ order.date }}</p>
          </td>

          <td class="px-5 py-4">
            <span
              class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-bold"
              :class="statusBadge(order.status).bg"
            >
              <svg v-if="order.status === 'Completed'" xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px">
                <path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/>
              </svg>
              <svg v-else-if="order.status === 'In Production'" xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px">
                <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/>
                <path d="M12 22V12"/><polyline points="3.29 7 12 12 20.71 7"/><path d="m7.5 4.27 9 5.15"/>
              </svg>
              <svg v-else-if="order.status === 'Scheduled'" xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px">
                <path d="M8 2v4"/><path d="M16 2v4"/>
                <rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              {{ order.status }}
            </span>
          </td>

          <td class="px-5 py-4">
            <span
              class="inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-bold capitalize"
              :class="paymentBadge(order.payment)"
            >
              {{ order.payment }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  orders: { type: Array, required: true },
})

defineEmits(['select'])

const columns = ['Order ID', 'Customer', 'Product', 'Qty', 'Amount', 'Date', 'Status', 'Payment']

function statusBadge(status) {
  return {
    Completed:       { bg: 'bg-green-100 text-green-700'   },
    'In Production': { bg: 'bg-blue-100 text-blue-700'     },
    Scheduled:       { bg: 'bg-purple-100 text-purple-700' },
    Pending:         { bg: 'bg-yellow-100 text-yellow-700' },
    'To Ship':       { bg: 'bg-cyan-100 text-cyan-700'     },
    Cancelled:       { bg: 'bg-gray-100 text-gray-500'     },
  }[status] ?? { bg: 'bg-gray-100 text-gray-500' }
}

function paymentBadge(payment) {
  return {
    paid:    'bg-green-100 text-green-700',
    partial: 'bg-orange-100 text-orange-700',
    unpaid:  'bg-red-100 text-red-700',
  }[payment] ?? 'bg-gray-100 text-gray-500'
}
</script>