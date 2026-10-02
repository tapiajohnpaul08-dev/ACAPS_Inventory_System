<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

    <!-- Empty state — no accounts at all -->
    <div v-if="accounts.length === 0" class="text-center py-16">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="1.5"
        class="mx-auto text-gray-300 mb-3">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <p class="text-gray-400 text-sm font-medium">No accounts found</p>
      <p class="text-xs text-gray-400 mt-1">Try adjusting your search or filters.</p>
    </div>

    <!-- Table -->
    <div v-else class="overflow-x-auto">
      <table class="w-full min-w-[800px]">
        <thead class="bg-gray-50 border-b border-gray-100">
          <tr class="text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
            <th
              v-for="col in columns"
              :key="col"
              class="px-5 py-3 text-center text-xs font-bold text-gray-400 uppercase tracking-wider"
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
            <!-- Account Name Column -->
            <td class="px-5 py-4">
              <div class="flex items-center gap-3">
                <div
                  class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  :class="getAvatarColor(type)"
                >
                  <span class="text-white font-bold text-sm">
                    {{ getInitials(account) }}
                  </span>
                </div>
                <div>
                  <p class="text-sm font-semibold text-gray-900">{{ getDisplayName(account) }}</p>
                  <p class="text-xs text-gray-400">{{ account.userId || account.driverId || 'N/A' }}</p>
                </div>
              </div>
            </td>

            <!-- Contact Info Column -->
            <td class="px-5 py-4">
              <p class="text-sm text-gray-900">{{ account.email }}</p>
              <p class="text-xs text-gray-400">{{ account.phone || account.phoneNumber || 'N/A' }}</p>
            </td>

            <!-- Status Column -->
            <td class="px-5 py-4">
              <span
                class="px-2.5 py-1 rounded-full text-xs font-semibold"
                :class="getStatusClass(account)"
              >
                {{ getStatus(account) }}
              </span>
            </td>

            <!-- Dynamic Column 1 -->
            <td v-if="type === 'customers'" class="px-5 py-4">
              <p class="text-sm font-semibold text-gray-900">{{ account.ordersCount || 0 }}</p>
              <p class="text-xs text-gray-400">orders</p>
            </td>
            <td v-else-if="type === 'drivers'" class="px-5 py-4">
              <p class="text-sm font-semibold text-gray-900">{{ account.plateNumber || 'N/A' }}</p>
              <p class="text-xs text-gray-400">{{ account.vehicleDescription || 'No vehicle' }}</p>
            </td>
            <td v-else class="px-5 py-4">
              <p class="text-sm font-semibold text-gray-900">{{ account.role || 'N/A' }}</p>
              <p class="text-xs text-gray-400">{{ account.department || '' }}</p>
            </td>

            <!-- Dynamic Column 2 -->
            <td v-if="type === 'customers'" class="px-5 py-4">
              <p class="text-sm font-bold text-blue-600">₱{{ account.totalSpent.toLocaleString() || '0' }}</p>
            </td>
            <td v-else-if="type === 'drivers'" class="px-5 py-4">
              <p class="text-sm text-gray-600">{{ account.assignedOrders || 0 }}</p>
              <p class="text-xs text-gray-400">assigned orders</p>
            </td>

            <!-- Last Active Column -->
            <td class="px-5 py-4">
              <p class="text-sm text-gray-600">{{ account.lastActive || account.lastLogin || 'N/A' }}</p>
            </td>

            <!-- Actions Column -->
            <td class="px-5 py-4">
              <div class="flex items-center justify-center gap-1">
                <button
                  class="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-600
                         hover:bg-blue-100 hover:text-blue-800 rounded-lg transition-colors"
                  @click.stop="handleEdit(account)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" style="width: 13px; height: 13px">
                    <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>
                  </svg>
                  Edit
                </button>
                <button
                  class="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-red-600
                         hover:bg-red-100 hover:text-red-800 rounded-lg transition-colors"
                  @click.stop="handleDelete(account)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" style="width: 13px; height: 13px">
                    <path d="M3 6h18"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination footer -->
    <div
      v-if="accounts.length > 0"
      class="px-5 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between flex-wrap gap-4"
    >
      <div class="flex items-center gap-3">
        <p class="text-sm text-gray-500">
          Showing
          <span class="font-semibold text-gray-700">{{ startIndex + 1 }}</span>
          to
          <span class="font-semibold text-gray-700">{{ endIndex }}</span>
          of
          <span class="font-semibold text-gray-700">{{ accounts.length }}</span>
          {{ accounts.length === 1 ? 'account' : 'accounts' }}
        </p>

        <!-- Rows-per-page selector -->
        <select
          :value="itemsPerPage"
          @change="onPageSizeChange(Number($event.target.value))"
          class="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white text-gray-600
                 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option :value="5">5 / page</option>
          <option :value="10">10 / page</option>
          <option :value="25">25 / page</option>
          <option :value="50">50 / page</option>
        </select>
      </div>

      <div class="flex gap-2">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="px-3 py-1.5 text-sm font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          :class="currentPage === 1
            ? 'bg-gray-100 text-gray-400'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
        >
          Previous
        </button>

        <div class="flex gap-1">
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="goToPage(page)"
            class="px-3 py-1.5 text-sm font-medium rounded-lg transition-all"
            :class="currentPage === page
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
          >
            {{ page }}
          </button>
        </div>

        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-3 py-1.5 text-sm font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          :class="currentPage === totalPages
            ? 'bg-gray-100 text-gray-400'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  accounts: { type: Array, required: true },
  type: { type: String, required: true } // 'customers', 'sales', 'production', 'superadmin', 'drivers'
})

const emit = defineEmits(['select', 'edit', 'delete'])

// ─────────────────────────────────────────────────────────────────
// Pagination state
// ─────────────────────────────────────────────────────────────────
const currentPage = ref(1)
const itemsPerPage = ref(10)

const totalPages = computed(() =>
  Math.max(1, Math.ceil(props.accounts.length / itemsPerPage.value)),
)

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() =>
  Math.min(startIndex.value + itemsPerPage.value, props.accounts.length),
)

const paginatedAccounts = computed(() => {
  const start = startIndex.value
  const end = start + itemsPerPage.value
  return props.accounts.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

function prevPage() {
  if (currentPage.value > 1) currentPage.value--
}

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}

function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) currentPage.value = page
}

function onPageSizeChange(size) {
  itemsPerPage.value = size
  currentPage.value = 1   // reset when the page size changes
}

// ─────────────────────────────────────────────────────────────────
// Reset to page 1 whenever the underlying account list or type
// changes (search input, tab switch, add/delete refresh).
//
// Watching the array reference works because `filteredAccounts` in
// the parent returns a NEW array from `.filter()` every time the
// search query changes, and a new array from `accountsByTab` every
// time the tab changes.
// ─────────────────────────────────────────────────────────────────
watch(
  () => [props.accounts, props.type],
  () => { currentPage.value = 1 },
)

// Clamp the current page if a delete shrinks the list below the
// current page's range.
watch(totalPages, (max) => {
  if (currentPage.value > max) currentPage.value = max
})

// ─────────────────────────────────────────────────────────────────
// Column headers per account type
// ─────────────────────────────────────────────────────────────────
const columns = computed(() => {
  if (props.type === 'customers') {
    return ['Account', 'Contact Info', 'Status', 'Orders', 'Total Spent', 'Last Active', 'Actions']
  } else if (props.type === 'drivers') {
    return ['Account', 'Contact Info', 'Status', 'Plate/Vehicle', 'Assigned Orders', 'Last Active', 'Actions']
  } else {
    return ['Account', 'Contact Info', 'Status', 'Role/Department', 'Last Login', 'Actions']
  }
})

function getInitials(account) {
  const name = getDisplayName(account)
  return name.charAt(0).toUpperCase()
}

function getDisplayName(account) {
  if (account.name) return account.name
  if (account.firstName) {
    const middle = account.middleName ? ` ${account.middleName} ` : ' '
    return `${account.firstName}${middle}${account.lastName || ''}`.trim()
  }
  return 'Unknown'
}

function getAvatarColor(type) {
  switch (type) {
    case 'customers':  return 'bg-blue-600'
    case 'sales':      return 'bg-green-600'
    case 'production': return 'bg-purple-600'
    case 'drivers':    return 'bg-orange-600'
    default:           return 'bg-gray-600'
  }
}

function getStatus(account) {
  if (account.status) return account.status
  if (account.available !== undefined) {
    return account.available ? 'Available' : 'Unavailable'
  }
  return 'Active'
}

function getStatusClass(account) {
  const status = getStatus(account).toLowerCase()
  const classes = {
    'active':      'bg-green-100 text-green-700',
    'available':   'bg-green-100 text-green-700',
    'inactive':    'bg-red-100 text-red-700',
    'unavailable': 'bg-red-100 text-red-700',
  }
  return classes[status] || 'bg-gray-100 text-gray-700'
}

function handleSelect(account) { emit('select', account) }
function handleEdit(account)   { emit('edit', account) }
function handleDelete(account) { emit('delete', account) }
</script>