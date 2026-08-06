<!-- src/admin/components/AdminLoadingModal.vue -->
<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="visible"
        class="fixed inset-0 z-[9999] flex items-center justify-center"
      >
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        
        <div class="relative bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4">
          <div class="flex flex-col items-center text-center">
            <!-- Spinner -->
            <div class="relative mb-6">
              <div class="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
              <div 
                class="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 rounded-full animate-spin"
                style="border-right-color: transparent; border-bottom-color: transparent;"
              ></div>
              <div v-if="icon" class="absolute inset-0 flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="iconPath" />
                </svg>
              </div>
            </div>

            <h3 class="text-lg font-bold text-gray-900 mb-1">{{ title }}</h3>
            <p class="text-sm text-gray-500 mb-4">{{ message }}</p>

            <!-- Progress Bar -->
            <div v-if="showProgress" class="w-full mt-2">
              <div class="flex justify-between text-xs text-gray-500 mb-1">
                <span>{{ progressLabel }}</span>
                <span>{{ progress }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div 
                  class="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                  :style="{ width: progress + '%' }"
                ></div>
              </div>
            </div>

            <!-- Cancel Button -->
            <button
              v-if="showCancel"
              @click="handleCancel"
              class="mt-4 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {{ cancelText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, watch, onUnmounted } from 'vue'

const props = defineProps({
  visible: { type: Boolean, default: false },
  title: { type: String, default: 'Loading...' },
  message: { type: String, default: 'Please wait while we process your request.' },
  icon: { type: String, default: null },
  showProgress: { type: Boolean, default: false },
  progress: { type: Number, default: 0 },
  progressLabel: { type: String, default: 'Progress' },
  showCancel: { type: Boolean, default: false },
  cancelText: { type: String, default: 'Cancel' },
  duration: { type: Number, default: 0 }
})

const emit = defineEmits(['cancel', 'complete'])

const iconPaths = {
  upload: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12',
  save: 'M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4',
  delete: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16',
  process: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  order: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
  email: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  driver: 'M14 18V6a2 2 0 00-2-2H4a2 2 0 00-2 2v11a1 1 0 001 1h2m4-6h4m-4-4h4M18 14v4m0 0h-2m2 0h2m-2-12l3 3-3 3',
  payment: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z'
}

const iconPath = computed(() => {
  return props.icon ? iconPaths[props.icon] || iconPaths.process : ''
})

let timer = null

watch(() => props.visible, (newVal) => {
  if (newVal && props.duration > 0) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      emit('complete')
    }, props.duration)
  }
  if (!newVal) {
    clearTimeout(timer)
  }
})

function handleCancel() {
  clearTimeout(timer)
  emit('cancel')
}

onUnmounted(() => {
  clearTimeout(timer)
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .relative {
  transform: scale(0.95) translateY(10px);
  opacity: 0;
}
.modal-leave-to .relative {
  transform: scale(0.95) translateY(10px);
  opacity: 0;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
.animate-spin {
  animation: spin 0.8s linear infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
.animate-pulse {
  animation: pulse 1.5s ease-in-out infinite;
}
</style>