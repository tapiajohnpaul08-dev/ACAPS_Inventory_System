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
                <svg v-else-if="order.status === 'Out for Delivery'" xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px">
                  <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
                  <path d="M15 18H9"/>
                  <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/>
                  <circle cx="17" cy="18" r="2"/>
                  <circle cx="7" cy="18" r="2"/>
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
            <td class="px-5 py-4">
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
            </td>
          </tr>

          <!-- Empty state -->
          <tr v-if="paginatedOrders.length === 0">
            <td :colspan="columns.length" class="px-5 py-10 text-center text-sm text-gray-400">
              No orders found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination Footer -->
    <div class="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50">
      <p class="text-xs text-gray-400">
        Showing
        <span class="font-semibold text-gray-600">{{ rangeStart }}–{{ rangeEnd }}</span>
        of
        <span class="font-semibold text-gray-600">{{ props.orders.length }}</span>
        orders
      </p>

      <div class="flex items-center gap-1">
        <!-- Prev -->
        <button class="pagination-btn" :disabled="currentPage === 1" @click="currentPage--">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            style="width:14px;height:14px">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>

        <!-- Page numbers -->
        <template v-for="page in pageRange" :key="page">
          <span v-if="page === '...'" class="px-1 text-xs text-gray-400 select-none">…</span>
          <button
            v-else
            class="pagination-btn"
            :class="{ 'pagination-btn--active': page === currentPage }"
            @click="currentPage = page"
          >
            {{ page }}
          </button>
        </template>

        <!-- Next -->
        <button class="pagination-btn" :disabled="currentPage === totalPages" @click="currentPage++">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            style="width:14px;height:14px">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  orders: { type: Array, required: true },
})

defineEmits(['select', 'edit'])

const ITEMS_PER_PAGE = 10
const currentPage = ref(1)

const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE
  return props.orders.slice(start, start + ITEMS_PER_PAGE)
})

const totalPages = computed(() => Math.max(1, Math.ceil(props.orders.length / ITEMS_PER_PAGE)))

const rangeStart = computed(() => Math.min((currentPage.value - 1) * ITEMS_PER_PAGE + 1, props.orders.length))
const rangeEnd = computed(() => Math.min(currentPage.value * ITEMS_PER_PAGE, props.orders.length))

const pageRange = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages = []
  const addDots = () => { if (pages[pages.length - 1] !== '...') pages.push('...') }

  pages.push(1)
  if (current > 3) addDots()
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) pages.push(p)
  if (current < total - 2) addDots()
  pages.push(total)

  return pages
})

// Reset to page 1 when orders list changes (e.g. after filtering)
watch(() => props.orders, () => { currentPage.value = 1 })

const columns = ['Order ID', 'Customer', 'Product', 'Qty', 'Amount', 'Date', 'Status', 'Payment', 'Actions']

function statusBadge(status) {
  return {
    Completed:          { bg: 'bg-green-100 text-green-700'   },
    'In Production':    { bg: 'bg-blue-100 text-blue-700'     },
    Scheduled:          { bg: 'bg-purple-100 text-purple-700' },
    Pending:            { bg: 'bg-yellow-100 text-yellow-700' },
    'Out for Delivery': { bg: 'bg-cyan-100 text-cyan-700'     },
    Cancelled:          { bg: 'bg-gray-100 text-gray-500'     },
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