<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <!-- Header -->
    <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
          <Handshake class="w-4 h-4 text-amber-600" />
        </div>
        <div>
          <h3 class="text-sm font-bold text-gray-900 leading-tight">Pending Negotiations</h3>
          <p class="text-[11px] text-gray-400">Orders waiting for pricing agreement</p>
        </div>
        <span
          v-if="items.length > 0"
          class="ml-1 bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full font-bold"
        >
          {{ items.length }}
        </span>
      </div>
      <button
        @click="$emit('refresh')"
        :disabled="isLoading"
        class="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
        title="Refresh"
      >
        <RefreshCw :class="['w-4 h-4', isLoading ? 'animate-spin' : '']" />
      </button>
    </div>

    <!-- Loading -->
    <div v-if="isLoading && items.length === 0" class="p-6 text-center">
      <div class="inline-block w-6 h-6 border-2 border-gray-200 border-t-amber-600 rounded-full animate-spin"></div>
      <p class="text-xs text-gray-400 mt-2">Loading…</p>
    </div>

    <!-- Empty state -->
    <div v-else-if="items.length === 0" class="p-8 text-center">
      <div class="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-2">
        <CheckCircle2 class="w-6 h-6 text-green-500" />
      </div>
      <p class="text-sm font-semibold text-gray-600">All caught up!</p>
      <p class="text-xs text-gray-400 mt-0.5">No orders are waiting for negotiation.</p>
    </div>

    <!-- List -->
    <div v-else class="divide-y divide-gray-50">
      <button
        v-for="item in items"
        :key="item.conversationId"
        @click="$emit('open', item)"
        class="w-full text-left px-5 py-3 hover:bg-amber-50/40 transition-colors group"
      >
        <div class="flex items-center gap-3">
          <div
            class="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
          >
            {{ getInitial(item.customerName) }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between gap-2">
              <p class="text-sm font-semibold text-gray-900 truncate">
                {{ item.customerName || 'Customer' }}
              </p>
              <span class="text-[10px] text-gray-400 flex-shrink-0">
                {{ formatRelative(item.lastMessageAt) }}
              </span>
            </div>
            <div class="flex items-center justify-between gap-2 mt-0.5">
              <p class="text-xs text-gray-500 font-mono truncate">{{ item.orderId }}</p>
              <p class="text-xs font-bold text-amber-700 flex-shrink-0">
                ₱{{ (item.amount || 0).toLocaleString() }}
              </p>
            </div>
            <p
              v-if="item.lastMessage"
              class="text-[11px] text-gray-400 truncate mt-0.5"
            >
              {{ item.lastMessage }}
            </p>
          </div>
        </div>
        <div class="mt-2 flex items-center justify-end">
          <span
            class="text-[10px] font-semibold text-amber-600 group-hover:text-amber-700 inline-flex items-center gap-1"
          >
            Open negotiation
            <ArrowRight class="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </button>
    </div>

    <!-- Footer -->
    <div v-if="items.length > 0" class="px-5 py-3 bg-gray-50 border-t border-gray-100">
      <button
        @click="$emit('view-all')"
        class="w-full text-center text-xs text-blue-600 hover:text-blue-800 transition-colors flex items-center justify-center gap-1 font-semibold"
      >
        View all in Messages
        <ArrowRight class="w-3 h-3" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { Handshake, RefreshCw, CheckCircle2, ArrowRight } from 'lucide-vue-next'

defineProps({
  items: { type: Array, default: () => [] },
  isLoading: { type: Boolean, default: false },
})

defineEmits(['open', 'refresh', 'view-all'])

function getInitial(name) {
  if (!name) return '?'
  return name.charAt(0).toUpperCase()
}

function formatRelative(dateValue) {
  if (!dateValue) return ''
  const diff = Date.now() - new Date(dateValue).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'now'
  if (mins < 60) return `${mins}m`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d`
  return new Date(dateValue).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })
}
</script>