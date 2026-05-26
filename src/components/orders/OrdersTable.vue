<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <div class="overflow-x-auto">
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
            v-for="order in paginatedOrders"
            :key="order.id"
            class="cursor-pointer hover:bg-blue-50/50 transition-all group"
            @click="$emit('select', order)"
          >
            <td class="px-5 py-4">
              <p class="text-sm font-bold text-blue-600 group-hover:text-blue-800">{{ order.orderId || order.id }}</p>
            </td>
            <td class="px-5 py-4">
              <div class="flex items-center gap-2">
                <div class="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center
                            text-gray-600 text-xs font-bold flex-shrink-0">
                  {{ (order.customer || '?')[0] }}
                </div>
                <div>
                  <p class="text-sm font-semibold text-gray-900">{{ order.customer || 'N/A' }}</p>
                  <p class="text-xs text-gray-400">{{ order.email || 'N/A' }}</p>
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
                  <p class="text-sm font-medium text-gray-900">{{ order.product || 'N/A' }}</p>
                  <p class="text-xs text-gray-400">{{ order.size || 'N/A' }}</p>
                </div>
              </div>
            </td>
            <td class="px-5 py-4">
              <p class="text-sm text-gray-700 font-medium">{{ (order.qty || 0).toLocaleString() }}</p>
              <p class="text-xs text-gray-400">pcs</p>
            </td>
            <td class="px-5 py-4">
              <p class="text-sm font-bold text-gray-900">{{ order.amount || '₱0' }}</p>
            </td>
            <td class="px-5 py-4">
              <p class="text-sm text-gray-600">{{ order.date || 'N/A' }}</p>
            </td>
            <td class="px-5 py-4">
              <span
                class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-bold"
                :class="statusBadge(order.status).bg"
              >
                <component :is="getStatusIcon(order.status)" v-if="getStatusIcon(order.status)" style="width:14px;height:14px" />
                {{ order.status || 'Pending' }}
              </span>
            </td>
            <td class="px-5 py-4">
              <span
                class="inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-bold capitalize"
                :class="paymentBadge(order.payment)"
              >
                {{ order.payment || 'unpaid' }}
              </span>
            </td>
            <td class="px-5 py-4">
              <div class="flex items-center gap-2">
                <button
                  class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600
                         hover:bg-blue-100 hover:text-blue-800 rounded-lg transition-colors"
                  @click.stop="$emit('edit', order)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    style="width:13px;height:13px">
                    <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>
                  </svg>
                  Edit
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="orders.length === 0">
            <td :colspan="columns.length" class="px-5 py-12 text-center text-gray-500">
              No orders found
            </td>
          </tr>
        </tbody>
       </table>
    </div>
    
    <!-- Pagination -->
    <div v-if="orders.length > 0" class="px-5 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between flex-wrap gap-4">
      <div class="text-sm text-gray-500">
        Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ orders.length }} orders
      </div>
      <div class="flex gap-2">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="px-3 py-1.5 text-sm font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          :class="currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
        >
          Previous
        </button>
        <div class="flex gap-1">
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="goToPage(page)"
            class="px-3 py-1.5 text-sm font-medium rounded-lg transition-all"
            :class="currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
          >
            {{ page }}
          </button>
        </div>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-3 py-1.5 text-sm font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          :class="currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { h } from 'vue'

const props = defineProps({
  orders: { type: Array, required: true },
  isLoading: { type: Boolean, default: false }
})

const emit = defineEmits(['select', 'edit'])

const currentPage = ref(1)
const itemsPerPage = 10

const columns = ['Order ID', 'Customer', 'Product', 'Qty', 'Amount', 'Date', 'Status', 'Payment', 'Actions']

// Pagination computed properties
const totalPages = computed(() => Math.ceil(props.orders.length / itemsPerPage))

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, props.orders.length))

const paginatedOrders = computed(() => {
  return props.orders.slice(startIndex.value, endIndex.value)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

function goToPage(page) {
  currentPage.value = page
}

// Reset to first page when orders change (e.g., after filter/search)
watch(() => props.orders.length, () => {
  currentPage.value = 1
})

// Also reset when orders array reference changes
watch(() => props.orders, () => {
  currentPage.value = 1
}, { deep: true })

function getStatusIcon(status) {
  const icons = {
    'Completed': () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' }, [
      h('path', { d: 'M21.801 10A10 10 0 1 1 17 3.335' }),
      h('path', { d: 'm9 11 3 3L22 4' })
    ]),
    'In Production': () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' }, [
      h('path', { d: 'M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z' }),
      h('path', { d: 'M12 22V12' }),
      h('polyline', { points: '3.29 7 12 12 20.71 7' }),
      h('path', { d: 'm7.5 4.27 9 5.15' })
    ]),
    'Scheduled': () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' }, [
      h('path', { d: 'M8 2v4' }),
      h('path', { d: 'M16 2v4' }),
      h('rect', { width: '18', height: '18', x: '3', y: '4', rx: '2' }),
      h('path', { d: 'M3 10h18' })
    ]),
    'Out for Delivery': () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' }, [
      h('path', { d: 'M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2' }),
      h('path', { d: 'M15 18H9' }),
      h('path', { d: 'M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14' }),
      h('circle', { cx: '17', cy: '18', r: '2' }),
      h('circle', { cx: '7', cy: '18', r: '2' })
    ]),
    'Pending': () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' }, [
      h('circle', { cx: '12', cy: '12', r: '10' }),
      h('polyline', { points: '12 6 12 12 16 14' })
    ]),
    'Cancelled': () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' }, [
      h('circle', { cx: '12', cy: '12', r: '10' }),
      h('path', { d: 'm15 9-6 6' }),
      h('path', { d: 'm9 9 6 6' })
    ])
  }
  return icons[status] || null
}

function statusBadge(status) {
  const classes = {
    Completed:       { bg: 'bg-green-100 text-green-700' },
    'In Production': { bg: 'bg-blue-100 text-blue-700' },
    Scheduled:       { bg: 'bg-purple-100 text-purple-700' },
    Pending:         { bg: 'bg-yellow-100 text-yellow-700' },
    'Out for Delivery': { bg: 'bg-cyan-100 text-cyan-700' },
    Cancelled:       { bg: 'bg-gray-100 text-gray-500' },
  }
  return classes[status] ?? { bg: 'bg-gray-100 text-gray-500' }
}

function paymentBadge(payment) {
  const classes = {
    paid:    'bg-green-100 text-green-700',
    partial: 'bg-orange-100 text-orange-700',
    unpaid:  'bg-red-100 text-red-700',
  }
  return classes[payment] ?? 'bg-gray-100 text-gray-500'
}
</script>

<style scoped>
/* Add any additional styles if needed */
</style>