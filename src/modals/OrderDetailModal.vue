<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="closeModal"
      >
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeModal" />

        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">

          <!-- Header -->
          <div class="flex items-start justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
            <div>
              <div class="flex items-center gap-2.5">
                <h1 class="text-lg font-bold text-gray-900">Order ID:</h1>
                <h2 class="text-lg font-bold text-gray-900">{{ order?.orderId || order?.id || 'N/A' }}</h2>
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold" :class="statusBadge(localStatus)">
                  <component :is="statusIcon(localStatus)" class="w-3 h-3" />
                  {{ localStatus }}
                </span>
              </div>
              <p class="text-sm text-gray-500 mt-0.5">{{ order?.customer }} · {{ order?.date }}</p>
            </div>
            <div class="flex items-center gap-2 ml-4">
              <button
                @click="$emit('edit', order)"
                class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/></svg>
                Edit Order
              </button>
              <button @click="closeModal" class="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
          </div>

          <!-- Scrollable body -->
          <div class="flex-1 overflow-y-auto px-6 py-5">
            <div v-if="order" class="space-y-5">

              <!-- Dates row -->
              <div class="grid grid-cols-3 gap-3">
                <div class="bg-gray-50 rounded-xl p-3.5">
                  <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Type</p>
                  <p class="text-sm font-bold text-gray-900">{{ order.supplyType || 'N/A' }}</p>
                </div>
                <div class="bg-gray-50 rounded-xl p-3.5">
                  <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Ordered</p>
                  <p class="text-sm font-bold text-gray-900">{{ order.date }}</p>
                </div>
                
                <div class="bg-gray-50 rounded-xl p-3.5">
                  <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Expected Delivery</p>
                  <p class="text-sm font-bold text-gray-900">{{ order.expectedDelivery || 'N/A' }}</p>
                </div>
              </div>

              <!-- Customer Information -->
              <div class="border border-gray-200 rounded-xl overflow-hidden">
                <div class="bg-gray-50 px-4 py-2.5 border-b border-gray-100">
                  <p class="text-xs font-bold text-gray-400 uppercase tracking-wide">Customer</p>
                </div>
                <div class="p-4 space-y-3">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-black text-base flex-shrink-0">
                      {{ (order.customer?.[0] || '?').toUpperCase() }}
                    </div>
                    <div>
                      <p class="text-sm font-bold text-gray-900">{{ order.customer }}</p>
                      <p class="text-xs text-gray-400">{{ order.supplyType }}</p>
                    </div>
                  </div>
                  <div class="grid grid-cols-1 gap-1.5 text-sm">
                    <div v-if="order.email" class="flex items-center gap-2 text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" class="text-gray-400 flex-shrink-0" style="width:14px;height:14px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                      <span>{{ order.email }}</span>
                    </div>
                    <div v-if="order.phone" class="flex items-center gap-2 text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" class="text-gray-400 flex-shrink-0" style="width:14px;height:14px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                      <span>{{ order.phone }}</span>
                    </div>
                    <div class="flex items-center gap-2 text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" class="text-gray-400 flex-shrink-0" style="width:14px;height:14px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>
                      <span class="capitalize">{{ order.deliveryMethod || 'Pick-up' }}</span>
                      <span v-if="order.deliveryMethod === 'Pick-up'" class="text-gray-400">· Company Address</span>
                    </div>
                    <div v-if="order.address && order.deliveryMethod == 'Delivery'" class="flex items-center gap-2 text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" class="text-gray-400 flex-shrink-0" style="width:14px;height:14px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
                      <span>{{ order.address }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Order Items -->
              <div class="border border-gray-200 rounded-xl overflow-hidden">
                <div class="bg-gray-50 px-4 py-2.5 border-b border-gray-100">
                  <p class="text-xs font-bold text-gray-400 uppercase tracking-wide">Order Items</p>
                </div>
                <div class="p-4 space-y-3">
                  <!-- Cart items (multiple) -->
                  <template v-if="order.items && order.items.length > 0">
                    <div v-for="(item, i) in order.items" :key="i" class="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" class="text-blue-600" style="width:14px;height:14px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><polyline points="3.29 7 12 12 20.71 7"/></svg>
                        </div>
                        <div>
                          <p class="text-sm font-semibold text-gray-900">{{ item.name }}</p>
                          <p class="text-xs text-gray-400">{{ item.size || 'N/A' }} · {{ (item.quantity || 0).toLocaleString() }} pcs</p>
                        </div>
                      </div>
                      <p class="text-sm font-bold text-gray-900">₱{{ (item.estimatedTotal || 0).toLocaleString() }}</p>
                    </div>
                  </template>
                  <!-- Single product -->
                  <template v-else>
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-3">
                        <div class="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" class="text-blue-600" style="width:16px;height:16px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><polyline points="3.29 7 12 12 20.71 7"/></svg>
                        </div>
                        <div>
                          <p class="text-sm font-bold text-gray-900">{{ order.product }}</p>
                          <p class="text-xs text-gray-400">{{ order.size || 'N/A' }} · {{ (order.qty || 0).toLocaleString() }} pcs</p>
                        </div>
                      </div>
                      <p class="text-sm font-bold text-gray-900">{{ order.amount }}</p>
                    </div>
                  </template>
                  <div class="border-t border-gray-100 pt-3 flex items-center justify-between">
                    <span class="text-sm font-bold text-gray-700">Total</span>
                    <span class="text-base font-black text-gray-900">{{ order.amount }}</span>
                  </div>
                </div>
              </div>

              <!-- Payment Status -->
              <div v-if="localStatus !== 'Cancelled'">
                <div class="flex items-center justify-between mb-2.5">
                  <p class="text-xs font-bold text-gray-400 uppercase tracking-wide">Payment Status</p>
                  <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold capitalize" :class="paymentBadge(localPayment)">
  {{ localPayment }}
</span>
                </div>
                <div class="flex gap-2">
  <button
    v-for="ps in paymentStatuses"
    :key="ps.value"
    @click="handlePaymentClick(ps.value)"
    :disabled="isSaving"
    class="flex-1 py-2 rounded-xl text-xs font-bold capitalize border-2 transition-all disabled:opacity-50"
    :class="localPayment === ps.value
      ? 'border-current ' + ps.activeClass
      : 'border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600'"
  >
    {{ ps.label }}
  </button>
</div>
              </div>

              <!-- Order Status Flow -->
              <div>
                <div class="flex items-center justify-between mb-3">
                  <p class="text-xs font-bold text-gray-400 uppercase tracking-wide">Order Status</p>
                  <button
                    v-if="localStatus !== 'Cancelled' && localStatus !== 'Completed'"
                    @click="handleCancelClick"
                    :disabled="isSaving"
                    class="text-xs font-semibold text-red-500 hover:text-red-700 hover:bg-red-50 px-2.5 py-1 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Cancel Order
                  </button>
                </div>

                <!-- Cancelled banner -->
                <div v-if="localStatus === 'Cancelled'" class="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 font-semibold mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
                  This order has been cancelled
                </div>

                <!-- Progress flow -->
                <div v-else class="flex items-center gap-1">
                  <div v-for="(status, index) in statusFlow" :key="status" class="flex items-center flex-1">
                    <button
                      @click="handleStatusClick(status)"
                      :disabled="isSaving || isStatusDisabled(status)"
                      class="flex-1 flex flex-col items-center gap-1.5 py-2.5 px-1 rounded-xl text-center transition-all disabled:cursor-not-allowed"
                      :class="getStatusButtonClass(status)"
                      :title="isStatusDisabled(status) ? `Cannot skip to ${status}` : `Set to: ${status}`"
                    >
                      <span class="flex items-center justify-center w-6 h-6">
                        <component v-if="isStatusCompleted(status)" :is="statusIcon(status)" class="w-4 h-4" />
                        <span v-else class="text-xs font-black">{{ index + 1 }}</span>
                      </span>
                      <span class="text-xs font-semibold leading-tight">{{ getStatusShortName(status) }}</span>
                    </button>
                    <svg v-if="index < statusFlow.length - 1" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="flex-shrink-0 mx-0.5" :class="isStatusCompleted(statusFlow[index + 1]) ? 'text-green-400' : 'text-gray-200'">
                      <path d="m9 18 6-6-6-6"/>
                    </svg>
                  </div>
                </div>

                <!-- Saving indicator -->
                <div v-if="isSaving" class="flex items-center gap-2 mt-2 text-xs text-gray-400">
                  <div class="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </div>
              </div>

              <!-- Special Instructions -->
              <div v-if="order.notes" class="flex items-start gap-2.5 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" class="text-amber-600 flex-shrink-0 mt-0.5" style="width:15px;height:15px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
                <div>
                  <p class="text-xs font-bold text-amber-600 uppercase tracking-wide mb-1">Special Instructions</p>
                  <p class="text-sm text-amber-900">{{ order.notes }}</p>
                </div>
              </div>

              <!-- Status History (real data from backend) -->
              <div v-if="order.statusHistory && order.statusHistory.length">
                <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Status History</p>
                <div class="space-y-2">
                  <div
                    v-for="(h, i) in [...order.statusHistory].reverse()"
                    :key="i"
                    class="flex items-start gap-3 px-4 py-3 bg-gray-50 rounded-xl"
                  >
                    <div class="mt-0.5 flex-shrink-0 p-1.5 rounded-full" :class="historyBg(h.status)">
                      <component :is="statusIcon(h.status)" class="w-3.5 h-3.5" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center justify-between">
                        <p class="text-xs font-bold" :class="historyText(h.status)">{{ h.status }}</p>
                        <p class="text-xs text-gray-400">{{ formatDate(h.timestamp) }}</p>
                      </div>
                      <p v-if="h.notes" class="text-xs text-gray-500 mt-0.5">{{ h.notes }}</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-end px-6 py-4 border-t border-gray-100 flex-shrink-0">
            <button
              @click="closeModal"
              class="px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-100 rounded-xl transition-colors font-semibold"
            >
              Close
            </button>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'
import { h } from 'vue'

const props = defineProps({
  show: { type: Boolean, required: true },
  order: { type: Object, required: true },
})

const emit = defineEmits(['close', 'statusUpdate', 'paymentUpdate', 'edit'])

const isSaving = ref(false)
const localStatus = ref(props.order?.status || 'Pending')
const localPayment = ref(props.order?.payment || 'unpaid')

console.log('OrderDetailModal initialized with order:', props.order)

// Keep local state in sync when the parent updates the order
watch(() => props.order, (o) => {
  if (o) {
    localStatus.value = o.status || 'Pending'
    localPayment.value = o.payment || 'unpaid'
  }
}, { deep: true })

// Status flow - must match backend enum exactly
const statusFlow = ['Pending', 'Scheduled', 'In Production', 'Out for Delivery', 'Completed']
const paymentStatuses = [
  { value: 'Paid',    label: 'Paid',    activeClass: 'border-green-500 bg-green-50 text-green-700' },
  { value: 'Partial', label: 'Partial', activeClass: 'border-orange-400 bg-orange-50 text-orange-700' },
  { value: 'Unpaid',  label: 'Unpaid',  activeClass: 'border-red-400 bg-red-50 text-red-600' },
]

// Map frontend payment display to backend values
const paymentDisplayMap = {
  'paid': 'Paid',
  'partial': 'Partial', 
  'unpaid': 'Unpaid',
  'Paid': 'Paid',
  'Partial': 'Partial',
  'Unpaid': 'Unpaid'
}

// Get backend payment value
const getBackendPaymentValue = (displayValue) => {
  return paymentDisplayMap[displayValue] || 'Unpaid'
}

// Status helpers
function isStatusCompleted(status) {
  const ci = statusFlow.indexOf(localStatus.value)
  const si = statusFlow.indexOf(status)
  return si <= ci
}

function isStatusDisabled(status) {
  const ci = statusFlow.indexOf(localStatus.value)
  const si = statusFlow.indexOf(status)
  return si > ci + 1
}

function getStatusButtonClass(status) {
  const ci = statusFlow.indexOf(localStatus.value)
  const si = statusFlow.indexOf(status)
  const isActive = localStatus.value === status
  if (isActive) return 'bg-green-100 text-green-700 ring-2 ring-inset ring-green-400 cursor-default'
  if (si < ci)  return 'bg-green-50 text-green-600'
  if (si === ci + 1) return 'bg-blue-50 text-blue-600 hover:bg-blue-100 cursor-pointer'
  return 'bg-gray-50 text-gray-300 cursor-not-allowed'
}

function getStatusShortName(status) {
  const names = { 
    'Pending': 'Pending', 
    'Scheduled': 'Scheduled', 
    'In Production': 'In Prod.', 
    'Out for Delivery': 'Delivery', 
    'Completed': 'Done' 
  }
  return names[status] || status
}

// Click handlers - emit to parent with correct backend values
async function handleStatusClick(status) {
  if (isStatusDisabled(status) || localStatus.value === status || isSaving.value) return
  isSaving.value = true
  localStatus.value = status  // optimistic
  // Emit with the exact status value that backend expects
  emit('statusUpdate', { orderId: props.order.id, status: status, notes: '' })
  setTimeout(() => { isSaving.value = false }, 1500)
}

async function handlePaymentClick(paymentDisplayValue) {
  const backendValue = getBackendPaymentValue(paymentDisplayValue)
  if (localPayment.value === backendValue || isSaving.value) return
  isSaving.value = true
  localPayment.value = backendValue  // optimistic
  emit('paymentUpdate', { orderId: props.order.id, paymentStatus: backendValue, amountPaid: null })
  setTimeout(() => { isSaving.value = false }, 1500)
}

async function handleCancelClick() {
  if (isSaving.value) return
  if (!confirm(`Cancel order ${props.order.orderId || props.order.id}? This cannot be undone.`)) return
  isSaving.value = true
  localStatus.value = 'Cancelled'
  emit('statusUpdate', { orderId: props.order.id, status: 'Cancelled', notes: 'Cancelled by admin' })
  setTimeout(() => { isSaving.value = false }, 1500)
}

function closeModal() { emit('close') }

// Badge styling
function statusBadge(status) {
  const classes = {
    'Completed': 'bg-green-100 text-green-700',
    'In Production': 'bg-blue-100 text-blue-700',
    'Scheduled': 'bg-purple-100 text-purple-700',
    'Pending': 'bg-yellow-100 text-yellow-700',
    'Out for Delivery': 'bg-cyan-100 text-cyan-700',
    'Cancelled': 'bg-red-100 text-red-600',
  }
  return classes[status] ?? 'bg-gray-100 text-gray-500'
}

function paymentBadge(payment) {
  const classes = {
    'Paid': 'bg-green-100 text-green-700',
    'Partial': 'bg-orange-100 text-orange-700',
    'Unpaid': 'bg-red-100 text-red-600',
  }
  return classes[payment] ?? 'bg-gray-100 text-gray-500'
}

function historyBg(status) {
  const classes = {
    'Completed': 'bg-green-100',
    'In Production': 'bg-blue-100',
    'Scheduled': 'bg-purple-100',
    'Pending': 'bg-yellow-100',
    'Out for Delivery': 'bg-cyan-100',
    'Cancelled': 'bg-red-100',
  }
  return classes[status] ?? 'bg-gray-100'
}

function historyText(status) {
  const classes = {
    'Completed': 'text-green-700',
    'In Production': 'text-blue-700',
    'Scheduled': 'text-purple-700',
    'Pending': 'text-yellow-700',
    'Out for Delivery': 'text-cyan-700',
    'Cancelled': 'text-red-600',
  }
  return classes[status] ?? 'text-gray-600'
}

function formatDate(ts) {
  if (!ts) return ''
  return new Date(ts).toLocaleString('en-PH', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

// Status icons
const CheckIcon    = () => h('svg', { xmlns:'http://www.w3.org/2000/svg', viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', 'stroke-width':2 }, [h('path',{d:'M21.801 10A10 10 0 1 1 17 3.335'}), h('path',{d:'m9 11 3 3L22 4'})])
const PackageIcon  = () => h('svg', { xmlns:'http://www.w3.org/2000/svg', viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', 'stroke-width':2 }, [h('path',{d:'M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z'}), h('path',{d:'M12 22V12'}), h('polyline',{points:'3.29 7 12 12 20.71 7'})])
const ClockIcon    = () => h('svg', { xmlns:'http://www.w3.org/2000/svg', viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', 'stroke-width':2 }, [h('circle',{cx:12,cy:12,r:10}), h('polyline',{points:'12 6 12 12 16 14'})])
const CalendarIcon = () => h('svg', { xmlns:'http://www.w3.org/2000/svg', viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', 'stroke-width':2 }, [h('path',{d:'M8 2v4'}), h('path',{d:'M16 2v4'}), h('rect',{width:18,height:18,x:3,y:4,rx:2}), h('path',{d:'M3 10h18'})])
const TruckIcon    = () => h('svg', { xmlns:'http://www.w3.org/2000/svg', viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', 'stroke-width':2 }, [h('path',{d:'M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2'}), h('path',{d:'M15 18H9'}), h('path',{d:'M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14'}), h('circle',{cx:17,cy:18,r:2}), h('circle',{cx:7,cy:18,r:2})])
const XIcon        = () => h('svg', { xmlns:'http://www.w3.org/2000/svg', viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', 'stroke-width':2 }, [h('circle',{cx:12,cy:12,r:10}), h('path',{d:'m15 9-6 6'}), h('path',{d:'m9 9 6 6'})])

function statusIcon(status) {
  const icons = {
    'Completed': CheckIcon,
    'In Production': PackageIcon,
    'Scheduled': CalendarIcon,
    'Pending': ClockIcon,
    'Out for Delivery': TruckIcon,
    'Cancelled': XIcon
  }
  return icons[status] ?? ClockIcon
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-active .relative, .modal-leave-active .relative { transition: transform 0.2s ease, opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .relative { transform: scale(0.95) translateY(8px); opacity: 0; }
.modal-leave-to .relative { transform: scale(0.95) translateY(8px); opacity: 0; }
@keyframes spin { to { transform: rotate(360deg); } }
.animate-spin { animation: spin 0.7s linear infinite; }
</style>