<template>
  <div ref="receiptRef" class="receipt-container">
    <!-- ═══════════════════════════════════════════════════════════════
         HEADER — Logo + Company (left) | DELIVERY RECEIPT + DR No (right)
         ═══════════════════════════════════════════════════════════════ -->
    <div class="receipt-header">
      <div class="receipt-header-left">
        <img src="@/assets/logo/ACAPS_LOGO_AND_TEXT.png" alt="ACAPS Logo" class="receipt-logo" />
        <div class="receipt-company-info">
          <p class="receipt-address">5051 QUE Grande Ext. Valenzuela, 1440 Manila, Philippines</p>
          <p class="receipt-address"><strong>CONSTANTINO A. ANECITO</strong> - Proprietor VAT Reg. TIN: 102-484-998-00000</p>
        </div>
      </div>
      <div class="receipt-header-right">
        <p class="receipt-title">DELIVERY RECEIPT</p>
        <p class="receipt-dr-number">DR No.: <span class="font-weight-600">{{ formattedData.drNumber }}</span></p>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════
         TOP INFO — Customer (left) | Order metadata (right)
         ═══════════════════════════════════════════════════════════════ -->
    <div class="receipt-info-grid">
      <div class="receipt-info-col">
        <p class="receipt-info-line">
          <span class="receipt-info-label">Customer Name:</span>
          <span class="receipt-info-value">{{ formattedData.customerName }}</span>
        </p>
        <p class="receipt-info-line">
          <span class="receipt-info-label">Address:</span>
          <span class="receipt-info-value">{{ formattedData.address }}</span>
        </p>
        <p class="receipt-info-line">
          <span class="receipt-info-label">Contact No.:</span>
          <span class="receipt-info-value">{{ formattedData.contactNo }}</span>
        </p>
      </div>
      <div class="receipt-info-col">
        <p class="receipt-info-line">
          <span class="receipt-info-label">Date:</span>
          <span class="receipt-info-value">{{ formattedData.date }}</span>
        </p>
        <p class="receipt-info-line">
          <span class="receipt-info-label">Delivery Date:</span>
          <span class="receipt-info-value">{{ formattedData.deliveryDate }}</span>
        </p>
        <p class="receipt-info-line">
          <span class="receipt-info-label">Terms:</span>
          <span class="receipt-info-value">{{ formattedData.terms }}</span>
        </p>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════
         ITEMS TABLE — full width
         ═══════════════════════════════════════════════════════════════ -->
    <table class="receipt-table">
      <thead class="receipt-table-header">
        <tr>
          <th class="receipt-table-th no-col">No.</th>
          <th class="receipt-table-th desc-col">Description</th>
          <th class="receipt-table-th qty-col">Quantity</th>
          <th class="receipt-table-th unit-col">Unit</th>
          <th class="receipt-table-th remarks-col">Remarks</th>
        </tr>
      </thead>
      <tbody class="receipt-table-body">
        <tr v-for="(item, idx) in formattedData.items" :key="idx" class="receipt-table-row">
          <td class="receipt-table-td no-col">{{ idx + 1 }}</td>
          <td class="receipt-table-td desc-col">{{ item.description }}</td>
          <td class="receipt-table-td qty-col">{{ (item.quantity || 0).toLocaleString() }}</td>
          <td class="receipt-table-td unit-col">₱{{ (item.unitPrice || 0).toFixed(2) }}</td>
          <td class="receipt-table-td remarks-col">{{ item.remarks || '' }}</td>
        </tr>
        <tr v-for="i in Math.max(0, 6 - formattedData.items.length)" :key="`empty-${i}`" class="receipt-table-row receipt-empty-row">
          <td class="receipt-table-td no-col">&nbsp;</td>
          <td class="receipt-table-td desc-col">&nbsp;</td>
          <td class="receipt-table-td qty-col">&nbsp;</td>
          <td class="receipt-table-td unit-col">&nbsp;</td>
          <td class="receipt-table-td remarks-col">&nbsp;</td>
        </tr>
      </tbody>
    </table>

    <!-- ═══════════════════════════════════════════════════════════════
         BOTTOM GRID — Order summary (left) | Payment breakdown (right)
         ═══════════════════════════════════════════════════════════════ -->
    <div class="receipt-bottom-grid">

      <!-- ── LEFT: Order Summary ── -->
      <div class="receipt-bottom-left">
        <p class="receipt-section-title">Order Summary</p>

        <div class="receipt-summary-row">
          <span class="receipt-summary-label">Type</span>
          <span class="receipt-summary-value">{{ formattedData.orderType }}</span>
        </div>
        <div class="receipt-summary-row">
          <span class="receipt-summary-label">Receiving Mode</span>
          <span class="receipt-summary-value">{{ formattedData.receivingMode }}</span>
        </div>
        <div v-if="formattedData.productionSchedule" class="receipt-summary-row">
          <span class="receipt-summary-label">Production</span>
          <span class="receipt-summary-value">{{ formattedData.productionSchedule }}</span>
        </div>
        <div v-if="formattedData.driverName" class="receipt-summary-row">
          <span class="receipt-summary-label">Driver</span>
          <span class="receipt-summary-value">{{ formattedData.driverName }}</span>
        </div>
        <div v-if="formattedData.driverPlate" class="receipt-summary-row">
          <span class="receipt-summary-label">Vehicle</span>
          <span class="receipt-summary-value">{{ formattedData.driverPlate }}</span>
        </div>
        <div v-if="formattedData.totalQuantity" class="receipt-summary-row">
          <span class="receipt-summary-label">Total Quantity</span>
          <span class="receipt-summary-value">{{ formattedData.totalQuantity }}</span>
        </div>

        <!-- Notes -->
        <div v-if="formattedData.notes" class="receipt-notes">
          <p class="receipt-notes-label">Notes</p>
          <p class="receipt-notes-text">{{ formattedData.notes }}</p>
        </div>
      </div>

      <!-- ── RIGHT: Payment Breakdown ── -->
      <div class="receipt-bottom-right">
        <p class="receipt-section-title">Payment Breakdown</p>

        <div v-if="itemsSubtotal > 0" class="receipt-breakdown-row">
          <span>Subtotal</span>
          <span>{{ formatPeso(itemsSubtotal) }}</span>
        </div>

        <div v-if="showDesignFee" class="receipt-breakdown-row">
          <span>Design Fee</span>
          <span>{{ formatPeso(designFee) }}</span>
        </div>

        <div v-if="showShippingFee" class="receipt-breakdown-row">
          <span>Shipping Fee</span>
          <span>{{ formatPeso(shippingFee) }}</span>
        </div>

        <div class="receipt-breakdown-total">
          <span class="font-weight-bold">Total</span>
          <span class="font-weight-bold">{{ formatPeso(calculatedTotal) }}</span>
        </div>

        <div v-if="showPaidRow" class="receipt-breakdown-row receipt-breakdown-row--paid">
          <span>Amount Paid</span>
          <span>{{ formatPeso(totalPaid) }}</span>
        </div>

        <div v-if="showBalanceDue" class="receipt-breakdown-balance">
          <span class="font-weight-bold">Balance Due</span>
          <span class="font-weight-bold">{{ formatPeso(remainingBalance) }}</span>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════
         SIGNATURES — two columns
         ═══════════════════════════════════════════════════════════════ -->
    <div class="receipt-signature-section">
      <div class="receipt-signature-box">
        <p class="receipt-signature-title">Received by:</p>
        <div class="receipt-signature-line"></div>
        <p class="receipt-signature-name">Name: {{ formattedData.receivedByName || '_________________________' }}</p>
        <p class="receipt-signature-date">Date: {{ formattedData.receivedDate }}</p>
      </div>
      <div class="receipt-signature-box">
        <p class="receipt-signature-title">Delivered by:</p>
        <div class="receipt-signature-line"></div>
        <p class="receipt-signature-name">Name: {{ formattedData.deliveredByName || '_________________________' }}</p>
        <p class="receipt-signature-date">Date: {{ formattedData.deliveredDate }}</p>
      </div>
    </div>

    <!-- FOOTER -->
    <div class="receipt-footer">
      <p class="receipt-footer-text">Thank you for doing business with ACAPS TRADING!</p>
    </div>

    <!-- ACTION BUTTONS -->
    <div class="receipt-actions no-print">
      <button @click="downloadPDF" class="receipt-btn receipt-btn-primary">
        <Printer style="width: 16px; height: 16px;" /> Download PDF
      </button>
      <button @click="$emit('close')" class="receipt-btn receipt-btn-secondary">
        Close
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { Printer } from 'lucide-vue-next'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const props = defineProps({
  order: { type: Object, required: true }
})

const emit = defineEmits(['close', 'print'])

const receiptRef = ref(null)

// ─── Formatted Data ─────────────────────────────────────────────────
const formattedData = computed(() => {
  const order = props.order

  let items = []
  if (order.items && order.items.length > 0) {
    items = order.items.map(item => ({
      description: `${item.name} (${item.size || 'N/A'})`,
      quantity: item.quantity || 0,
      unitPrice: item.unitPrice || (item.estimatedTotal / (item.quantity || 1)) || 0,
      remarks: item.remarks || ''
    }))
  } else {
    items = [{
      description: order.product || 'Custom Order',
      quantity: order.qty || 0,
      unitPrice: order.rawAmount / (order.qty || 1) || 0,
      remarks: ''
    }]
  }

  const formatDate = (dateValue) => {
    if (!dateValue) return ''
    try {
      const date = new Date(dateValue)
      if (isNaN(date.getTime())) return ''
      return date.toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })
    } catch { return '' }
  }

  const formatDateTime = (dateValue) => {
    if (!dateValue) return ''
    try {
      const d = new Date(dateValue)
      if (isNaN(d.getTime())) return ''
      return d.toLocaleString('en-PH', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    } catch { return '' }
  }

  const getDriverName = (o) => {
    if (o.statusHistory && Array.isArray(o.statusHistory)) {
      const outForDelivery = [...o.statusHistory].reverse().find(h => h.status === 'Out for Delivery' && h.driverDetails?.driverName)
      if (outForDelivery?.driverDetails?.driverName) return outForDelivery.driverDetails.driverName
    }
    if (o.driverDetails?.driverName) return o.driverDetails.driverName
    return ''
  }

  const getDriverPlate = (o) => {
    if (o.driverDetails?.plateNumber) return o.driverDetails.plateNumber
    if (o.statusHistory && Array.isArray(o.statusHistory)) {
      const h = [...o.statusHistory].reverse().find(x => x.driverDetails?.plateNumber)
      if (h?.driverDetails?.plateNumber) return h.driverDetails.plateNumber
    }
    return ''
  }

  const driverName = getDriverName(order)
  const driverPlate = getDriverPlate(order)
  const today = new Date()
  const todayStr = formatDate(today)

  // Total quantity across all items
  const totalQty = items.reduce((sum, i) => sum + (i.quantity || 0), 0)

  // Order type label
  const orderType = order.isProvided ? 'Customer Provided Items' : 'Company Product'

  return {
    drNumber: order.orderId || order.id || '',
    customerName: order.customer || order.customerName || '',
    address: order.address || order.deliveryAddress || '',
    contactNo: order.phone || order.customerPhone || '',
    date: formatDate(order.orderedAt || order.date) || todayStr,
    deliveryDate: formatDate(order.expectedDelivery || order.date) || todayStr,
    terms: order.paymentStatus || order.payment || 'COD',
    items,
    receivedByName: '',
    receivedDate: todayStr,
    deliveredByName: driverName || '',
    deliveredDate: todayStr,
    // New summary fields
    orderType,
    receivingMode: order.receivingMode || order.deliveryMethod || 'Pick-up',
    productionSchedule: order.productionSchedule ? formatDateTime(order.productionSchedule) : '',
    driverName,
    driverPlate,
    totalQuantity: totalQty > 0 ? `${totalQty.toLocaleString()} pcs` : '',
    notes: order.notes || '',
  }
})

// ─── Fees & totals ──────────────────────────────────────────────────
const designFee = computed(() => Number(props.order?.designFee) || 0)
const shippingFee = computed(() => Number(props.order?.shippingFee) || 0)

const showDesignFee = computed(() =>
  designFee.value > 0 && (props.order?.hasDesign || props.order?.isProvided)
)

const showShippingFee = computed(() =>
  shippingFee.value > 0 &&
  (props.order?.receivingMode === 'Delivery' || props.order?.deliveryMethod === 'Delivery')
)

function formatPeso(value) {
  const n = Number(value) || 0
  return `₱${n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

const itemsSubtotal = computed(() =>
  formattedData.value.items.reduce((sum, item) => sum + (item.quantity || 0) * (item.unitPrice || 0), 0)
)

const calculatedTotal = computed(() => {
  const storedTotal = Number(props.order?.amount ?? props.order?.totalAmount)
  if (Number.isFinite(storedTotal) && storedTotal > 0) return storedTotal
  return itemsSubtotal.value + designFee.value + shippingFee.value
})

const totalPaid = computed(() => {
  if (!Array.isArray(props.order?.partialPayments)) return 0
  return props.order.partialPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0)
})

const remainingBalance = computed(() => Math.max(0, calculatedTotal.value - totalPaid.value))

const showBalanceDue = computed(() => remainingBalance.value > 0)
const showPaidRow = computed(() => totalPaid.value > 0)

// ─── Download PDF (unchanged) ───────────────────────────────────────
async function downloadPDF() {
  try {
    const downloadBtn = document.querySelector('.receipt-btn-primary')
    if (downloadBtn) {
      downloadBtn.disabled = true
      downloadBtn.textContent = 'Generating...'
    }

    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 500))

    const element = receiptRef.value
    if (!element) { alert('Receipt element not found'); return }

    const clone = element.cloneNode(true)
    const buttons = clone.querySelector('.receipt-actions')
    if (buttons) buttons.remove()

    const allElements = clone.querySelectorAll('*')
    allElements.forEach(el => {
      el.style.color = '#000000'
      el.style.background = '#ffffff'
      el.style.backgroundColor = '#ffffff'
      el.style.borderColor = '#000000'
    })

    const styleTags = clone.querySelectorAll('style')
    styleTags.forEach(tag => {
      if (tag.innerHTML && tag.innerHTML.includes('oklch')) {
        tag.innerHTML = tag.innerHTML.replace(/oklch\([^)]*\)/g, '#000000')
      }
    })

    const container = document.createElement('div')
    container.style.position = 'fixed'
    container.style.left = '-9999px'
    container.style.top = '0'
    container.style.width = '800px'
    container.style.background = 'white'
    container.style.padding = '20px'
    container.style.zIndex = '9999'
    container.appendChild(clone)
    document.body.appendChild(container)

    await new Promise(resolve => setTimeout(resolve, 300))

    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: 800,
      height: container.scrollHeight,
      windowWidth: 800,
      windowHeight: container.scrollHeight,
      onclone: (doc) => {
        const elements = doc.querySelectorAll('*')
        elements.forEach(el => {
          try {
            el.style.color = '#000000'
            el.style.background = '#ffffff'
            el.style.backgroundColor = '#ffffff'
            el.style.borderColor = '#000000'
          } catch (e) {}
        })
        const styleTags = doc.querySelectorAll('style')
        styleTags.forEach(tag => {
          if (tag.innerHTML && tag.innerHTML.includes('oklch')) {
            tag.innerHTML = tag.innerHTML.replace(/oklch\([^)]*\)/g, '#000000')
          }
        })
      }
    })

    document.body.removeChild(container)

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pdfWidth = 210
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)

    const filename = `receipt-${formattedData.value.drNumber || 'order'}.pdf`
    pdf.save(filename)

    emit('print', { data: formattedData.value, pdf })

    if (downloadBtn) {
      downloadBtn.disabled = false
      downloadBtn.textContent = 'Download PDF'
    }
  } catch (error) {
    console.error('Error generating receipt:', error)
    alert('Failed to generate receipt. Please try again.')
    const downloadBtn = document.querySelector('.receipt-btn-primary')
    if (downloadBtn) {
      downloadBtn.disabled = false
      downloadBtn.textContent = 'Download PDF'
    }
  }
}
</script>

<style scoped>
/* ─── Base ─── */
.receipt-container {
  font-family: 'Courier New', monospace;
  background: white;
  color: black;
  padding: 40px;
  max-width: 800px;
  margin: 0 auto;
  box-sizing: border-box;
}

/* ─── Header ─── */
.receipt-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  border-bottom: 2px solid #000;
  padding-bottom: 16px;
  margin-bottom: 16px;
}

.receipt-header-left {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  flex: 1;
}

.receipt-logo {
  width: 280px;
  height: 100px;
  object-fit: contain;
}

.receipt-company-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.receipt-address {
  color: #4b5563;
  font-size: 11px;
  margin: 0;
  line-height: 1.3;
}

.receipt-header-right {
  display: flex;
  flex-direction: column;
  gap: 2px;
  align-items: flex-end;
}

.receipt-title {
  color: #111827;
  font-size: 20px;
  font-weight: 700;
  margin: 0;
}

.receipt-dr-number {
  color: #4b5563;
  font-size: 12px;
  margin: 0;
}

/* ─── Info Grid (customer + metadata) ─── */
.receipt-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 16px;
}

.receipt-info-col {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.receipt-info-line {
  display: flex;
  gap: 6px;
  font-size: 13px;
  margin: 0;
  line-height: 1.4;
}

.receipt-info-label {
  font-weight: 700;
  flex-shrink: 0;
}

.receipt-info-value {
  flex: 1;
  word-break: break-word;
}

/* ─── Items Table ─── */
.receipt-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  margin-bottom: 20px;
  table-layout: fixed;
}

.receipt-table-header tr {
  border-top: 2px solid #000;
  border-bottom: 2px solid #000;
}

.receipt-table-th {
  padding: 8px 4px;
  text-align: left;
  font-weight: 700;
  font-size: 12px;
  word-wrap: break-word;
}

.no-col { width: 48px; }
.desc-col { flex: 1; }
.qty-col { width: 80px; text-align: right; }
.unit-col { width: 96px; text-align: right; }
.remarks-col { width: 112px; text-align: right; }

.receipt-table-row {
  border-bottom: 1px solid #d1d5db;
}
.receipt-table-row:last-child { border-bottom: none; }
.receipt-empty-row { height: 24px; }

.receipt-table-td {
  padding: 8px 4px;
  word-wrap: break-word;
  overflow-wrap: break-word;
}
.receipt-table-td.qty-col,
.receipt-table-td.unit-col,
.receipt-table-td.remarks-col {
  text-align: right;
}

/* ─── Bottom Grid ─── */
.receipt-bottom-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  margin-bottom: 20px;
  padding-top: 16px;
  border-top: 1px solid #d1d5db;
}

.receipt-bottom-left,
.receipt-bottom-right {
  min-width: 0;
}

.receipt-section-title {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #111827;
  margin: 0 0 8px 0;
  padding-bottom: 4px;
  border-bottom: 1px dashed #d1d5db;
}

/* Order summary rows (left column) */
.receipt-summary-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 3px 0;
  font-size: 12px;
  gap: 8px;
}

.receipt-summary-label {
  color: #6b7280;
  flex-shrink: 0;
}

.receipt-summary-value {
  text-align: right;
  font-weight: 600;
  word-break: break-word;
}

.receipt-notes {
  margin-top: 8px;
  padding: 6px 8px;
  background: #f9fafb;
  border-left: 3px solid #d1d5db;
  font-size: 11px;
}

.receipt-notes-label {
  font-weight: 700;
  margin: 0 0 2px 0;
  color: #374151;
}

.receipt-notes-text {
  margin: 0;
  color: #4b5563;
  line-height: 1.4;
}

/* Payment breakdown (right column) */
.receipt-breakdown-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 3px 0;
  font-size: 13px;
  color: #111827;
}

.receipt-breakdown-total {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 8px 0 4px;
  margin-top: 4px;
  border-top: 2px solid #000;
  font-size: 14px;
}

.receipt-breakdown-row--paid {
  color: #15803d;
  padding-top: 4px;
}

.receipt-breakdown-balance {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 6px 0 0;
  margin-top: 4px;
  border-top: 1px dashed #9ca3af;
  color: #b45309;
  font-size: 14px;
}

/* ─── Signatures ─── */
.receipt-signature-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 2px solid #000;
}

.receipt-signature-box {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.receipt-signature-title {
  font-size: 13px;
  font-weight: 700;
  margin: 0;
}

.receipt-signature-line {
  height: 28px;
  border-bottom: 1px solid #000;
  width: 100%;
}

.receipt-signature-name,
.receipt-signature-date {
  font-size: 11px;
  margin: 2px 0;
}

/* ─── Footer ─── */
.receipt-footer {
  text-align: center;
  margin-top: 20px;
  padding-top: 12px;
  border-top: 2px solid #000;
}

.receipt-footer-text {
  font-size: 13px;
  font-weight: 700;
  margin: 0;
}

/* ─── Buttons ─── */
.receipt-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
}

.receipt-btn {
  padding: 8px 24px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
}

.receipt-btn-primary { background-color: #2563eb; color: white; }
.receipt-btn-primary:hover { background-color: #1d4ed8; }
.receipt-btn-primary:disabled { background-color: #9ca3af; cursor: not-allowed; }

.receipt-btn-secondary {
  border: 1px solid #d1d5db;
  color: #374151;
  background: transparent;
}
.receipt-btn-secondary:hover { background-color: #f3f4f6; }

/* ─── Print ─── */
@media print {
  .no-print { display: none !important; }

  @page { size: A4; margin: 0; padding: 0; }

  .receipt-container {
    max-width: 100%;
    width: 100%;
    padding: 0.5in;
    margin: 0;
    background: white;
    color: black;
    border: none;
    page-break-inside: avoid;
  }

  .receipt-container,
  .receipt-container * {
    background: white !important;
    color: black !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .receipt-header,
  .receipt-table,
  .receipt-table-row,
  .receipt-info-grid,
  .receipt-bottom-grid,
  .receipt-breakdown-total,
  .receipt-breakdown-balance,
  .receipt-signature-section,
  .receipt-footer {
    page-break-inside: avoid;
  }

  .receipt-notes {
    border-left-color: #000 !important;
  }

  * { box-shadow: none !important; }
}

/* ─── Responsive ─── */
@media (max-width: 768px) {
  .receipt-container { padding: 20px; }

  .receipt-header {
    flex-direction: column;
    gap: 16px;
  }

  .receipt-header-right { align-items: flex-start; }

  .receipt-info-grid,
  .receipt-bottom-grid,
  .receipt-signature-section {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .receipt-logo {
    width: 200px;
    height: 60px;
  }
}
</style>