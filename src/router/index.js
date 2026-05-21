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
        meta: { title: 'Orders'}
      },
      {
        path: 'messages',
        name: 'Messages',
        component: MessagePage,
        meta: { title: 'Messages'}
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
        meta: { title: 'Accounts'}
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

// Navigation guard
router.beforeEach((to, from) => {
  // Check authentication
  const adminToken = localStorage.getItem('adminToken')
  const adminRole = localStorage.getItem('adminRole')
  const isAuthenticated = !!adminToken

  // Redirect to login if route requires auth and not authenticated
  if (to.meta.requiresAuth && !isAuthenticated) {
    return '/'
  }

  // Redirect to dashboard if already logged in and trying to access login page
  if (to.path === '/' && isAuthenticated) {
    return '/dashboard'
  }


 

  return true
})

export default router