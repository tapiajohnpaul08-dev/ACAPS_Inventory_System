<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="closeModal">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeModal" />

        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col">

          <!-- Header - Compact -->
          <div class="flex items-start justify-between px-6 py-3 border-b border-gray-100 flex-shrink-0 bg-gradient-to-r from-blue-50 to-white rounded-t-2xl">
            <div>
              <h2 class="text-lg font-bold text-gray-900">Edit Order</h2>
              <p class="text-sm text-gray-500">{{ order?.orderId || order?.id }} · {{ order?.customer }} · {{ order?.date }}</p>
            </div>
            <button @click="closeModal" class="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- Form - Compact -->
          <div class="flex-1 overflow-y-auto px-6 py-4">
            <div class="space-y-4">

              <!-- Customer Information - Compact Grid -->
              <div class="border border-gray-200 rounded-xl p-4">
                <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Customer Information</p>
                <div class="grid grid-cols-3 gap-3">
                  <div class="col-span-1">
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Customer Name <span class="text-red-400">*</span></label>
                    <input v-model="form.customer" type="text" required class="field" :class="{'border-red-300': errors.customer}" @input="errors.customer = ''" />
                    <p v-if="errors.customer" class="text-xs text-red-500 mt-1">{{ errors.customer }}</p>
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Email</label>
                    <input v-model="form.email" type="email" class="field" />
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Phone</label>
                    <input v-model="form.phone" type="tel" class="field" />
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Delivery Method</label>
                    <select v-model="form.deliveryMethod" class="field">
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

              <!-- Product Information & Status - Combined Grid -->
              <div class="grid grid-cols-2 gap-4">
                <!-- Product Information -->
                <div class="border border-gray-200 rounded-xl p-4">
                  <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Product Information</p>
                  <div class="space-y-3">
                    <div>
                      <label class="block text-xs font-semibold text-gray-600 mb-1">Product <span class="text-red-400">*</span></label>
                      <input v-model="form.product" type="text" required class="field" :class="{'border-red-300': errors.product}" @input="errors.product = ''" />
                      <p v-if="errors.product" class="text-xs text-red-500 mt-1">{{ errors.product }}</p>
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                      <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1">Size</label>
                        <input v-model="form.size" type="text" class="field" placeholder="e.g. 8oz" />
                      </div>
                      <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1">Quantity <span class="text-red-400">*</span></label>
                        <input v-model.number="form.qty" type="number" min="1" required class="field" :class="{'border-red-300': errors.qty}" @input="errors.qty = ''" />
                        <p v-if="errors.qty" class="text-xs text-red-500 mt-1">{{ errors.qty }}</p>
                      </div>
                    </div>
                    <div>
                      <label class="block text-xs font-semibold text-gray-600 mb-1">Amount (₱)</label>
                      <input v-model.number="form.rawAmount" type="number" min="0" step="0.01" class="field" placeholder="0.00" />
                    </div>
                  </div>
                </div>

                <!-- Status & Payment -->
                <div class="border border-gray-200 rounded-xl p-4">
                  <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Status & Payment</p>
                  <div class="space-y-3">
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
                    <div>
                      <label class="block text-xs font-semibold text-gray-600 mb-1">Expected Delivery</label>
                      <input v-model="form.expectedDelivery" type="date" class="field" />
                      <p class="text-xs text-gray-400 mt-0.5">Leave empty to keep current</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Driver Information (Only for Out for Delivery) -->
              <div v-if="form.status === 'Out for Delivery' && form.deliveryMethod === 'Delivery'" class="border border-gray-200 rounded-xl p-4">
                <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <Truck class="w-4 h-4" />
                  Driver Information
                </p>
                <div class="grid grid-cols-4 gap-3">
                  <div class="col-span-2">
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Driver Name</label>
                    <input v-model="form.driverName" type="text" class="field" placeholder="Driver name" />
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Driver Phone</label>
                    <input v-model="form.driverPhone" type="tel" class="field" placeholder="Phone" />
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Plate Number</label>
                    <input v-model="form.plateNumber" type="text" class="field" placeholder="ABC-1234" />
                  </div>
                  <div class="col-span-4">
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Truck Description</label>
                    <input v-model="form.truckDescription" type="text" class="field" placeholder="e.g., White Isuzu Elf" />
                  </div>
                </div>
              </div>

              <!-- Notes -->
              <div class="border border-gray-200 rounded-xl p-4">
                <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Notes</p>
                <textarea
                  v-model="form.notes"
                  rows="2"
                  class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                  placeholder="Special instructions or admin notes..."
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Footer - Compact -->
          <div class="flex gap-3 px-6 py-3 border-t border-gray-100 flex-shrink-0">
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
              class="flex-1 py-2.5 border-2 border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors text-sm font-bold"
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
import { X, Truck } from 'lucide-vue-next'
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
    driverName: o.driverDetails?.driverName || '',
    driverPhone: o.driverDetails?.driverPhone || '',
    plateNumber: o.driverDetails?.plateNumber || '',
    truckDescription: o.driverDetails?.truckDescription || '',
  }
}

const form = ref(buildForm(props.order))

watch(() => props.order, (o) => { 
  if (o) {
    form.value = buildForm(o)
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
    
    if (form.value.expectedDelivery) {
      payload.expectedDelivery = new Date(form.value.expectedDelivery)
    }

    if (form.value.status === 'Out for Delivery' && form.value.deliveryMethod === 'Delivery') {
      if (form.value.driverName) {
        payload.driverDetails = {
          driverName: form.value.driverName,
          driverPhone: form.value.driverPhone || '',
          plateNumber: form.value.plateNumber || '',
          truckDescription: form.value.truckDescription || '',
        }
      }
    }

    const response = await adminOrderApi.updateOrder(props.order.id, payload)

    if (response.success) {
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
        driverDetails: {
          driverName: form.value.driverName,
          driverPhone: form.value.driverPhone,
          plateNumber: form.value.plateNumber,
          truckDescription: form.value.truckDescription,
        }
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
  padding: 0.4rem 0.75rem;
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