<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="close"
      >
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="close" />
        
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div class="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
            <h2 class="text-lg font-semibold text-gray-900">
              {{ userType === 'customer' ? 'Add New Customer' : 'Add New Admin' }}
            </h2>
            <button @click="close" class="text-gray-400 hover:text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <form @submit.prevent="submit" class="p-6 space-y-4">
            <!-- Name Fields -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                <input
                  v-model="form.firstName"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                <input
                  v-model="form.lastName"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Middle Name <span class="text-gray-400">(optional)</span></label>
              <input
                v-model="form.middleName"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Santos"
              />
            </div>

            <!-- Username -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Username *</label>
              <input
                v-model="form.username"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="johndoe"
              />
            </div>

            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
              <input
                v-model="form.email"
                type="email"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="john@example.com"
              />
            </div>

            <!-- Phone -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number <span class="text-gray-400">(optional)</span></label>
              <div class="flex items-center gap-2">
                <span class="text-gray-500 border border-gray-300 px-3 py-2 rounded-lg bg-gray-50">+63</span>
                <input
                  v-model="form.phone"
                  type="tel"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="912 345 6789"
                />
              </div>
            </div>

            <!-- Company Name (Customer only) -->
            <div v-if="userType === 'customer'">
              <label class="block text-sm font-medium text-gray-700 mb-1">Company Name <span class="text-gray-400">(optional)</span></label>
              <input
                v-model="form.companyName"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ABC Corporation"
              />
            </div>

            <!-- Role (Admin only) -->
            <div v-if="userType === 'admin'">
              <label class="block text-sm font-medium text-gray-700 mb-1">Role *</label>
              <select
                v-model="form.role"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Sales">Sales Department</option>
                <option value="Production">Production Department</option>
              </select>
            </div>

            <!-- Password -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Password *</label>
              <div class="relative">
                <input
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  minlength="8"
                  class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="At least 8 characters"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Confirm Password -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
              <input
                v-model="form.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm password"
              />
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {{ errorMessage }}
            </div>

            <!-- Buttons -->
            <div class="flex gap-3 pt-4">
              <button
                type="button"
                @click="close"
                class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="isSubmitting"
                class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span v-if="isSubmitting" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                {{ isSubmitting ? 'Creating...' : 'Create Account' }}
              </button>
            </div>
          </form>
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
import { ref, watch } from 'vue'
import FeedbackModal from './FeedbackModal.vue'

const props = defineProps({
  show: { type: Boolean, default: false },
  userType: { type: String, required: true } // 'customer' or 'admin'
})

const emit = defineEmits(['close', 'submit'])

const form = ref({
  firstName: '',
  middleName: '',
  lastName: '',
  username: '',
  email: '',
  phone: '',
  companyName: '',
  role: 'Sales',
  password: '',
  confirmPassword: ''
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isSubmitting = ref(false)
const errorMessage = ref('')

const feedback = ref({
  show: false,
  type: 'success',
  title: '',
  message: ''
})

watch(() => props.show, (newVal) => {
  if (newVal) {
    // Reset form when modal opens
    form.value = {
      firstName: '',
      middleName: '',
      lastName: '',
      username: '',
      email: '',
      phone: '',
      companyName: '',
      role: 'Sales',
      password: '',
      confirmPassword: ''
    }
    errorMessage.value = ''
  }
})

function validateForm() {
  if (!form.value.firstName.trim()) {
    errorMessage.value = 'First name is required'
    return false
  }
  if (!form.value.lastName.trim()) {
    errorMessage.value = 'Last name is required'
    return false
  }
  if (!form.value.username.trim()) {
    errorMessage.value = 'Username is required'
    return false
  }
  if (form.value.username.length < 3) {
    errorMessage.value = 'Username must be at least 3 characters'
    return false
  }
  if (!form.value.email.trim()) {
    errorMessage.value = 'Email is required'
    return false
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.value.email)) {
    errorMessage.value = 'Enter a valid email address'
    return false
  }
  if (!form.value.password) {
    errorMessage.value = 'Password is required'
    return false
  }
  if (form.value.password.length < 8) {
    errorMessage.value = 'Password must be at least 8 characters'
    return false
  }
  if (form.value.password !== form.value.confirmPassword) {
    errorMessage.value = 'Passwords do not match'
    return false
  }
  return true
}

function showFeedback(type, title, message) {
  feedback.value = {
    show: true,
    type,
    title,
    message
  }
}

async function submit() {
  if (!validateForm()) return
  
  isSubmitting.value = true
  errorMessage.value = ''
  
  const submitData = {
    firstName: form.value.firstName,
    middleName: form.value.middleName,
    lastName: form.value.lastName,
    username: form.value.username,
    email: form.value.email,
    phone: form.value.phone,
    password: form.value.password
  }
  
  if (props.userType === 'customer') {
    submitData.companyName = form.value.companyName
  } else {
    submitData.role = form.value.role
  }
  
  emit('submit', submitData)
  
  showFeedback('success', 'Success', `${props.userType === 'customer' ? 'Customer' : 'Admin'} account has been created successfully!`)
  
  isSubmitting.value = false
  
  // Close modal after a short delay
  setTimeout(() => {
    close()
  }, 1500)
}

function close() {
  emit('close')
}
</script>

<style scoped>
@keyframes spin {
  to { transform: rotate(360deg); }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
</style>