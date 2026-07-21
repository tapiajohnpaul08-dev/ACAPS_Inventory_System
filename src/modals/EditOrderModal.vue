<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="closeModal">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeModal" />

        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">

          <!-- Header -->
          <div class="flex items-start justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
            <div>
              <h2 class="text-lg font-bold text-gray-900">Edit Order</h2>
              <p class="text-sm text-gray-500 mt-0.5">{{ order?.orderId || order?.id }} · {{ order?.customer }} · {{ order?.date }}</p>
            </div>
            <button @click="closeModal" class="ml-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>

          <!-- Form -->
          <div class="flex-1 overflow-y-auto px-6 py-5">
            <div class="space-y-5">

              <!-- Customer Information -->
              <div class="border border-gray-200 rounded-xl p-4">
                <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">Customer Information</p>
                <div class="grid grid-cols-2 gap-3">
                  <div class="col-span-2 sm:col-span-1">
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Customer Name <span class="text-red-400">*</span></label>
                    <input disabled v-model="form.customer" type="text" required class=" field not-allowed " :class="{'border-red-300': errors.customer}" @input="errors.customer = ''" />
                    <p v-if="errors.customer" class="text-xs text-red-500 mt-1">{{ errors.customer }}</p>
                  </div>
                  <div class="col-span-2 sm:col-span-1">
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Email</label>
                    <input disabled v-model="form.email" type="email" class="field not-allowed" />
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Phone</label>
                    <input disabled v-model="form.phone" type="tel" class="field not-allowed" />
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Delivery Method</label>
                    <select disabled v-model="form.deliveryMethod" class="field not-allowed">
                      <option value="Pick-up">Pick-up</option>
                      <option value="Delivery">Delivery</option>
                    </select>
                  </div>
                  <div v-if="form.deliveryMethod === 'Delivery'" class="col-span-2">
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Delivery Address</label>
                    <input v-model="form.address" type="text" class="field" placeholder="Full delivery address" />
                  </div>
                </div>
              </div>

              <!-- Product Information -->
              <div class="border border-gray-200 rounded-xl p-4">
                <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">Product Information</p>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Product <span class="text-red-400">*</span></label>
                    <input disabled v-model="form.product" type="text" required class="field not-allowed" :class="{'border-red-300': errors.product}" @input="errors.product = ''" />
                    <p v-if="errors.product" class="text-xs text-red-500 mt-1">{{ errors.product }}</p>
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Size</label>
                    <input disabled v-model="form.size" type="text" class="field not-allowed" placeholder="e.g. 8oz, 12oz" />
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Quantity <span class="text-red-400">*</span></label>
                    <input v-model.number="form.qty" type="number" min="1" required class="field" :class="{'border-red-300': errors.qty}" @input="errors.qty = ''" />
                    <p v-if="errors.qty" class="text-xs text-red-500 mt-1">{{ errors.qty }}</p>
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Amount (₱)</label>
                    <input v-model.number="form.rawAmount" type="number" min="0" step="0.01" class="field" placeholder="0.00" />
                  </div>
                </div>
              </div>

              <!-- Status & Payment -->
              <div class="border border-gray-200 rounded-xl p-4">
                <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">Status & Payment</p>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Order Status</label>
                    <select v-model="form.status" class="field">
                      <option value="Pending">Pending</option>
                      <option value="Scheduled">Scheduled</option>
                      <option value="In Production">In Production</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Payment Status</label>
                    <select v-model="form.payment" class="field">
                      <option value="Unpaid">Unpaid</option>
                      <option value="Partial">Partial</option>
                      <option value="Paid">Paid</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Expected Delivery -->
              <div class="border border-gray-200 rounded-xl p-4">
                <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">Scheduling</p>
                <div>
                  <label class="block text-xs font-semibold text-gray-600 mb-1">Expected Delivery / Pickup Date</label>
                  <input v-model="form.expectedDelivery" type="date" class="field" />
                  <p class="text-xs text-gray-400 mt-1">Leave empty to keep current date</p>
                </div>
              </div>

              <!-- Notes -->
              <div class="border border-gray-200 rounded-xl p-4">
                <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Notes</p>
                <textarea
                  v-model="form.notes"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                  placeholder="Special instructions or admin notes..."
                ></textarea>
              </div>

            </div>
          </div>

          <!-- Footer -->
          <div class="flex gap-3 px-6 py-4 border-t border-gray-100 flex-shrink-0">
            <button
              @click="handleSubmit"
              :disabled="isSubmitting"
              class="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-bold disabled:opacity-50"
            >
              <svg v-if="!isSubmitting" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
              <div v-else class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
            </button>
            <button
              @click="closeModal"
              :disabled="isSubmitting"
              class="flex-1 flex items-center justify-center gap-2 py-2.5 border-2 border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors text-sm font-bold"
            >
              Cancel
            </button>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'
import { adminOrderApi } from '@/api/api'

const props = defineProps({
  show: { type: Boolean, required: true },
  order: { type: Object, required: true }
})

const emit = defineEmits(['close', 'saved'])

const isSubmitting = ref(false)
const errors = ref({ customer: '', product: '', qty: '' })

// Helper function to format date to YYYY-MM-DD for input[type="date"]
function formatDateForInput(dateValue) {
  if (!dateValue) return ''
  try {
    const date = new Date(dateValue)
    if (isNaN(date.getTime())) return ''
    return date.toISOString().split('T')[0]
  } catch {
    return ''
  }
}

function buildForm(o) {
  // Extract expected delivery date from various possible locations
  let expectedDelivery = ''
  if (o.expectedDelivery) {
    expectedDelivery = formatDateForInput(o.expectedDelivery)
  } else if (o.fulfillment?.expectedDelivery) {
    expectedDelivery = formatDateForInput(o.fulfillment.expectedDelivery)
  }
  
  return {
    customer: o.customer || o.customerName || '',
    email: o.email || o.customerEmail || '',
    phone: o.phone || o.customerPhone || '',
    deliveryMethod: o.deliveryMethod || o.receivingMode || 'Pick-up',
    address: o.address || o.deliveryAddress || o.fulfillment?.deliveryAddress || '',
    product: o.product || o.productName || '',
    size: o.size || '',
    qty: o.qty || o.quantity || 0,
    rawAmount: o.rawAmount || o.amount || 0,
    status: o.status || 'Pending',
    payment: o.payment || o.paymentStatus || 'Unpaid',
    notes: o.notes || '',
    expectedDelivery: expectedDelivery,
  }
}

const form = ref(buildForm(props.order))

console.log('EditOrderModal initialized with form:', form.value)

watch(() => props.order, (o) => { 
  if (o) {
    form.value = buildForm(o)
    console.log('EditOrderModal updated with new order:', form.value)
  }
}, { immediate: true, deep: true })

function validate() {
  let ok = true
  errors.value = { customer: '', product: '', qty: '' }
  if (!form.value.customer.trim()) { errors.value.customer = 'Customer name is required.'; ok = false }
  if (!form.value.product.trim()) { errors.value.product = 'Product name is required.'; ok = false }
  if (!form.value.qty || form.value.qty < 1) { errors.value.qty = 'Quantity must be at least 1.'; ok = false }
  return ok
}

function closeModal() { emit('close') }

async function handleSubmit() {
  if (!validate()) return
  isSubmitting.value = true

  try {
    // Normalize payment status to match backend enum
    const paymentStatusMap = {
      'Unpaid': 'Unpaid',
      'Partial': 'Partial',
      'Paid': 'Paid',
    }
    
    const payload = {
      customerName: form.value.customer,
      customerEmail: form.value.email,
      customerPhone: form.value.phone,
      receivingMode: form.value.deliveryMethod,
      address: form.value.address,
      productName: form.value.product,
      size: form.value.size,
      quantity: form.value.qty,
      amount: form.value.rawAmount,
      status: form.value.status,
      paymentStatus: paymentStatusMap[form.value.payment] || 'Unpaid',
      notes: form.value.notes,
    }
    
    // Only include expectedDelivery if it has a value
    if (form.value.expectedDelivery) {
      payload.expectedDelivery = new Date(form.value.expectedDelivery)
    }

    console.log('EditOrderModal payload:', payload)

    const response = await adminOrderApi.updateOrder(props.order.id, payload)

    if (response.success) {
      // Build a merged updated order for the parent to patch into its list
      const updated = {
        ...props.order,
        customer: form.value.customer,
        customerName: form.value.customer,
        email: form.value.email,
        customerEmail: form.value.email,
        phone: form.value.phone,
        customerPhone: form.value.phone,
        deliveryMethod: form.value.deliveryMethod,
        receivingMode: form.value.deliveryMethod,
        address: form.value.address,
        product: form.value.product,
        productName: form.value.product,
        size: form.value.size,
        qty: form.value.qty,
        quantity: form.value.qty,
        rawAmount: form.value.rawAmount,
        amount: form.value.rawAmount,
        amountFormatted: `₱${Number(form.value.rawAmount).toLocaleString()}`,
        status: form.value.status,
        payment: form.value.payment,
        paymentStatus: paymentStatusMap[form.value.payment] || 'Unpaid',
        notes: form.value.notes,
        expectedDelivery: form.value.expectedDelivery ? new Date(form.value.expectedDelivery) : props.order.expectedDelivery,
      }
      emit('saved', updated)
      closeModal()
    } else {
      alert(response.message || 'Failed to save order. Please try again.')
    }
  } catch (e) {
    console.error('EditOrderModal save error:', e)
    alert('An error occurred while saving. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.field {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.field:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.not-allowed { 
  cursor: not-allowed;
  background-color: #e4e4e4;
}

.field.border-red-300 { border-color: #fca5a5; }
select.field { appearance: auto; }
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-active .relative, .modal-leave-active .relative { transition: transform 0.2s ease, opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .relative { transform: scale(0.95) translateY(8px); opacity: 0; }
.modal-leave-to .relative { transform: scale(0.95) translateY(8px); opacity: 0; }
@keyframes spin { to { transform: rotate(360deg); } }
.animate-spin { animation: spin 0.7s linear infinite; }
</style>