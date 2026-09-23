<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isDragging"
        class="fixed inset-0 z-[9998] flex items-center justify-center pointer-events-none"
        style="background: rgba(37, 99, 235, 0.08); backdrop-filter: blur(2px);"
      >
        <div class="border-4 border-dashed border-blue-500 rounded-3xl px-10 py-8 bg-white/90 shadow-2xl">
          <div class="flex flex-col items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" stroke-width="1.5" class="text-blue-600">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            <p class="text-lg font-bold text-blue-700">Drop to upload</p>
            <p class="text-xs text-gray-500">Files will be attached to the current form or chat</p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useGlobalDropZone } from '@/composables/useGlobalDropZone'

// This is the ONLY component that should wire the global listeners.
// Every other consumer just calls registerDropTarget().
const { isDragging, init, destroy } = useGlobalDropZone()

onMounted(() => init())
onUnmounted(() => destroy())
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>