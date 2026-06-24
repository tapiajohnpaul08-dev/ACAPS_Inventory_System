// composables/useAdminChat.js
import { ref, computed, nextTick } from 'vue'
import { adminChatApi } from '@/api/api'
import { useAdminSocket } from './useAdminSocket'

export function useAdminChat() {
  const conversations = ref([])
  const selectedConversation = ref(null)
  const messages = ref([])
  const isLoading = ref(false)
  const isLoadingMessages = ref(false)
  const unreadCount = ref(0)
  const isCustomerTyping = ref(false)
  const messagesContainerRef = ref(null) // expose so MessageDetail can register

  // Socket
  const socket = useAdminSocket()

  // ─────────────────────────────────────────
  // Auth helpers
  // ─────────────────────────────────────────
  const getToken = () => localStorage.getItem('adminToken')
  const getAdminId = () => localStorage.getItem('adminId') || localStorage.getItem('adminUser')

  // ─────────────────────────────────────────
  // Map a raw DB/socket message → UI message
  // BUG FIX: backend uses senderType + createdAt, not sender + timestamp
  // ─────────────────────────────────────────
  const mapMessage = (msg) => ({
    ...msg,
    // normalise field names so MessageDetail can use either
    sender: msg.senderType || msg.sender || 'customer',
    timestamp: msg.createdAt || msg.timestamp || new Date().toISOString(),
    attachments: (msg.attachments || []).map((file) => ({
      ...file,
      url: resolveFileUrl(file),
    })),
  })

  // ─────────────────────────────────────────
  // File URL helper (shared with MessageDetail)
  // ─────────────────────────────────────────
  const resolveFileUrl = (file) => {
    if (file.url && !file.url.startsWith('blob:')) return file.url
    if (file.path) {
      const base = import.meta.env.VITE_API_URL || 'http://localhost:3001'
      const clean = file.path.replace(/^\/+/, '')
      if (clean.startsWith('http')) return clean
      if (clean.startsWith('uploads/')) return `${base}/${clean}`
      return `${base}/uploads/chat/${clean}`
    }
    return ''
  }

  // ─────────────────────────────────────────
  // Socket init
  // ─────────────────────────────────────────
  const initSocket = () => {
    const token = getToken()
    const adminId = getAdminId()
    if (token) {
      socket.connect(token, adminId, 'admin')
      setupSocketListeners()
    }
  }

  const setupSocketListeners = () => {
    socket.onNewMessage(async (rawMessage) => {
      const message = mapMessage(rawMessage)

      // If message belongs to the open conversation → append & scroll
      if (selectedConversation.value?.conversationId === message.conversationId) {
        // Avoid duplicates (socket may fire for messages we sent via REST fallback)
        const exists = messages.value.some((m) => m.messageId === message.messageId)
        if (!exists) {
          messages.value.push(message)
          await scrollToBottom()
        }

        // Mark as read if it came from the customer
        if (message.senderType === 'customer') {
          socket.markAsRead(message.conversationId)
        }
      }

      // Update the sidebar conversation preview
      const conv = conversations.value.find((c) => c.conversationId === message.conversationId)
      if (conv) {
        conv.preview = message.content?.substring(0, 100) || '📎 Attachment'
        conv.date = formatDate(new Date())
        conv.lastMessage = message.content
        conv.lastMessageAt = message.createdAt
        if (
          message.senderType === 'customer' &&
          selectedConversation.value?.conversationId !== message.conversationId
        ) {
          conv.read = false
          conv.adminUnreadCount = (conv.adminUnreadCount || 0) + 1
        }
      } else {
        // Unknown conversation – reload the list
        await loadConversations()
      }

      await loadUnreadCount()
    })

    socket.onUserTyping(({ userType, isTyping: typing }) => {
      if (userType === 'customer') {
        isCustomerTyping.value = typing
        if (typing) {
          setTimeout(() => { isCustomerTyping.value = false }, 3000)
        }
      }
    })

    socket.onMessagesRead(() => {
      // Optionally update read receipts in the UI
    })

    socket.onError((error) => {
      console.error('Socket error:', error)
    })
  }

  // ─────────────────────────────────────────
  // Scroll to bottom of message list
  // BUG FIX: previous implementation was a no-op (setTimeout only)
  // ─────────────────────────────────────────
  const scrollToBottom = async () => {
    await nextTick()
    const el = messagesContainerRef.value
    if (el) {
      el.scrollTop = el.scrollHeight
    }
  }

  // ─────────────────────────────────────────
  // Conversations
  // ─────────────────────────────────────────
  const loadConversations = async () => {
    isLoading.value = true
    try {
      const result = await adminChatApi.getConversations()
      if (result.success && result.data) {
        conversations.value = result.data.map((conv) => ({
          // BUG FIX: keep conversationId as the primary key used for socket rooms,
          // but also expose .id so MessageList selectedId comparison works
          id: conv.conversationId,          // ← was conv._id which never matched selectedId
          conversationId: conv.conversationId,
          name: conv.customerName || 'Unknown Customer',
          email: conv.customerEmail || '',
          subject: conv.subject || 'Customer Support',
          preview: conv.lastMessage?.substring(0, 100) || 'No messages yet',
          date: formatDate(conv.lastMessageAt || conv.createdAt),
          read: (conv.adminUnreadCount || 0) === 0,
          replyStatus: conv.status === 'closed' ? 'replied' : 'pending',
          adminUnreadCount: conv.adminUnreadCount || 0,
          status: conv.status,
          customerId: conv.customerId,
        }))
      }
    } catch (error) {
      console.error('Failed to load conversations:', error)
    } finally {
      isLoading.value = false
    }
  }

  // ─────────────────────────────────────────
  // Messages
  // ─────────────────────────────────────────
  const loadMessages = async (conversationId) => {
    isLoadingMessages.value = true
    try {
      const result = await adminChatApi.getMessages(conversationId, 100)
      if (result.success && result.data) {
        // BUG FIX: map each message so senderType / createdAt are normalised
        messages.value = result.data.map(mapMessage)
      }
    } catch (error) {
      console.error('Failed to load messages:', error)
    } finally {
      isLoadingMessages.value = false
    }
  }

  // ─────────────────────────────────────────
  // Send reply
  // BUG FIX: attachments were silently dropped in MessagePage
  // ─────────────────────────────────────────
  const sendReply = async (conversationId, content, attachments = []) => {
    try {
      if (socket.isConnected.value) {
        socket.sendMessage(conversationId, content, attachments)
        return true
      }

      // REST fallback
      const result = await adminChatApi.sendMessage(conversationId, content, attachments)
      if (result.success && result.data) {
        messages.value.push(mapMessage(result.data))
        await scrollToBottom()
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to send reply:', error)
      return false
    }
  }

  // ─────────────────────────────────────────
  // Mark as read
  // ─────────────────────────────────────────
  const markAsRead = async (conversationId) => {
    try {
      socket.markAsRead(conversationId)
      const conv = conversations.value.find((c) => c.conversationId === conversationId)
      if (conv) {
        conv.read = true
        conv.adminUnreadCount = 0
      }
      await loadUnreadCount()
    } catch (error) {
      console.error('Failed to mark as read:', error)
    }
  }

  // ─────────────────────────────────────────
  // Unread count
  // ─────────────────────────────────────────
  const loadUnreadCount = async () => {
    try {
      const result = await adminChatApi.getUnreadCount()
      if (result.success && result.data) {
        unreadCount.value = result.data.total || result.data.count || 0
      }
    } catch (error) {
      console.error('Failed to load unread count:', error)
    }
  }

  // ─────────────────────────────────────────
  // Select conversation
  // ─────────────────────────────────────────
  const selectConversation = async (conversation) => {
    // Leave previous room
    if (selectedConversation.value?.conversationId) {
      socket.leaveConversation(selectedConversation.value.conversationId)
    }

    selectedConversation.value = conversation
    messages.value = []

    socket.joinConversation(conversation.conversationId)
    await loadMessages(conversation.conversationId)
    await markAsRead(conversation.conversationId)
    await nextTick()
    await scrollToBottom()
  }

  // ─────────────────────────────────────────
  // Typing indicator
  // ─────────────────────────────────────────
  const handleTyping = (conversationId, typing) => {
    socket.sendTyping(conversationId, typing)
  }

  // ─────────────────────────────────────────
  // Update conversation status
  // ─────────────────────────────────────────
  const updateConversationStatus = async (conversationId, status) => {
    try {
      await adminChatApi.updateStatus(conversationId, status)
      const conv = conversations.value.find((c) => c.conversationId === conversationId)
      if (conv) {
        conv.status = status
        conv.replyStatus = status === 'closed' ? 'replied' : 'pending'
      }
      if (selectedConversation.value?.conversationId === conversationId) {
        selectedConversation.value.status = status
      }
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  // ─────────────────────────────────────────
  // Date formatting
  // ─────────────────────────────────────────
  const formatDate = (date) => {
    if (!date) return ''
    const d = new Date(date)
    const now = new Date()
    const diff = now - d
    if (diff < 60000) return 'Just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    if (diff < 604800000) {
      return d.toLocaleDateString('en-PH', { weekday: 'short' })
    }
    return d.toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })
  }

  // ─────────────────────────────────────────
  // Cleanup
  // ─────────────────────────────────────────
  const cleanup = () => {
    if (selectedConversation.value?.conversationId) {
      socket.leaveConversation(selectedConversation.value.conversationId)
    }
    socket.disconnect()
  }

  // ─────────────────────────────────────────
  // Computed stats
  // ─────────────────────────────────────────
  const totalMessages = computed(() => conversations.value.length)
  const unreadMessages = computed(() => conversations.value.filter((c) => !c.read).length)
  const pendingReplies = computed(() => conversations.value.filter((c) => c.status !== 'closed' && c.status !== 'resolved').length)

  return {
    conversations,
    selectedConversation,
    messages,
    isLoading,
    isLoadingMessages,
    unreadCount,
    totalMessages,
    unreadMessages,
    pendingReplies,
    isConnected: socket.isConnected,
    isCustomerTyping,
    messagesContainerRef,
    initSocket,
    loadConversations,
    loadMessages,
    sendReply,
    selectConversation,
    markAsRead,
    loadUnreadCount,
    handleTyping,
    updateConversationStatus,
    resolveFileUrl,
    cleanup,
    formatDate,
  }
}