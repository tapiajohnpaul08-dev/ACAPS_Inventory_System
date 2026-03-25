<template>
  <div class="p-8">
    <div class="mb-8">
      <h1 class="text-2xl font-black text-gray-900">Orders</h1>
      <p class="text-sm text-gray-500 mt-1">Manage customer orders</p>
    </div>
    
    <OrdersStatCards :orders="allOrders" />
    
    <OrdersFilters
      :search="search"
      :status-filter="statusFilter"
      :counts="statusCounts"
      @update:search="search = $event"
      @update:statusFilter="statusFilter = $event"
    />
    
    <OrdersTable 
      :orders="filteredOrders" 
      @select="handleSelect" 
      @edit="handleEdit" 
    />
    
    <!-- Order Detail Modal -->
    <OrderDetailModal
      v-if="selectedOrder"
      :show="true"
      :order="selectedOrder"
      @close="selectedOrder = null"
      @update="handleOrderUpdate"
    />
    
    <!-- Edit Order Modal -->
    <EditOrderModal
      v-if="editOrder"
      :show="true"
      :order="editOrder"
      @close="closeEditModal"
      @update="handleOrderUpdate"
    />
    
    <!-- Feedback Modal -->
    <FeedbackModal
      :show="feedback.show"
      :type="feedback.type"
      :title="feedback.title"
      :message="feedback.message"
      @close="closeFeedback"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import OrdersStatCards from '@/components/orders/OrdersStatCards.vue'
import OrdersFilters from '@/components/orders/OrdersFilters.vue'
import OrdersTable from '@/components/orders/OrdersTable.vue'
import OrderDetailModal from '@/modals/OrderDetailModal.vue'
import EditOrderModal from '@/modals/EditOrderModal.vue'
import FeedbackModal from '@/modals/FeedbackModal.vue'
import { orders } from '@/data/dummyData'

const search = ref('')
const statusFilter = ref('all')
const allOrders = ref([...orders])
const selectedOrder = ref(null)
const editOrder = ref(null)

// Feedback modal state
const feedback = ref({
  show: false,
  type: 'success',
  title: '',
  message: ''
})

const statusCounts = computed(() => ({
  all: allOrders.value.length,
  pending: allOrders.value.filter(o => o.status === 'Pending').length,
  scheduled: allOrders.value.filter(o => o.status === 'Scheduled').length,
  inProduction: allOrders.value.filter(o => o.status === 'In Production').length,
  outForDelivery: allOrders.value.filter(o => o.status === 'Out for Delivery').length,
  completed: allOrders.value.filter(o => o.status === 'Completed').length,
  cancelled: allOrders.value.filter(o => o.status === 'Cancelled').length,
}))

const statusMap = {
  'pending': 'Pending',
  'scheduled': 'Scheduled',
  'in-production': 'In Production',
  'out-for-delivery': 'Out for Delivery',
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
  selectedOrder.value = order
}

function handleEdit(order) {
  editOrder.value = order
}

function closeEditModal() {
  editOrder.value = null
}

function handleOrderUpdate(updatedOrder) {
  const index = allOrders.value.findIndex(o => o.id === updatedOrder.id)
  if (index !== -1) {
    allOrders.value[index] = { ...allOrders.value[index], ...updatedOrder }
    
    // Show success feedback
    showFeedback('success', 'Order Updated', 
      `Order ${updatedOrder.id} has been updated successfully.`)
  }
  
  // Close any open modals
  selectedOrder.value = null
  editOrder.value = null
}

function showFeedback(type, title, message) {
  feedback.value = {
    show: true,
    type,
    title,
    message
  }
}

function closeFeedback() {
  feedback.value.show = false
}
</script>