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
                {{ account?.name || 'Account Details' }} - {{ account?.userId || 'N/A' }}
              </h2>
              <p class="text-sm text-gray-500 mt-0.5 capitalize">{{ account?.type?.replace('-', ' ') || 'Account' }}</p>
            </div>
            <button @click="closeModal" class="ml-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5">
                <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
              </svg>
            </button>
          </div>

          <div class="flex-1 overflow-y-auto px-6 py-5">
            <div v-if="account" class="space-y-5">
              <!-- Account ID and Status -->
              <div class="grid grid-cols-2 gap-4">
                <div class="bg-blue-50 rounded-xl p-4">
                  <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Account ID</p>
                  <p class="text-sm font-bold text-gray-900">{{ account.userId || 'N/A' }}</p>
                </div>
                <div class="bg-gray-50 rounded-xl p-4">
                  <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Status</p>
                  <span class="inline-flex px-2 py-1 rounded-full text-xs font-semibold"
                    :class="account.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                    {{ account.status || 'N/A' }}
                  </span>
                </div>
              </div>

              <!-- Contact Information -->
              <div class="border border-gray-200 rounded-xl p-4">
                <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Contact Information</p>
                <div class="space-y-2">
                  <div class="flex items-center gap-2 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="text-gray-400">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                    <span class="text-gray-700">{{ account.email || 'No email provided' }}</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="text-gray-400">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                    <span class="text-gray-700">{{ account.phone || 'No phone number' }}</span>
                  </div>
                  <div v-if="account.address" class="flex items-start gap-2 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="text-gray-400 mt-0.5">
                      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    <span class="text-gray-700">{{ account.address }}</span>
                  </div>
                </div>
              </div>

              <!-- Customer Specific Stats -->
              <div v-if="account.type === 'customer'" class="grid grid-cols-2 gap-4">
                <div class="bg-green-50 rounded-xl p-4">
                  <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Total Orders</p>
                  <p class="text-2xl font-black text-green-700">{{ account.ordersCount || 0 }}</p>
                </div>
                <div class="bg-purple-50 rounded-xl p-4">
                  <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Total Spent</p>
                  <p class="text-2xl font-black text-purple-700">{{ account.totalSpent || '₱0' }}</p>
                </div>
              </div>

              <!-- Admin Specific Details -->
              <div v-if="account.type !== 'customer'" class="border border-gray-200 rounded-xl p-4">
                <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Employment Details</p>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-xs text-gray-400">Role</p>
                    <p class="text-sm font-semibold text-gray-900">{{ account.role || 'N/A' }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-400">Department</p>
                    <p class="text-sm font-semibold text-gray-900">{{ account.department || 'N/A' }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-400">Created At</p>
                    <p class="text-sm text-gray-700">{{ account.createdAt || 'N/A' }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-400">Last Login</p>
                    <p class="text-sm text-gray-700">{{ account.lastLogin || account.lastActive || 'N/A' }}</p>
                  </div>
                </div>
              </div>

              <!-- Additional Info for Customers -->
              <div v-if="account.type === 'customer' && (account.paymentTerms || account.createdAt)" class="border border-gray-200 rounded-xl p-4">
                <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Additional Information</p>
                <div class="grid grid-cols-2 gap-4">
                  <div v-if="account.paymentTerms">
                    <p class="text-xs text-gray-400">Payment Terms</p>
                    <p class="text-sm font-semibold text-gray-900">{{ account.paymentTerms }}</p>
                  </div>
                  <div v-if="account.createdAt">
                    <p class="text-xs text-gray-400">Customer Since</p>
                    <p class="text-sm text-gray-700">{{ account.createdAt }}</p>
                  </div>
                </div>
              </div>

              <!-- Permissions (for admins) -->
              <div v-if="account.permissions && account.permissions.length" class="border border-gray-200 rounded-xl p-4">
                <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Permissions</p>
                <div class="flex flex-wrap gap-2">
                  <span v-for="perm in account.permissions" :key="perm" 
                    class="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium">
                    {{ perm.replace(/_/g, ' ') }}
                  </span>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex gap-3 pt-4">
                <button @click="handleEdit" 
                  class="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-semibold">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4">
                    <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>
                  </svg>
                  Edit Account
                </button>
                <button @click="closeModal" 
                  class="flex-1 flex items-center justify-center gap-2 py-2.5 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors text-sm font-semibold">
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
import { onMounted, onUnmounted } from 'vue'

const props = defineProps({
  show: { type: Boolean, required: true },
  account: { type: Object, required: true }
})

const emit = defineEmits(['close', 'edit'])

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
  emit('edit', props.account)
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