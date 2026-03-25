<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="closeModal"
      >
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeModal" />
        
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
          <div class="flex items-start justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
            <div>
              <h2 class="text-lg font-semibold text-gray-900 leading-snug">
                Edit {{ accountType }} Account
              </h2>
              <p class="text-sm text-gray-500 mt-0.5">{{ account?.name }} - {{ account?.userId }}</p>
            </div>
            <button @click="closeModal" class="ml-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5">
                <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
              </svg>
            </button>
          </div>

          <div class="flex-1 overflow-y-auto px-6 py-5">
            <form @submit.prevent="handleSubmit" class="space-y-5">
              <!-- Basic Information -->
              <div class="border border-gray-200 rounded-xl p-4">
                <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">Basic Information</p>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      v-model="formData.name"
                      type="text"
                      required
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">User ID</label>
                    <input
                      v-model="formData.userId"
                      type="text"
                      disabled
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 text-sm cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Email Address *</label>
                    <input
                      v-model="formData.email"
                      type="email"
                      required
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      v-model="formData.phone"
                      type="tel"
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                  <div class="col-span-2">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Address</label>
                    <textarea
                      v-model="formData.address"
                      rows="2"
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                    ></textarea>
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Status</label>
                    <select
                      v-model="formData.status"
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Customer Specific Fields -->
              <div v-if="accountType === 'customer'" class="border border-gray-200 rounded-xl p-4">
                <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">Customer Details</p>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Payment Terms</label>
                    <select
                      v-model="formData.paymentTerms"
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="Net 15">Net 15</option>
                      <option value="Net 30">Net 30</option>
                      <option value="Net 45">Net 45</option>
                      <option value="Net 60">Net 60</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Orders Count</label>
                    <input
                      v-model.number="formData.ordersCount"
                      type="number"
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Total Spent</label>
                    <input
                      v-model="formData.totalSpent"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="₱0"
                    />
                  </div>
                </div>
              </div>

              <!-- Admin Specific Fields -->
              <div v-if="accountType !== 'customer'" class="border border-gray-200 rounded-xl p-4">
                <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">Employment Details</p>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Role *</label>
                    <input
                      v-model="formData.role"
                      type="text"
                      required
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Department</label>
                    <input
                      v-model="formData.department"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>
              </div>

              <!-- Permissions Section (for Admins) -->
              <!-- <div v-if="accountType !== 'customer'" class="border border-gray-200 rounded-xl p-4">
                <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Permissions</p>
                <div class="space-y-2">
                  <label v-for="perm in availablePermissions" :key="perm.value" class="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      :value="perm.value"
                      v-model="formData.permissions"
                      class="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span class="text-sm text-gray-700">{{ perm.label }}</span>
                  </label>
                </div>
              </div> -->

              <!-- Action Buttons -->
              <div class="flex gap-3 pt-4">
                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg v-if="!isSubmitting" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                  <svg v-else class="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
                </button>
                <button
                  type="button"
                  @click="closeModal"
                  class="flex-1 flex items-center justify-center gap-2 py-2.5 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors text-sm font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  show: { type: Boolean, required: true },
  account: { type: Object, required: true },
  accountType: { type: String, required: true } // 'customer', 'sales', 'production'
})

const emit = defineEmits(['close', 'update'])

const isSubmitting = ref(false)

// Available permissions for admin accounts
const availablePermissions = [
  { value: 'view_orders', label: 'View Orders' },
  { value: 'manage_orders', label: 'Manage Orders' },
  { value: 'view_inventory', label: 'View Inventory' },
  { value: 'manage_inventory', label: 'Manage Inventory' },
  { value: 'view_customers', label: 'View Customers' },
  { value: 'manage_customers', label: 'Manage Customers' },
  { value: 'view_analytics', label: 'View Analytics' },
  { value: 'manage_production', label: 'Manage Production' },
]

// Form data
const formData = ref({
  name: '',
  userId: '',
  email: '',
  phone: '',
  address: '',
  status: 'Active',
  // Customer specific
  ordersCount: 0,
  totalSpent: '',
  paymentTerms: 'Net 30',
  // Admin specific
  role: '',
  department: '',
  permissions: []
})

// Watch for account changes to populate form
watch(() => props.account, (newAccount) => {
  if (newAccount) {
    populateForm(newAccount)
  }
}, { immediate: true })

function populateForm(account) {
  formData.value = {
    name: account.name || '',
    userId: account.userId || '',
    email: account.email || '',
    phone: account.phone || '',
    address: account.address || '',
    status: account.status || 'Active',
    ordersCount: account.ordersCount || 0,
    totalSpent: account.totalSpent || '₱0',
    paymentTerms: account.paymentTerms || 'Net 30',
    role: account.role || '',
    department: account.department || '',
    permissions: account.permissions ? [...account.permissions] : []
  }
}

function handleEscKey(event) {
  if (event.key === 'Escape' && props.show) {
    closeModal()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscKey)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscKey)
})

function closeModal() {
  emit('close')
}

async function handleSubmit() {
  isSubmitting.value = true
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800))
  
  // Prepare updated account data
  const updatedAccount = {
    ...props.account,
    name: formData.value.name,
    email: formData.value.email,
    phone: formData.value.phone,
    address: formData.value.address,
    status: formData.value.status,
  }
  
  // Add customer specific fields
  if (props.accountType === 'customer') {
    updatedAccount.ordersCount = formData.value.ordersCount
    updatedAccount.totalSpent = formData.value.totalSpent
    updatedAccount.paymentTerms = formData.value.paymentTerms
  } 
  // Add admin specific fields
  else {
    updatedAccount.role = formData.value.role
    updatedAccount.department = formData.value.department
    updatedAccount.permissions = formData.value.permissions
    updatedAccount.lastLogin = formData.value.lastLogin || props.account.lastLogin
  }
  
  // Emit update event
  emit('update', updatedAccount)
  
  isSubmitting.value = false
  closeModal()
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .relative {
  transform: scale(0.95) translateY(8px);
  opacity: 0;
}
.modal-leave-to .relative {
  transform: scale(0.95) translateY(8px);
  opacity: 0;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>