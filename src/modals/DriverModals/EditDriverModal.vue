<!-- src/modals/EditDriverModal.vue -->
<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="closeModal"
      >
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeModal" />
        
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col">
          <div class="flex items-start justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0 bg-gradient-to-r from-orange-50 to-white rounded-t-2xl">
            <div>
              <h2 class="text-lg font-semibold text-gray-900 leading-snug">
                Edit Driver Account
              </h2>
              <p class="text-sm text-gray-500">{{ displayName }} - {{ driver?.driverId || 'N/A' }}</p>
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
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Middle Name</label>
                    <input
                      v-model="formData.middleName"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Last Name *</label>
                    <input
                      v-model="formData.lastName"
                      type="text"
                      required
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>
                <div class="grid grid-cols-3 gap-3 mt-3">
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Driver ID</label>
                    <input
                      :value="driver?.driverId || 'N/A'"
                      type="text"
                      disabled
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 text-sm cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Username</label>
                    <input
                      :value="driver?.username || 'N/A'"
                      type="text"
                      disabled
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 text-sm cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      :value="driver?.email || 'N/A'"
                      type="email"
                      disabled
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 text-sm cursor-not-allowed"
                    />
                  </div>
                </div>
                <div class="mt-3">
                  <label class="block text-xs font-medium text-gray-700 mb-1">Phone Number *</label>
                  <div class="flex items-center gap-2">
                    <span class="text-gray-500 border border-gray-200 px-3 py-2 rounded-lg bg-gray-50 text-sm">+63</span>
                    <input
                      v-model="formData.phoneNumber"
                      type="tel"
                      required
                      class="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>
              </div>

              <!-- Vehicle Information & Availability -->
              <div class="grid grid-cols-2 gap-4">
                <!-- Vehicle Information -->
                <div class="border border-gray-200 rounded-xl p-4">
                  <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <Car class="w-4 h-4" />
                    Vehicle Information
                  </p>
                  <div class="space-y-3">
                    <div>
                      <label class="block text-xs font-medium text-gray-700 mb-1">Plate Number *</label>
                      <input
                        v-model="formData.plateNumber"
                        type="text"
                        required
                        class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm uppercase"
                      />
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-gray-700 mb-1">Vehicle Description</label>
                      <input
                        v-model="formData.vehicleDescription"
                        type="text"
                        class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                        placeholder="e.g., White Isuzu Elf"
                      />
                    </div>
                  </div>
                </div>

                <!-- Availability & Max Orders -->
                <div class="border border-gray-200 rounded-xl p-4">
                  <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Availability</p>
                  <div class="space-y-4">
                    <div class="flex items-center gap-3">
                      <input
                        v-model="formData.available"
                        type="checkbox"
                        class="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <label class="text-sm text-gray-700">Available for delivery</label>
                    </div>
                    <p class="text-xs text-gray-400">
                      {{ formData.available ? 'Driver is currently available for delivery assignments.' : 'Driver is currently unavailable.' }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Password Reset -->
              <div class="border border-gray-200 rounded-xl p-4">
                <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <Lock class="w-4 h-4" />
                  Reset Password
                </p>
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">New Password</label>
                  <input
                    v-model="formData.newPassword"
                    type="password"
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    placeholder="Leave blank to keep current password"
                  />
                  <p class="text-xs text-gray-400 mt-1">Minimum 6 characters. Leave blank to keep current password.</p>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex gap-3 pt-4">
                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="flex-1 flex items-center justify-center gap-2 py-2.5 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save v-if="!isSubmitting" class="w-4 h-4" />
                  <Loader2 v-else class="w-4 h-4 animate-spin" />
                  {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
                </button>
                <button
                  type="button"
                  @click="closeModal"
                  class="flex-1 py-2.5 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors text-sm font-semibold"
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
import { X, Car, Lock, Save, Loader2 } from 'lucide-vue-next'

const props = defineProps({
  show: { type: Boolean, required: true },
  driver: { type: Object, required: true }
})

const emit = defineEmits(['close', 'submit'])

const isSubmitting = ref(false)

const displayName = computed(() => {
  const driver = props.driver
  if (driver.firstName && driver.lastName) {
    return `${driver.firstName} ${driver.lastName}`
  }
  return driver.name || driver.email || 'Driver'
})

// Form data
const formData = ref({
  firstName: '',
  middleName: '',
  lastName: '',
  phoneNumber: '',
  plateNumber: '',
  vehicleDescription: '',
  available: true,
  newPassword: ''
})

// Watch for driver changes to populate form
watch(() => props.driver, (newDriver) => {
  if (newDriver) {
    populateForm(newDriver)
  }
}, { immediate: true })

function populateForm(driver) {
  formData.value = {
    firstName: driver.firstName || '',
    middleName: driver.middleName || '',
    lastName: driver.lastName || '',
    phoneNumber: driver.phoneNumber || '',
    plateNumber: driver.plateNumber || '',
    vehicleDescription: driver.vehicleDescription || '',
    available: driver.available !== undefined ? driver.available : true,
    newPassword: ''
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
  
  const updatedData = {
    firstName: formData.value.firstName,
    middleName: formData.value.middleName,
    lastName: formData.value.lastName,
    phoneNumber: formData.value.phoneNumber,
    plateNumber: formData.value.plateNumber.toUpperCase(),
    vehicleDescription: formData.value.vehicleDescription,
    available: formData.value.available,
  }
  
  if (formData.value.newPassword && formData.value.newPassword.length >= 6) {
    updatedData.password = formData.value.newPassword
  }
  
  emit('submit', updatedData)
  
  isSubmitting.value = false
  
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