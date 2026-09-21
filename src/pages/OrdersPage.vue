<template>
  <div class="p-8">
    <!-- ═══════════════════════════════════════════════════════════════
         HEADER — same on list & detail; content swaps based on mode
         ═══════════════════════════════════════════════════════════════ -->
    <div class="mb-8 flex items-center justify-between gap-4">
      <div class="flex items-center gap-3 min-w-0">
        <!-- Back button — only on detail view -->
        <button
          v-if="detailOrder"
          @click="goBackToList"
          class="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
          title="Back to Orders"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>

        <div class="min-w-0">
          <h1 class="text-2xl font-black text-gray-900 truncate">
            {{ detailOrder ? `Order ${detailOrder.orderId || detailOrder.id}` : 'Orders' }}
          </h1>
          <p class="text-sm text-gray-500 mt-1 truncate">
            <template v-if="detailOrder">
              {{ detailOrder.customer }} · {{ detailOrder.date }}
            </template>
            <template v-else>
              Manage and track all customer orders
            </template>
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2 flex-shrink-0">
        <!-- Print Receipt — detail view, near status flow -->
        <button
          v-if="detailOrder && ['Out for Delivery', 'Ready to Pick-up', 'Completed'].includes(detailOrder.status)"
          @click="handlePrintReceipt"
          class="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
            <rect x="6" y="14" width="12" height="8" rx="1"/>
          </svg>
          Print Receipt
        </button>

        <button
          @click="loadOrders"
          :disabled="isLoading"
          class="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-all shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :class="{ 'animate-spin': isLoading }">
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
            <path d="M21 3v5h-5"/>
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
            <path d="M8 16H3v5"/>
          </svg>
          Refresh
        </button>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════
         BODY — Loading → Detail view OR List view
         ═══════════════════════════════════════════════════════════════ -->

    <!-- Initial loading -->
    <div v-if="isLoading && allOrders.length === 0" class="flex flex-col items-center justify-center py-20 gap-3">
      <div class="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p class="text-gray-400 text-sm">Loading orders...</p>
    </div>

    <!-- Detail mode -->
    <OrderDetailView
      v-else-if="detailOrder"
      ref="detailViewRef"
      :order="detailOrder"
      :in-production-order-id="inProductionOrder?.id || null"
      @statusUpdate="handleStatusUpdate"
      @paymentUpdate="handlePaymentUpdate"
      @edit="handleEdit"
    />

    <!-- List mode -->
    <template v-else>
      <OrdersStatCards :orders="allOrders" />
      <OrdersFilters
        :search="search"
        :status-filter="statusFilter"
        :counts="statusCounts"
        @update:search="search = $event"
        @update:statusFilter="statusFilter = $event"
      />
      <OrdersTable
        :orders="filteredOrders"
        :is-loading="isLoading"
        :pinned-order-id="inProductionOrder?.id || null"
        :highlighted-order-id="highlightedOrderId"
        @select="handleSelect"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </template>

    <!-- ═══════════════════════════════════════════════════════════════
         MODALS — Edit + Delete still modal (small focused dialogs)
         ═══════════════════════════════════════════════════════════════ -->
    <EditOrderModal
      v-if="editOrder"
      :show="true"
      :order="editOrder"
      @close="closeEditModal"
      @saved="handleOrderSaved"
    />

    <ConfirmModal
      :show="confirmModal.show"
      :type="confirmModal.type"
      :title="confirmModal.title"
      :message="confirmModal.message"
      :confirm-text="'Delete'"
      :cancel-text="'Cancel'"
      @confirm="confirmDelete"
      @cancel="closeConfirmModal"
    />

    <!-- Toast -->
    <Transition name="toast">
      <div
        v-if="toast.show"
        class="fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-semibold max-w-sm"
        :class="toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'"
      >
        <svg v-if="toast.type === 'success'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M20 6L9 17l-5-5"/>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/>
        </svg>
        {{ toast.message }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import OrdersStatCards from '@/components/orders/OrdersStatCards.vue'
import OrdersFilters from '@/components/orders/OrdersFilters.vue'
import OrdersTable from '@/components/orders/OrdersTable.vue'
import OrderDetailView from '@/pages/OrderDetailView.vue'
import EditOrderModal from '@/modals/EditOrderModal.vue'
import ConfirmModal from '@/modals/ConfirmModal.vue'
import { adminOrderApi } from '@/api/api'
import { transformOrder as sharedTransformOrder } from '@/utils/orderHelpers'
import { getDisplayStatus } from '@/composables/useOrderStatus'

const route = useRoute()
const router = useRouter()

const search = ref('')
const statusFilter = ref('all')
const allOrders = ref([])
const editOrder = ref(null)
const isLoading = ref(false)
const toast = ref({ show: false, type: 'success', message: '' })
const confirmModal = ref({ show: false, type: 'danger', title: '', message: '', itemToDelete: null })
const highlightedOrderId = ref(null)
const detailViewRef = ref(null)

// Delegate to the shared transform so the receipt, detail view and
// table all see the exact same order shape.
function transformOrder(order) {
  return sharedTransformOrder(order, getDisplayStatus)
}

// ── Detail mode derived from URL ────────────────────────────────────
const detailOrderId = computed(() => {
  const q = route.query.order
  return q ? String(q) : null
})

const detailOrder = computed(() => {
  if (!detailOrderId.value) return null
  return allOrders.value.find(
    (o) => o.id === detailOrderId.value || o.orderId === detailOrderId.value,
  ) || null
})

// ── Navigation helpers ──────────────────────────────────────────────
function goBackToList() {
  // Preserve search / status filters, drop only the ?order=
  const { order, ...rest } = route.query
  router.push({ query: rest })
}

function handleSelect(order) {
  const id = order.orderId || order.id
  if (!id) return
  // Preserve search / status filters when opening a detail view
  router.push({ query: { ...route.query, order: id } })
}

// Highlight the row briefly when arriving from an external link
function flashRow(orderId) {
  highlightedOrderId.value = orderId
  setTimeout(() => { highlightedOrderId.value = null }, 3500)
}

// ── Data loading ────────────────────────────────────────────────────
async function loadOrders() {
  isLoading.value = true
  try {
    const response = await adminOrderApi.getAllOrders()
    if (response.success && response.data) {
      allOrders.value = response.data.map(transformOrder)
    } else {
      showToast('error', response.message || 'Failed to load orders')
    }
  } catch (error) {
    console.error('Error loading orders:', error)
    showToast('error', 'Failed to load orders')
  } finally {
    isLoading.value = false
  }
}

// ── Filters / counts ────────────────────────────────────────────────
const inProductionOrder = computed(() =>
  allOrders.value.find((o) => o.status === 'In Production') || null
)

const ordersWithPinnedProduction = computed(() => {
  const list = allOrders.value
  if (!inProductionOrder.value) return list
  return [
    inProductionOrder.value,
    ...list.filter((o) => o.id !== inProductionOrder.value.id),
  ]
})

const statusCounts = computed(() => ({
  all: allOrders.value.length,
  pending: allOrders.value.filter((o) => o.status === 'Pending').length,
  scheduled: allOrders.value.filter((o) => o.status === 'Scheduled').length,
  inProduction: allOrders.value.filter((o) => o.status === 'In Production').length,
  outForDelivery: allOrders.value.filter(
    (o) => o.status === 'Out for Delivery' || o.status === 'Ready to Pick-up',
  ).length,
  completed: allOrders.value.filter((o) => o.status === 'Completed').length,
  cancelled: allOrders.value.filter((o) => o.status === 'Cancelled').length,
}))

const statusMap = {
  pending: 'Pending',
  scheduled: 'Scheduled',
  'in-production': 'In Production',
  'out-for-delivery': 'Out for Delivery',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

const filteredOrders = computed(() => {
  let list = ordersWithPinnedProduction.value
  if (statusFilter.value !== 'all') {
    list = list.filter((o) => o.status === statusMap[statusFilter.value])
  }
  const q = search.value.toLowerCase().trim()
  if (q) {
    list = list.filter(
      (o) =>
        o.id?.toLowerCase().includes(q) ||
        o.customer?.toLowerCase().includes(q) ||
        o.email?.toLowerCase().includes(q) ||
        o.product?.toLowerCase().includes(q) ||
        o.phone?.toLowerCase().includes(q),
    )
  }
  return list
})

// ── Row actions ─────────────────────────────────────────────────────
function handleEdit(order) {
  editOrder.value = order
}
function closeEditModal() {
  editOrder.value = null
}

// ── Status update — same as before ──────────────────────────────────
async function handleStatusUpdate({ orderId, status, notes, productionSchedule, driverDetails, driverId, codCollected }) {
  try {
    const validStatuses = ['Pending', 'Confirmed', 'Scheduled', 'In Production', 'Out for Delivery', 'Completed', 'Cancelled']
    const normalizedStatus = validStatuses.find((s) => s.toLowerCase() === status.toLowerCase()) || status

    const payload = { status: normalizedStatus, notes: notes || '' }
    if (productionSchedule) payload.productionSchedule = productionSchedule
    if (driverId) payload.driverId = driverId
    if (codCollected !== undefined) payload.codCollected = codCollected
    if (driverDetails) {
      payload.driverDetails = {
        driverName: driverDetails.driverName,
        driverPhone: driverDetails.driverPhone,
        plateNumber: driverDetails.plateNumber,
        truckDescription: driverDetails.truckDescription,
      }
    }

    const response = await adminOrderApi.updateOrderStatus(orderId, payload)
    if (response.success) {
      patchLocalOrder(orderId, transformOrder(response.data))
      showToast('success', `Status updated to "${normalizedStatus}"`)
    } else {
      showToast('error', response.message || 'Failed to update status')
    }
  } catch (e) {
    console.error('Status update error:', e)
    showToast('error', 'Failed to update status')
  }
}

// ── Payment update — same as before ─────────────────────────────────
async function handlePaymentUpdate({ orderId, paymentStatus, amountPaid, partialPayments }) {
  try {
    const validPayments = ['Paid', 'Partial', 'Unpaid']
    const normalizedPayment = validPayments.find((p) => p.toLowerCase() === paymentStatus.toLowerCase()) || paymentStatus

    const payload = { paymentStatus: normalizedPayment, amountPaid }
    if (partialPayments !== undefined && Array.isArray(partialPayments)) {
      payload.partialPayments = partialPayments
    }

    const response = await adminOrderApi.updatePaymentStatus(orderId, payload)
    if (response.success) {
      patchLocalOrder(orderId, transformOrder(response.data))
      showToast('success', `Payment marked as "${normalizedPayment}"`)
    } else {
      showToast('error', response.message || 'Failed to update payment')
    }
  } catch (e) {
    console.error('Payment update error:', e)
    showToast('error', 'Failed to update payment')
  }
}

function handleOrderSaved(updatedOrder) {
  patchLocalOrder(updatedOrder.id, updatedOrder)
  showToast('success', `Order ${updatedOrder.id} saved successfully`)
}

function patchLocalOrder(orderId, updated) {
  const idx = allOrders.value.findIndex((o) => o.id === orderId)
  if (idx !== -1) allOrders.value[idx] = updated
}

// ── Delete flow ─────────────────────────────────────────────────────
function handleDelete(order) {
  confirmModal.value = {
    show: true,
    type: 'danger',
    title: 'Delete Order',
    message: `Are you sure you want to delete order "${order.orderId || order.id}"? This action cannot be undone.`,
    itemToDelete: order,
  }
}

async function confirmDelete() {
  const order = confirmModal.value.itemToDelete
  confirmModal.value.show = false
  try {
    const response = await adminOrderApi.deleteOrder(order.id)
    if (response.success) {
      await loadOrders()
      // If we were viewing the deleted order, kick back to the list
      if (detailOrderId.value === order.id) goBackToList()
      showToast('success', `Order ${order.orderId || order.id} has been deleted successfully.`)
    } else {
      showToast('error', response.message || 'Failed to delete order')
    }
  } catch (error) {
    console.error('Error deleting order:', error)
    showToast('error', 'Failed to delete order')
  }
}
function closeConfirmModal() {
  confirmModal.value.show = false
}

// ── Print receipt — delegates to the inner view ─────────────────────
function handlePrintReceipt() {
  detailViewRef.value?.openReceiptModal?.()
}

// ── Toast ───────────────────────────────────────────────────────────
function showToast(type, message) {
  clearTimeout(toastTimer)
  toast.value = { show: true, type, message }
  toastTimer = setTimeout(() => { toast.value.show = false }, 3500)
}
let toastTimer = null

// ── Lifecycle ───────────────────────────────────────────────────────
function applySearchQuery() {
  const q = route.query.search
  if (q) search.value = String(q)
}

onMounted(async () => {
  applySearchQuery()
  await loadOrders()
})

// When the user opens a detail view via URL, flash the row so they
// can find it later if they hit Back.
watch(
  () => route.query.order,
  (newId) => {
    if (newId) flashRow(String(newId))
  },
)
</script>

<style scoped>
@keyframes spin { to { transform: rotate(360deg); } }
.animate-spin { animation: spin 0.7s linear infinite; }

.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(12px) scale(0.95); }
</style>