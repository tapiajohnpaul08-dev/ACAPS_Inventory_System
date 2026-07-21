<template>
  <div class="h-screen flex flex-col" style="background: var(--bg-base); font-family: 'DM Sans', 'Segoe UI', sans-serif;">

    <!-- Top Header -->
    <header class="shrink-0 px-6 py-4 flex items-center justify-between border-b" style="background: var(--surface); border-color: var(--border);">
      <div>
        <h1 class="text-xl font-bold tracking-tight" style="color: var(--text-primary);">Customer Messages</h1>
        <p class="text-xs mt-0.5" style="color: var(--text-muted);">Real-time support inbox</p>
      </div>
      <div class="flex items-center gap-3">
        <!-- Live badge -->
        <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
          :class="isConnected ? 'badge-live' : 'badge-offline'">
          <span class="w-1.5 h-1.5 rounded-full" :class="isConnected ? 'dot-live' : 'dot-offline'"></span>
          {{ isConnected ? 'Live' : 'Reconnecting…' }}
        </div>

        <!-- Status filter -->
        <select
          v-model="statusFilter"
          @change="applyFilter"
          class="text-xs px-3 py-1.5 rounded-lg border cursor-pointer focus:outline-none"
          style="background: var(--surface); color: var(--text-secondary); border-color: var(--border);"
        >
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>

        <!-- Refresh -->
        <button
          @click="refreshConversations"
          :disabled="isLoading"
          class="p-2 rounded-lg transition-colors disabled:opacity-40"
          style="color: var(--text-muted);"
          title="Refresh"
        >
          <svg class="w-4 h-4" :class="{ 'spin': isLoading }" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </header>

    <!-- Stats Row -->
    <div class="shrink-0 px-6 pt-4">
      <MessageStatCards
        :total="totalMessages"
        :unread="unreadMessages"
        :pending="pendingReplies"
      />
    </div>

    <!-- Chat Grid -->
    <div class="flex-1 min-h-0 px-6 pb-6 pt-3">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
        <!-- Conversation list -->
        <div class="lg:col-span-1 h-full min-h-0">
          <MessageList
            :messages="filteredConversations"
            :selected-id="selectedConversation?.id ?? null"
            :is-loading="isLoading"
            @select="handleSelectConversation"
          />
        </div>

        <!-- Message detail panel -->
        <div class="lg:col-span-2 h-full min-h-0">
          <MessageDetail
            :message="selectedConversation"
            :messages="messages"
            :is-typing="isCustomerTyping"
            :is-loading-messages="isLoadingMessages"
            :on-send-reply="handleSendReply"
            :on-typing-indicator="handleTyping"
            :messages-container-ref-setter="(el) => (messagesContainerRef = el)"
            @reply="handleReplySent"
            @status-change="handleStatusChange"
          />
        </div>
      </div>
    </div>

    <!-- Image Viewer -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="showImageViewer"
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
          style="background: rgba(0,0,0,0.92);"
          @click.self="closeImageViewer"
        >
          <div class="relative max-w-4xl max-h-full">
            <img
              :src="viewerImage"
              class="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
            />
            <button
              @click="closeImageViewer"
              class="absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center text-white transition-colors"
              style="background: rgba(255,255,255,0.15); backdrop-filter: blur(8px);"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
              </svg>
            </button>
            <a
              :href="viewerImage"
              download
              class="absolute -bottom-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center text-white transition-colors"
              style="background: rgba(255,255,255,0.15); backdrop-filter: blur(8px);"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
            </a>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Toast -->
    <Teleport to="body">
      <Transition name="toast">
        <div
          v-if="toast.show"
          class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-xl text-sm font-medium"
          :style="toast.type === 'success'
            ? 'background: #16a34a; color: #fff;'
            : 'background: #dc2626; color: #fff;'"
        >
          <svg v-if="toast.type === 'success'" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {{ toast.message }}
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import MessageStatCards from '@/components/messages/MessageStatCards.vue'
import MessageList from '@/components/messages/MessageList.vue'
import MessageDetail from '@/components/messages/MessageDetail.vue'
import { useAdminChat } from '@/composables/useAdminChat'

const {
  conversations,
  selectedConversation,
  messages,
  totalMessages,
  unreadMessages,
  pendingReplies,
  isConnected,
  isCustomerTyping,
  isLoading,
  isLoadingMessages,
  messagesContainerRef,
  initSocket,
  loadConversations,
  selectConversation,
  sendReply,
  handleTyping,
  updateConversationStatus,
  cleanup,
} = useAdminChat()

// ── Local state ──────────────────────────────────────
const showImageViewer = ref(false)
const viewerImage     = ref('')
const statusFilter    = ref('')
const toast           = ref({ show: false, type: 'success', message: '' })

// ── Filtered conversations ────────────────────────────
const filteredConversations = computed(() => {
  if (!statusFilter.value) return conversations.value
  return conversations.value.filter((c) => c.status === statusFilter.value)
})

// ── Helpers ───────────────────────────────────────────
const showToast = (type, message) => {
  toast.value = { show: true, type, message }
  setTimeout(() => { toast.value.show = false }, 3000)
}

const openImageViewer = (url) => {
  viewerImage.value = url
  showImageViewer.value = true
}

const closeImageViewer = () => {
  showImageViewer.value = false
  viewerImage.value = ''
}

// ── Handlers ──────────────────────────────────────────

const handleSendReply = async (conversationId, content, attachments = [], replyToMessageId = null) => {
  const success = await sendReply(conversationId, content, attachments, replyToMessageId)
  if (!success) showToast('error', 'Failed to send message')
  return success
}

const handleSelectConversation = async (conv) => {
  await selectConversation(conv)
}

const handleReplySent = () => {
  // Optionally refresh unread counts
}

const handleStatusChange = async (conversationId, status) => {
  await updateConversationStatus(conversationId, status)
  showToast('success', `Conversation marked as ${status}`)
}

const applyFilter = () => {
  // filteredConversations computed handles it reactively
}

const refreshConversations = async () => {
  await loadConversations()
  showToast('success', 'Refreshed')
}

// Forward image-viewer events from MessageDetail
const handleImageViewerEvent = (e) => openImageViewer(e.detail)

// ── Lifecycle ─────────────────────────────────────────
// In MessagePage.vue - add to onMounted
onMounted(async () => {
  initSocket()
  await loadConversations()
  window.addEventListener('open-image-viewer', handleImageViewerEvent)
  
  // Listen for toast events from MessageDetail
  window.addEventListener('show-toast', (e) => {
    if (e.detail) {
      showToast(e.detail.type, e.detail.message)
    }
  })
})

onUnmounted(() => {
  window.removeEventListener('open-image-viewer', handleImageViewerEvent)
  window.removeEventListener('show-toast', () => {})
  cleanup()
})

onUnmounted(() => {
  window.removeEventListener('open-image-viewer', handleImageViewerEvent)
  cleanup()
})
</script>

<style scoped>
:root {
  --bg-base:       #f3f4f6;
  --surface:       #ffffff;
  --border:        #e5e7eb;
  --text-primary:  #111827;
  --text-secondary:#374151;
  --text-muted:    #6b7280;
  --accent:        #2563eb;
  --accent-hover:  #1d4ed8;
}

.badge-live {
  background: #dcfce7;
  color: #15803d;
}
.badge-offline {
  background: #fee2e2;
  color: #b91c1c;
}
.dot-live {
  background: #22c55e;
  animation: pulse 2s cubic-bezier(0.4,0,0.6,1) infinite;
}
.dot-offline {
  background: #ef4444;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
.spin {
  animation: spin 0.8s linear infinite;
}

/* Modal */
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* Toast */
.toast-enter-active, .toast-leave-active { transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1); }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(8px) scale(0.95); }
</style>