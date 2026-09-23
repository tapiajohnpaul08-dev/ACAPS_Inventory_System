<!-- components/messages/NegotiationPanel.vue -->
<template>
  <div class="h-full flex flex-col rounded-2xl overflow-hidden border" style="background: #fff; border-color: #e5e7eb;">
    <!-- Header -->
    <div class="shrink-0 px-4 py-3 border-b" style="border-color: #e5e7eb; background: linear-gradient(to right, #eff6ff, #fff);">
      <div class="flex items-center justify-between">
        <span class="text-sm font-bold text-gray-900">Negotiation</span>
        <span v-if="order" class="text-xs font-mono text-blue-600 font-semibold">{{ order.orderId }}</span>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="!order" class="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <div class="w-12 h-12 rounded-xl flex items-center justify-center mb-3" style="background: #f3f4f6;">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="1.5">
          <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
        </svg>
      </div>
      <p class="text-sm font-medium text-gray-600">No order selected</p>
      <p class="text-xs text-gray-400 mt-1">The customer needs to pick a Pending order to start negotiating.</p>
    </div>

    <!-- Editable panel -->
    <div v-else class="flex-1 overflow-y-auto">
      <div class="px-4 py-3 border-b" style="border-color: #f3f4f6;">
        <div class="flex items-center gap-2 flex-wrap">
          <span class="text-xs px-2 py-0.5 rounded-full font-semibold" style="background: #fef3c7; color: #92400e;">{{ order.status }}</span>
          <span class="text-xs px-2 py-0.5 rounded-full font-semibold" style="background: #fee2e2; color: #991b1b;">{{ order.paymentStatus }}</span>
          <span v-if="order.negotiationStatus === 'in_progress'" class="text-xs px-2 py-0.5 rounded-full font-semibold" style="background: #dbeafe; color: #1e40af;">In Negotiation</span>
        </div>
        <p class="text-xs text-gray-500 mt-2">
          <strong>{{ order.customerName || 'Customer' }}</strong>
          <span v-if="order.customerEmail"> · {{ order.customerEmail }}</span>
        </p>
      </div>

      <div class="px-4 py-4 space-y-3">

        <!-- ── Cart orders: one row per item ─────────────────────── -->
        <div v-if="isMultiItem" class="space-y-2">
          <div
            v-for="(row, idx) in perItemForm"
            :key="idx"
            class="border rounded-lg p-2.5 space-y-2"
            style="border-color:#e5e7eb;"
          >
            <p class="text-[11px] font-semibold text-gray-700 truncate">
              {{ row.name }} <span class="text-gray-400">· {{ row.size }}</span>
            </p>
            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block text-[10px] font-semibold text-gray-500 mb-0.5">Quantity (pcs)</label>
                <input
                  v-model.number="row.quantity"
                  type="number" min="1" :disabled="saving"
                  class="w-full px-2 py-1.5 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style="border-color:#e5e7eb;"
                />
              </div>
              <div>
                <label class="block text-[10px] font-semibold text-gray-500 mb-0.5">Unit Price (₱/pc)</label>
                <input
                  v-model.number="row.unitPrice"
                  type="number" min="0" step="0.01" :disabled="saving"
                  class="w-full px-2 py-1.5 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style="border-color:#e5e7eb;"
                />
              </div>
            </div>
            <p class="text-[10px] text-gray-400 text-right">
              Subtotal: ₱{{ formatNumber((row.unitPrice || 0) * (row.quantity || 0)) }}
            </p>
          </div>
        </div>

        <!-- ── Single-item orders: existing UX ──────────────────── -->
        <div v-else class="flex gap-4">
          <div>
            <label class="block text-xs font-semibold text-gray-600 mb-1">Quantity (pcs)</label>
            <input
              v-model.number="form.quantity"
              type="number" min="1" :disabled="saving"
              class="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              style="border-color: #e5e7eb;"
            />
          </div>
          <div v-if="!order.isProvided">
            <label class="block text-xs font-semibold text-gray-600 mb-1">Unit Price (₱/pc)</label>
            <input
              v-model.number="form.unitPrice"
              type="number" min="0" step="0.01" :disabled="saving"
              placeholder="Leave blank to use bulk tier"
              class="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              style="border-color: #e5e7eb;"
            />
          </div>
        </div>

        <div class="flex gap-4">
                  <!-- Design fee -->
        <div>
          <label class="block text-xs font-semibold text-gray-600 mb-1">Design Fee (₱)</label>
          <input
            v-model.number="form.designFee"
            type="number" min="0" :disabled="saving"
            class=" w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            style="border-color: #e5e7eb;"
          />
        </div>

        <!-- Delivery method -->
        <div>
          <label class="block text-xs font-semibold text-gray-600 mb-1">Delivery Method</label>
          <select v-model="form.deliveryMethod" :disabled="saving"
            class="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            style="border-color: #e5e7eb;">
            <option value="Pick-up">Pick-up</option>
            <option value="Delivery">Delivery</option>
          </select>
        </div>
        </div>

        <!-- Shipping fee -->
        <div v-if="form.deliveryMethod === 'Delivery'">
          <label class="block text-xs font-semibold text-gray-600 mb-1">Shipping Fee (₱)</label>
          <input
            v-model.number="form.shippingFee"
            type="number" min="0" :disabled="saving"
            class="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            style="border-color: #e5e7eb;"
          />
        </div>

        <!-- Notes -->
        <div>
          <label class="block text-xs font-semibold text-gray-600 mb-1">Notes (optional)</label>
          <textarea v-model="form.notes" rows="2" :disabled="saving"
            placeholder="e.g., adjusted for premium design"
            class="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            style="border-color: #e5e7eb;"></textarea>
        </div>


      </div>
    </div>

    <!-- Actions -->
    <div v-if="order" class="shrink-0 px-4 py-3 border-t space-y-2" style="border-color: #e5e7eb; background: #f9fafb;">
      
              <!-- Live total -->
        <div class="rounded-lg p-3 border" style="background: #f9fafb; border-color: #e5e7eb;">
          <div class="flex items-center justify-between text-xs text-gray-500">
            <span>Product subtotal</span>
            <span>₱{{ formatNumber(productSubtotal) }}</span>
          </div>
          <div class="flex items-center justify-between text-xs text-gray-500 mt-1">
            <span>Design fee</span>
            <span>₱{{ formatNumber(form.designFee || 0) }}</span>
          </div>
          <div class="flex items-center justify-between text-xs text-gray-500 mt-1">
            <span>Shipping</span>
            <span>₱{{ formatNumber(currentShippingFee) }}</span>
          </div>
          <div class="flex items-center justify-between mt-2 pt-2 border-t" style="border-color: #e5e7eb;">
            <span class="text-sm font-bold text-gray-900">New Total</span>
            <span class="text-base font-black text-blue-600">₱{{ formatNumber(newTotal) }}</span>
          </div>
          <p v-if="newTotal !== order.amount" class="text-[10px] text-amber-600 mt-1.5 italic">
            Current: ₱{{ formatNumber(order.amount) }} → New: ₱{{ formatNumber(newTotal) }}
          </p>
        </div>
      
      <button
        @click="handleSave"
        :disabled="saving || !hasChanges"
        class="w-full py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
        style="background: #2563eb; color: white;"
      >
        <svg v-if="saving" class="animate-spin" xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M20 6L9 17l-5-5"/>
        </svg>
        {{ saving ? 'Saving…' : hasChanges ? 'Save Changes' : 'No Changes' }}
      </button>

<button
        v-if="order.status === 'Pending' && order.paymentStatus === 'Unpaid'"
        @click="openPaymentModal"
        :disabled="saving || confirming || !!order.activePaymentRequestMessageId"
        class="w-full py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
        style="background: #16a34a; color: white;"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <rect x="2" y="5" width="20" height="14" rx="2"/>
          <line x1="2" y1="10" x2="22" y2="10"/>
        </svg>
        {{ order.activePaymentRequestMessageId ? 'Payment Request Sent' : 'Send Payment Details' }}
      </button>

    <div
        v-if="order.activePaymentRequestMessageId"
        class="w-full py-2 px-3 text-[11px] rounded-lg text-center"
        style="background: #fef3c7; color: #92400e;"
      >
        Awaiting customer payment proof…
      </div>

      <!-- <button
        @click="handleConfirmOrder"
        :disabled="confirming"
        class="w-full py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
        style="background: #16a34a; color: white;"
      >
        <svg v-if="confirming" class="animate-spin" xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        {{ confirming ? 'Confirming…' : 'Confirm Order' }}
      </button> -->
    </div>

      <!-- Payment Details Modal -->
  <Teleport to="body">
    <div
      v-if="showPaymentModal"
      class="fixed inset-0 z-[100] flex items-center justify-center p-4"
      @click.self="showPaymentModal = false"
    >
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <h3 class="text-lg font-bold text-gray-900 mb-4">Send Payment Details</h3>

        <div class="space-y-4">
          <!-- Method selector -->
          <div>
            <label class="block text-xs font-semibold text-gray-600 mb-2">Payment Method</label>
            <div class="grid grid-cols-2 gap-2">
              <button
                type="button"
                @click="selectedMethod = 'gcash'"
                class="py-2 rounded-lg text-sm font-semibold transition-colors"
                :class="selectedMethod === 'gcash' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
              >GCash</button>
              <button
                type="button"
                @click="selectedMethod = 'bank_transfer'"
                class="py-2 rounded-lg text-sm font-semibold transition-colors"
                :class="selectedMethod === 'bank_transfer' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
              >Bank Transfer</button>
            </div>
          </div>

          <!-- Account preview -->
          <div class="bg-gray-50 rounded-lg p-3 space-y-1.5 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-500">Account Name</span>
              <span class="font-semibold">{{ paymentOptions?.[selectedMethod]?.accountName || '—' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Account Number</span>
              <span class="font-mono font-semibold">{{ paymentOptions?.[selectedMethod]?.accountNumber || '—' }}</span>
            </div>
            <div v-if="selectedMethod === 'bank_transfer'" class="flex justify-between">
              <span class="text-gray-500">Bank</span>
              <span class="font-semibold">{{ paymentOptions?.bank_transfer?.bankName || '—' }}</span>
            </div>
          </div>

          <!-- Amount -->
          <div>
            <label class="block text-xs font-semibold text-gray-600 mb-1">Amount Due (₱)</label>
            <input
              v-model.number="amountDue"
              type="number"
              min="1"
              step="0.01"
              class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p class="text-[10px] text-gray-400 mt-1">
              Default: 50% of order total
              (₱{{ Math.round(((order?.amount || order?.totalAmount || 0) * 0.5)).toLocaleString() }})
            </p>
          </div>

          <!-- Notes -->
          <div>
            <label class="block text-xs font-semibold text-gray-600 mb-1">Notes (optional)</label>
            <textarea
              v-model="paymentNotes"
              rows="2"
              placeholder="e.g., Please send proof within 24 hours"
              class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
        </div>

        <div class="flex gap-3 mt-6">
          <button
            @click="showPaymentModal = false"
            :disabled="isSendingPayment"
            class="flex-1 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >Cancel</button>
          <button
            @click="submitPaymentRequest"
            :disabled="isSendingPayment"
            class="flex-1 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-50 flex items-center justify-center gap-1.5"
            style="background: #f59e0b;"
          >
            <svg v-if="isSendingPayment" class="animate-spin" xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            {{ isSendingPayment ? 'Sending…' : 'Send' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { adminOrderApi } from '@/api/api'
import { adminChatApi } from '@/api/api'

const showPaymentModal = ref(false)
const paymentOptions = ref(null)
const selectedMethod = ref('gcash')
const amountDue = ref(0)
const paymentNotes = ref('')
const isSendingPayment = ref(false)

const props = defineProps({
  order: { type: Object, default: null },
  conversationId: { type: String, default: null },
})

const emit = defineEmits(['updated', 'confirmed'])

const saving = ref(false)
const confirming = ref(false)


const form = ref({
  quantity: 0,
  unitPrice: null,   // used ONLY when the order has a single item
  designFee: 500,
  deliveryMethod: 'Pick-up',
  shippingFee: 0,
  notes: '',
})

// Multi-item orders expose a per-item editor. Single-item orders keep the
// existing "one unit price + one quantity" UX.
const isMultiItem = computed(() => {
  const items = props.order?.items
  return Array.isArray(items) && items.length > 1
})

// Per-item form state for cart orders. Each row is
//   { productId, size, quantity, unitPrice, estimatedTotal }
const perItemForm = ref([])

function seedPerItemFromOrder(o) {
  if (!Array.isArray(o?.items) || o.items.length === 0) return []
  return o.items.map((it) => {
    const qty = Number(it.quantity) || 0
    const total = Number(it.estimatedTotal) || 0
    const unit = qty > 0 ? Number((total / qty).toFixed(2)) : 0
    return {
      productId: it.productId,
      name: it.name,
      size: it.size,
      quantity: qty,
      unitPrice: unit,
      estimatedTotal: total,
    }
  })
}

// Load initial values whenever the order changes
watch(
  () => props.order,
  (o) => {
    if (!o) return

    // Single-item derivation (kept for backwards compatibility)
    let derivedUnitPrice = null
    if (!o.isProvided && o.items?.[0]?.estimatedTotal && o.items?.[0]?.quantity) {
      derivedUnitPrice = Number(
        (o.items[0].estimatedTotal / o.items[0].quantity).toFixed(2),
      )
    }

    form.value = {
      quantity: o.quantity || 0,
      unitPrice: derivedUnitPrice,
      designFee: o.designFee ?? 500,
      deliveryMethod: o.receivingMode || 'Pick-up',
      shippingFee: o.shippingFee || 0,
      notes: '',
    }
    perItemForm.value = seedPerItemFromOrder(o)
  },
  { immediate: true, deep: true },
)

// Auto-zero shipping when Pick-up
watch(
  () => form.value.deliveryMethod,
  (m) => { if (m === 'Pick-up') form.value.shippingFee = 0 }
)

const currentShippingFee = computed(() => {
  return form.value.deliveryMethod === 'Pick-up' ? 0 : form.value.shippingFee || 0
})

const productSubtotal = computed(() => {
  const o = props.order
  if (!o) return 0
  if (o.isProvided) return 0

  // Cart / multi-item: sum the per-item editors
  if (isMultiItem.value) {
    return perItemForm.value.reduce(
      (sum, row) => sum + Number(row.unitPrice || 0) * Number(row.quantity || 0),
      0,
    )
  }

  // Single-item: legacy path
  if (!form.value.unitPrice || !form.value.quantity) return 0
  return Number(form.value.unitPrice) * Number(form.value.quantity)
})

const newTotal = computed(() => {
  return (
    productSubtotal.value +
    Number(form.value.designFee || 0) +
    Number(currentShippingFee.value)
  )
})

const hasChanges = computed(() => {
  const o = props.order
  if (!o) return false

  const feeChanged = Number(form.value.designFee) !== Number(o.designFee ?? 500)
  const modeChanged = form.value.deliveryMethod !== (o.receivingMode || 'Pick-up')
  const shipChanged = Number(currentShippingFee.value) !== Number(o.shippingFee || 0)

  if (isMultiItem.value) {
    // Any per-row qty / unit-price drift
    const rowsChanged = perItemForm.value.some((row, i) => {
      const orig = o.items?.[i]
      if (!orig) return true
      const origQty = Number(orig.quantity) || 0
      const origUnit = origQty > 0
        ? Number((Number(orig.estimatedTotal || 0) / origQty).toFixed(2))
        : 0
      return (
        Number(row.quantity) !== origQty ||
        Number(row.unitPrice) !== origUnit
      )
    })
    return rowsChanged || feeChanged || modeChanged || shipChanged
  }

  // Single-item
  const initialUnitPrice = (!o.isProvided && o.items?.[0]?.estimatedTotal && o.items?.[0]?.quantity)
    ? Number((o.items[0].estimatedTotal / o.items[0].quantity).toFixed(2))
    : null
  return (
    Number(form.value.quantity) !== Number(o.quantity) ||
    Number(form.value.unitPrice ?? 0) !== Number(initialUnitPrice ?? 0) ||
    feeChanged || modeChanged || shipChanged
  )
})

function formatNumber(n) {
  if (!n && n !== 0) return '0'
  return Number(n).toLocaleString()
}

async function handleSave() {
  if (!props.order || saving.value || !hasChanges.value) return
  saving.value = true
  try {
    const updates = {
      designFee: Number(form.value.designFee),
      deliveryMethod: form.value.deliveryMethod,
      shippingFee: Number(currentShippingFee.value),
      notes: form.value.notes || '',
    }

    if (isMultiItem.value) {
      // Hand the backend a full items[] diff. The backend will match by
      // index (productId + size) and rewrite each item's estimatedTotal.
      updates.items = perItemForm.value.map((row) => ({
        productId: row.productId,
        size: row.size,
        quantity: Number(row.quantity),
        unitPrice: Number(row.unitPrice),
      }))
    } else {
      updates.quantity = Number(form.value.quantity)
      if (!props.order.isProvided && form.value.unitPrice) {
        updates.unitPrice = Number(form.value.unitPrice)
      }
    }

    const result = await adminOrderApi.negotiateOrder(props.order.orderId, updates)
if (result.success) {
  emit('updated', result.data)
  form.value.notes = ''
  window.dispatchEvent(new CustomEvent('show-toast', {
    detail: { type: 'success', message: 'Order updated' }
  }))
} else {
  window.dispatchEvent(new CustomEvent('show-toast', {
    detail: { type: 'error', message: result.message || 'Failed to update order' }
  }))
}
  } catch (e) {
    console.error('Negotiate error:', e)
    alert('Failed to update order')
  } finally {
    saving.value = false
  }
}

async function handleConfirmOrder() {
  if (!props.order || confirming.value) return
  confirming.value = true
  try {
    // Save pending changes first
    if (hasChanges.value) {
      await handleSave()
    }
    const result = await adminOrderApi.updateOrderStatus(props.order.orderId, {
      status: 'Confirmed',
      notes: 'Order confirmed after negotiation',
    })
    if (result.success) {
      emit('confirmed', result.data)
    } else {
      alert(result.message || 'Failed to confirm order')
    }
  } catch (e) {
    console.error('Confirm error:', e)
    alert('Failed to confirm order')
  } finally {
    confirming.value = false
  }
}

async function openPaymentModal() {
  if (!props.order) return
  try {
    const res = await adminChatApi.getPaymentOptions()
    if (res.success && res.data) {
      paymentOptions.value = res.data
      // Default amount = 50% of order total
      const total = props.order.amount || props.order.totalAmount || 0
      amountDue.value = Math.round(total * 0.5)
      selectedMethod.value = 'gcash'
      paymentNotes.value = ''
      showPaymentModal.value = true
    } else {
      alert('Failed to load payment options')
    }
  } catch (e) {
    console.error('openPaymentModal error:', e)
    alert('Failed to load payment options')
  }
}

async function submitPaymentRequest() {
  if (!props.order || !props.conversationId) return
  if (!amountDue.value || amountDue.value <= 0) {
    alert('Amount must be greater than 0')
    return
  }
  isSendingPayment.value = true
  try {
    const res = await adminChatApi.sendPaymentRequest(props.conversationId, {
      orderId: props.order.orderId,
      method: selectedMethod.value,
      amountDue: amountDue.value,
      notes: paymentNotes.value,
    })
    if (res.success) {
      showPaymentModal.value = false
      window.dispatchEvent(new CustomEvent('show-toast', {
        detail: { type: 'success', message: 'Payment details sent to customer' }
      }))
      emit('updated', { ...props.order, activePaymentRequestMessageId: res.data.messageId })
    } else {
      alert(res.message || 'Failed to send payment request')
    }
  } catch (e) {
    console.error('submitPaymentRequest error:', e)
    alert('Failed to send payment request')
  } finally {
    isSendingPayment.value = false
  }
}
</script>