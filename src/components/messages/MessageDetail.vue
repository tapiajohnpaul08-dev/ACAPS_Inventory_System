<template>
  <div class="h-full flex flex-col rounded-2xl overflow-hidden border" style="background: #fff; border-color: var(--border, #e5e7eb);">

    <!-- Empty state -->
    <div v-if="!message" class="flex-1 flex flex-col items-center justify-center p-12 text-center">
      <div class="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style="background: #f3f4f6;">
        <svg class="w-8 h-8" style="color: #d1d5db;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"/>
        </svg>
      </div>
      <p class="text-sm font-semibold" style="color: #374151;">Select a conversation</p>
      <p class="text-xs mt-1" style="color: #9ca3af;">Choose a conversation from the left to start replying</p>
    </div>

    <!-- Active conversation -->
    <template v-else>
      <!-- ── Conversation Header ── -->
      <div class="shrink-0 px-5 py-3.5 border-b flex items-center justify-between" style="border-color: #e5e7eb;">
        <div class="flex items-center gap-3">
          <!-- Avatar -->
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm uppercase shrink-0"
            :style="{ background: getAvatarColor(message.name) }"
          >
            {{ (message.name || '?')[0] }}
          </div>
          <div>
            <p class="text-sm font-semibold leading-tight" style="color: #111827;">{{ message.name }}</p>
            <p class="text-xs" style="color: #6b7280;">{{ message.email }}</p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <!-- Subject chip -->
          <span class="hidden sm:inline-block text-xs px-2.5 py-1 rounded-full font-medium" style="background: #eff6ff; color: #2563eb;">
            {{ message.subject || 'General Support' }}
          </span>

          <!-- Status dropdown -->
          <select
            :value="message.status"
            @change="emit('status-change', message.conversationId, $event.target.value)"
            class="text-xs px-3 py-1.5 rounded-lg border cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            style="background: #f9fafb; border-color: #e5e7eb; color: #374151;"
          >
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      <!-- ── Messages area ── -->
      <div
        ref="messagesContainer"
        class="flex-1 overflow-y-auto px-5 py-4 space-y-3"
        style="background: #f9fafb;"
      >

        <!-- Loading messages -->
        <div v-if="isLoadingMessages" class="flex flex-col gap-3 pt-4">
          <div v-for="i in 4" :key="i" class="flex" :class="i % 2 === 0 ? 'justify-end' : 'justify-start'">
            <div class="rounded-2xl px-4 py-2.5 animate-pulse"
              :class="i % 2 === 0 ? 'bg-blue-100 w-40' : 'bg-gray-200 w-56'"
              style="height: 48px;">
            </div>
          </div>
        </div>

        <!-- Actual messages -->
        <template v-else>
          <!-- Date separator helper (groups by day) -->
          <template v-for="(group, gi) in groupedMessages" :key="gi">
            <!-- Day separator -->
            <div class="flex items-center gap-3 my-3">
              <div class="flex-1 h-px" style="background: #e5e7eb;"></div>
              <span class="text-xs font-medium px-2" style="color: #9ca3af;">{{ group.label }}</span>
              <div class="flex-1 h-px" style="background: #e5e7eb;"></div>
            </div>

            <!-- Messages in this day group -->
            <div
              v-for="msg in group.messages"
              :key="msg.messageId || msg._id"
              class="flex"
              :class="isAdminMessage(msg) ? 'justify-end' : 'justify-start'"
            >
              <!-- Customer avatar (left) -->
              <div
                v-if="!isAdminMessage(msg)"
                class="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2 shrink-0 self-end mb-1"
                :style="{ background: getAvatarColor(message.name) }"
              >
                {{ (message.name || '?')[0] }}
              </div>

              <!-- Bubble -->
              <div
                class="message-bubble max-w-[68%]"
                :class="isAdminMessage(msg) ? 'bubble-admin' : 'bubble-customer'"
              >
                <!-- Text content -->
                <p v-if="msg.content" class="text-sm leading-relaxed whitespace-pre-wrap break-words">{{ msg.content }}</p>

                <!-- Attachments -->
               <div v-if="msg.attachments && msg.attachments.length > 0" class="mt-2 space-y-2">
    <div v-for="(file, idx) in msg.attachments" :key="idx">
      <div v-if="isImageFile(file)" class="relative">
        <img 
          :src="getFileUrl(file)" 
          :alt="file.name || 'Image'"
          class="max-w-full max-h-48 rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
          @click="openImageViewer(getFileUrl(file))"
          @error="handleImageError"
        />
        <p class="text-xs mt-1" :class="msg.sender === 'admin' ? 'text-blue-200' : 'text-gray-500'">
          📷 {{ file.name || 'Image' }}
        </p>
      </div>
      <div v-else class="flex items-center gap-2 p-2 rounded-lg bg-gray-100">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-gray-500">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
        <a :href="getFileUrl(file)" target="_blank" class="text-sm text-blue-600 hover:underline truncate flex-1">
          {{ file.name || 'Download' }}
        </a>
        <span class="text-xs text-gray-400">{{ formatFileSize(file.size) }}</span>
      </div>
    </div>
  </div>

                <!-- Timestamp + read status -->
                <div class="flex items-center gap-1 mt-1.5" :class="isAdminMessage(msg) ? 'justify-end' : 'justify-start'">
                  <span class="text-[10px]" :class="isAdminMessage(msg) ? 'text-blue-200' : 'text-gray-400'">
                    {{ formatTime(msg.createdAt || msg.timestamp) }}
                  </span>
                  <!-- Read tick for admin messages -->
                  <svg v-if="isAdminMessage(msg) && msg.isRead" class="w-3 h-3 text-blue-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
              </div>
            </div>
          </template>

          <!-- Typing indicator -->
          <div v-if="isTyping" class="flex justify-start">
            <div class="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2 shrink-0"
              :style="{ background: getAvatarColor(message.name) }">
              {{ (message.name || '?')[0] }}
            </div>
            <div class="bubble-customer px-4 py-3">
              <div class="flex gap-1 items-center h-4">
                <span class="typing-dot"></span>
                <span class="typing-dot" style="animation-delay: 160ms;"></span>
                <span class="typing-dot" style="animation-delay: 320ms;"></span>
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- ── Reply composer ── -->
      <div class="shrink-0 px-5 py-4 border-t" style="border-color: #e5e7eb; background: #fff;">

        <!-- Pending attachment preview -->
        <div v-if="pendingAttachments.length" class="mb-3 flex flex-wrap gap-2">
          <div
            v-for="(file, idx) in pendingAttachments"
            :key="idx"
            class="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs"
            style="background: #f9fafb; border-color: #e5e7eb;"
          >
            <!-- Image thumbnail -->
            <img
              v-if="file.type?.startsWith('image/')"
              :src="file.preview"
              class="w-6 h-6 rounded object-cover"
              alt=""
            />
            <svg v-else class="w-4 h-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            <span class="max-w-[120px] truncate font-medium text-gray-700">{{ file.name }}</span>
            <span class="text-gray-400">{{ formatFileSize(file.size) }}</span>
            <button @click="removeAttachment(idx)" class="text-gray-400 hover:text-red-500 ml-1 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="flex items-end gap-2">
          <!-- Attachment button -->
          <input
            ref="fileInput"
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx,.txt,.xls,.xlsx,.csv"
            class="hidden"
            @change="handleFileSelect"
          />
          <button
            @click="fileInput?.click()"
            :disabled="isSending"
            class="w-9 h-9 shrink-0 flex items-center justify-center rounded-xl border transition-colors disabled:opacity-40"
            style="border-color: #e5e7eb; color: #6b7280; background: #f9fafb;"
            title="Attach file"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
            </svg>
          </button>

          <!-- Textarea -->
          <textarea
            v-model="reply"
            ref="textareaRef"
            rows="1"
            placeholder="Type your reply… (Enter to send)"
            class="flex-1 resize-none rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            style="border-color: #e5e7eb; min-height: 42px; max-height: 120px; line-height: 1.5; background: #f9fafb; color: #111827;"
            :disabled="isSending"
            @input="onInput"
            @keydown.enter.exact.prevent="sendReply"
            @keydown.enter.shift.exact="reply += '\n'"
          ></textarea>

          <!-- Send button -->
          <button
            @click="sendReply"
            :disabled="(!reply.trim() && pendingAttachments.length === 0) || isSending"
            class="w-9 h-9 shrink-0 flex items-center justify-center rounded-xl text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style="background: #2563eb;"
            :style="(!reply.trim() && !pendingAttachments.length) || isSending ? '' : 'background: #2563eb;'"
          >
            <svg v-if="!isSending" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>
            </svg>
            <svg v-else class="animate-spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
          </button>
        </div>

        <p class="text-[10px] text-center mt-2" style="color: #9ca3af;">Enter to send · Shift+Enter for new line</p>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, computed } from 'vue'

const props = defineProps({
  message:               { type: Object,   default: null },
  messages:              { type: Array,    default: () => [] },
  isTyping:              { type: Boolean,  default: false },
  isLoadingMessages:     { type: Boolean,  default: false },
  onSendReply:           { type: Function, required: true },
  onTypingIndicator:     { type: Function, default: null },
  messagesContainerRefSetter: { type: Function, default: null },
})

const emit = defineEmits(['reply', 'status-change'])

// ── Refs ─────────────────────────────────────────────
const reply             = ref('')
const isSending         = ref(false)
const messagesContainer = ref(null)
const fileInput         = ref(null)
const textareaRef       = ref(null)
const pendingAttachments = ref([])
let typingTimeout       = null

// Expose container ref to parent (for scroll coordination)
watch(messagesContainer, (el) => {
  if (props.messagesContainerRefSetter && el) {
    props.messagesContainerRefSetter(el)
  }
})

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

async function uploadFiles(files) {
  const formData = new FormData()
  files.forEach(file => {
    formData.append('files', file)
  })
  
  try {
    const token = localStorage.getItem('adminToken')
    const response = await fetch(`${API_URL}/api/v1/chat/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })
    const result = await response.json()
    if (result.success) {
      return result.files
    }
    return []
  } catch (error) {
    console.error('Upload failed:', error)
    return []
  }
}

// ── Scroll to bottom ─────────────────────────────────
// BUG FIX: actually scroll using the ref
const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// Scroll whenever message list grows or conversation changes
watch(
  () => props.messages.length,
  async () => { await scrollToBottom() },
  { immediate: true }
)

// Clear input on conversation switch
// BUG FIX: watch conversationId not msg.id — they are the same field but clarifies intent
watch(
  () => props.message?.conversationId,
  () => {
    reply.value = ''
    isSending.value = false
    pendingAttachments.value.forEach((f) => f.preview && URL.revokeObjectURL(f.preview))
    pendingAttachments.value = []
  }
)

// Auto-resize textarea
watch(reply, async () => {
  await nextTick()
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto'
    textareaRef.value.style.height = `${Math.min(textareaRef.value.scrollHeight, 120)}px`
  }
})

// ── Grouped messages (by day) ─────────────────────────
const groupedMessages = computed(() => {
  if (!props.messages.length) return []
  const groups = []
  let currentDate = ''

  props.messages.forEach((msg) => {
    const d = new Date(msg.createdAt || msg.timestamp)
    const label = formatDayLabel(d)
    if (label !== currentDate) {
      currentDate = label
      groups.push({ label, messages: [] })
    }
    groups[groups.length - 1].messages.push(msg)
  })

  return groups
})

// ── Helpers ───────────────────────────────────────────

// BUG FIX: use senderType from backend, with sender as fallback for old data
const isAdminMessage = (msg) => (msg.senderType || msg.sender) === 'admin'

const formatTime = (ts) => {
  if (!ts) return ''
  return new Date(ts).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })
}

const formatDayLabel = (date) => {
  const now = new Date()
  const d = new Date(date)
  const diff = now - d

  if (diff < 86400000 && now.getDate() === d.getDate()) return 'Today'
  if (diff < 172800000) return 'Yesterday'
  return d.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: diff > 31536000000 ? 'numeric' : undefined })
}

const formatFileSize = (bytes) => {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)}KB`
  return `${(bytes / 1048576).toFixed(1)}MB`
}

const AVATAR_COLORS = [
  '#2563eb','#7c3aed','#db2777','#dc2626','#d97706',
  '#059669','#0891b2','#4f46e5','#c026d3','#65a30d',
]
const getAvatarColor = (name = '') => {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

// Update isImageFile to handle more cases
function isImageFile(file) {
  if (file.type) {
    return file.type.startsWith('image/')
  }
  if (file.mimetype) {
    return file.mimetype.startsWith('image/')
  }
  if (file.name) {
    return /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(file.name)
  }
  if (file.contentType) {
    return file.contentType.startsWith('image/')
  }
  return false
}

function getFileUrl(file) {
  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
  
  console.log('Getting file URL for:', file)
  
  // If there's a path from backend
  if (file.path) {
    let cleanPath = file.path.replace(/^\/+/, '')
    // If it's already a full URL
    if (cleanPath.startsWith('http')) return cleanPath
    // If it starts with uploads/
    if (cleanPath.startsWith('uploads/')) {
      return `${baseURL}/${cleanPath}`
    }
    // Default to chat uploads folder
    return `${baseURL}/uploads/chat/${cleanPath}`
  }
  
  // If there's a url property (not a blob)
  if (file.url && !file.url.startsWith('blob:')) {
    return file.url
  }
  
  // For local preview while sending
  if (file instanceof File) {
    return URL.createObjectURL(file)
  }
  
  return ''
}

function handleImageError(e) {
  console.error('Image failed to load:', e.target.src)
  // Show a fallback icon instead of broken image
  e.target.onerror = null
  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%23999" stroke-width="1"%3E%3Crect x="3" y="3" width="18" height="18" rx="2"%3E%3C/rect%3E%3Ccircle cx="8.5" cy="8.5" r="1.5"%3E%3C/circle%3E%3Cpath d="M21 15l-5-5-6 6-3-3-4 4"%3E%3C/path%3E%3C/svg%3E'
  e.target.classList.add('bg-gray-100', 'p-4')
}

const openImageViewer = (url) => {
  if (url && !url.startsWith('blob:')) {
    window.dispatchEvent(new CustomEvent('open-image-viewer', { detail: url }))
  }
}

// ── File handling ─────────────────────────────────────
const handleFileSelect = (e) => {
  const MAX = 10 * 1024 * 1024
  Array.from(e.target.files).forEach((file) => {
    if (file.size > MAX) {
      console.warn(`${file.name} exceeds 10MB`)
      return
    }
    pendingAttachments.value.push(
      Object.assign(file, { preview: URL.createObjectURL(file) })
    )
  })
  e.target.value = ''
}

const removeAttachment = (idx) => {
  const f = pendingAttachments.value[idx]
  if (f?.preview) URL.revokeObjectURL(f.preview)
  pendingAttachments.value.splice(idx, 1)
}

// ── Typing indicator ──────────────────────────────────
const onInput = () => {
  if (props.onTypingIndicator && props.message) {
    props.onTypingIndicator(props.message.conversationId, true)
    clearTimeout(typingTimeout)
    typingTimeout = setTimeout(() => {
      props.onTypingIndicator(props.message.conversationId, false)
    }, 1500)
  }
}

// ── Send message ──────────────────────────────────────
// Update sendReply function
async function sendReply() {
  const content = reply.value.trim()
  if ((pendingAttachments.value.length === 0 && !content) || isSending.value) return
  
  isSending.value = true
  
  try {
    if (props.onTypingIndicator && props.message) {
      props.onTypingIndicator(props.message.conversationId, false)
    }
    
    let attachments = []
    
    // Upload files first if there are any
    if (pendingAttachments.value.length > 0) {
      attachments = await uploadFiles(pendingAttachments.value)
      console.log('Uploaded attachments:', attachments)
    }
    
    const messageContent = content || (attachments.length > 0 ? '📎 Sent an attachment' : '')
    
    const success = await props.onSendReply(
      props.message.conversationId, 
      messageContent, 
      attachments
    )
    
    if (success) {
      emit('reply', { messageId: props.message.id, text: messageContent })
      reply.value = ''
      pendingAttachments.value = []
    }
  } catch (error) {
    console.error('Failed to send reply:', error)
  } finally {
    isSending.value = false
  }
}
</script>

<style scoped>
/* Bubbles */
.message-bubble {
  border-radius: 18px;
  padding: 10px 14px;
  word-break: break-word;
}
.bubble-admin {
  background: #2563eb;
  color: #fff;
  border-bottom-right-radius: 4px;
}
.bubble-customer {
  background: #fff;
  color: #111827;
  border: 1px solid #e5e7eb;
  border-bottom-left-radius: 4px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.06);
}

/* Typing dots */
.typing-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #9ca3af;
  animation: typingBounce 1.2s infinite ease-in-out;
}
@keyframes typingBounce {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-6px); }
}

/* Spin */
@keyframes spin {
  to { transform: rotate(360deg); }
}
.animate-spin { animation: spin 0.7s linear infinite; }
</style>