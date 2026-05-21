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
                Edit {{ accountTypeLabel }} Account
              </h2>
              <p class="text-sm text-gray-500 mt-0.5">{{ displayName }} - {{ accountId }}</p>
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
                    <label class="block text-xs font-medium text-gray-700 mb-1">First Name *</label>
                    <input
                      v-model="formData.firstName"
                      type="text"
                      required
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Last Name *</label>
                    <input
                      v-model="formData.lastName"
                      type="text"
                      required
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Middle Name</label>
                    <input
                      v-model="formData.middleName"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">User ID</label>
                    <input
                      :value="accountId"
                      type="text"
                      disabled
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 text-sm cursor-not-allowed"
                    />
                  </div>
                  <div class="col-span-2">
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
                    <div class="flex items-center gap-2">
                      <span class="text-gray-500 border border-gray-200 px-3 py-2 rounded-lg bg-gray-50 text-sm">+63</span>
                      <input
                        v-model="formData.phone"
                        type="tel"
                        class="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Customer Specific Fields -->
              <div v-if="accountType === 'customers'" class="border border-gray-200 rounded-xl p-4">
                <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">Customer Details</p>
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">Company Name</label>
                  <input
                    v-model="formData.companyName"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Company name (optional)"
                  />
                </div>
              </div>

              <!-- Admin Specific Fields -->
              <div v-if="accountType !== 'customers'" class="border border-gray-200 rounded-xl p-4">
                <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">Employment Details</p>
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">Admin Role</label>
                  <select
                    v-model="formData.role"
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="Sales">Sales Department</option>
                    <option value="Production">Production Department</option>
                  </select>
                </div>
              </div>

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

  <!-- Feedback Modal -->
  <FeedbackModal
    v-model:show="feedback.show"
    :type="feedback.type"
    :title="feedback.title"
    :message="feedback.message"
    @close="feedback.show = false"
  />
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import FeedbackModal from './FeedbackModal.vue'

const props = defineProps({
  show: { type: Boolean, required: true },
  account: { type: Object, required: true },
  accountType: { type: String, required: true } // 'customers', 'sales', 'production'
})

const emit = defineEmits(['close', 'update'])

const isSubmitting = ref(false)

const feedback = ref({
  show: false,
  type: 'success',
  title: '',
  message: ''
})

const accountId = computed(() => {
  return props.account?.userId || props.account?.customerId || props.account?.adminId || ''
})

const displayName = computed(() => {
  const account = props.account
  if (account.firstName && account.lastName) {
    return `${account.firstName} ${account.lastName}`
  }
  return account.name || account.email || 'Account'
})

const accountTypeLabel = computed(() => {
  switch(props.accountType) {
    case 'customers': return 'Customer'
    case 'sales': return 'Sales Admin'
    case 'production': return 'Production Admin'
    default: return 'Account'
  }
})

// Form data
const formData = ref({
  firstName: '',
  middleName: '',
  lastName: '',
  email: '',
  phone: '',
  companyName: '',
  role: ''
})

// Watch for account changes to populate form
watch(() => props.account, (newAccount) => {
  if (newAccount) {
    populateForm(newAccount)
  }
}, { immediate: true })

function populateForm(account) {
  formData.value = {
    firstName: account.firstName || '',
    middleName: account.middleName || '',
    lastName: account.lastName || '',
    email: account.email || '',
    phone: account.phone || '',
    companyName: account.companyName || '',
    role: account.role || (props.accountType === 'sales' ? 'Sales' : 'Production')
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

function showFeedback(type, title, message) {
  feedback.value = {
    show: true,
    type,
    title,
    message
  }
}

async function handleSubmit() {
  isSubmitting.value = true
  
  // Prepare updated account data matching backend structure
  const updatedAccount = {
    firstName: formData.value.firstName,
    middleName: formData.value.middleName,
    lastName: formData.value.lastName,
    email: formData.value.email,
    phone: formData.value.phone
  }
  
  // Add customer specific fields
  if (props.accountType === 'customers') {
    updatedAccount.companyName = formData.value.companyName
  } 
  // Add admin specific fields
  else {
    updatedAccount.role = formData.value.role
  }
  
  // Emit update event
  emit('update', updatedAccount)
  
  showFeedback('success', 'Success', `${accountTypeLabel.value} account has been updated successfully!`)
  
  isSubmitting.value = false
  
  // Close modal after a short delay
  setTimeout(() => {
    closeModal()
  }, 1500)
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
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
</style>