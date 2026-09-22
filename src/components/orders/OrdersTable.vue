<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full min-w-[800px]">
        <thead class="bg-gray-50 border-b border-gray-100">
          <tr>
            <th
              v-for="col in columns"
              :key="col.key"
              class="px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider select-none"
              :class="[
                col.align === 'right' ? 'text-right' : 'text-left',
                col.sortable ? 'cursor-pointer hover:text-gray-600' : '',
              ]"
              @click="col.sortable && toggleSort(col.key)"
            >
              <span class="inline-flex items-center gap-1" :class="col.align === 'right' ? 'flex-row-reverse' : ''">
                {{ col.label }}
                <span v-if="col.sortable" class="inline-flex flex-col leading-none text-[8px]">
                  <span :class="sortKey === col.key && sortDir === 'asc' ? 'text-blue-600' : 'text-gray-300'">▲</span>
                  <span :class="sortKey === col.key && sortDir === 'desc' ? 'text-blue-600' : 'text-gray-300'">▼</span>
                </span>
              </span>
            </th>
          </tr>
        </thead>

        <!-- Loading skeleton: shown while refreshing an already-populated table -->
        <tbody v-if="isLoading && orders.length > 0" class="divide-y divide-gray-50">
          <tr v-for="n in skeletonRows" :key="`skeleton-${n}`" class="animate-pulse">
            <td v-for="col in columns" :key="col.key" class="px-5 py-4">
              <div class="h-3.5 bg-gray-100 rounded w-3/4"></div>
            </td>
          </tr>
        </tbody>

        <tbody v-else class="divide-y divide-gray-50">
<tr
  v-for="order in paginatedOrders"
  :key="order.id"
  :data-order-id="order.id"
  class="cursor-pointer hover:bg-blue-50/50 transition-all group"
  :class="{
    'bg-amber-50/60 ring-1 ring-inset ring-amber-200': pinnedOrderId === order.id,
    'highlight-pulse': highlightedOrderId === order.id,
  }"
  @click="$emit('select', order)"
>
            <td class="px-5 py-4">
              <div class="flex items-center gap-2 flex-wrap">
                <p class="text-sm font-bold text-blue-600 group-hover:text-blue-800">{{ order.orderId || order.id }}</p>
                <span
                  v-if="pinnedOrderId === order.id"
                  class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-amber-100 text-amber-800"
                >
                  📌 In Production
                </span>
              </div>
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
                  <p class="text-left text-xs text-gray-400">{{ order.size || 'N/A' }}</p>
                </div>
              </div>
            </td>
            <td class="px-5 py-4 text-right">
              <p class="text-sm text-gray-700 font-medium">{{ (order.qty || 0).toLocaleString() }}</p>
              <p class="text-xs text-gray-400">pcs</p>
            </td>
            <td class="px-5 py-4 text-right">
              <p class="text-sm font-bold text-gray-900">{{ order.amount || '₱0' }}</p>
            </td>
            <td class="px-5 py-4">
              <p class="text-sm text-gray-600">{{ order.expectedDelivery || 'N/A' }}</p>
            </td>
            <td class="px-5 py-4">
              <span
                class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-bold"
                :class="getStatusBadgeClass(order.status)"
              >
                <component :is="getStatusIcon(order.status)" v-if="getStatusIcon(order.status)" style="width:14px;height:14px" />
                {{ order.status || 'Pending' }}
              </span>
            </td>
            <td class="px-5 py-4">
              <span
                class="inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-bold capitalize"
                :class="getPaymentBadgeClass(order.payment)"
              >
                {{ order.payment || 'Unpaid' }}
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
                  
                </button>
                <button
                  class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600
                         hover:bg-red-100 hover:text-red-800 rounded-lg transition-colors"
                  @click.stop="$emit('delete', order)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    style="width:13px;height:13px">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
              
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
      <div class="flex items-center gap-3">
        <div class="text-sm text-gray-500">
          Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ orders.length }} orders
        </div>
        
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
import { getStatusBadgeClass, getPaymentBadgeClass, getStatusIcon } from '@/composables/useOrderStatus'

const props = defineProps({
  orders: { type: Array, required: true },
  isLoading: { type: Boolean, default: false },
  pinnedOrderId: { type: String, default: null },
  // ✅ Optional — ID of the order to flash (from ?order= navigation)
  highlightedOrderId: { type: String, default: null },
})

defineEmits(['select', 'edit', 'delete'])

// ─── Columns (declarative -> also drives sorting + alignment) ─────────────
const columns = [
  { key: 'orderId', label: 'Order ID', },
  { key: 'customer', label: 'Customer',},
  { key: 'product', label: 'Product',  },
  { key: 'qty', label: 'Qty',  align: 'right' },
  { key: 'rawAmount', label: 'Amount',  align: 'right' },
  { key: 'orderedAt', label: 'Delivery Date',  },
  { key: 'status', label: 'Status',  },
  { key: 'payment', label: 'Payment',},
  { key: 'actions', label: 'Actions', },
]

// ─── Sorting ────────────────────────────────────────────────────────────
const sortKey = ref('orderedAt')
const sortDir = ref('desc') // 'asc' | 'desc'

function toggleSort(key) {
  if (sortKey.value === key) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDir.value = 'asc'
  }
}

const sortedOrders = computed(() => {
  // Split out the pinned order (if any) BEFORE sorting.
  // The pinned order is always forced to the top, regardless of sort column
  // or direction. Everything else sorts normally.
  const pinned = props.pinnedOrderId
    ? props.orders.find(o => o.id === props.pinnedOrderId)
    : null

  const rest = pinned
    ? props.orders.filter(o => o.id !== pinned.id)
    : [...props.orders]

  const key = sortKey.value
  const dir = sortDir.value === 'asc' ? 1 : -1

  rest.sort((a, b) => {
    let av = a[key]
    let bv = b[key]

    // Dates need to compare as timestamps, not lexically
    if (key === 'orderedAt') {
      av = av ? new Date(av).getTime() : 0
      bv = bv ? new Date(bv).getTime() : 0
    }
    if (typeof av === 'string' && typeof bv === 'string') {
      return av.localeCompare(bv) * dir
    }
    if ((av ?? 0) < (bv ?? 0)) return -1 * dir
    if ((av ?? 0) > (bv ?? 0)) return 1 * dir
    return 0
  })

  return pinned ? [pinned, ...rest] : rest
})

// ─── Pagination ─────────────────────────────────────────────────────────
const currentPage = ref(1)
const itemsPerPage = ref(10)
const pageSizeOptions = [10, 25, 50, 100]
const skeletonRows = computed(() => Math.min(itemsPerPage.value, 6))

const totalPages = computed(() => Math.max(1, Math.ceil(sortedOrders.value.length / itemsPerPage.value)))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, sortedOrders.value.length))
const paginatedOrders = computed(() => sortedOrders.value.slice(startIndex.value, endIndex.value))

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

function prevPage() { if (currentPage.value > 1) currentPage.value-- }
function nextPage() { if (currentPage.value < totalPages.value) currentPage.value++ }
function goToPage(page) { currentPage.value = page }

// Reset to first page whenever the underlying list, sort, or page size changes
watch(() => [props.orders.length, sortKey.value, sortDir.value, itemsPerPage.value], () => {
  currentPage.value = 1
})
// Clamp current page if it's now out of range (e.g. after deleting the last item on a page)
watch(totalPages, (max) => {
  if (currentPage.value > max) currentPage.value = max
})
</script>

<style scoped>
@keyframes orderPulse {
  0%   { background-color: #fef3c7; }
  50%  { background-color: #fde68a; }
  100% { background-color: #fef3c7; }
}

.highlight-pulse {
  animation: orderPulse 1s ease-in-out 3;
}
</style>