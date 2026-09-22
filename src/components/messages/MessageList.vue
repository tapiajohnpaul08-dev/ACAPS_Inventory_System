<!-- src/components/messages/MessageList.vue -->
<template>
  <div class="h-full flex flex-col rounded-2xl overflow-hidden border bg-white" style="border-color: #e5e7eb;">

    <!-- Header / Search -->
    <div class="shrink-0 px-4 pt-4 pb-3 border-b" style="border-color: #e5e7eb;">
      <div class="flex items-center justify-between mb-3">
        <span class="text-sm font-semibold text-gray-900">
          Conversations
          <span
            v-if="messages.length"
            class="ml-1.5 px-1.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-600"
          >
            {{ messages.length }}
          </span>
        </span>

        <span v-if="unreadCount > 0" class="flex items-center gap-1 text-xs font-medium text-red-600">
          <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
          {{ unreadCount }} unread
        </span>
      </div>

      <!-- Search input -->
      <div class="relative">
        <svg
          class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          v-model="search"
          type="text"
          placeholder="Search name, email, or message…"
          class="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
        />
      </div>
    </div>

    <!-- Loading skeleton -->
    <div v-if="isLoading" class="flex-1 overflow-y-auto">
      <div
        v-for="i in 6"
        :key="i"
        class="px-4 py-3.5 flex gap-3 animate-pulse border-b border-gray-100"
      >
        <div class="w-10 h-10 rounded-full bg-gray-200 shrink-0"></div>
        <div class="flex-1 space-y-2">
          <div class="h-3 bg-gray-200 rounded w-2/3"></div>
          <div class="h-2.5 bg-gray-100 rounded w-full"></div>
          <div class="h-2 bg-gray-100 rounded w-1/3"></div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-else-if="groupedConversations.length === 0"
      class="flex-1 flex flex-col items-center justify-center p-6 text-center"
    >
      <div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
        <svg
          class="w-6 h-6 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
          />
        </svg>
      </div>
      <p class="text-sm font-medium text-gray-700">
        {{ search ? 'No results found' : 'No conversations yet' }}
      </p>
      <p class="text-xs mt-1 text-gray-400">
        {{ search ? 'Try a different search term' : 'Customer messages will appear here' }}
      </p>
    </div>

    <!-- Conversations, grouped unread → earlier -->
    <div v-else class="flex-1 overflow-y-auto">
      <template v-for="(group, gi) in groupedConversations" :key="gi">
        <!-- Section header (only shown when there's a mix of unread & read) -->
        <div
          v-if="group.label"
          class="sticky top-0 z-10 px-4 py-1.5 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider"
          :class="
            group.key === 'unread'
              ? 'bg-blue-50/95 backdrop-blur-sm text-blue-700 border-b border-blue-100'
              : 'bg-gray-50/95 backdrop-blur-sm text-gray-400 border-b border-gray-100'
          "
        >
          <span>{{ group.label }}</span>
          <span :class="group.key === 'unread' ? 'text-blue-500' : 'text-gray-300'">
            {{ group.items.length }}
          </span>
        </div>

        <!-- Items -->
        <div
          v-for="msg in group.items"
          :key="msg.id"
          class="conversation-item px-4 py-3.5 cursor-pointer transition-all relative group"
          :class="{ 'item-selected': selectedId === msg.id }"
          @click="$emit('select', msg)"
        >
          <!-- Unread left bar -->
          <div v-if="group.key === 'unread'" class="unread-bar"></div>

          <div class="flex items-start gap-3">
            <!-- Avatar with unread indicator -->
            <div class="relative shrink-0">
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold uppercase"
                :style="{ background: getAvatarColor(msg.name) }"
              >
                {{ (msg.name || '?')[0] }}
              </div>
              <div
                v-if="group.key === 'unread'"
                class="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-blue-500 border-2 border-white"
              ></div>
            </div>

            <div class="flex-1 min-w-0">
              <!-- Row 1: name + time -->
              <div class="flex items-center justify-between mb-0.5 gap-2">
                <p
                  class="text-sm truncate"
                  :class="group.key === 'unread' ? 'font-bold text-gray-900' : 'font-semibold text-gray-700'"
                >
                  {{ msg.name }}
                </p>
                <span
                  class="text-[10px] shrink-0"
                  :class="group.key === 'unread' ? 'text-blue-600 font-semibold' : 'text-gray-400'"
                >
                  {{ msg.date }}
                </span>
              </div>

              <!-- Row 2: preview -->
              <p
                class="text-xs truncate leading-snug"
                :class="group.key === 'unread' ? 'text-gray-700' : 'text-gray-400'"
              >
                {{ msg.preview || 'No messages yet' }}
              </p>

              <!-- Row 3: badges -->
              <div class="flex items-center gap-1.5 mt-1">
                <span
                  v-if="msg.orderId"
                  class="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-amber-50 text-amber-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="9"
                    height="9"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  </svg>
                  {{ msg.orderId }}
                </span>

                <span
                  v-if="msg.adminUnreadCount > 0"
                  class="ml-auto inline-flex items-center justify-center min-w-[18px] h-[18px] px-1.5 rounded-full text-white text-[10px] font-bold"
                  style="background: #2563eb;"
                >
                  {{ msg.adminUnreadCount > 99 ? '99+' : msg.adminUnreadCount }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  messages:   { type: Array, required: true },
  selectedId: { type: [String, null], default: null },
  isLoading:  { type: Boolean, default: false },
})

defineEmits(['select'])

const search = ref('')

const unreadCount = computed(() => props.messages.filter((m) => !m.read).length)

// Search filter — same as before
const filteredMessages = computed(() => {
  const q = search.value.toLowerCase().trim()
  if (!q) return props.messages
  return props.messages.filter(
    (m) =>
      m.name?.toLowerCase().includes(q) ||
      m.email?.toLowerCase().includes(q) ||
      m.subject?.toLowerCase().includes(q) ||
      m.preview?.toLowerCase().includes(q),
  )
})

// ── Sort helper ──────────────────────────────────────
// Pick the newest usable timestamp. Prefers lastMessageAt (set on both
// initial fetch now, and on each socket update), falls back to updatedAt
// then createdAt. Returns 0 if none are present so the item sorts last.
function getTimestamp(msg) {
  return msg.lastMessageAt || msg.updatedAt || msg.createdAt || 0
}

function sortByNewest(a, b) {
  const ta = new Date(getTimestamp(a)).getTime() || 0
  const tb = new Date(getTimestamp(b)).getTime() || 0
  return tb - ta
}

// ── Grouped, sorted conversations ────────────────────
//   • Unread group: newest first
//   • Read group:   newest first, labelled "Earlier"
//
// When only one side has items, we collapse to a single unlabeled group
// so no pointless "Unread" header appears above a list of all-read threads.
const groupedConversations = computed(() => {
  const all = [...filteredMessages.value]

  const unread = all.filter((m) => !m.read).sort(sortByNewest)
  const read = all.filter((m) => m.read).sort(sortByNewest)

  const groups = []
  if (unread.length > 0) groups.push({ key: 'unread', label: 'Unread', items: unread })
  if (read.length > 0) groups.push({ key: 'read', label: 'Earlier', items: read })

  if (groups.length === 1) {
    return [{ ...groups[0], label: '' }]
  }
  return groups
})

// Deterministic avatar colour from name
const AVATAR_COLORS = [
  '#2563eb', '#7c3aed', '#db2777', '#dc2626', '#d97706',
  '#059669', '#0891b2', '#4f46e5', '#c026d3', '#65a30d',
]
const getAvatarColor = (name = '') => {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
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

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
.animate-pulse {
  animation: pulse 2s ease infinite;
}

/* Slim scrollbar */
.overflow-y-auto::-webkit-scrollbar { width: 6px; }
.overflow-y-auto::-webkit-scrollbar-track { background: transparent; }
.overflow-y-auto::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 3px; }
.overflow-y-auto::-webkit-scrollbar-thumb:hover { background: #d1d5db; }
</style>