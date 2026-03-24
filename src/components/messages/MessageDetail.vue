<template>
  <div class="lg:col-span-2">
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 h-full">

      <!-- Empty state -->
      <div v-if="!message" class="p-12 text-center text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          class="w-16 h-16 mx-auto mb-4 text-gray-300">
          <rect width="20" height="16" x="2" y="4" rx="2"/>
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
        </svg>
        <p>Select a message to view details</p>
      </div>

      <!-- Message detail -->
      <div v-else class="flex flex-col h-full">
        <!-- Header -->
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center
                          text-white font-bold">
                {{ message.name[0] }}
              </div>
              <div>
                <p class="text-sm font-semibold text-gray-900">{{ message.name }}</p>
                <p class="text-xs text-gray-500">{{ message.email }}</p>
              </div>
            </div>
            <p class="text-xs text-gray-400">{{ message.date }}</p>
          </div>
          <h2 class="text-base font-bold text-gray-900 mt-4">{{ message.subject }}</h2>
        </div>

        <!-- Body -->
        <div class="p-6 flex-1">
          <p class="text-sm text-gray-700 leading-relaxed">{{ message.preview }}</p>
        </div>

        <!-- Reply box -->
        <div class="p-6 border-t border-gray-200">
          <textarea
            v-model="reply"
            rows="3"
            placeholder="Type your reply..."
            class="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-xl text-sm
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white
                   transition-all resize-none"
          />
          <div class="flex justify-end mt-3">
            <button
              class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium
                     rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors"
              @click="sendReply"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="w-4 h-4">
                <path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>
              </svg>
              Send Reply
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  message: { type: Object, default: null },
})

const emit = defineEmits(['reply'])

const reply = ref('')

// Clear reply box when switching messages
watch(() => props.message?.id, () => { reply.value = '' })

function sendReply() {
  if (!reply.value.trim()) return
  emit('reply', { messageId: props.message.id, text: reply.value })
  reply.value = ''
}
</script>