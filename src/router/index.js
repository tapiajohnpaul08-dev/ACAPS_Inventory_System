import { createRouter, createWebHistory } from 'vue-router'

import LoginPageView from '@/views/LoginPageView.vue'
import MainLayoutView from '@/views/MainLayoutView.vue'
import DashboardPage from '@/pages/DashboardPage.vue'
import InventoryPage from '@/pages/InventoryPage.vue'
import OrdersPage from '@/pages/OrdersPage.vue'
import MessagePage from '@/pages/MessagePage.vue'
import AnalyticsPage from '@/pages/AnalyticsPage.vue'
import AccountsPage from '@/pages/AccountsPage.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginPageView,
    meta: { requiresAuth: false },
  },
  {
    path: '/dashboard',
    component: MainLayoutView,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: DashboardPage,
      },
      {
        path: 'inventory',
        name: 'Inventory',
        component: InventoryPage,
      },
      {
        path: 'orders',
        name: 'Orders',
        component: OrdersPage,
      },
      {
        path: 'messages',
        name: 'Messages',
        component: MessagePage,
      },
      {
        path: 'analytics',
        name: 'Analytics',
        component: AnalyticsPage,
      },
      {
        path: 'accounts',
        name: 'Accounts',
        component: AccountsPage,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Navigation guard using modern approach (return value instead of next callback)
router.beforeEach((to, from) => {
  const isAuthenticated = localStorage.getItem('userRole') !== null

  if (to.meta.requiresAuth && !isAuthenticated) {
    // Redirect to login if not authenticated
    return '/'
  } else if (to.path === '/' && isAuthenticated) {
    // Redirect to dashboard if already logged in
    return '/dashboard'
  }

  // Allow navigation
  return true
})

export default router
