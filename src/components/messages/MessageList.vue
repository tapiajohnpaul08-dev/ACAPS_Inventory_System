<template>
  <div class="h-full flex flex-col rounded-2xl overflow-hidden border" style="background: var(--surface, #fff); border-color: var(--border, #e5e7eb);">

    <!-- Header / Search -->
    <div class="shrink-0 px-4 pt-4 pb-3 border-b" style="border-color: var(--border, #e5e7eb);">
      <div class="flex items-center justify-between mb-3">
        <span class="text-sm font-semibold" style="color: var(--text-primary, #111827);">
          Conversations
          <span v-if="messages.length" class="ml-1.5 px-1.5 py-0.5 rounded-md text-xs font-medium" style="background: #eff6ff; color: #2563eb;">
            {{ messages.length }}
          </span>
        </span>
        <!-- Unread dot -->
        <span v-if="unreadCount > 0" class="flex items-center gap-1 text-xs font-medium" style="color: #dc2626;">
          <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
          {{ unreadCount }} unread
        </span>
      </div>

      <!-- Search input -->
      <div class="relative">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style="color: var(--text-muted, #9ca3af);"
          xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
        </svg>
        <input
          v-model="search"
          type="text"
          placeholder="Search…"
          class="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs border focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          style="background: #f9fafb; border-color: var(--border, #e5e7eb); color: var(--text-primary, #111827);"
        />
      </div>
    </div>

    <!-- Loading skeleton -->
    <div v-if="isLoading" class="flex-1 overflow-y-auto divide-y" style="divide-color: var(--border, #e5e7eb);">
      <div v-for="i in 5" :key="i" class="p-4 flex gap-3 animate-pulse">
        <div class="w-9 h-9 rounded-full bg-gray-200 shrink-0"></div>
        <div class="flex-1 space-y-2">
          <div class="h-3 bg-gray-200 rounded w-2/3"></div>
          <div class="h-2.5 bg-gray-100 rounded w-full"></div>
          <div class="h-2 bg-gray-100 rounded w-1/3"></div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="filteredMessages.length === 0" class="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <div class="w-12 h-12 rounded-full flex items-center justify-center mb-3" style="background: #f3f4f6;">
        <svg class="w-6 h-6" style="color: #9ca3af;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"/>
        </svg>
      </div>
      <p class="text-sm font-medium" style="color: var(--text-secondary, #374151);">
        {{ search ? 'No results found' : 'No conversations yet' }}
      </p>
      <p class="text-xs mt-1" style="color: var(--text-muted, #9ca3af);">
        {{ search ? 'Try a different search term' : 'Customer messages will appear here' }}
      </p>
    </div>

    <!-- Conversation items -->
    <div v-else class="flex-1 overflow-y-auto">
      <div
        v-for="msg in filteredMessages"
        :key="msg.id"
        class="conversation-item px-4 py-3.5 cursor-pointer transition-all relative"
        :class="{
          'item-selected': selectedId === msg.id,
          'item-unread': !msg.read && selectedId !== msg.id,
        }"
        @click="$emit('select', msg)"
      >
        <!-- Unread left bar -->
        <div v-if="!msg.read" class="unread-bar"></div>

        <div class="flex items-start gap-3">
          <!-- Avatar -->
          <div
            class="avatar shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold uppercase"
            :style="{ background: getAvatarColor(msg.name) }"
          >
            {{ (msg.name || '?')[0] }}
          </div>

          <div class="flex-1 min-w-0">
            <!-- Row 1: name + time -->
            <div class="flex items-center justify-between mb-0.5">
              <p class="text-sm font-semibold truncate" :class="!msg.read ? 'text-gray-900' : 'text-gray-700'" style="max-width: 140px;">
                {{ msg.name }}
              </p>
              <span class="text-xs shrink-0 ml-1" style="color: #9ca3af;">{{ msg.date }}</span>
            </div>

            <!-- Row 2: subject -->
            <p class="text-xs truncate mb-0.5" :class="!msg.read ? 'font-semibold text-gray-800' : 'text-gray-600'">
              {{ msg.subject }}
            </p>

            <!-- Row 3: preview + badges -->
            <div class="flex items-center justify-between gap-1">
              <p class="text-xs truncate flex-1" style="color: #9ca3af;">{{ msg.preview }}</p>
              <div class="flex items-center gap-1 shrink-0">
                <!-- Unread count badge -->
                <span
                  v-if="msg.adminUnreadCount > 0"
                  class="w-4 h-4 rounded-full text-white text-[10px] font-bold flex items-center justify-center"
                  style="background: #2563eb; min-width: 16px;"
                >
                  {{ msg.adminUnreadCount > 9 ? '9+' : msg.adminUnreadCount }}
                </span>
                <!-- Status badge -->
                <span class="status-badge" :class="statusClass(msg.status)">
                  {{ statusLabel(msg.status) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  messages:   { type: Array,  required: true },
  selectedId: { type: [String, null], default: null },
  isLoading:  { type: Boolean, default: false },
})

defineEmits(['select'])

const search = ref('')

const unreadCount = computed(() => props.messages.filter((m) => !m.read).length)

const filteredMessages = computed(() => {
  const q = search.value.toLowerCase().trim()
  if (!q) return props.messages
  return props.messages.filter(
    (m) =>
      m.name?.toLowerCase().includes(q) ||
      m.email?.toLowerCase().includes(q) ||
      m.subject?.toLowerCase().includes(q) ||
      m.preview?.toLowerCase().includes(q)
  )
})

// Deterministic avatar colour from name
const AVATAR_COLORS = [
  '#2563eb','#7c3aed','#db2777','#dc2626','#d97706',
  '#059669','#0891b2','#4f46e5','#c026d3','#65a30d',
]
const getAvatarColor = (name = '') => {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

const statusLabel = (status) => {
  const map = { open: 'Open', in_progress: 'Active', resolved: 'Done', closed: 'Closed' }
  return map[status] || status || ''
}

const statusClass = (status) => {
  const map = {
    open:        'badge-open',
    in_progress: 'badge-active',
    resolved:    'badge-resolved',
    closed:      'badge-closed',
  }
  return map[status] || 'badge-open'
}
</script>

<style scoped>
.conversation-item {
  border-bottom: 1px solid #f3f4f6;
}
.conversation-item:last-child {
  border-bottom: none;
}
.conversation-item:hover {
  background: #f9fafb;
}
.item-selected {
  background: #eff6ff !important;
}
.item-unread {
  background: #fafafa;
}

.unread-bar {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 60%;
  border-radius: 0 2px 2px 0;
  background: #2563eb;
}

.status-badge {
  font-size: 10px;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: 9999px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}
.badge-open     { background: #dbeafe; color: #1d4ed8; }
.badge-active   { background: #fef9c3; color: #854d0e; }
.badge-resolved { background: #dcfce7; color: #166534; }
.badge-closed   { background: #f3f4f6; color: #6b7280; }

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
.animate-pulse { animation: pulse 2s ease infinite; }
</style>