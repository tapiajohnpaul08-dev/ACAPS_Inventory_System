<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="close"
      >
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="close" />
        
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
          <div class="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center rounded-t-2xl">
            <div>
              <h2 class="text-lg font-semibold text-gray-900">
                {{ userType === 'customer' ? 'Add New Customer' : 'Add New Admin' }}
              </h2>
              <p class="text-sm text-gray-500">Fill in the details below</p>
            </div>
            <button @click="close" class="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all">
              <X class="w-5 h-5" />
            </button>
          </div>

          <form @submit.prevent="submit" class="p-6 space-y-4">
            <!-- Name Fields -->
            <div class="grid grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                <input
                  v-model="form.firstName"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="John"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
                <input
                  v-model="form.middleName"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Santos"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                <input
                  v-model="form.lastName"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Doe"
                />
              </div>
            </div>

            <!-- Username & Email -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                <input
                  v-model="form.email"
                  type="email"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <!-- Phone -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number <span class="text-gray-400">(optional)</span></label>
              <div class="flex items-center gap-2">
                <span class="text-gray-500 border border-gray-300 px-3 py-2 rounded-lg bg-gray-50 text-sm">+63</span>
                <input
                  v-model="form.phone"
                  type="tel"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="ABC Corporation"
              />
            </div>

            <!-- Role (Admin only) -->
            <div v-if="userType === 'admin'">
              <label class="block text-sm font-medium text-gray-700 mb-1">Role *</label>
              <select
                v-model="form.role"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="Sales">Sales Staff</option>
                <option value="Production">Production Staff</option>
                <option value="Super Admin">Super Admin</option>
              </select>
            </div>

            <!-- Password -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                <div class="relative">
                  <input
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    required
                    minlength="8"
                    class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="At least 8 characters"
                  />
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <Eye v-if="!showPassword" class="w-4 h-4" />
                    <EyeOff v-else class="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
                <div class="relative">
                  <input
                    v-model="form.confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    required
                    class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Confirm password"
                  />
                  <button
                    type="button"
                    @click="showConfirmPassword = !showConfirmPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <Eye v-if="!showConfirmPassword" class="w-4 h-4" />
                    <EyeOff v-else class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {{ errorMessage }}
            </div>

            <!-- Buttons -->
            <div class="flex gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                @click="close"
                class="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="isSubmitting"
                class="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm font-semibold"
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
import { X, Eye, EyeOff } from 'lucide-vue-next'
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
    form.value = {
      firstName: '',
      middleName: '',
      lastName: '',
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

function validatePhone(phone) {
  const clean = phone.replace(/[\s\-()]/g, '')
  // Accept: +639XXXXXXXXX, 09XXXXXXXXX, 9XXXXXXXXX
  return /^(\+?63|0)?9\d{9}$/.test(clean)
}

function validateForm() {

  
  if (!form.value.firstName.trim()) {
    errorMessage.value = 'First name is required'
    return false
  }
  if (!form.value.lastName.trim()) {
    errorMessage.value = 'Last name is required'
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

  if (form.value.phone && !validatePhone(form.value.phone)) {
  errorMessage.value = 'Enter a valid PH phone number (e.g., 09171234567)'
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