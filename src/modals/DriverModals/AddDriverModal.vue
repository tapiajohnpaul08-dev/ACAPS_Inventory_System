<!-- src/modals/AddDriverModal.vue -->
<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="close"
      >
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="close" />
        
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto">
          <div class="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center rounded-t-2xl bg-gradient-to-r from-orange-50 to-white">
            <div>
              <h2 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Truck class="w-5 h-5 text-orange-600" />
                Add New Driver
              </h2>
              <p class="text-sm text-gray-500">Enter driver and vehicle details</p>
            </div>
            <button @click="close" class="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all">
              <X class="w-5 h-5" />
            </button>
          </div>

          <form @submit.prevent="submit" class="p-6 space-y-4">
            <!-- Name Fields - 3 columns -->
            <div class="grid grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                <input
                  v-model="form.firstName"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                  placeholder="John"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
                <input
                  v-model="form.middleName"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                  placeholder="Santos"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                <input
                  v-model="form.lastName"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                  placeholder="Doe"
                />
              </div>
            </div>

            <!-- Account Credentials - 2 columns -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Username *</label>
                <input
                  v-model="form.username"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                  placeholder="johndoe"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                <input
                  v-model="form.email"
                  type="email"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
              <div class="flex items-center gap-2">
                <span class="text-gray-500 border border-gray-300 px-3 py-2 rounded-lg bg-gray-50 text-sm">+63</span>
                <input
                  v-model="form.phoneNumber"
                  type="tel"
                  required
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                  placeholder="912 345 6789"
                />
              </div>
            </div>

            <!-- Vehicle Information -->
            <div class="border-t border-gray-200 pt-4">
              <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Car class="w-4 h-4 text-gray-500" />
                Vehicle Information
              </h3>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Plate Number *</label>
                  <input
                    v-model="form.plateNumber"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 uppercase text-sm"
                    placeholder="ABC-1234"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Vehicle Description</label>
                  <input
                    v-model="form.vehicleDescription"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                    placeholder="e.g., White Isuzu Elf"
                  />
                </div>
              </div>
            </div>

            <!-- Availability & Password - 2 columns -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                <div class="flex items-center gap-3 pt-1">
                  <input
                    v-model="form.available"
                    type="checkbox"
                    class="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <label class="text-sm text-gray-700">Available for delivery</label>
                </div>
              </div>
              <!-- <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Max Orders</label>
                <input
                  v-model.number="form.maxOrders"
                  type="number"
                  min="1"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                  placeholder="5"
                />
                <p class="text-xs text-gray-400 mt-1">Maximum orders driver can handle</p>
              </div> -->
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
                    minlength="6"
                    class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                    placeholder="Min 6 characters"
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
                    class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
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
                class="flex-1 px-4 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm font-semibold"
              >
                <span v-if="isSubmitting" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                {{ isSubmitting ? 'Creating...' : 'Add Driver' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'
import { X, Truck, Car, Eye, EyeOff } from 'lucide-vue-next'

const props = defineProps({
  show: { type: Boolean, default: false },
  loading: { type: Boolean, default: false }
})

const emit = defineEmits(['close', 'submit'])

const form = ref({
  firstName: '',
  middleName: '',
  lastName: '',
  username: '',
  email: '',
  phoneNumber: '',
  plateNumber: '',
  vehicleDescription: '',
  available: true,
  maxOrders: 5,
  password: '',
  confirmPassword: ''
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isSubmitting = ref(false)
const errorMessage = ref('')

// Reset form when modal opens
watch(() => props.show, (newVal) => {
  if (newVal) {
    form.value = {
      firstName: '',
      middleName: '',
      lastName: '',
      username: '',
      email: '',
      phoneNumber: '',
      plateNumber: '',
      vehicleDescription: '',
      available: true,
      maxOrders: 5,
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
  if (!form.value.phoneNumber.trim()) {
    errorMessage.value = 'Phone number is required'
    return false
  }
  if (!form.value.plateNumber.trim()) {
    errorMessage.value = 'Plate number is required'
    return false
  }
  if (!form.value.password) {
    errorMessage.value = 'Password is required'
    return false
  }
  if (form.value.password.length < 6) {
    errorMessage.value = 'Password must be at least 6 characters'
    return false
  }
  if (form.value.password !== form.value.confirmPassword) {
    errorMessage.value = 'Passwords do not match'
    return false
  }
  return true
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
    phoneNumber: form.value.phoneNumber,
    plateNumber: form.value.plateNumber.toUpperCase(),
    vehicleDescription: form.value.vehicleDescription,
    available: form.value.available,
    maxOrders: form.value.maxOrders || 5,
    password: form.value.password
  }
  
  emit('submit', submitData)
  
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