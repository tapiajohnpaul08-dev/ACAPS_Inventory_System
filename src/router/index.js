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
    meta: { requiresAuth: false }
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
        meta: { title: 'Dashboard' }
      },
      {
        path: 'inventory',
        name: 'Inventory',
        component: InventoryPage,
        meta: { title: 'Inventory' }
      },
      {
        path: 'orders',
        name: 'Orders',
        component: OrdersPage,
        meta: { title: 'Orders' }
      },
      {
        path: 'messages',
        name: 'Messages',
        component: MessagePage,
        meta: { title: 'Messages' }
      },
      {
        path: 'analytics',
        name: 'Analytics',
        component: AnalyticsPage,
        meta: { title: 'Analytics' }
      },
      {
        path: 'accounts',
        name: 'Accounts',
        component: AccountsPage,
        meta: { title: 'Accounts' }
      }
    ]
  },
  {
    path: '/unauthorized',
    name: 'Unauthorized',
    component: () => import('@/views/UnauthorizedView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// ✅ MODERN SYNTAX - Return value instead of calling next()
router.beforeEach((to, from) => {
  const adminToken = localStorage.getItem('adminToken')
  const isAuthenticated = !!adminToken

  // If route requires auth and not authenticated, redirect to login
  if (to.meta.requiresAuth && !isAuthenticated) {
    return '/'
  }

  // If already authenticated and trying to go to login page, redirect to dashboard
  if (to.path === '/' && isAuthenticated) {
    return '/dashboard'
  }

  // Allow navigation
  return true
})

export default router