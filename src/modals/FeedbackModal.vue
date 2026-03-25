<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="close"
      >
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="close" />
        
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
          <!-- Icon -->
          <div class="flex justify-center pt-6">
            <div 
              class="w-16 h-16 rounded-full flex items-center justify-center"
              :class="iconBgClass"
            >
              <component :is="iconComponent" class="w-8 h-8" :class="iconColorClass" />
            </div>
          </div>
          
          <!-- Content -->
          <div class="p-6 text-center">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ title }}</h3>
            <p class="text-sm text-gray-500">{{ message }}</p>
          </div>
          
          <!-- Button -->
          <div class="px-6 pb-6">
            <button
              @click="close"
              class="w-full py-2.5 rounded-xl text-sm font-semibold transition-colors"
              :class="buttonClass"
            >
              {{ buttonText }}
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
  show: { type: Boolean, required: true },
  type: { type: String, default: 'success' }, // 'success', 'error', 'warning', 'info'
  title: { type: String, default: '' },
  message: { type: String, default: '' },
  buttonText: { type: String, default: 'OK' }
})

const emit = defineEmits(['close'])

const iconComponent = computed(() => {
  switch(props.type) {
    case 'success':
      return SuccessIcon
    case 'error':
      return ErrorIcon
    case 'warning':
      return WarningIcon
    default:
      return InfoIcon
  }
})

const iconBgClass = computed(() => {
  switch(props.type) {
    case 'success':
      return 'bg-green-100'
    case 'error':
      return 'bg-red-100'
    case 'warning':
      return 'bg-yellow-100'
    default:
      return 'bg-blue-100'
  }
})

const iconColorClass = computed(() => {
  switch(props.type) {
    case 'success':
      return 'text-green-600'
    case 'error':
      return 'text-red-600'
    case 'warning':
      return 'text-yellow-600'
    default:
      return 'text-blue-600'
  }
})

const buttonClass = computed(() => {
  switch(props.type) {
    case 'success':
      return 'bg-green-600 hover:bg-green-700 text-white'
    case 'error':
      return 'bg-red-600 hover:bg-red-700 text-white'
    case 'warning':
      return 'bg-yellow-600 hover:bg-yellow-700 text-white'
    default:
      return 'bg-blue-600 hover:bg-blue-700 text-white'
  }
})

const SuccessIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  `
}

const ErrorIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  `
}

const WarningIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  `
}

const InfoIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  `
}

function close() {
  emit('close')
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