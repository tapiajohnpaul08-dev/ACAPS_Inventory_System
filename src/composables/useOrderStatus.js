// composables/useOrderStatus.js
//
// Single source of truth for the "Out for Delivery" <-> "Ready to Pick-up"
// mapping and everything downstream of it (badge colors, icons, filtering,
// status flow, valid next-status transitions).
//
// WHY THIS EXISTS:
// The backend only ever stores the status "Out for Delivery" (there is no
// separate DB status for pickup orders). The admin UI wants to *display*
// "Ready to Pick-up" instead, whenever the order's receivingMode is
// "Pick-up". Previously this mapping logic (and its badge/filter
// consequences) was duplicated - and drifted out of sync - across
// OrdersPage.vue, OrderDetailModal.vue and OrdersTable.vue. Everything
// related to that mapping now lives here.

import { h } from 'vue'

// The status as it is actually persisted in MongoDB.
export const DB_STATUSES = [
  'Pending',
  'Confirmed',
  'Scheduled',
  'In Production',
  'Out for Delivery',
  'Completed',
  'Cancelled',
]

// The status a "Delivery" order will show in the UI is the same as DB_STATUSES.
// A "Pick-up" order additionally has this alias for "Out for Delivery".
const PICKUP_ALIAS = { 'Out for Delivery': 'Ready to Pick-up' }

/**
 * Given a raw order (must have `.status` and `.receivingMode`), return the
 * status that should be *displayed* to an admin.
 * @param {{status?: string, receivingMode?: string}} order
 * @returns {string}
 */
export function getDisplayStatus(order) {
  const status = order?.status || 'Pending'
  if (order?.receivingMode === 'Pick-up' && PICKUP_ALIAS[status]) {
    return PICKUP_ALIAS[status]
  }
  return status
}

/**
 * Reverse of getDisplayStatus: given a display status (possibly
 * "Ready to Pick-up"), return the value that should actually be sent to the
 * backend / stored in the DB.
 * @param {string} displayStatus
 * @returns {string}
 */
export function toDbStatus(displayStatus) {
  if (displayStatus === 'Ready to Pick-up') return 'Out for Delivery'
  return displayStatus
}

/**
 * Does a display status belong to the same underlying status "group" as a
 * given filter value? Used so the "Out for Delivery" filter/count also
 * picks up orders currently displayed as "Ready to Pick-up".
 * @param {string} displayStatus
 * @param {string} dbStatus - one of DB_STATUSES
 */
export function isStatusGroupMatch(displayStatus, dbStatus) {
  if (displayStatus === dbStatus) return true
  return toDbStatus(displayStatus) === dbStatus
}

/**
 * The ordered list of statuses an order moves through, worded correctly for
 * the order's receiving mode.
 * @param {string} receivingMode - 'Pick-up' | 'Delivery'
 */
export function getStatusFlow(receivingMode) {
  const flow = ['Pending', 'Confirmed', 'Scheduled', 'In Production', 'Out for Delivery', 'Completed']  // ← Add Confirmed here
  if (receivingMode === 'Pick-up') {
    return flow.map(s => PICKUP_ALIAS[s] || s)
  }
  return flow
}

/**
 * Given the order's current display status, what statuses can it legally
 * move to next? Cancelled is always allowed unless already
 * Completed/Cancelled. Mirrors the transition rules enforced server-side in
 * OrderService.updateOrderStatus so the UI never offers a transition the
 * backend will reject.
 * @param {string} currentDisplayStatus
 * @param {string} receivingMode
 */
export function getNextStatuses(currentDisplayStatus, receivingMode) {
  const flow = getStatusFlow(receivingMode)
  const idx = flow.indexOf(currentDisplayStatus)
  if (currentDisplayStatus === 'Completed' || currentDisplayStatus === 'Cancelled') {
    return []
  }
  const next = []
  if (idx !== -1 && idx + 1 < flow.length) next.push(flow[idx + 1])
  next.push('Cancelled')
  return next
}

// ─── Badge styling ──────────────────────────────────────────────────────
const STATUS_BADGE_CLASSES = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Confirmed: 'bg-green-100 text-green-700',
  Scheduled: 'bg-purple-100 text-purple-700',
  'In Production': 'bg-blue-100 text-blue-700',
  'Out for Delivery': 'bg-cyan-100 text-cyan-700',
  'Ready to Pick-up': 'bg-cyan-100 text-cyan-700',
  Completed: 'bg-green-100 text-green-700',
  Cancelled: 'bg-gray-100 text-gray-500',
}

/**
 * @param {string} displayStatus
 * @returns {string} tailwind classes for the status badge background/text
 */
export function getStatusBadgeClass(displayStatus) {
  return STATUS_BADGE_CLASSES[displayStatus] || 'bg-gray-100 text-gray-500'
}

// Payment badges are keyed case-insensitively since backend enum is
// Title Case ("Paid"/"Partial"/"Unpaid") but some older data / UI code used
// lowercase - normalize so the badge never silently falls through to gray.
const PAYMENT_BADGE_CLASSES = {
  paid: 'bg-green-100 text-green-700',
  partial: 'bg-orange-100 text-orange-700',
  unpaid: 'bg-red-100 text-red-700',
}

/**
 * @param {string} payment
 * @returns {string} tailwind classes for the payment badge
 */
export function getPaymentBadgeClass(payment) {
  return PAYMENT_BADGE_CLASSES[(payment || '').toLowerCase()] || 'bg-gray-100 text-gray-500'
}

// ─── Status icons (render functions, shared by OrdersTable / modal) ─────
const ICONS = {
  Completed: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' }, [
    h('path', { d: 'M21.801 10A10 10 0 1 1 17 3.335' }),
    h('path', { d: 'm9 11 3 3L22 4' }),
  ]),
  Confirmed: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' }, [
    h('path', { d: 'M20 6L9 17l-5-5' }),
  ]),
  'In Production': () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' }, [
    h('path', { d: 'M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z' }),
    h('path', { d: 'M12 22V12' }),
    h('polyline', { points: '3.29 7 12 12 20.71 7' }),
    h('path', { d: 'm7.5 4.27 9 5.15' }),
  ]),
  Scheduled: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' }, [
    h('path', { d: 'M8 2v4' }),
    h('path', { d: 'M16 2v4' }),
    h('rect', { width: '18', height: '18', x: '3', y: '4', rx: '2' }),
    h('path', { d: 'M3 10h18' }),
  ]),
  'Out for Delivery': () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' }, [
    h('path', { d: 'M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2' }),
    h('path', { d: 'M15 18H9' }),
    h('path', { d: 'M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14' }),
    h('circle', { cx: '17', cy: '18', r: '2' }),
    h('circle', { cx: '7', cy: '18', r: '2' }),
  ]),
  Pending: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' }, [
    h('circle', { cx: '12', cy: '12', r: '10' }),
    h('polyline', { points: '12 6 12 12 16 14' }),
  ]),
  Cancelled: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' }, [
    h('circle', { cx: '12', cy: '12', r: '10' }),
    h('path', { d: 'm15 9-6 6' }),
    h('path', { d: 'm9 9 6 6' }),
  ]),
}
// "Ready to Pick-up" uses the same glyph as "Out for Delivery" - it's the
// same underlying stage, just worded differently for pickup orders.
ICONS['Ready to Pick-up'] = ICONS['Out for Delivery']

/**
 * @param {string} displayStatus
 * @returns {(() => VNode)|null} render function, or null if no icon defined
 */
export function getStatusIcon(displayStatus) {
  return ICONS[displayStatus] || null
}

/**
 * Convenience composable wrapper - lets components do
 *   const { getDisplayStatus, getStatusBadgeClass } = useOrderStatus()
 * if they prefer destructuring a single import over many named imports.
 */
export function useOrderStatus() {
  return {
    DB_STATUSES,
    getDisplayStatus,
    toDbStatus,
    isStatusGroupMatch,
    getStatusFlow,
    getNextStatuses,
    getStatusBadgeClass,
    getPaymentBadgeClass,
    getStatusIcon,
  }
}