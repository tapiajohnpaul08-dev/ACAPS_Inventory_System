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
            v-for="account in accounts"
            :key="account.id"
            class="cursor-pointer transition-all hover:bg-blue-50/50"
            @click="handleSelect(account)"
          >
            <!-- Account Name Column -->
            <td class="px-5 py-4">
              <div class="flex items-center gap-3">
                <div
                  class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  :class="getAvatarColor(account.type)"
                >
                  <span class="text-white font-bold text-sm">
                    {{ account.name.charAt(0) }}
                  </span>
                </div>
                <div>
                  <p class="text-sm font-semibold text-gray-900">{{ account.name }}</p>
                  <p class="text-xs text-gray-400">{{ account.userId }}</p>
                </div>
              </div>
            </td>

            <!-- Contact Info Column -->
            <td class="px-5 py-4">
              <p class="text-sm text-gray-900">{{ account.email }}</p>
              <p class="text-xs text-gray-400">{{ account.phone || 'N/A' }}</p>
            </td>

            <!-- Status Column -->
            <td class="px-5 py-4">
              <span
                class="px-2.5 py-1 rounded-full text-xs font-semibold"
                :class="account.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
              >
                {{ account.status }}
              </span>
            </td>

            <!-- Dynamic Column: Orders (for customers) OR Role/Department (for admins) -->
            <td v-if="type === 'customers'" class="px-5 py-4">
              <p class="text-sm font-semibold text-gray-900">{{ account.ordersCount || 0 }}</p>
              <p class="text-xs text-gray-400">orders</p>
            </td>
            <td v-else class="px-5 py-4">
              <p class="text-sm font-semibold text-gray-900">{{ account.role || 'N/A' }}</p>
              <p class="text-xs text-gray-400">{{ account.department || '' }}</p>
            </td>

            <!-- Dynamic Column: Total Spent (for customers) OR Last Login (for admins) -->
            <td v-if="type === 'customers'" class="px-5 py-4">
              <p class="text-sm font-bold text-blue-600">{{ account.totalSpent || '₱0' }}</p>
            </td>
            <td v-else class="px-5 py-4">
              <p class="text-sm text-gray-600">{{ account.lastLogin || 'N/A' }}</p>
            </td>

            <!-- Last Active / Last Login Column -->
            <td class="px-5 py-4">
              <p class="text-sm text-gray-600">{{ account.lastActive || account.lastLogin || 'N/A' }}</p>
            </td>

            <!-- Actions Column -->
            <td class="px-5 py-4">
              <button
                class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600
                       hover:bg-blue-100 hover:text-blue-800 rounded-lg transition-colors"
                @click.stop="handleEdit(account)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  style="width: 13px; height: 13px"
                >
                  <path
                    d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"
                  />
                </svg>
                Edit
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  accounts: { type: Array, required: true },
  type: { type: String, required: true } // 'customers', 'sales', or 'production'
})

const emit = defineEmits(['select', 'edit'])

// Define columns based on account type
const columns = computed(() => {
  if (props.type === 'customers') {
    return ['Account', 'Contact Info', 'Status', 'Orders', 'Total Spent', 'Last Active', 'Actions']
  } else {
    return ['Account', 'Contact Info', 'Status', 'Role/Department', 'Last Login', 'Actions']
  }
})

function getAvatarColor(type) {
  switch (type) {
    case 'customer':
      return 'bg-blue-600'
    case 'sales-admin':
      return 'bg-green-600'
    case 'production-admin':
      return 'bg-purple-600'
    default:
      return 'bg-gray-600'
  }
}

function handleSelect(account) {
  emit('select', account)
}

function handleEdit(account) {
  emit('edit', account)
}
</script>