<template>
  <aside class="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
    <div class="p-6 border-b border-gray-100">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
          <span class="text-white font-black text-sm">A</span>
        </div>
        <div>
          <h1 class="text-lg font-black text-gray-900 tracking-tight">ACAPSHOP</h1>
          <p class="text-xs text-gray-400 -mt-0.5">Inventory System</p>
        </div>
      </div>
    </div>

    <nav class="flex-1 p-3 space-y-0.5">
      <!-- Dashboard - Always visible -->
      <router-link to="/dashboard" class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative group"
        :class="isActive('/dashboard')
          ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          class="lucide lucide-layout-dashboard w-4.5 h-4.5 flex-shrink-0" style="width: 18px; height: 18px;">
          <rect width="7" height="9" x="3" y="3" rx="1"></rect>
          <rect width="7" height="5" x="14" y="3" rx="1"></rect>
          <rect width="7" height="9" x="14" y="12" rx="1"></rect>
          <rect width="7" height="5" x="3" y="16" rx="1"></rect>
        </svg>
        <span class="text-sm font-medium">Dashboard</span>
      </router-link>

      <!-- Inventory - Always visible -->
      <router-link to="/dashboard/inventory"
        class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative group" :class="isActive('/dashboard/inventory')
          ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          class="lucide lucide-package w-4.5 h-4.5 flex-shrink-0" style="width: 18px; height: 18px;">
          <path
            d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z">
          </path>
          <path d="M12 22V12"></path>
          <polyline points="3.29 7 12 12 20.71 7"></polyline>
          <path d="m7.5 4.27 9 5.15"></path>
        </svg>
        <span class="text-sm font-medium">Inventory</span>
        <span
          class="ml-auto text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center font-semibold bg-red-500 text-white">8</span>
      </router-link>

      <!-- Orders - Always visible -->
      <router-link to="/dashboard/orders"
        class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative group" :class="isActive('/dashboard/orders')
          ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          class="lucide lucide-shopping-cart w-4.5 h-4.5 flex-shrink-0" style="width: 18px; height: 18px;">
          <circle cx="8" cy="21" r="1"></circle>
          <circle cx="19" cy="21" r="1"></circle>
          <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
        </svg>
        <span class="text-sm font-medium">Orders</span>
      </router-link>

      <!-- Messages - Only visible for sales department -->
      <router-link v-if="userRole === 'sales'" to="/dashboard/messages"
        class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative group" :class="isActive('/dashboard/messages')
          ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          class="lucide lucide-message-square w-4.5 h-4.5 flex-shrink-0" style="width: 18px; height: 18px;">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        <span class="text-sm font-medium">Messages</span>
        <span
          class="ml-auto text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center font-semibold bg-red-500 text-white">1</span>
      </router-link>

      <!-- Disabled state for production users (shows as disabled but not clickable) -->
      <div v-else class="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed"
        title="Messages are only available for Sales department">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          class="lucide lucide-message-square w-4.5 h-4.5 flex-shrink-0" style="width: 18px; height: 18px;">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        <span class="text-sm font-medium">Messages</span>
        <span
          class="ml-auto text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center font-semibold bg-gray-400 text-white">1</span>
      </div>

      <!-- Analytics - Only visible for sales department -->
      <router-link v-if="userRole === 'sales'" to="/dashboard/analytics"
        class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative group" :class="isActive('/dashboard/analytics')
          ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          class="lucide lucide-chart-column w-4.5 h-4.5 flex-shrink-0" style="width: 18px; height: 18px;">
          <path d="M3 3v16a2 2 0 0 0 2 2h16"></path>
          <path d="M18 17V9"></path>
          <path d="M13 17V5"></path>
          <path d="M8 17v-3"></path>
        </svg>
        <span class="text-sm font-medium">Analytics</span>
      </router-link>

      <!-- Disabled state for production users -->
      <div v-else class="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed"
        title="Analytics are only available for Sales department">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          class="lucide lucide-chart-column w-4.5 h-4.5 flex-shrink-0" style="width: 18px; height: 18px;">
          <path d="M3 3v16a2 2 0 0 0 2 2h16"></path>
          <path d="M18 17V9"></path>
          <path d="M13 17V5"></path>
          <path d="M8 17v-3"></path>
        </svg>
        <span class="text-sm font-medium">Analytics</span>
      </div>
      <!-- Accounts - Always visible -->
<router-link
  to="/dashboard/accounts"
  class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative group"
  :class="isActive('/dashboard/accounts') 
    ? 'bg-blue-600 text-white shadow-sm shadow-blue-200' 
    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
>
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
  <span class="text-sm font-medium">Accounts</span>
</router-link>
    </nav>

    <div class="mx-3 mb-3 p-3 bg-red-50 border border-red-200 rounded-xl">
      <div class="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          class="lucide lucide-triangle-alert w-4 h-4 text-red-600 flex-shrink-0">
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"></path>
          <path d="M12 9v4"></path>
          <path d="M12 17h.01"></path>
        </svg>
        <div>
          <p class="text-xs font-semibold text-red-800">Low Stock Alert</p>
          <p class="text-xs text-red-600">8 items running low</p>
        </div>
      </div>
    </div>

    <div class="p-3 border-t border-gray-100">
      <div class="relative">
        <button @click="toggleUserMenu"
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left">
          <div
            class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {{ userNameInitial }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-gray-900 truncate">{{ userName }}</p>
            <p class="text-xs text-gray-400 truncate">{{ userRole === 'sales' ? 'Sales Department' : 'Production Department' }}</p>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="w-4 h-4 text-gray-400 transition-transform" :class="{ 'rotate-180': showUserMenu }">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>

        <!-- User dropdown menu -->
        <div v-if="showUserMenu"
          class="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-10">
          <button @click="logout"
            class="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" x2="9" y1="12" y2="12"></line>
            </svg>
            Logout
          </button>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const showUserMenu = ref(false)

// Get user info from localStorage (set during login)
const userName = ref(localStorage.getItem('userName') || 'Sarah Dela Cruz')
const userRole = ref(localStorage.getItem('userRole') || 'sales')

const userNameInitial = computed(() => userName.value.charAt(0))

function isActive(path) {
  return route.path === path
}

function toggleUserMenu() {
  showUserMenu.value = !showUserMenu.value
}

function logout() {
  // Clear user session data
  localStorage.removeItem('userName')
  localStorage.removeItem('userRole')
  localStorage.removeItem('userEmail')

  // Redirect to login page
  router.push('/')

  // Close menu if open
  showUserMenu.value = false
}

// Close dropdown when clicking outside
function handleClickOutside(event) {
  const userMenu = event.target.closest('.p-3.border-t')
  if (!userMenu) {
    showUserMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>