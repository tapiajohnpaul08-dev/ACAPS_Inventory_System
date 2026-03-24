<template>
  <div class="p-8">
    <OrdersStatCards :orders="allOrders" />
    <OrdersFilters
      :search="search"
      :status-filter="statusFilter"
      :counts="statusCounts"
      @update:search="search = $event"
      @update:statusFilter="statusFilter = $event"
    />
    <OrdersTable :orders="filteredOrders" @select="handleSelect" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import OrdersStatCards from '@/components/orders/OrdersStatCards.vue'
import OrdersFilters from '@/components/orders/OrdersFilters.vue'
import OrdersTable from '@/components/orders/OrdersTable.vue'
import { orders } from '@/data/dummyData'

const search = ref('')
const statusFilter = ref('all')
const allOrders = ref(orders)

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
  alert(`Order Details:\nID: ${order.id}\nCustomer: ${order.customer}\nProduct: ${order.product}\nAmount: ${order.amount}`)
}
</script>