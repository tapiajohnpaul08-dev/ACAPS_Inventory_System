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
import { adminAuthApi, adminDashboardApi } from '@/api/api'
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

// ─────────────────────────────────────────────────────────────────
// Sidebar counts — one request, same source of truth as the dashboard
//
// Uses /admin/sidebar-counts which mirrors the exact queries used by
// /admin/summary. This guarantees the sidebar badges and dashboard cards
// always agree.
//
// Refresh triggers:
//   • mount
//   • route change (cheap, keeps the badge current while navigating)
//   • socket / window events for real-time updates
//   • 30s poll as a safety net
// ─────────────────────────────────────────────────────────────────

let lastCountsFetchAt = 0
const COUNTS_DEBOUNCE_MS = 2000

async function fetchSidebarCounts({ force = false } = {}) {
  const now = Date.now()
  if (!force && now - lastCountsFetchAt < COUNTS_DEBOUNCE_MS) return
  lastCountsFetchAt = now

  try {
    const response = await adminDashboardApi.getSidebarCounts()
    if (response.success && response.data) {
      const d = response.data
      pendingOrdersCount.value   = d.pendingOrders       || 0
      lowStockCount.value        = d.lowStockItems       || 0
      pendingNegotiationsCount.value = d.pendingNegotiations || 0
      unreadMessagesCount.value  = d.unreadMessages      || 0
      pendingFeedbackCount.value = d.pendingFeedback     || 0
    }
  } catch (error) {
    console.error('Error fetching sidebar counts:', error)
  } finally {
    isLoading.value = false
  }
}

// Alias so existing callers still work
const fetchLowStockCount          = () => fetchSidebarCounts({ force: true })
const fetchUnreadMessagesCount    = () => fetchSidebarCounts({ force: true })
const fetchPendingFeedbackCount   = () => fetchSidebarCounts({ force: true })
const fetchPendingOrdersCount     = () => fetchSidebarCounts({ force: true })

// Close dropdown when clicking outside
function handleClickOutside(event) {
  const userMenu = event.target.closest('.p-3.border-t')
  if (!userMenu) {
    showUserMenu.value = false
  }
}

// Watch for route changes — a quick refresh keeps the badge current
watch(() => route.path, () => {
  fetchSidebarCounts()
})

// Real-time event handlers (from socket / window events)
function handleUnreadCountUpdate(event) {
  // Optimistic: apply the pushed count, then re-sync from server
  if (event.detail && event.detail.count !== undefined) {
    unreadMessagesCount.value = event.detail.count
  }
  fetchSidebarCounts({ force: true })
}

const handleMessageRead           = () => fetchSidebarCounts({ force: true })
const handleNewMessage            = () => fetchSidebarCounts({ force: true })
const handleFeedbackSubmitted     = () => fetchSidebarCounts({ force: true })
const handleFeedbackReviewed      = () => fetchSidebarCounts({ force: true })
const handleOrderStatusChanged    = () => fetchSidebarCounts({ force: true })

let intervalId = null

onMounted(() => {
  fetchSidebarCounts({ force: true })

  initSocket()
  loadPendingNegotiations()

  document.addEventListener('click', handleClickOutside)

  window.addEventListener('unreadCountUpdated',    handleUnreadCountUpdate)
  window.addEventListener('messageRead',           handleMessageRead)
  window.addEventListener('newMessageReceived',    handleNewMessage)
  window.addEventListener('feedbackSubmitted',     handleFeedbackSubmitted)
  window.addEventListener('feedbackReviewed',      handleFeedbackReviewed)
  window.addEventListener('orderStatusChanged',    handleOrderStatusChanged)

  // 30s poll as a safety net for anything the socket layer misses
  intervalId = setInterval(() => fetchSidebarCounts({ force: true }), 30000)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('unreadCountUpdated', handleUnreadCountUpdate)
  window.removeEventListener('messageRead',        handleMessageRead)
  window.removeEventListener('newMessageReceived', handleNewMessage)
  window.removeEventListener('feedbackSubmitted',  handleFeedbackSubmitted)
  window.removeEventListener('feedbackReviewed',   handleFeedbackReviewed)
  window.removeEventListener('orderStatusChanged', handleOrderStatusChanged)

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