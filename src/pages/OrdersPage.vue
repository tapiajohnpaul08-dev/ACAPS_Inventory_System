<template>
  <div class="p-8">
    <div class="mb-8"><h1 class="text-2xl font-black text-gray-900">Orders</h1><p class="text-sm text-gray-500 mt-1">Manage customer orders</p></div>
    <OrdersStatCards :orders="allOrders" />
    <OrdersFilters
      :search="search"
      :status-filter="statusFilter"
      :counts="statusCounts"
      @update:search="search = $event"
      @update:statusFilter="statusFilter = $event"
    />
    <OrdersTable :orders="filteredOrders" @select="handleSelect" @edit="handleEdit" />
    <OrderDetailModal
      :show="!!selectedOrder"
      :order="selectedOrder"
      @close="selectedOrder = null"
      @update="handleOrderUpdate"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import OrdersStatCards from '@/components/orders/OrdersStatCards.vue'
import OrdersFilters from '@/components/orders/OrdersFilters.vue'
import OrdersTable from '@/components/orders/OrdersTable.vue'
import { orders } from '@/data/dummyData'
import OrderDetailModal from '@/modals/OrderDetailModal.vue'

const search = ref('')
const statusFilter = ref('all')
const allOrders = ref([...orders]) // Create a reactive copy
const selectedOrder = ref(null)

const statusCounts = computed(() => ({
  all: allOrders.value.length,
  pending: allOrders.value.filter(o => o.status === 'Pending').length,
  scheduled: allOrders.value.filter(o => o.status === 'Scheduled').length,
  inProduction: allOrders.value.filter(o => o.status === 'In Production').length,
  toShip: allOrders.value.filter(o => o.status === 'To Ship').length,
  completed: allOrders.value.filter(o => o.status === 'Completed').length,
  cancelled: allOrders.value.filter(o => o.status === 'Cancelled').length,
}))

const statusMap = {
  'pending': 'Pending',
  'scheduled': 'Scheduled',
  'in-production': 'In Production',
  'to-ship': 'To Ship',
  'completed': 'Completed',
  'cancelled': 'Cancelled',
}

const filteredOrders = computed(() => {
  let list = allOrders.value

  if (statusFilter.value !== 'all') {
    list = list.filter(o => o.status === statusMap[statusFilter.value])
  }

  const q = search.value.toLowerCase().trim()
  if (q) {
    list = list.filter(o =>
      o.id.toLowerCase().includes(q) ||
      o.customer.toLowerCase().includes(q) ||
      o.email.toLowerCase().includes(q) ||
      o.product.toLowerCase().includes(q)
    )
  }

  return list
})

function handleSelect(order) {
  console.log('Selected order:', order)
  selectedOrder.value = order // Open modal with selected order
}

function handleEdit(order) {
  console.log('Edit order:', order)
  // You can also open the modal for editing or handle edit separately
  selectedOrder.value = order
}

function handleOrderUpdate(updatedOrder) {
  // Update the orders list with the updated order
  const index = allOrders.value.findIndex(o => o.id === updatedOrder.id)
  if (index !== -1) {
    allOrders.value[index] = { ...allOrders.value[index], ...updatedOrder }
  }
  console.log('Order updated:', updatedOrder)
}
</script>