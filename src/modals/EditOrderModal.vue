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
          <div class="flex items-start justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
            <div>
              <h2 class="text-lg font-semibold text-gray-900 leading-snug">
                Edit Order - {{ order?.id }}
              </h2>
              <p class="text-sm text-gray-500 mt-0.5">{{ order?.customer }} · {{ order?.date }}</p>
            </div>
            <button @click="closeModal" class="ml-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5">
                <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
              </svg>
            </button>
          </div>

          <div class="flex-1 overflow-y-auto px-6 py-5">
            <form @submit.prevent="handleSubmit" class="space-y-5">
              <!-- Basic Information -->
              <div class="border border-gray-200 rounded-xl p-4">
                <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">Order Information</p>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Order ID</label>
                    <input
                      v-model="formData.id"
                      type="text"
                      disabled
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 text-sm cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Order Date</label>
                    <input
                      v-model="formData.date"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>
              </div>

              <!-- Customer Information -->
              <div class="border border-gray-200 rounded-xl p-4">
                <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">Customer Information</p>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Customer Name *</label>
                    <input
                      v-model="formData.customer"
                      type="text"
                      required
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Email</label>
                    <input
                      v-model="formData.email"
                      type="email"
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      v-model="formData.phone"
                      type="tel"
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Delivery Method</label>
                    <select
                      v-model="formData.delivery"
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="pickup">Pickup</option>
                      <option value="standard">Standard Delivery</option>
                      <option value="express">Express Delivery</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Product Information -->
              <div class="border border-gray-200 rounded-xl p-4">
                <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">Product Information</p>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Product *</label>
                    <input
                      v-model="formData.product"
                      type="text"
                      required
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Size</label>
                    <input
                      v-model="formData.size"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Quantity *</label>
                    <input
                      v-model.number="formData.qty"
                      type="number"
                      required
                      min="1"
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Price per piece</label>
                    <input
                      v-model="formData.pricePerPc"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>
              </div>

              <!-- Status and Payment -->
              <div class="border border-gray-200 rounded-xl p-4">
                <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">Status & Payment</p>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Order Status</label>
                    <select
                      v-model="formData.status"
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Scheduled">Scheduled</option>
                      <option value="In Production">In Production</option>
                      <option value="To Ship">To Ship</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Payment Status</label>
                    <select
                      v-model="formData.payment"
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="unpaid">Unpaid</option>
                      <option value="partial">Partial</option>
                      <option value="paid">Paid</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Amount</label>
                    <input
                      v-model="formData.amount"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="₱0"
                    />
                  </div>
                </div>
              </div>

              <!-- Notes -->
              <div class="border border-gray-200 rounded-xl p-4">
                <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Notes</p>
                <textarea
                  v-model="formData.notes"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                  placeholder="Special instructions or notes..."
                ></textarea>
              </div>

              <!-- Action Buttons -->
              <div class="flex gap-3 pt-4">
                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-semibold disabled:opacity-50"
                >
                  <svg v-if="!isSubmitting" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                  <svg v-else class="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
                </button>
                <button
                  type="button"
                  @click="closeModal"
                  class="flex-1 flex items-center justify-center gap-2 py-2.5 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors text-sm font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  show: { type: Boolean, required: true },
  order: { type: Object, required: true }
})

const emit = defineEmits(['close', 'update'])

const isSubmitting = ref(false)
const formData = ref({
  id: '',
  customer: '',
  email: '',
  phone: '',
  delivery: 'standard',
  product: '',
  size: '',
  qty: 0,
  pricePerPc: '',
  amount: '',
  status: '',
  payment: '',
  date: '',
  notes: ''
})

// Watch for order changes to populate form
watch(() => props.order, (newOrder) => {
  if (newOrder) {
    populateForm(newOrder)
  }
}, { immediate: true })

function populateForm(order) {
  formData.value = {
    id: order.id || '',
    customer: order.customer || '',
    email: order.email || '',
    phone: order.phone || '',
    delivery: order.delivery || 'standard',
    product: order.product || '',
    size: order.size || '',
    qty: order.qty || 0,
    pricePerPc: order.pricePerPc || '',
    amount: order.amount || '₱0',
    status: order.status || 'Pending',
    payment: order.payment || 'unpaid',
    date: order.date || '',
    notes: order.notes || ''
  }
}

function handleEscKey(event) {
  if (event.key === 'Escape' && props.show) {
    closeModal()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscKey)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscKey)
})

function closeModal() {
  emit('close')
}

async function handleSubmit() {
  isSubmitting.value = true
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800))
  
  // Prepare updated order
  const updatedOrder = {
    ...props.order,
    customer: formData.value.customer,
    email: formData.value.email,
    phone: formData.value.phone,
    delivery: formData.value.delivery,
    product: formData.value.product,
    size: formData.value.size,
    qty: formData.value.qty,
    pricePerPc: formData.value.pricePerPc,
    amount: formData.value.amount,
    status: formData.value.status,
    payment: formData.value.payment,
    date: formData.value.date,
    notes: formData.value.notes
  }
  
  emit('update', updatedOrder)
  isSubmitting.value = false
  closeModal()
}
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

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>