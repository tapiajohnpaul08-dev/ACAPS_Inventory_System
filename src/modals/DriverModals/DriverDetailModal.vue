<!-- src/modals/DriverDetailModal.vue -->
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
                {{ displayName }} - {{ driver?.driverId || 'N/A' }}
              </h2>
              <p class="text-sm text-gray-500 mt-0.5">Driver Account</p>
            </div>
            <button @click="closeModal" class="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all">
              <X class="w-5 h-5" />
            </button>
          </div>

          <div class="flex-1 overflow-y-auto px-6 py-4">
            <div v-if="driver" class="space-y-4">
              <!-- Driver ID and Status -->
              <div class="grid grid-cols-3 gap-3">
                <div class="bg-orange-50 rounded-xl p-3">
                  <p class="text-xs font-bold text-gray-400 uppercase tracking-wide">Driver ID</p>
                  <p class="text-sm font-bold text-gray-900">{{ driver.driverId || 'N/A' }}</p>
                </div>
                <div class="bg-gray-50 rounded-xl p-3">
                  <p class="text-xs font-bold text-gray-400 uppercase tracking-wide">Status</p>
                  <span 
                    class="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold"
                    :class="driver.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
                  >
                    {{ driver.available ? 'Available' : 'Unavailable' }}
                  </span>
                </div>
              </div>

              <!-- Contact Information & Name Details - Two columns -->
              <div class="grid grid-cols-2 gap-4">
                <!-- Contact Information -->
                <div class="border border-gray-200 rounded-xl p-4">
                  <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Contact Information</p>
                  <div class="space-y-2">
                    <div class="flex items-center gap-2 text-sm">
                      <Mail class="w-4 h-4 text-gray-400" />
                      <span class="text-gray-700 truncate">{{ driver.email || 'No email provided' }}</span>
                    </div>
                    <div class="flex items-center gap-2 text-sm">
                      <Phone class="w-4 h-4 text-gray-400" />
                      <span class="text-gray-700">{{ driver.phoneNumber || 'No phone number' }}</span>
                    </div>
                    <div class="flex items-center gap-2 text-sm">
                      <User class="w-4 h-4 text-gray-400" />
                      <span class="text-gray-700">Username: {{ driver.username || 'N/A' }}</span>
                    </div>
                  </div>
                </div>

                <!-- Name Details -->
                <div class="border border-gray-200 rounded-xl p-4">
                  <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Name Details</p>
                  <div class="grid grid-cols-3 gap-2">
                    <div>
                      <p class="text-xs text-gray-400">First</p>
                      <p class="text-sm font-semibold text-gray-900">{{ driver.firstName || 'N/A' }}</p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-400">Middle</p>
                      <p class="text-sm text-gray-700">{{ driver.middleName || 'N/A' }}</p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-400">Last</p>
                      <p class="text-sm font-semibold text-gray-900">{{ driver.lastName || 'N/A' }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Vehicle Information & Activity - Two columns -->
              <div class="grid grid-cols-2 gap-4">
                <!-- Vehicle Information -->
                <div class="border border-gray-200 rounded-xl p-4">
                  <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <Car class="w-4 h-4" />
                    Vehicle Information
                  </p>
                  <div class="space-y-2">
                    <div class="flex justify-between">
                      <span class="text-xs text-gray-500">Plate Number</span>
                      <span class="text-sm font-semibold text-gray-900 uppercase">{{ driver.plateNumber || 'N/A' }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-xs text-gray-500">Vehicle Description</span>
                      <span class="text-sm text-gray-700">{{ driver.vehicleDescription || 'N/A' }}</span>
                    </div>
                  </div>
                </div>

                <!-- Activity Information -->
                <div class="border border-gray-200 rounded-xl p-4">
                  <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Activity</p>
                  <div class="space-y-2">
                    <div class="flex justify-between">
                      <span class="text-xs text-gray-500">Created At</span>
                      <span class="text-sm text-gray-700">{{ formatDate(driver.createdAt) }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-xs text-gray-500">Last Login</span>
                      <span class="text-sm text-gray-700">{{ formatDate(driver.lastLogin) || 'Never' }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-xs text-gray-500">Assigned Orders</span>
                      <span class="text-sm font-semibold text-gray-900">{{ driver.assignedOrders || 0 }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex gap-3 pt-4">
                <button 
                  @click="handleEdit" 
                  class="flex-1 flex items-center justify-center gap-2 py-2.5 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors text-sm font-semibold"
                >
                  <Edit class="w-4 h-4" />
                  Edit Driver
                </button>
                <button 
                  @click="closeModal" 
                  class="flex-1 py-2.5 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors text-sm font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { X, Mail, Phone, User, Edit, Car } from 'lucide-vue-next'

const props = defineProps({
  show: { type: Boolean, required: true },
  driver: { type: Object, required: true }
})

const emit = defineEmits(['close', 'edit'])

const displayName = computed(() => {
  const driver = props.driver
  if (driver.firstName && driver.lastName) {
    return `${driver.firstName} ${driver.lastName}`
  }
  return driver.name || driver.email || 'Driver'
})

function formatDate(dateString) {
  if (!dateString) return null
  const date = new Date(dateString)
  return date.toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })
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

function handleEdit() {
  emit('edit', props.driver)
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
</style>