<template>
  <aside class="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
    <div class="p-6 border-b border-gray-100">
      <router-link
              to="/dashboard" 
      >
        <div class="flex items-center">
        <div class="w-12 h-12 flex items-center justify-center">
          <img 
            src="../assets/logo/acapsLogo.png" 
            alt="ACAPSHOP" 
            class="h-16 w-16 object-contain"
            @error="(e) => e.target.style.display = 'none'"
          />        </div>
        <div>
          <h1 class="text-lg font-black text-gray-900 tracking-tight">ACAPSHOP</h1>
          <p class="text-xs text-gray-400 -mt-0.5">Inventory System</p>
        </div>
      </div>
      </router-link>
    </div>

    <nav class="flex-1 p-3 space-y-0.5 overflow-y-auto">
      <!-- Dashboard -->
      <router-link 
        to="/dashboard" 
        class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative group"
        :class="isActive('/dashboard')
          ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
      >
        <LayoutDashboard class="w-4.5 h-4.5 flex-shrink-0" style="width: 18px; height: 18px;" />
        <span class="text-sm font-medium">Dashboard</span>
      </router-link>

      <!-- Inventory -->
      <router-link 
        to="/dashboard/inventory"
        class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative group" 
        :class="isActive('/dashboard/inventory')
          ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
      >
        <Package class="w-4.5 h-4.5 flex-shrink-0" style="width: 18px; height: 18px;" />
        <span class="text-sm font-medium">Inventory</span>
        <span v-if="lowStockCount > 0" class="ml-auto text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center font-semibold bg-red-500 text-white">
          {{ lowStockCount }}
        </span>
      </router-link>

      <!-- Orders -->
      <router-link 
        to="/dashboard/orders"
        class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative group" 
        :class="isActive('/dashboard/orders')
          ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
      >
        <ShoppingCart class="w-4.5 h-4.5 flex-shrink-0" style="width: 18px; height: 18px;" />
        <span class="text-sm font-medium">Orders</span>
        <span v-if="pendingOrdersCount > 0" class="ml-auto text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center font-semibold bg-orange-500 text-white">
          {{ pendingOrdersCount }}
        </span>
      </router-link>

      <!-- Messages - Only for sales department -->
      <template v-if="adminRole === 'Sales' || adminRole === 'Super Admin'">
        <router-link 
          to="/dashboard/messages"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative group" 
          :class="isActive('/dashboard/messages')
            ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
        >
          <MessageSquare class="w-4.5 h-4.5 flex-shrink-0" style="width: 18px; height: 18px;" />
          <span class="text-sm font-medium">Messages</span>

          <!-- ✅ NEW — Pending negotiations indicator (real-time) -->
          <span
            v-if="pendingNegotiationsCount > 0"
            class="ml-auto text-[10px] rounded-full px-1.5 py-0.5 font-bold"
            :class="isActive('/dashboard/messages')
              ? 'bg-amber-400 text-amber-950'
              : 'bg-amber-100 text-amber-700'"
            :title="`${pendingNegotiationsCount} pending negotiation(s)`"
          >
            {{ pendingNegotiationsCount }}
          </span>

          <!-- Unread messages badge (existing) -->
          <span
            v-if="unreadMessagesCount > 0"
            class="text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center font-semibold bg-red-500 text-white"
            :class="pendingNegotiationsCount > 0 ? '' : 'ml-auto'"
          >
            {{ unreadMessagesCount }}
          </span>
        </router-link>
      </template>

      <!-- ✅ Feedback - Only for sales department -->
      <template v-if="adminRole === 'Sales' || adminRole === 'Super Admin'">
        <router-link 
          to="/dashboard/feedback"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative group" 
          :class="isActive('/dashboard/feedback')
            ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
        >
          <Star class="w-4.5 h-4.5 flex-shrink-0" style="width: 18px; height: 18px;" />
          <span class="text-sm font-medium">Feedback</span>
          <span v-if="pendingFeedbackCount > 0" class="ml-auto text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center font-semibold bg-yellow-500 text-white">
            {{ pendingFeedbackCount }}
          </span>
        </router-link>
      </template>

      <!-- Analytics - Only for sales department -->
      <template v-if="adminRole === 'Sales' || adminRole === 'Super Admin'">
        <router-link 
          to="/dashboard/analytics"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative group" 
          :class="isActive('/dashboard/analytics')
            ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
        >
          <ChartColumn class="w-4.5 h-4.5 flex-shrink-0" style="width: 18px; height: 18px;" />
          <span class="text-sm font-medium">Analytics</span>
        </router-link>
      </template>

      <!-- Accounts - Only for Super Admin -->
      <template v-if="adminRole === 'Super Admin'">
        <router-link
          to="/dashboard/accounts"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative group"
          :class="isActive('/dashboard/accounts') 
            ? 'bg-blue-600 text-white shadow-sm shadow-blue-200' 
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
        >
          <Users class="w-4.5 h-4.5 flex-shrink-0" style="width: 18px; height: 18px;" />
          <span class="text-sm font-medium">Accounts</span>
        </router-link>
      </template>

    </nav>

    <!-- Low Stock Alert Box -->
    <div 
      v-if="lowStockCount > 0" 
      class="mx-3 mb-3 p-3 bg-red-50 border border-red-200 rounded-xl cursor-pointer hover:bg-red-100 transition-colors"
      @click="navigateToInventory"
    >
      <div class="flex items-center gap-2">
        <TriangleAlert class="w-4 h-4 text-red-600 flex-shrink-0" />
        <div>
          <p class="text-xs font-semibold text-red-800">Low Stock Alert</p>
          <p class="text-xs text-red-600">{{ lowStockCount }} item{{ lowStockCount > 1 ? 's' : '' }} running low</p>
        </div>
      </div>
    </div>

    <!-- User Menu -->
    <div class="p-3 border-t border-gray-100">
      <div class="relative">
        <button @click="toggleUserMenu"
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left">
          <div class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {{ userNameInitial }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-gray-900 truncate">{{ userName }}</p>
            <p class="text-xs text-gray-400 truncate">{{ userDepartment }}</p>
          </div>
          <ChevronDown class="w-4 h-4 text-gray-400 transition-transform" :class="{ 'rotate-180': showUserMenu }" />
        </button>

        <!-- User dropdown menu -->
        <div v-if="showUserMenu"
          class="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-10">
          <!-- Show user info in dropdown -->
          <div class="px-4 py-3 border-b border-gray-100">
            <p class="text-sm font-semibold text-gray-900">{{ userName }}</p>
            <p class="text-xs text-gray-400">{{ userDepartment }}</p>
            <p class="text-xs text-gray-400 mt-0.5">Role: {{ adminRole }}</p>
          </div>
          <button @click="logout"
            class="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors">
            <LogOut class="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  MessageSquare, 
  Star, 
  ChartColumn, 
  Users, 
  TriangleAlert, 
  ChevronDown, 
  LogOut 
} from 'lucide-vue-next'
import { adminAuthApi, inventoryApi, adminChatApi, feedBackApi } from '@/api/api'

import { useAdminChat } from '@/composables/useAdminChat'
const {
  initSocket,
  // ✅ NEW
  pendingNegotiationsCount,
  loadPendingNegotiations,
} = useAdminChat()


const route = useRoute()
const router = useRouter()
const showUserMenu = ref(false)
const lowStockCount = ref(0)
const unreadMessagesCount = ref(0)
const pendingOrdersCount = ref(0)
const pendingFeedbackCount = ref(0)
const isLoading = ref(true)

// Get user info from localStorage
const userName = ref(localStorage.getItem('adminName') || 'Admin User')
const userRole = ref(localStorage.getItem('adminRole') || 'Super Admin')
const adminRole = userRole.value

const userNameInitial = computed(() => userName.value.charAt(0).toUpperCase())

const userDepartment = computed(() => {
  switch(adminRole) {
    case 'Sales': return 'Sales Department'
    case 'Production': return 'Production Department'
    case 'Super Admin': return 'Super Administrator'
    default: return 'Staff'
  }
})

function isActive(path) {
  return route.path === path
}

function toggleUserMenu() {
  showUserMenu.value = !showUserMenu.value
}

async function logout() {
  await adminAuthApi.logout()
  router.push('/')
  showUserMenu.value = false
}

function navigateToInventory() {
  router.push('/dashboard/inventory?tab=supplies&status=low-stock')
}

// Fetch low stock count — debounced so rapid remounts don't
// fire duplicate requests.
let lastLowStockFetchAt = 0
const LOW_STOCK_DEBOUNCE_MS = 5000

async function fetchLowStockCount() {
  const now = Date.now()
  if (now - lastLowStockFetchAt < LOW_STOCK_DEBOUNCE_MS) {
    // Skip — we already fetched recently
    return
  }
  lastLowStockFetchAt = now

  try {
    const response = await inventoryApi.getLowStockItems()
    if (response.success && response.data) {
      lowStockCount.value = response.data.length
    }
  } catch (error) {
    console.error('Error fetching low stock count:', error)
    lowStockCount.value = 0
  } finally {
    isLoading.value = false
  }
}

// Fetch unread messages count
async function fetchUnreadMessagesCount() {
  if (adminRole !== 'Sales' && adminRole !== 'Super Admin') {
    return
  }

  try {
    const response = await adminChatApi.getUnreadCount()
    console.log('Unread messages response:', response)
    
    if (response.success && response.data) {
      const count = response.data.total || response.data.count || 0
      unreadMessagesCount.value = count
      console.log('Unread messages count set to:', count)
    } else {
      unreadMessagesCount.value = 0
    }
  } catch (error) {
    console.error('Error fetching unread messages count:', error)
    unreadMessagesCount.value = 0
  }
}

// ✅ Fetch pending feedback count
async function fetchPendingFeedbackCount() {
  if (adminRole !== 'Sales' && adminRole !== 'Super Admin') {
    return
  }

  try {
    const response = await feedBackApi.getAllFeedback({ status: 'pending' }, 1, 1)
    
    if (response.success && response.pagination) {
      pendingFeedbackCount.value = response.pagination.total || 0
    } else {
      pendingFeedbackCount.value = 0
    }
  } catch (error) {
    console.error('Error fetching pending feedback count:', error)
    pendingFeedbackCount.value = 0
  }
}

// Fetch pending orders count
async function fetchPendingOrdersCount() {
  try {
    // This would need to be implemented in your orders API
    // For now, we'll use a placeholder
    const response = await fetch('/api/v1/order/status/Pending/count')
    if (response.ok) {
      const data = await response.json()
      pendingOrdersCount.value = data.count || 0
    }
  } catch (error) {
    console.error('Error fetching pending orders count:', error)
    pendingOrdersCount.value = 0
  }
}

// Close dropdown when clicking outside
function handleClickOutside(event) {
  const userMenu = event.target.closest('.p-3.border-t')
  if (!userMenu) {
    showUserMenu.value = false
  }
}

// Watch for route changes to refresh counts
watch(() => route.path, (newPath) => {
  if (newPath === '/dashboard/messages' || newPath.startsWith('/dashboard/messages/')) {
    setTimeout(fetchUnreadMessagesCount, 500)
  }
  if (newPath === '/dashboard/feedback') {
    setTimeout(fetchPendingFeedbackCount, 500)
  }
})

// Listen for unread count updates from the chat system
function handleUnreadCountUpdate(event) {
  if (event.detail && event.detail.count !== undefined) {
    unreadMessagesCount.value = event.detail.count
    console.log('Unread count updated via event:', event.detail.count)
  }
}

function handleMessageRead() {
  fetchUnreadMessagesCount()
}

function handleNewMessage() {
  fetchUnreadMessagesCount()
}

// ✅ Listen for feedback events
function handleFeedbackSubmitted() {
  fetchPendingFeedbackCount()
}

function handleFeedbackReviewed() {
  fetchPendingFeedbackCount()
}

let intervalId = null

onMounted(() => {
  fetchLowStockCount()
  fetchUnreadMessagesCount()
  fetchPendingFeedbackCount()
  fetchPendingOrdersCount()
  initSocket()
  loadPendingNegotiations()

  document.addEventListener('click', handleClickOutside)
  
  // Listen for chat events
  window.addEventListener('unreadCountUpdated', handleUnreadCountUpdate)
  window.addEventListener('messageRead', handleMessageRead)
  window.addEventListener('newMessageReceived', handleNewMessage)
  
  // Listen for feedback events
  window.addEventListener('feedbackSubmitted', handleFeedbackSubmitted)
  window.addEventListener('feedbackReviewed', handleFeedbackReviewed)
  
  // Refresh counts periodically
  intervalId = setInterval(() => {
    if (route.path === '/dashboard/messages' || route.path.startsWith('/dashboard/messages/')) {
      fetchUnreadMessagesCount()
    }
    if (route.path === '/dashboard/feedback') {
      fetchPendingFeedbackCount()
    }
  }, 30000)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('unreadCountUpdated', handleUnreadCountUpdate)
  window.removeEventListener('messageRead', handleMessageRead)
  window.removeEventListener('newMessageReceived', handleNewMessage)
  window.removeEventListener('feedbackSubmitted', handleFeedbackSubmitted)
  window.removeEventListener('feedbackReviewed', handleFeedbackReviewed)
  
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
})
</script>

<style scoped>
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Scrollbar styling */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}
.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}
.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>