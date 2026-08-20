<!-- components/DeliveryReceipt.vue -->
<template>
  <div ref="receiptRef" class="receipt-container">
    <!-- Header with Logo -->
    <div class="receipt-header">
      <div class="receipt-header-left">
        <img src="@/assets/logo/ACAPS_LOGO_AND_TEXT.png" alt="ACAPS Logo" class="receipt-logo" />
        <div class="receipt-company-info">
          <p class="receipt-address">5051 QUE Grande Ext. Valenzuela, 1440 Manila, Philippines</p>
          <p class="receipt-address"> <strong>CONSTANTINO A. ANECITO</strong> - Proprietor VAT Reg. TIN: 102-484-998-00000</p>
        </div>
      </div>
      <div class="receipt-header-right">
        <p class="receipt-title">DELIVERY RECEIPT</p>
        <p class="receipt-dr-number">DR No.: <span class="font-weight-600">{{ formattedData.drNumber }}</span></p>
      </div>
    </div>

    <!-- Customer Info -->
    <div class="receipt-customer-info">
      <div class="receipt-customer-left">
        <p class="receipt-customer-line"><span class="font-weight-bold">Customer Name:</span> {{ formattedData.customerName }}</p>
        <p class="receipt-customer-line"><span class="font-weight-bold">Address:</span> {{ formattedData.address }}</p>
        <p class="receipt-customer-line"><span class="font-weight-bold">Contact No.:</span> {{ formattedData.contactNo }}</p>
      </div>
      <div class="receipt-customer-right">
        <p class="receipt-customer-line"><span class="font-weight-bold">Date:</span> {{ formattedData.date }}</p>
        <p class="receipt-customer-line"><span class="font-weight-bold">Delivery Date:</span> {{ formattedData.deliveryDate }}</p>
        <p class="receipt-customer-line"><span class="font-weight-bold">Terms:</span> {{ formattedData.terms }}</p>
      </div>
    </div>

    <!-- Items Table -->
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
        <!-- Empty rows for spacing -->
        <tr v-for="i in Math.max(0, 6 - formattedData.items.length)" :key="`empty-${i}`" class="receipt-table-row receipt-empty-row">
          <td class="receipt-table-td no-col">&nbsp;</td>
          <td class="receipt-table-td desc-col">&nbsp;</td>
          <td class="receipt-table-td qty-col">&nbsp;</td>
          <td class="receipt-table-td unit-col">&nbsp;</td>
          <td class="receipt-table-td remarks-col">&nbsp;</td>
        </tr>
      </tbody>
    </table>

    <!-- Fees -->
    <div v-if="order.hasDesign" class="receipt-fee-row">
      <div class="receipt-fee-content">
        <span class="font-weight-bold">Design Fee:</span>
        <span>₱500.00</span>
      </div>
    </div>

    <div v-if="order.isProvided" class="receipt-fee-row">
      <div class="receipt-fee-content">
        <span class="font-weight-bold">Printing Service:</span>
        <span>₱500.00</span>
      </div>
    </div>

    <!-- Total -->
    <div class="receipt-total">
      <div class="receipt-total-content">
        <div class="receipt-total-line">
          <span class="font-weight-bold">Total:</span>
          <span class="font-weight-bold">₱{{ calculatedTotal.toLocaleString() }}</span>
        </div>
      </div>
    </div>

    <!-- Signature Section -->
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

    <!-- Footer -->
    <div class="receipt-footer">
      <p class="receipt-footer-text">Thank you for doing business with ACAPS TRADING!</p>
      <p class="receipt-footer-line">________________</p>
    </div>

    <!-- Action Buttons (hidden in print) -->
    <div class="receipt-actions no-print">
      <button 
        @click="downloadPDF" 
        class="receipt-btn receipt-btn-primary"
      >
        <Printer style="width: 16px; height: 16px;" /> Download PDF
      </button>
      <button 
        @click="$emit('close')"
        class="receipt-btn receipt-btn-secondary"
      >
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
  order: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'print'])

const receiptRef = ref(null)

// ─── Formatted Data (Read-only) ──────────────────────────────────────

const formattedData = computed(() => {
  const order = props.order
  
  // Format items
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

  // Format dates
  const formatDate = (dateValue) => {
    if (!dateValue) return ''
    try {
      const date = new Date(dateValue)
      if (isNaN(date.getTime())) return ''
      return date.toLocaleDateString('en-PH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch {
      return ''
    }
  }

  // Get driver name
  const getDriverName = (order) => {
    if (order.statusHistory && Array.isArray(order.statusHistory)) {
      const outForDelivery = [...order.statusHistory]
        .reverse()
        .find(h => h.status === 'Out for Delivery' && h.driverDetails?.driverName)
      
      if (outForDelivery?.driverDetails?.driverName) {
        return outForDelivery.driverDetails.driverName
      }
    }
    if (order.driverDetails?.driverName) {
      return order.driverDetails.driverName
    }
    return ''
  }

  const driverName = getDriverName(order)
  const today = new Date()
  const todayStr = formatDate(today)

  return {
    drNumber: order.orderId || order.id || '',
    customerName: order.customer || '',
    address: order.address || order.deliveryAddress || '',
    contactNo: order.phone || '',
    date: formatDate(order.orderedAt || order.date) || todayStr,
    deliveryDate: formatDate(order.expectedDelivery || order.date) || todayStr,
    terms: order.payment || 'COD',
    items: items,
    receivedBy: '',
    receivedByName: '',
    receivedDate: todayStr,
    deliveredBy: driverName || '',
    deliveredByName: driverName || '',
    deliveredDate: todayStr,
  }
})

// ─── Calculated Total ──────────────────────────────────────────────

const calculatedTotal = computed(() => {
  let total = formattedData.value.items.reduce((sum, item) => {
    return sum + ((item.quantity || 0) * (item.unitPrice || 0))
  }, 0)

  // Add design fee if order has design
  if (props.order.hasDesign) {
    total += 500
  }

  // Add printing service fee if own cups
  if (props.order.isProvided) {
    total += 500
  }

  return total
})

// ─── Download PDF Function ──────────────────────────────────────────

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
    
    if (!element) {
      alert('Receipt element not found')
      return
    }

    // ✅ FIX: Use a clone with all styles applied and override oklch colors
    const clone = element.cloneNode(true)
    
    // Remove action buttons from clone
    const buttons = clone.querySelector('.receipt-actions')
    if (buttons) {
      buttons.remove()
    }

    // ✅ Force all colors to safe values in the clone
    const allElements = clone.querySelectorAll('*')
    allElements.forEach(el => {
      // Override any oklch colors with safe values
      el.style.color = '#000000'
      el.style.background = '#ffffff'
      el.style.backgroundColor = '#ffffff'
      el.style.borderColor = '#000000'
      
      // Remove any oklch references
      if (el.style.background && el.style.background.includes('oklch')) {
        el.style.background = '#ffffff'
      }
      if (el.style.backgroundColor && el.style.backgroundColor.includes('oklch')) {
        el.style.backgroundColor = '#ffffff'
      }
      if (el.style.color && el.style.color.includes('oklch')) {
        el.style.color = '#000000'
      }
    })

    // Also fix any style tags
    const styleTags = clone.querySelectorAll('style')
    styleTags.forEach(tag => {
      if (tag.innerHTML && tag.innerHTML.includes('oklch')) {
        tag.innerHTML = tag.innerHTML.replace(/oklch\([^)]*\)/g, '#000000')
      }
    })

    // Create temporary container
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

    // ✅ Use html2canvas with safe settings
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
        // Force all elements to use safe colors in the cloned document
        const elements = doc.querySelectorAll('*')
        elements.forEach(el => {
          try {
            el.style.color = '#000000'
            el.style.background = '#ffffff'
            el.style.backgroundColor = '#ffffff'
            el.style.borderColor = '#000000'
            // Remove any oklch references
            if (el.style.background && el.style.background.includes('oklch')) {
              el.style.background = '#ffffff'
            }
            if (el.style.backgroundColor && el.style.backgroundColor.includes('oklch')) {
              el.style.backgroundColor = '#ffffff'
            }
            if (el.style.color && el.style.color.includes('oklch')) {
              el.style.color = '#000000'
            }
          } catch (e) {
            // Skip
          }
        })
        
        // Also fix style tags
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

    emit('print', { data: formattedData.value, pdf: pdf })

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
/* ─── Base Receipt Container ─── */
.receipt-container {
  font-family: 'Courier New', monospace;
  background: white;
  color: black;
  padding: 40px;
  max-width: 800px;
  margin: 0 auto;
  min-height: auto;
  box-sizing: border-box;
}

/* ─── Header Styles ─── */
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
  gap: 10px;
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

/* ─── Customer Info Styles ─── */
.receipt-customer-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
  font-size: 14px;
}

.receipt-customer-left,
.receipt-customer-right {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.receipt-customer-line {
  margin: 0;
  font-size: 14px;
  line-height: 1.4;
}

.font-weight-bold {
  font-weight: 700;
}

.font-weight-600 {
  font-weight: 600;
}

/* ─── Table Styles ─── */
.receipt-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  margin-bottom: 16px;
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
  font-size: 13px;
  word-wrap: break-word;
}

.no-col {
  width: 48px;
}

.desc-col {
  flex: 1;
}

.qty-col {
  width: 80px;
  text-align: right;
}

.unit-col {
  width: 96px;
  text-align: right;
}

.remarks-col {
  width: 112px;
  text-align: right;
}

.receipt-table-row {
  border-bottom: 1px solid #d1d5db;
}

.receipt-table-row:last-child {
  border-bottom: none;
}

.receipt-empty-row {
  height: 24px;
}

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

/* ─── Fee Styles ─── */
.receipt-fee-row {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 8px;
  font-size: 14px;
}

.receipt-fee-content {
  width: 192px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* ─── Total Styles ─── */
.receipt-total {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
}

.receipt-total-content {
  width: 192px;
}

.receipt-total-line {
  display: flex;
  justify-content: space-between;
  border-top: 2px solid #000;
  padding-top: 8px;
  font-weight: 700;
  font-size: 14px;
}

/* ─── Signature Section ─── */
.receipt-signature-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 2px solid #000;
}

.receipt-signature-box {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.receipt-signature-title {
  font-size: 14px;
  font-weight: 700;
  margin: 0;
}

.receipt-signature-line {
  height: 32px;
  border-bottom: 1px solid #000;
  width: 100%;
}

.receipt-signature-name,
.receipt-signature-date {
  font-size: 12px;
  margin: 4px 0;
}

/* ─── Footer ─── */
.receipt-footer {
  text-align: center;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 2px solid #000;
}

.receipt-footer-text {
  font-size: 14px;
  font-weight: 700;
  margin: 0 0 8px 0;
}

.receipt-footer-line {
  color: #6b7280;
  font-size: 12px;
  margin: 0;
}

/* ─── Action Buttons ─── */
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

.receipt-btn-primary {
  background-color: #2563eb;
  color: white;
}

.receipt-btn-primary:hover {
  background-color: #1d4ed8;
}

.receipt-btn-primary:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.receipt-btn-secondary {
  border: 1px solid #d1d5db;
  color: #374151;
  background: transparent;
}

.receipt-btn-secondary:hover {
  background-color: #f3f4f6;
}

/* ─── Print Media Styles ─── */
@media print {
  .no-print {
    display: none !important;
  }

  @page {
    size: A4;
    margin: 0;
    padding: 0;
  }

  .receipt-container {
    max-width: 100%;
    width: 100%;
    padding: 0.5in;
    margin: 0;
    background: white;
    color: black;
    border: none;
    page-break-after: avoid;
    page-break-inside: avoid;
  }

  .receipt-container,
  .receipt-container * {
    background: white !important;
    color: black !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .receipt-header {
    page-break-inside: avoid;
  }

  .receipt-logo {
    max-width: 100%;
    height: auto;
  }

  .receipt-table {
    page-break-inside: avoid;
    width: 100%;
  }

  .receipt-table-row {
    page-break-inside: avoid;
  }

  .receipt-customer-info,
  .receipt-fee-row,
  .receipt-total,
  .receipt-signature-section,
  .receipt-footer {
    page-break-inside: avoid;
  }

  .receipt-header,
  .receipt-table-header tr,
  .receipt-total-line,
  .receipt-signature-section,
  .receipt-footer {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  * {
    box-shadow: none !important;
  }
}

/* ─── Responsive Styles ─── */
@media (max-width: 768px) {
  .receipt-container {
    padding: 20px;
  }

  .receipt-header {
    flex-direction: column;
    gap: 16px;
  }

  .receipt-header-right {
    align-items: flex-start;
  }

  .receipt-customer-info {
    grid-template-columns: 1fr;
  }

  .receipt-signature-section {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .receipt-logo {
    width: 200px;
    height: 60px;
  }
}
</style>