<template>
  <div class="lg:col-span-1">
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">

      <!-- Search -->
      <div class="p-4 border-b border-gray-200">
        <div class="relative">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
          <input
            v-model="search"
            type="text"
            placeholder="Search messages..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg
                   focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
      </div>

      <!-- Message items -->
      <div class="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
        <div
          v-for="msg in filteredMessages"
          :key="msg.id"
          class="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
          :class="{ 'bg-blue-50/30': !msg.read, 'bg-white': msg.read,
                    'ring-2 ring-inset ring-blue-200': selectedId === msg.id }"
          @click="$emit('select', msg)"
        >
          <!-- Header row -->
          <div class="flex items-start justify-between mb-2">
            <div class="flex items-center gap-2">
              <!-- Avatar -->
              <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center
                          text-white text-sm font-medium flex-shrink-0">
                {{ msg.name[0] }}
              </div>
              <div>
                <p class="text-sm font-semibold text-gray-900" :class="{ 'font-bold': !msg.read }">
                  {{ msg.name }}
                </p>
                <p class="text-xs text-gray-500">{{ msg.email }}</p>
              </div>
            </div>

            <!-- Read/unread icon -->
            <!-- Unread: filled mail -->
            <svg v-if="!msg.read" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              class="w-4 h-4 text-blue-600 flex-shrink-0">
              <rect width="20" height="16" x="2" y="4" rx="2"/>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
            <!-- Read: open mail -->
            <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              class="w-4 h-4 text-gray-400 flex-shrink-0">
              <path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z"/>
              <path d="m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10"/>
            </svg>
          </div>

          <!-- Subject + preview -->
          <p class="text-sm text-gray-900 mb-1" :class="{ 'font-medium': !msg.read }">
            {{ msg.subject }}
          </p>
          <p class="text-xs text-gray-500 line-clamp-2">{{ msg.preview }}</p>
          <p class="text-xs text-gray-400 mt-2">{{ msg.date }}</p>

          <!-- Replied badge -->
          <span v-if="msg.replyStatus === 'replied'"
            class="inline-block mt-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
            Replied
          </span>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  messages:   { type: Array,  required: true },
  selectedId: { type: [Number, null], default: null },
})

defineEmits(['select'])

const search = ref('')

const filteredMessages = computed(() => {
  const q = search.value.toLowerCase()
  if (!q) return props.messages
  return props.messages.filter(m =>
    m.name.toLowerCase().includes(q)    ||
    m.email.toLowerCase().includes(q)   ||
    m.subject.toLowerCase().includes(q) ||
    m.preview.toLowerCase().includes(q)
  )
})
</script>