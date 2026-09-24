// utils/orderHelpers.js
// Shared, framework-agnostic formatting & transformation helpers for orders.
// Extracted so OrdersPage / OrdersTable / OrderDetailModal all format things
// (currency, dates, order shape) exactly the same way instead of each
// re-implementing their own slightly-different version.

/**
 * Format a number as Philippine Peso currency, e.g. 1234 -> "₱1,234"
 * @param {number} amount
 * @returns {string}
 */
export function formatCurrency(amount) {
  const value = Number(amount) || 0
  return `₱${value.toLocaleString('en-PH')}`
}

/**
 * Format a date (Date, ISO string, or timestamp) as "Jan 5, 2026".
 * Returns a fallback string if the date is missing/invalid.
 * @param {Date|string|number|null|undefined} date
 * @param {string} fallback
 * @returns {string}
 */
export function formatDate(date, fallback = 'N/A') {
  if (!date) return fallback
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return fallback
  return d.toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })
}

/**
 * Format a date + time, e.g. "Jan 5, 2026, 3:45 PM"
 */
export function formatDateTime(date, fallback = 'N/A') {
  if (!date) return fallback
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return fallback
  return d.toLocaleString('en-PH', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit',
  })
}

/**
 * Debounce helper. Returns a wrapped function that only fires `delay` ms
 * after the last call. Used for search inputs so we don't re-filter/re-fetch
 * on every keystroke.
 * @param {Function} fn
 * @param {number} delay
 */
export function debounce(fn, delay = 300) {
  let timer = null
  const debounced = (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
  debounced.cancel = () => clearTimeout(timer)
  return debounced
}

/**
 * Transform a raw backend order document into the flat shape the admin UI
 * components consume. Centralized here so OrdersPage and any other screen
 * (e.g. a future orders export/report) map fields identically.
 *
 * IMPORTANT: `status` on the returned object is the *display* status
 * (e.g. "Ready to Pick-up"), not necessarily what's stored in the DB.
 * Use `rawStatus` when you need the true backend status (for API calls).
 *
 * @param {object} order - raw order document from the API
 * @param {(order: object) => string} getDisplayStatus - injected to avoid a
 *        circular import with useOrderStatus.js
 */
export function transformOrder(order, getDisplayStatus) {
  const rawStatus = order.status || 'Pending'
  const displayStatus = getDisplayStatus ? getDisplayStatus(order) : rawStatus
  console.log('Design Fee', order.designFee)
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
    product: order.productName || order.items?.[0]?.name || 'Custom Order',
    size: order.size || order.items?.[0]?.size || 'N/A',
    qty: order.quantity || order.items?.[0]?.quantity || 0,
    amount: formatCurrency(order.amount),
    rawAmount: order.amount || 0,

    // Status
    status: displayStatus,
    rawStatus,
    paymentStatus: order.paymentStatus,
    hasDesign: order.hasDesign || false,
    // Delivery
    deliveryMethod: order.receivingMode || order.deliveryMethod || order.fulfillment?.method || 'Pick-up',
    deliveryAddress: order.fulfillment?.deliveryAddress || order.address || '',
    supplyType: order.isProvided ? 'Own Cups' : 'Company Cups',
    expectedDelivery: formatDate(order.expectedDelivery),
    receivingMode: order.receivingMode, // keep original for status logic
    proofOfDelivery: order.proofOfDelivery || null,
    // Driver
    driverDetails: order.driverDetails || null,

    // OwnCups fields
    dropOffStatus: order.dropOffStatus,
    dropOffStatusDate: order.fromCustomerToCompanyDeliveryDate,

    // ✅ NEW — Photos of the customer's own item (own-cups orders).
    // Stored as an array of Cloudinary URLs. Falls back to the
    // per-item array if the top-level snapshot is empty (older orders
    // saved before the top-level mirror was added).
    itemPhotos: (() => {
      if (Array.isArray(order.itemPhotos) && order.itemPhotos.length > 0) {
        return order.itemPhotos.filter((u) => typeof u === 'string' && u.trim())
      }
      const perItem = (order.items || [])
        .flatMap((it) => (Array.isArray(it.itemPhotos) ? it.itemPhotos : []))
        .filter((u) => typeof u === 'string' && u.trim())
      return perItem
    })(),

     // ── Fees & totals (needed by Receipt + Detail modal) ──
  designFee: Number(order.designFee) || 0,
  shippingFee: Number(order.shippingFee) || 0,
  subtotal: (order.items || []).reduce(
    (sum, it) => sum + (Number(it.estimatedTotal) || 0),
    0
  ),

    // Dates
    date: formatDate(order.orderedAt),
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
    productionSchedule: order.productionSchedule || null,

    // ✅ NEW — Delay tracking
    delayHistory: Array.isArray(order.delayHistory) ? order.delayHistory : [],
    isCurrentlyDelayed: (() => {
      const h = order.delayHistory || []
      const last = h[h.length - 1]
      return !!(last && last.isDelayed)
    })(),
    currentDelay: (() => {
      const h = order.delayHistory || []
      const last = h[h.length - 1]
      return last && last.isDelayed ? last : null
    })(),
  }
}