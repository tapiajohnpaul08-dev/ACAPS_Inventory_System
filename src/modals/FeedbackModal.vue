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
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-vue-next'

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