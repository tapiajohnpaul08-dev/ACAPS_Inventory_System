<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="closeModal"
      >
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeModal" />
        
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">

          <!-- ✅ Loading overlay — covers the whole modal so the admin
               can't double-click Save or edit fields mid-request. -->
          <Transition name="modal-fade">
            <div
              v-if="isSubmitting"
              class="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-white/80 backdrop-blur-sm"
            >
              <div class="flex flex-col items-center gap-3">
                <div class="inline-block w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <p class="text-sm font-semibold text-gray-700">Saving changes…</p>
                <p class="text-xs text-gray-400">Please wait, do not close this window</p>
              </div>
            </div>
          </Transition>

          <div class="flex items-start justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0 bg-gradient-to-r from-blue-50 to-white rounded-t-2xl">
            <div>
              <h2 class="text-lg font-semibold text-gray-900 leading-snug">
                Edit {{ accountTypeLabel }} Account
              </h2>
              <p class="text-sm text-gray-500">{{ displayName }} - {{ accountId }}</p>
            </div>
            <button @click="closeModal" class="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all">
              <X class="w-5 h-5" />
            </button>
          </div>

          <div class="flex-1 overflow-y-auto px-6 py-4">
            <form @submit.prevent="handleSubmit" class="space-y-4">
              <!-- Basic Information -->
              <div class="border border-gray-200 rounded-xl p-4">
                <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Basic Information</p>
                <div class="grid grid-cols-3 gap-3">
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
                    <label class="block text-xs font-medium text-gray-700 mb-1">Middle Name</label>
                    <input
                      v-model="formData.middleName"
                      type="text"
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
                </div>
                <div class="grid grid-cols-3 gap-3 mt-3">
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
                </div>
                <div class="mt-3">
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

              <!-- Customer Specific Fields -->
              <div v-if="accountType === 'customers'" class="border border-gray-200 rounded-xl p-4">
                <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Customer Details</p>
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
                <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Employment Details</p>
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">Admin Role</label>
                  <select
                    v-model="formData.role"
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="Sales">Sales Department</option>
                    <option value="Production">Production Department</option>
                    <option value="SuperAdmin">Super Admin</option>
                  </select>
                </div>
              </div>

              <!-- ✅ Reset Password — Super Admin only, admin accounts only -->
              <div v-if="canResetPassword" class="border border-amber-200 bg-amber-50/40 rounded-xl p-4">
                <div class="flex items-center gap-2 mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2"
                    class="text-amber-600 flex-shrink-0">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <p class="text-xs font-bold text-amber-700 uppercase tracking-wide">
                    Reset Password
                  </p>
                </div>
                <p class="text-xs text-amber-700/80 mb-3">
                  Leave blank to keep the current password. The admin will use the new password the next time they log in.
                </p>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">New Password</label>
                    <input
                      v-model="formData.newPassword"
                      type="password"
                      autocomplete="new-password"
                      placeholder="Min 8 characters"
                      class="w-full px-3 py-2 border border-amber-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Confirm Password</label>
                    <input
                      v-model="formData.confirmPassword"
                      type="password"
                      autocomplete="new-password"
                      placeholder="Re-enter password"
                      class="w-full px-3 py-2 border border-amber-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>
                <p v-if="passwordError" class="text-xs text-red-500 mt-2">
                  {{ passwordError }}
                </p>
              </div>

              <!-- Action Buttons -->
              <div class="flex gap-3 pt-4">
                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <svg v-if="!isSubmitting" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                  <svg v-else class="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ isSubmitting ? 'Saving…' : 'Save Changes' }}
                </button>
                <button
                  type="button"
                  @click="closeModal"
                  :disabled="isSubmitting"
                  class="flex-1 py-2.5 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
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
import { X } from 'lucide-vue-next'
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

// ── Current logged-in admin (for the reset-password privilege gate) ──
const currentAdminRole = ref('')
const currentAdminId = ref('')
try {
  currentAdminRole.value = localStorage.getItem('adminRole') || ''
  const stored = JSON.parse(localStorage.getItem('adminUser') || '{}')
  currentAdminId.value = stored.adminId || ''
} catch (e) {
  // Corrupt localStorage — treat as non-privileged
  currentAdminRole.value = ''
  currentAdminId.value = ''
}

// Show the reset-password block only when:
//   1. The logged-in user is a Super Admin
//   2. We're editing an admin (not a customer)
//   3. It's not the Super Admin's own account — they should change
//      their own password through Profile, which requires the current
//      password and is the safer UX.
const canResetPassword = computed(() => {
  if (currentAdminRole.value !== 'Super Admin') return false
  if (props.accountType === 'customers') return false
  if (props.accountType === 'superadmin' && accountId.value === currentAdminId.value) return false
  return true
})

const passwordError = ref('')

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
  role: '',
  // Reset-password fields (only used when canResetPassword is true)
  newPassword: '',
  confirmPassword: '',
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
    role: account.role || (props.accountType === 'sales' ? 'Sales' : 'Production'),
    // Always start blank — never carry a password between opens
    newPassword: '',
    confirmPassword: '',
  }
  passwordError.value = ''
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

// Helper — wraps an emit in a Promise that resolves when the parent
// calls back via `_onComplete`. Includes a 15 s safety timeout so a
// hung request can never lock the modal permanently.
function emitWithAck(eventName, payload) {
  return new Promise((resolve) => {
    let settled = false
    const finish = (result) => {
      if (settled) return
      settled = true
      resolve(result)
    }

    emit(eventName, { ...payload, _onComplete: finish })
    setTimeout(() => finish({ success: false, message: 'Request timed out' }), 15000)
  })
}

async function handleSubmit() {
  if (isSubmitting.value) return

  // ── Optional password validation ─────────────────────────────────
  // Validate first so we don't fire a partial update (profile changes
  // committed, password rejected) and leave the admin in a half-state.
  passwordError.value = ''
  const wantsPasswordReset = canResetPassword.value && !!formData.value.newPassword

  if (wantsPasswordReset) {
    if (formData.value.newPassword.length < 8) {
      passwordError.value = 'Password must be at least 8 characters'
      return
    }
    if (formData.value.newPassword !== formData.value.confirmPassword) {
      passwordError.value = 'Passwords do not match'
      return
    }
  }

  isSubmitting.value = true

  const updatedAccount = {
    firstName: formData.value.firstName,
    middleName: formData.value.middleName,
    lastName: formData.value.lastName,
    email: formData.value.email,
    phone: formData.value.phone,
  }

  if (props.accountType === 'customers') {
    updatedAccount.companyName = formData.value.companyName
  } else {
    updatedAccount.role = formData.value.role
  }

  try {
    // ── Step 1: profile update (always runs) ───────────────────────
    const updateResult = await emitWithAck('update', updatedAccount)

    if (!updateResult.success) {
      // Parent already showed a toast for the failure — just stop.
      isSubmitting.value = false
      return
    }

    // ── Step 2: password reset (only when the admin filled it in) ──
    if (wantsPasswordReset) {
      const resetResult = await emitWithAck('resetPassword', {
        adminId: accountId.value,
        newPassword: formData.value.newPassword,
      })

      // Wipe plaintext from memory as soon as the request is done,
      // whether it succeeded or failed.
      formData.value.newPassword = ''
      formData.value.confirmPassword = ''

      if (!resetResult.success) {
        // Profile changes are already saved. The parent's toast covers
        // the failure; we stay open so the admin can retry just the
        // password if they want.
        isSubmitting.value = false
        return
      }
    }

    // ── Both succeeded → success feedback + close ──────────────────
    showFeedback(
      'success',
      'Success',
      `${accountTypeLabel.value} account has been updated successfully!`,
    )
    isSubmitting.value = false

    setTimeout(() => closeModal(), 1200)
  } catch (err) {
    console.error('EditAccountModal submit failed:', err)
    isSubmitting.value = false
  }
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

/* Loading overlay fade */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>