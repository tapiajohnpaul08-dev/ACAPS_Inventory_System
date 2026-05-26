<template>
  <div class="p-8">
    <!-- Welcome Header with Animation -->
    <div class="mb-8 animate-fade-in">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-3xl font-black bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p class="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <span class="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Welcome back, {{ adminName }}
          </p>
        </div>
        <div class="flex gap-3">
          <button
            @click="refreshData"
            :disabled="loading"
            class="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-all shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" :class="{ 'animate-spin': loading }">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
              <path d="M21 3v5h-5"/>
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
              <path d="M8 16H3v5"/>
            </svg>
            Refresh
          </button>
          <button
            v-if="userRole === 'sales'"
            @click="navigateToOrders"
            class="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-all shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 3h18v18H3z"/>
              <path d="M3 9h18"/>
              <path d="M9 21V9"/>
            </svg>
            View All Orders
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State with Skeleton -->
    <div v-if="loading" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div v-for="i in 4" :key="i" class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-pulse">
          <div class="w-11 h-11 bg-gray-200 rounded-xl mb-4"></div>
          <div class="h-4 bg-gray-200 rounded w-24 mb-2"></div>
          <div class="h-8 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
          <div class="h-6 bg-gray-200 rounded w-32 mb-4"></div>
          <div class="space-y-3">
            <div v-for="i in 3" :key="i" class="h-16 bg-gray-100 rounded-xl"></div>
          </div>
        </div>
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
          <div class="h-6 bg-gray-200 rounded w-32 mb-4"></div>
          <div class="space-y-3">
            <div v-for="i in 5" :key="i" class="h-12 bg-gray-100 rounded-xl"></div>
          </div>
        </div>
      </div>
    </div>

    <template v-else>
      <!-- Stats Grid with Hover Effects -->
      <StatsGrid :stats="filteredStats" @stat-click="handleStatClick" />

      <!-- Charts Section with Glassmorphism -->
      <div v-if="userRole === 'sales'" class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div class="group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white rounded-2xl border border-gray-100 p-4">
          <RevenueCategoryChart :categories="revenueCategories" />
        </div>
        <div class="group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white rounded-2xl border border-gray-100 p-4">
          <WeeklySalesTrendChart :sales-data="weeklySales" />
        </div>
      </div>

      <!-- Alerts and Orders Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="transition-all duration-300 hover:shadow-lg rounded-2xl">
          <LowStockAlerts 
            :items="lowStockItems" 
            @notify="handleNotify"
            @view-all="navigateToInventory"
            @item-click="handleLowStockItemClick"
          />
        </div>
        <div class="transition-all duration-300 hover:shadow-lg rounded-2xl">
          <RecentOrders 
            :orders="recentOrders" 
            @edit="handleEditOrder"
            @saved="handleOrderSaved"
            @refresh="loadDashboardData"
            @view-all="navigateToOrders"
            @order-click="handleOrderClick"
          />
        </div>
      </div>
    </template>

    <!-- Edit Order Modal -->
    <EditOrderModal
      v-if="editOrderData"
      :show="true"
      :order="editOrderData"
      @close="closeEditModal"
      @saved="handleOrderSaved"
    />

    <!-- Toast Notification -->
    <Toast :show="toast.show" :type="toast.type" :message="toast.message" @update:show="toast.show = $event" />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import StatsGrid from '@/components/dashboard/StatsGrid.vue'
import RevenueCategoryChart from '@/components/dashboard/RevenueCategoryChart.vue'
import WeeklySalesTrendChart from '@/components/dashboard/WeeklySalesTrendChart.vue'
import LowStockAlerts from '@/components/dashboard/LowStockAlerts.vue'
import RecentOrders from '@/components/dashboard/RecentOrders.vue'
import EditOrderModal from '@/modals/EditOrderModal.vue'
import Toast from '@/components/Toast.vue'
import { useDashboard } from '@/composables/useDashboard'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const { 
  stats, 
  revenueCategories, 
  weeklySales, 
  lowStockItems, 
  recentOrders, 
  loading, 
  error, 
  userRole,
  loadDashboardData 
} = useDashboard()

const { toast, showToast } = useToast()
const editOrderData = ref(null)
const adminName = ref(localStorage.getItem('adminName') || 'Admin')

// Filter stats based on user role
const filteredStats = computed(() => {
  if (userRole.value === 'production') {
    return stats.value.filter(stat => stat.label !== 'Total Revenue')
  }
  return stats.value
})

// Navigation handlers
function navigateToOrders() {
  router.push('/dashboard/orders')
}

function navigateToInventory() {
  router.push('/dashboard/inventory')
}

// Handle order click - navigate to orders page and highlight specific order
function handleOrderClick(order) {
  router.push({
    path: '/dashboard/orders',
    query: { search: order.orderId || order.id }
  })
}

// Handle low stock item click - navigate to inventory and highlight specific item
function handleLowStockItemClick(item) {
  // Determine the correct tab based on item type
  const tab = item.type === 'product' ? 'products' : 'supplies'
  
  console.log('Navigating to inventory:', { tab, name: item.name, id: item.id })
  
  router.push({
    path: '/dashboard/inventory',
    query: { 
      tab: tab,
      search: item.name,
      highlight: item.id 
    }
  })
}



function handleStatClick(stat) {
  if (stat.label === 'Total Orders') {
    router.push('/dashboard/orders')
  } else if (stat.label === 'Pending Orders') {
    router.push('/dashboard/orders?status=pending')
  } else if (stat.label === 'Completed Orders') {
    router.push('/dashboard/orders?status=completed')
  } else if (stat.label === 'Low Stock Items') {
    router.push('/dashboard/inventory?tab=supplies&status=low-stock')
  } else if (stat.label === 'Out of Stock') {
    router.push('/dashboard/inventory?tab=supplies&status=out-of-stock')
  } else if (stat.label === 'Total Revenue') {
    router.push('/dashboard/analytics')
  }
}

// Refresh data
async function refreshData() {
  await loadDashboardData()
  showToast('success', 'Dashboard data refreshed!')
}

function handleEditOrder(order) {
  editOrderData.value = {
    id: order.id,
    orderId: order.orderId,
    customer: order.customer,
    customerName: order.customer,
    email: order.email,
    customerEmail: order.email,
    phone: order.phone,
    customerPhone: order.phone,
    address: order.address,
    deliveryMethod: order.deliveryMethod,
    receivingMode: order.deliveryMethod,
    product: order.product,
    productName: order.product,
    size: order.size,
    qty: order.qty,
    quantity: order.qty,
    rawAmount: order.rawAmount,
    amount: order.rawAmount,
    status: order.status,
    payment: order.payment,
    paymentStatus: order.payment === 'paid' ? 'Paid' : order.payment === 'partial' ? 'Partial' : 'Unpaid',
    notes: order.notes,
    expectedDelivery: order.expectedDelivery
  }
}

async function handleOrderSaved(updatedOrder) {
  await loadDashboardData()
  showToast('success', `Order ${updatedOrder.id} has been updated successfully!`)
  closeEditModal()
}

function handleNotify(item) {
  showToast('info', `Low stock alert sent for ${item.name}`)
}

function closeEditModal() {
  editOrderData.value = null
}

onMounted(() => {
  loadDashboardData()
})
</script>

<style scoped>
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-spin { animation: spin 0.7s linear infinite; }
.animate-fade-in { animation: fadeIn 0.5s ease-out; }
</style>