<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="closeModal"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeModal" />

        <!-- Modal Panel -->
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
          
          <!-- Header -->
          <div class="flex items-start justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
            <div>
              <h2 class="text-lg font-semibold text-gray-900 leading-snug">
                Order — {{ order?.id || 'N/A' }}
              </h2>
              <p class="text-sm text-gray-500 mt-0.5">{{ order?.customer || 'Unknown Customer' }}</p>
            </div>
            <button 
              @click="closeModal"
              class="ml-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors flex-shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
            </button>
          </div>

          <!-- Scrollable body -->
          <div class="flex-1 overflow-y-auto px-6 py-5">
            <div v-if="order" class="space-y-6">
              
              <!-- Order ID + Date -->
              <div class="grid grid-cols-2 gap-4">
                <div class="bg-blue-50 rounded-xl p-4">
                  <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Order ID</p>
                  <p class="text-base font-black text-blue-700">{{ order.id }}</p>
                </div>
                <div class="bg-gray-50 rounded-xl p-4">
                  <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Order Date</p>
                  <p class="text-sm font-bold text-gray-900">{{ order.date }}</p>
                </div>
              </div>

              <!-- Customer Information -->
              <div class="border border-gray-200 rounded-xl overflow-hidden">
                <div class="bg-gray-50 px-4 py-2.5 border-b border-gray-100">
                  <p class="text-xs font-bold text-gray-400 uppercase tracking-wide">Customer Information</p>
                </div>
                <div class="p-4 space-y-2.5">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-black text-base flex-shrink-0">
                      {{ (order.customer?.[0] || '?').toUpperCase() }}
                    </div>
                    <p class="text-sm font-bold text-gray-900">{{ order.customer }}</p>
                  </div>
                  <div class="grid grid-cols-1 gap-2 text-sm">
                    <div class="flex items-center gap-2 text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400 flex-shrink-0" style="width: 14px; height: 14px;">
                        <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                      </svg>
                      <span>{{ order.email || 'No email provided' }}</span>
                    </div>
                    <div class="flex items-center gap-2 text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400 flex-shrink-0" style="width: 14px; height: 14px;">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                      <span>{{ order.phone || 'No phone provided' }}</span>
                    </div>
                    <div class="flex items-center gap-2 text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400 flex-shrink-0" style="width: 14px; height: 14px;">
                        <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      <span class="capitalize">{{ order.delivery || 'pickup' }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Order Items -->
              <div class="border border-gray-200 rounded-xl overflow-hidden">
                <div class="bg-gray-50 px-4 py-2.5 border-b border-gray-100">
                  <p class="text-xs font-bold text-gray-400 uppercase tracking-wide">Order Items</p>
                </div>
                <div class="p-4">
                  <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-3">
                      <div class="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-600" style="width: 16px; height: 16px;">
                          <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"></path>
                          <path d="M12 22V12"></path>
                          <polyline points="3.29 7 12 12 20.71 7"></polyline>
                          <path d="m7.5 4.27 9 5.15"></path>
                        </svg>
                      </div>
                      <div>
                        <p class="text-sm font-bold text-gray-900">{{ order.product }}</p>
                        <p class="text-xs text-gray-500">{{ order.size || 'N/A' }} · Qty: {{ (order.qty || 0).toLocaleString() }} pcs</p>
                      </div>
                    </div>
                    <div class="text-right">
                      <p class="text-sm font-bold text-gray-900">{{ order.amount }}</p>
                      <p class="text-xs text-gray-400">{{ order.pricePerPc || '₱0' }}/pc</p>
                    </div>
                  </div>
                  <div class="border-t border-gray-100 pt-3 flex items-center justify-between">
                    <span class="text-xs text-gray-400 font-medium">Subtotal</span>
                    <span class="text-sm font-bold text-gray-700">{{ order.amount }}</span>
                  </div>
                  <div class="flex items-center justify-between mt-1.5">
                    <span class="text-sm font-bold text-gray-700">Total</span>
                    <span class="text-base font-black text-gray-900">{{ order.amount }}</span>
                  </div>
                </div>
              </div>

              <!-- Payment Status -->
              <div>
                <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2.5">Payment Status</p>
                <div class="flex gap-2">
                  <button
                    v-for="status in paymentStatuses"
                    :key="status"
                    @click="updatePaymentStatus(status)"
                    class="flex-1 py-2 rounded-xl text-xs font-bold capitalize border-2 transition-all"
                    :class="getPaymentButtonClass(status)"
                    :disabled="isSaving"
                  >
                    {{ status }}
                  </button>
                </div>
              </div>

              <!-- Order Status -->
              <div>
                <div class="flex items-center justify-between mb-2.5">
                  <p class="text-xs font-bold text-gray-400 uppercase tracking-wide">Order Status</p>
                  <span
                    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
                    :class="statusBadge(order.status)"
                  >
                    <component :is="statusIcon(order.status)" class="w-3.5 h-3.5" />
                    {{ order.status }}
                  </span>
                </div>
                
                <!-- Status Flow -->
                <div class="space-y-3">
                  <div class="flex items-center gap-1">
                    <div v-for="(status, index) in statusFlow" :key="status" class="flex items-center flex-1">
                      <button
                        @click="updateOrderStatus(status)"
                        :disabled="isSaving || isStatusDisabled(status)"
                        class="flex-1 flex flex-col items-center gap-1.5 py-2.5 px-1 rounded-xl text-center transition-all"
                        :class="getStatusButtonClass(status)"
                        :title="`Set to: ${status}`"
                      >
                        <span class="text-lg">
                          <component v-if="isStatusCompleted(status)" :is="statusIcon(status)" class="w-4 h-4" />
                          <span v-else>{{ getStatusNumber(index + 1) }}</span>
                        </span>
                        <span class="text-xs font-semibold leading-tight">{{ getStatusShortName(status) }}</span>
                      </button>
                      <svg 
                        v-if="index < statusFlow.length - 1"
                        xmlns="http://www.w3.org/2000/svg" 
                        width="24" height="24" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        stroke-width="2" 
                        stroke-linecap="round" 
                        stroke-linejoin="round" 
                        class="text-gray-300 flex-shrink-0 mx-0.5"
                        :class="{ 'text-green-400': isStatusCompleted(statusFlow[index + 1]) }"
                        style="width: 14px; height: 14px;"
                      >
                        <path d="m9 18 6-6-6-6"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Special Instructions -->
              <div v-if="order.notes" class="flex items-start gap-2.5 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-600 flex-shrink-0 mt-0.5" style="width: 15px; height: 15px;">
                  <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
                  <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                  <path d="M10 9H8"></path>
                  <path d="M16 13H8"></path>
                  <path d="M16 17H8"></path>
                </svg>
                <div>
                  <p class="text-xs font-bold text-amber-600 uppercase tracking-wide mb-1">Special Instructions</p>
                  <p class="text-sm text-amber-900">{{ order.notes }}</p>
                </div>
              </div>

              <!-- Status History -->
              <div v-if="statusHistory.length">
                <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Status History</p>
                <div class="space-y-2">
                  <div v-for="history in statusHistory" :key="history.timestamp" class="flex items-start gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                    <div class="mt-0.5 flex-shrink-0 p-1.5 rounded-full" :class="history.bgColor">
                      <component :is="history.icon" class="w-3.5 h-3.5" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center justify-between">
                        <p class="text-xs font-bold" :class="history.textColor">{{ history.status }}</p>
                        <p class="text-xs text-gray-400">{{ history.timestamp }}</p>
                      </div>
                      <p class="text-xs text-gray-500 mt-0.5 truncate">{{ history.note }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Footer Actions -->
              <div class="flex items-center justify-between pt-2 border-t border-gray-100">
                <button 
                  @click="closeModal"
                  class="px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-100 rounded-xl transition-colors font-medium"
                >
                  Close
                </button>
                <button 
                  @click="saveChanges"
                  :disabled="!hasChanges || isSaving"
                  class="px-6 py-2.5 bg-blue-600 text-white text-sm rounded-xl hover:bg-blue-700 transition-colors shadow-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {{ isSaving ? 'Saving...' : 'Save Changes' }}
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import { h } from 'vue'

const props = defineProps({
  show: { type: Boolean, required: true },
  order: { type: Object, required: true },
})

const emit = defineEmits(['close', 'update'])

const isSaving = ref(false)
const localOrder = ref({ ...props.order })
const hasChanges = ref(false)

// Status flow order
const statusFlow = ['Pending', 'Scheduled', 'In Production', 'To Ship', 'Completed']

// Payment statuses
const paymentStatuses = ['paid', 'partial', 'unpaid']

// Status icons
const CheckIcon = () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
  h('path', { d: 'M21.801 10A10 10 0 1 1 17 3.335' }),
  h('path', { d: 'm9 11 3 3L22 4' }),
])

const PackageIcon = () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
  h('path', { d: 'M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z' }),
  h('path', { d: 'M12 22V12' }),
  h('polyline', { points: '3.29 7 12 12 20.71 7' }),
  h('path', { d: 'm7.5 4.27 9 5.15' }),
])

const ClockIcon = () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
  h('circle', { cx: 12, cy: 12, r: 10 }),
  h('polyline', { points: '12 6 12 12 16 14' }),
])

const CalendarIcon = () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
  h('path', { d: 'M8 2v4' }),
  h('path', { d: 'M16 2v4' }),
  h('rect', { width: 18, height: 18, x: 3, y: 4, rx: 2 }),
  h('path', { d: 'M3 10h18' }),
])

const TruckIcon = () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
  h('path', { d: 'M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2' }),
  h('path', { d: 'M15 18H9' }),
  h('path', { d: 'M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14' }),
  h('circle', { cx: 17, cy: 18, r: 2 }),
  h('circle', { cx: 7, cy: 18, r: 2 }),
])

// Status badge styling
function statusBadge(status) {
  return {
    Completed: 'bg-green-100 text-green-700',
    'In Production': 'bg-blue-100 text-blue-700',
    Scheduled: 'bg-purple-100 text-purple-700',
    Pending: 'bg-yellow-100 text-yellow-700',
    'To Ship': 'bg-cyan-100 text-cyan-700',
  }[status] ?? 'bg-gray-100 text-gray-500'
}

function statusIcon(status) {
  return {
    Completed: CheckIcon,
    'In Production': PackageIcon,
    Scheduled: CalendarIcon,
    Pending: ClockIcon,
    'To Ship': TruckIcon,
  }[status] ?? ClockIcon
}

function getStatusShortName(status) {
  const names = {
    'Pending': 'Pending',
    'Scheduled': 'Scheduled',
    'In Production': 'In Prod.',
    'To Ship': 'To Ship',
    'Completed': 'Completed'
  }
  return names[status] || status
}

function getStatusNumber(num) {
  return num
}

function isStatusCompleted(status) {
  const currentIndex = statusFlow.indexOf(localOrder.value.status)
  const statusIndex = statusFlow.indexOf(status)
  return statusIndex <= currentIndex
}

function isStatusDisabled(status) {
  const currentIndex = statusFlow.indexOf(localOrder.value.status)
  const statusIndex = statusFlow.indexOf(status)
  // Can only update to next status or previous statuses
  return statusIndex > currentIndex + 1
}

function getStatusButtonClass(status) {
  const currentIndex = statusFlow.indexOf(localOrder.value.status)
  const statusIndex = statusFlow.indexOf(status)
  const isActive = localOrder.value.status === status
  
  if (statusIndex <= currentIndex) {
    return isActive 
      ? 'bg-green-100 text-green-700 ring-2 ring-inset ring-current'
      : 'bg-green-50 text-green-600'
  }
  return 'bg-gray-50 text-gray-400 hover:bg-gray-100'
}

function getPaymentButtonClass(status) {
  const isActive = localOrder.value.payment === status
  return isActive
    ? 'border-green-500 bg-green-50 text-green-700'
    : 'border-gray-200 text-gray-400 hover:border-gray-300'
}

function updateOrderStatus(status) {
  if (isStatusDisabled(status)) return
  localOrder.value.status = status
  hasChanges.value = true
}

function updatePaymentStatus(status) {
  localOrder.value.payment = status
  hasChanges.value = true
}

async function saveChanges() {
  if (!hasChanges.value) return
  
  isSaving.value = true
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Emit update event
  emit('update', { ...localOrder.value })
  hasChanges.value = false
  isSaving.value = false
  
  // Close modal after save
  closeModal()
}

function closeModal() {
  emit('close')
}

// Status history (example - you can fetch from your data)
const statusHistory = computed(() => {
  // This is example data - you should fetch from your backend
  const history = []
  const now = new Date()
  
  if (localOrder.value.status === 'Completed' || localOrder.value.status === 'To Ship') {
    history.push({
      status: 'Completed',
      timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toLocaleString(),
      note: 'Customer collected',
      icon: CheckIcon,
      bgColor: 'bg-green-100',
      textColor: 'text-green-700'
    })
  }
  
  if (localOrder.value.status === 'To Ship' || localOrder.value.status === 'Completed') {
    history.push({
      status: 'To Ship',
      timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toLocaleString(),
      note: 'Ready for pickup',
      icon: TruckIcon,
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-700'
    })
  }
  
  if (localOrder.value.status !== 'Pending') {
    history.push({
      status: 'In Production',
      timestamp: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toLocaleString(),
      note: 'Production started',
      icon: PackageIcon,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-700'
    })
  }
  
  history.push({
    status: 'Pending',
    timestamp: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toLocaleString(),
    note: 'Order received',
    icon: ClockIcon,
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-700'
  })
  
  return history
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .relative {
  transform: scale(0.95) translateY(8px);
  opacity: 0;
}
.modal-leave-to .relative {
  transform: scale(0.95) translateY(8px);
  opacity: 0;
}
</style>