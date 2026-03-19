import { createRouter, createWebHistory } from 'vue-router'

import LoginPageView from '@/views/LoginPageView.vue'
import MainLayoutView from '@/views/MainLayoutView.vue'
import DashboardPage from '@/pages/DashboardPage.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginPageView,
  },
  {
    path: '/dashboard',
    component: MainLayoutView,
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: DashboardPage,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router