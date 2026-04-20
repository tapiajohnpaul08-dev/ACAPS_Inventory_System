<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full min-w-[800px]">
        <thead class="bg-gray-50 border-b border-gray-100">
          <tr>
            <th
              v-for="col in columns"
              :key="col"
              class="px-5 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider"
            >
              {{ col }}
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr
            v-for="account in paginatedAccounts"
            :key="account.id"
            class="cursor-pointer transition-all hover:bg-blue-50/50"
            @click="handleSelect(account)"
          >
            <!-- Account Name -->
            <td class="px-5 py-4">
              <div class="flex items-center gap-3">
                <div
                  class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  :class="getAvatarColor(account.type)"
                >
                  <span class="text-white font-bold text-sm">{{ account.name.charAt(0) }}</span>
                </div>
                <div>
                  <p class="text-sm font-semibold text-gray-900">{{ account.name }}</p>
                  <p class="text-xs text-gray-400">{{ account.userId }}</p>
                </div>
              </div>
            </td>

            <!-- Contact Info -->
            <td class="px-5 py-4">
              <p class="text-sm text-gray-900">{{ account.email }}</p>
              <p class="text-xs text-gray-400">{{ account.phone || 'N/A' }}</p>
            </td>

            <!-- Status -->
            <td class="px-5 py-4">
              <span
                class="px-2.5 py-1 rounded-full text-xs font-semibold"
                :class="account.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
              >
                {{ account.status }}
              </span>
            </td>

            <!-- Orders (customers) | Role/Department (admins) -->
            <td v-if="type === 'customers'" class="px-5 py-4">
              <p class="text-sm font-semibold text-gray-900">{{ account.ordersCount || 0 }}</p>
              <p class="text-xs text-gray-400">orders</p>
            </td>
            <td v-else class="px-5 py-4">
              <p class="text-sm font-semibold text-gray-900">{{ account.role || 'N/A' }}</p>
              <p class="text-xs text-gray-400">{{ account.department || '' }}</p>
            </td>

            <!-- Total Spent (customers) | Last Login (admins) -->
            <td v-if="type === 'customers'" class="px-5 py-4">
              <p class="text-sm font-bold text-blue-600">{{ account.totalSpent || '₱0' }}</p>
            </td>
            <td v-else class="px-5 py-4">
              <p class="text-sm text-gray-600">{{ account.lastLogin || 'N/A' }}</p>
            </td>

            <!-- Last Active (customers only) -->
            <td v-if="type === 'customers'" class="px-5 py-4">
              <p class="text-sm text-gray-600">{{ account.lastActive || 'N/A' }}</p>
            </td>

            <!-- Actions -->
            <td class="px-5 py-4">
              <button
                class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600
                       hover:bg-blue-100 hover:text-blue-800 rounded-lg transition-colors"
                @click.stop="handleEdit(account)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" style="width:13px;height:13px">
                  <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>
                </svg>
                Edit
              </button>
            </td>
          </tr>

          <!-- Empty state -->
          <tr v-if="paginatedAccounts.length === 0">
            <td :colspan="columns.length" class="px-5 py-10 text-center text-sm text-gray-400">
              No accounts found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination Footer -->
    <div class="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50">
      <p class="text-xs text-gray-400">
        Showing
        <span class="font-semibold text-gray-600">{{ rangeStart }}–{{ rangeEnd }}</span>
        of
        <span class="font-semibold text-gray-600">{{ props.accounts.length }}</span>
        accounts
      </p>

      <div class="flex items-center gap-1">
        <button class="pagination-btn" :disabled="currentPage === 1" @click="currentPage--">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            style="width:14px;height:14px">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>

        <template v-for="page in pageRange" :key="page">
          <span v-if="page === '...'" class="px-1 text-xs text-gray-400 select-none">…</span>
          <button
            v-else
            class="pagination-btn"
            :class="{ 'pagination-btn--active': page === currentPage }"
            @click="currentPage = page"
          >
            {{ page }}
          </button>
        </template>

        <button class="pagination-btn" :disabled="currentPage === totalPages" @click="currentPage++">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            style="width:14px;height:14px">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  accounts: { type: Array, required: true },
  type: { type: String, required: true }, // 'customers', 'sales', or 'production'
})

const emit = defineEmits(['select', 'edit'])

const ITEMS_PER_PAGE = 10
const currentPage = ref(1)

const paginatedAccounts = computed(() => {
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE
  return props.accounts.slice(start, start + ITEMS_PER_PAGE)
})

const totalPages = computed(() => Math.max(1, Math.ceil(props.accounts.length / ITEMS_PER_PAGE)))

const rangeStart = computed(() => Math.min((currentPage.value - 1) * ITEMS_PER_PAGE + 1, props.accounts.length))
const rangeEnd = computed(() => Math.min(currentPage.value * ITEMS_PER_PAGE, props.accounts.length))

const pageRange = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages = []
  const addDots = () => { if (pages[pages.length - 1] !== '...') pages.push('...') }

  pages.push(1)
  if (current > 3) addDots()
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) pages.push(p)
  if (current < total - 2) addDots()
  pages.push(total)

  return pages
})

watch(() => props.accounts, () => { currentPage.value = 1 })

const columns = computed(() => {
  if (props.type === 'customers') {
    return ['Account', 'Contact Info', 'Status', 'Orders', 'Total Spent', 'Last Active', 'Actions']
  } else {
    return ['Account', 'Contact Info', 'Status', 'Role/Department', 'Last Login', 'Actions']
  }
})

function getAvatarColor(type) {
  return {
    'customer':           'bg-blue-600',
    'sales-admin':        'bg-green-600',
    'production-admin':   'bg-purple-600',
  }[type] ?? 'bg-gray-600'
}

function handleSelect(account) { emit('select', account) }
function handleEdit(account) { emit('edit', account) }
</script>