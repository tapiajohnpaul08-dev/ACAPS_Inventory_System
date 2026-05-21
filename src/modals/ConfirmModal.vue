<!-- modals/ConfirmModal.vue -->
<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div 
        v-if="show" 
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="handleCancel"
      >
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300"></div>
        
        <div class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 modal-slide-in overflow-hidden">
          <!-- Animated Icon -->
          <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div 
              class="rounded-full p-3 shadow-lg transition-all duration-300 animate-bounce-in"
              :class="iconBgClass"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" :class="iconColorClass" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path v-if="type === 'danger'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                <path v-else-if="type === 'warning'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <!-- Content -->
          <div class="pt-12 pb-6 px-6 text-center">
            <h3 class="text-lg font-bold text-gray-900 mb-2">{{ title }}</h3>
            <p class="text-sm text-gray-500 leading-relaxed">{{ message }}</p>
          </div>

          <!-- Actions -->
          <div class="flex gap-3 px-6 pb-6">
            <button
              @click="handleCancel"
              class="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200 transform hover:scale-[1.02]"
            >
              {{ cancelText }}
            </button>
            <button
              @click="handleConfirm"
              class="flex-1 px-4 py-2.5 text-sm font-semibold text-white rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-md hover:shadow-lg"
              :class="confirmButtonClass"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  show: { type: Boolean, default: false },
  type: { type: String, default: 'danger' },
  title: { type: String, default: 'Confirm Action' },
  message: { type: String, default: 'Are you sure you want to proceed?' },
  confirmText: { type: String, default: 'Confirm' },
  cancelText: { type: String, default: 'Cancel' }
})

const emit = defineEmits(['confirm', 'cancel'])

const iconBgClass = computed(() => {
  switch (props.type) {
    case 'danger': return 'bg-gradient-to-br from-red-500 to-red-600 shadow-red-200'
    case 'warning': return 'bg-gradient-to-br from-yellow-500 to-yellow-600 shadow-yellow-200'
    case 'success': return 'bg-gradient-to-br from-green-500 to-green-600 shadow-green-200'
    default: return 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-200'
  }
})

const iconColorClass = computed(() => {
  return 'text-white'
})

const confirmButtonClass = computed(() => {
  switch (props.type) {
    case 'danger': return 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800'
    case 'warning': return 'bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800'
    case 'success': return 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
    default: return 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
  }
})

function handleConfirm() {
  emit('confirm')
}

function handleCancel() {
  emit('cancel')
}
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-slide-in {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-bounce-in {
  animation: bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
  }
}
</style>