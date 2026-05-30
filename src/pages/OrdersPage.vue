<template>
  <div class="p-8">
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-black text-gray-900">Orders</h1>
        <p class="text-sm text-gray-500 mt-1">Manage and track all customer orders</p>
      </div>
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

    <div v-if="isLoading && allOrders.length === 0" class="flex flex-col items-center justify-center py-20 gap-3">
      <div class="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p class="text-gray-400 text-sm">Loading orders...</p>
    </div>

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
  @select="handleSelect"
  @edit="handleEdit"
  @delete="handleDelete"
/>
    </template>

    <OrderDetailModal
      v-if="selectedOrder"
      :show="true"
      :order="selectedOrder"
      @close="selectedOrder = null"
      @statusUpdate="handleStatusUpdate"
      @paymentUpdate="handlePaymentUpdate"
      @edit="handleEdit"
    />

    <EditOrderModal
      v-if="editOrder"
      :show="true"
      :order="editOrder"
      @close="closeEditModal"
      @saved="handleOrderSaved"
    />

    <!-- Confirm Modal for Delete -->
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

    <!-- Toast Notification -->
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
import { ref, computed, onMounted } from 'vue'
import OrdersStatCards from '@/components/orders/OrdersStatCards.vue'
import OrdersFilters from '@/components/orders/OrdersFilters.vue'
import OrdersTable from '@/components/orders/OrdersTable.vue'
import OrderDetailModal from '@/modals/OrderDetailModal.vue'
import EditOrderModal from '@/modals/EditOrderModal.vue'
import ConfirmModal from '@/modals/ConfirmModal.vue'
import { adminOrderApi } from '@/api/api'

const search = ref('')
const statusFilter = ref('all')
const allOrders = ref([])
const selectedOrder = ref(null)
const editOrder = ref(null)
const isLoading = ref(false)
const toast = ref({ show: false, type: 'success', message: '' })
const confirmModal = ref({ show: false, type: 'danger', title: '', message: '', itemToDelete: null })

// ─── Transform backend → frontend shape ───────────────────────────────────
function transformOrder(order) {
  console.log('transformed:', order);
  
  return {
    // Identifiers
    id: order.orderId || order._id,
    orderId: order.orderId,
    _mongoId: order._id,

    // Customer
    customer: order.customerName || order.customer?.name || 'N/A',
    email: order.customerEmail || order.customer?.email || 'N/A',
    phone: order.customerPhone || order.customer?.phone || '',
    address: order.address || order.customer?.address || '',

    // Product
    product: order.productName || (order.items?.[0]?.name) || 'Custom Order',
    size: order.size || order.items?.[0]?.size || 'N/A',
    qty: order.quantity || order.items?.[0]?.quantity || 0,
    amount: order.amount ? `₱${Number(order.amount).toLocaleString()}` : '₱0',
    rawAmount: order.amount || 0,

    // Status
    status: order.status || 'Pending',
    payment: (order.paymentStatus || 'Unpaid').toLowerCase(),

    // Delivery
    deliveryMethod: order.receivingMode || order.deliveryMethod || order.fulfillment?.method || 'Pick-up',
    deliveryAddress: order.fulfillment?.deliveryAddress || order.address || '',
    supplyType: order.isProvided ? 'Own Cups' : 'Company Cups',
    expectedDelivery: order.expectedDelivery ? new Date(order.expectedDelivery).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A',
    receivingMode: order.receivingMode ,
    // Dates
    date: order.orderedAt ? new Date(order.orderedAt).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A',
    orderedAt: order.orderedAt,
    updatedAt: order.updatedAt,

    // Extra
    notes: order.notes || '',
    designDetails: order.designDetails || [],
    items: order.items || [],
    statusHistory: order.statusHistory || [],
    partialPayments: order.partialPayments || [],
    type: order.type || '',
    isProvided: order.isProvided || false,
  }
}



// ─── Load orders ──────────────────────────────────────────────────────────
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

// ─── Counts & filtering ───────────────────────────────────────────────────
const statusCounts = computed(() => ({
  all: allOrders.value.length,
  pending: allOrders.value.filter(o => o.status === 'Pending').length,
  scheduled: allOrders.value.filter(o => o.status === 'Scheduled').length,
  inProduction: allOrders.value.filter(o => o.status === 'In Production').length,
  outForDelivery: allOrders.value.filter(o => o.status === 'Out for Delivery').length,
  completed: allOrders.value.filter(o => o.status === 'Completed').length,
  cancelled: allOrders.value.filter(o => o.status === 'Cancelled').length,
}))

const statusMap = {
  'pending': 'Pending',
  'scheduled': 'Scheduled',
  'in-production': 'In Production',
  'out-for-delivery': 'Out for Delivery',
  'completed': 'Completed',
  'cancelled': 'Cancelled',
}

const filteredOrders = computed(() => {
  let list = allOrders.value
  if (statusFilter.value !== 'all') {
    list = list.filter(o => o.status === statusMap[statusFilter.value])
  }
  const q = search.value.toLowerCase().trim()
  if (q) {
    list = list.filter(o =>
      o.id?.toLowerCase().includes(q) ||
      o.customer?.toLowerCase().includes(q) ||
      o.email?.toLowerCase().includes(q) ||
      o.product?.toLowerCase().includes(q) ||
      o.phone?.toLowerCase().includes(q)
    )
  }
  return list
})

// ─── Handlers ─────────────────────────────────────────────────────────────
function handleSelect(order) { selectedOrder.value = order }
function handleEdit(order) {
  selectedOrder.value = null
  editOrder.value = order
}
function closeEditModal() { editOrder.value = null }

// Called from OrderDetailModal when admin clicks a status step
async function handleStatusUpdate({ orderId, status, notes, productionSchedule, driverDetails }) {
  try {
    const validStatuses = ['Pending', 'Scheduled', 'In Production', 'Out for Delivery', 'Completed', 'Cancelled'];
    const normalizedStatus = validStatuses.find(s => s.toLowerCase() === status.toLowerCase()) || status;
    
    const payload = { 
      status: normalizedStatus, 
      notes: notes || ''
    }
    
    if (productionSchedule) {
      payload.productionSchedule = productionSchedule
    }
    
    if (driverDetails) {
      payload.driverDetails = driverDetails
    }
    
    const response = await adminOrderApi.updateOrderStatus(orderId, payload)
    
    if (response.success) {
      patchLocalOrder(orderId, transformOrder(response.data))
      if (selectedOrder.value?.id === orderId) {
        selectedOrder.value = transformOrder(response.data)
      }
      showToast('success', `Status updated to "${normalizedStatus}"`)
    } else {
      showToast('error', response.message || 'Failed to update status')
    }
  } catch (e) {
    console.error('Status update error:', e)
    showToast('error', 'Failed to update status')
  }
}

// Called from OrderDetailModal when admin clicks a payment button
async function handlePaymentUpdate({ orderId, paymentStatus, amountPaid }) {
  try {
    // Ensure payment status matches backend enum
    const validPayments = ['Paid', 'Partial', 'Unpaid'];
    const normalizedPayment = validPayments.find(p => p.toLowerCase() === paymentStatus.toLowerCase()) || paymentStatus;
    
    console.log('Updating payment:', { orderId, paymentStatus: normalizedPayment, amountPaid });
    
    const response = await adminOrderApi.updatePaymentStatus(orderId, { 
      paymentStatus: normalizedPayment, 
      amountPaid 
    })
    
    if (response.success) {
      patchLocalOrder(orderId, transformOrder(response.data))
      if (selectedOrder.value?.id === orderId) {
        selectedOrder.value = transformOrder(response.data)
      }
      showToast('success', `Payment marked as "${normalizedPayment}"`)
    } else {
      showToast('error', response.message || 'Failed to update payment')
    }
  } catch (e) {
    console.error('Payment update error:', e)
    showToast('error', 'Failed to update payment')
  }
}

// Called from EditOrderModal after a successful save
function handleOrderSaved(updatedOrder) {
  patchLocalOrder(updatedOrder.id, updatedOrder)
  showToast('success', `Order ${updatedOrder.id} saved successfully`)
}

function patchLocalOrder(orderId, updated) {
  const idx = allOrders.value.findIndex(o => o.id === orderId)
  if (idx !== -1) allOrders.value[idx] = updated
}

async function handleDelete(order) {
  confirmModal.value = {
    show: true,
    type: 'danger',
    title: 'Delete Order',
    message: `Are you sure you want to delete order "${order.orderId || order.id}"? This action cannot be undone.`,
    itemToDelete: order
  }
}

async function confirmDelete() {
  const order = confirmModal.value.itemToDelete
  confirmModal.value.show = false
  
  try {
    const response = await adminOrderApi.deleteOrder(order.id)
    if (response.success) {
      await loadOrders()
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

function showToast(type, message) {
  clearTimeout(toastTimer)
  toast.value = { show: true, type, message }
  toastTimer = setTimeout(() => { toast.value.show = false }, 3500)
}

let toastTimer = null

onMounted(loadOrders)
</script>

<style scoped>
@keyframes spin { to { transform: rotate(360deg); } }
.animate-spin { animation: spin 0.7s linear infinite; }

.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(12px) scale(0.95); }
</style>