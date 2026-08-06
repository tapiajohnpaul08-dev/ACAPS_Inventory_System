// composables/useOrders.js
//
// Centralizes order CRUD, loading/error state, and toast messaging so
// OrdersPage.vue (and any future screen that needs the order list, like a
// dashboard widget) doesn't have to re-implement fetch/patch/delete +
// error handling + optimistic local updates every time.

import { ref, computed } from 'vue'
import { adminOrderApi } from '@/api/api'
import { transformOrder } from '@/utils/orderHelpers'
import { getDisplayStatus, toDbStatus } from '@/composables/useOrderStatus'

/**
 * @param {object} [options]
 * @param {number} [options.retries] - number of automatic retries for getAllOrders on network failure
 */
export function useOrders(options = {}) {
  const { retries = 1 } = options

  const allOrders = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  function transform(order) {
    return transformOrder(order, getDisplayStatus)
  }

  /**
   * Fetch all orders. Retries once on network-level failure (no response
   * from server) before giving up - handles the flaky-wifi/cold-start case
   * without the user having to manually hit refresh.
   */
  async function loadOrders() {
    isLoading.value = true
    error.value = null
    let attempt = 0

    while (attempt <= retries) {
      try {
        const response = await adminOrderApi.getAllOrders()
        if (response.success && response.data) {
          allOrders.value = response.data.map(transform)
          isLoading.value = false
          return { success: true }
        }
        error.value = response.message || 'Failed to load orders'
        isLoading.value = false
        return { success: false, message: error.value }
      } catch (e) {
        attempt++
        if (attempt > retries) {
          console.error('Error loading orders:', e)
          error.value = 'Unable to reach the server. Please check your connection.'
          isLoading.value = false
          return { success: false, message: error.value }
        }
        // brief backoff before retrying
        await new Promise(r => setTimeout(r, 500 * attempt))
      }
    }
  }

  function patchLocalOrder(orderId, updatedRawOrder) {
    const updated = transform(updatedRawOrder)
    const idx = allOrders.value.findIndex(o => o.id === orderId)
    if (idx !== -1) allOrders.value[idx] = updated
    return updated
  }

  function removeLocalOrder(orderId) {
    allOrders.value = allOrders.value.filter(o => o.id !== orderId)
  }

  /**
   * Update an order's status. Accepts a *display* status (e.g.
   * "Ready to Pick-up") and converts it to the DB status before sending -
   * callers never need to know about that mapping.
   */
  async function updateStatus(orderId, { status, notes, productionSchedule, driverId, driverDetails } = {}) {
    const dbStatus = toDbStatus(status)
    const payload = { status: dbStatus, notes: notes || '' }
    if (productionSchedule) payload.productionSchedule = productionSchedule
    if (driverId) payload.driverId = driverId
    if (driverDetails) {
      payload.driverDetails = {
        driverName: driverDetails.driverName,
        driverPhone: driverDetails.driverPhone,
        plateNumber: driverDetails.plateNumber,
        truckDescription: driverDetails.truckDescription,
      }
    }

    try {
      const response = await adminOrderApi.updateOrderStatus(orderId, payload)
      if (response.success) {
        const updated = patchLocalOrder(orderId, response.data)
        return { success: true, order: updated }
      }
      return { success: false, message: response.message || 'Failed to update status' }
    } catch (e) {
      console.error('Status update error:', e)
      return { success: false, message: 'Failed to update status' }
    }
  }

  async function updatePayment(orderId, { paymentStatus, amountPaid } = {}) {
    try {
      const response = await adminOrderApi.updatePaymentStatus(orderId, { paymentStatus, amountPaid })
      if (response.success) {
        const updated = patchLocalOrder(orderId, response.data)
        return { success: true, order: updated }
      }
      return { success: false, message: response.message || 'Failed to update payment' }
    } catch (e) {
      console.error('Payment update error:', e)
      return { success: false, message: 'Failed to update payment' }
    }
  }

  async function deleteOrder(orderId) {
    try {
      const response = await adminOrderApi.deleteOrder(orderId)
      if (response.success) {
        removeLocalOrder(orderId)
        return { success: true }
      }
      return { success: false, message: response.message || 'Failed to delete order' }
    } catch (e) {
      console.error('Error deleting order:', e)
      return { success: false, message: 'Failed to delete order' }
    }
  }

  const statusCounts = computed(() => {
    const list = allOrders.value
    return {
      all: list.length,
      pending: list.filter(o => o.status === 'Pending').length,
      scheduled: list.filter(o => o.status === 'Scheduled').length,
      inProduction: list.filter(o => o.status === 'In Production').length,
      // Counts BOTH "Out for Delivery" and its pickup alias "Ready to Pick-up"
      // since they share the same underlying DB status.
      outForDelivery: list.filter(o => o.status === 'Out for Delivery' || o.status === 'Ready to Pick-up').length,
      completed: list.filter(o => o.status === 'Completed').length,
      cancelled: list.filter(o => o.status === 'Cancelled').length,
    }
  })

  return {
    allOrders,
    isLoading,
    error,
    statusCounts,
    loadOrders,
    updateStatus,
    updatePayment,
    deleteOrder,
    patchLocalOrder,
  }
}