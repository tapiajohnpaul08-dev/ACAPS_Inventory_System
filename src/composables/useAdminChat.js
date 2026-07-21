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
  const messagesContainerRef = ref(null)
  const processedMessages = new Set()
  let pendingTempId = null // Add this

  // Socket
  const socket = useAdminSocket()

  // ─────────────────────────────────────────
  // Auth helpers
  // ─────────────────────────────────────────
  const getToken = () => localStorage.getItem('adminToken')
  const getAdminId = () => localStorage.getItem('adminId') || localStorage.getItem('adminUser')

  // ─────────────────────────────────────────
  // Map a raw DB/socket message → UI message
  // ─────────────────────────────────────────
  const mapMessage = (msg) => ({
    ...msg,
    sender: msg.senderType || msg.sender || 'customer',
    timestamp: msg.createdAt || msg.timestamp || new Date().toISOString(),
    attachments: (msg.attachments || []).map((file) => {
      if (typeof file === 'string') {
        return { 
          name: file, 
          path: file, 
          url: file 
        }
      }
      return {
        ...file,
        path: file.path || file.url || file.name || '',
        url: resolveFileUrl(file),
      }
    }),
  })

  // ─────────────────────────────────────────
  // File URL helper
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
      // Prevent duplicate processing
      if (processedMessages.has(rawMessage.messageId)) {
        console.log('📩 Message already processed, skipping')
        return
      }
      processedMessages.add(rawMessage.messageId)

      const message = mapMessage(rawMessage)

      // If this is our own pending message, replace it
      if (pendingTempId) {
        const index = messages.value.findIndex(m => m.messageId === pendingTempId)
        if (index !== -1) {
          console.log('📩 Replacing temp message with real message')
          messages.value[index] = { 
            ...message, 
            isPending: false,
            replyTo: message.replyTo || messages.value[index].replyTo
          }
          pendingTempId = null
          return
        }
      }

      // If message belongs to the open conversation → append & scroll
      if (selectedConversation.value?.conversationId === message.conversationId) {
        const exists = messages.value.some((m) => m.messageId === message.messageId)
        if (!exists) {
          messages.value.push(message)
          await scrollToBottom()
        }

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
        await loadConversations()
      }

      await loadUnreadCount()
      window.dispatchEvent(new CustomEvent('newMessageReceived', { 
        detail: { conversationId: message.conversationId }
      }))
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
  // Scroll to bottom
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
          id: conv.conversationId,
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
    processedMessages.clear()
    pendingTempId = null
    try {
      const result = await adminChatApi.getMessages(conversationId, 100)
      if (result.success && result.data) {
        messages.value = result.data.map(mapMessage)
      }
    } catch (error) {
      console.error('Failed to load messages:', error)
    } finally {
      isLoadingMessages.value = false
    }
  }

  // ─────────────────────────────────────────
  // Send reply - Same approach as customer side
  // ─────────────────────────────────────────
 // composables/useAdminChat.js - FIXED sendReply function

// ─────────────────────────────────────────
// Send reply - MATCHES CUSTOMER SIDE EXACTLY
// ─────────────────────────────────────────
const sendReply = async (conversationId, content, attachments = [], replyToMessageId = null) => {
  console.log('📨 ADMIN sendReply called with replyToMessageId:', replyToMessageId)
  console.log('📨 ADMIN replyToMessageId type:', typeof replyToMessageId, 'value:', replyToMessageId)
  
  // Don't proceed if no content and no attachments
  if (!content && (!attachments || attachments.length === 0)) {
    console.log('📨 No content or attachments, skipping')
    return false
  }
  
  try {
    // Create temp message for optimistic UI update
    const tempId = 'temp_' + Date.now()
    pendingTempId = tempId
    
    // Get admin info
    const adminId = getAdminId()
    const adminName = localStorage.getItem('adminName') || 'Admin'
    
    // Find the original message to get its content for the reply preview
    let replyContent = null
    if (replyToMessageId) {
      const originalMsg = messages.value.find(m => (m.messageId || m._id) === replyToMessageId)
      if (originalMsg) {
        replyContent = originalMsg.content || '📎 Attachment'
      }
    }
    
    // Create temp message with reply data
    const tempMessage = {
      messageId: tempId,
      conversationId: conversationId,
      senderType: 'admin',
      senderId: adminId,
      senderName: adminName,
      content: content || (attachments.length > 0 ? '📎 Sent an attachment' : ''),
      attachments: attachments,
      createdAt: new Date().toISOString(),
      isPending: true,
      isRead: false,
      // This is the key - replyTo must be set for the UI to show "Replying to:"
      replyTo: replyToMessageId ? {
        messageId: replyToMessageId,
        content: replyContent || 'Original message'
      } : null
    }
    
    console.log('📨 ADMIN Temp message with replyTo:', tempMessage.replyTo)
    
    // Add optimistic message
    messages.value.push(tempMessage)
    await scrollToBottom()
    
    // Send via socket with replyToMessageId
    if (socket.isConnected.value) {
      console.log('📨 ADMIN Sending via socket with replyToMessageId:', replyToMessageId)
      const sent = socket.sendMessage(conversationId, content, attachments, replyToMessageId)
      if (sent) {
        console.log('📨 ADMIN Socket message sent successfully')
        return true
      }
    }
    
    // REST fallback with replyToMessageId
    console.log('📨 ADMIN Sending via REST with replyToMessageId:', replyToMessageId)
    const result = await adminChatApi.sendMessage(conversationId, content, attachments, replyToMessageId)
    console.log('📨 ADMIN REST result:', result)
    
    if (result.success && result.data) {
      processedMessages.add(result.data.messageId)
      const index = messages.value.findIndex(m => m.messageId === tempId)
      if (index !== -1) {
        // Preserve replyTo if the server doesn't return it
        const tempMsg = messages.value[index]
        messages.value[index] = { 
          ...result.data, 
          isPending: false,
          replyTo: result.data.replyTo || tempMsg.replyTo
        }
        console.log('📨 ADMIN Replaced temp message with replyTo:', messages.value[index].replyTo)
      }
      pendingTempId = null
      return true
    }
    
    // If we got here, something failed - mark the temp message as failed
    const idx = messages.value.findIndex(m => m.messageId === tempId)
    if (idx !== -1) {
      messages.value[idx].failed = true
      messages.value[idx].isPending = false
    }
    return false
  } catch (error) {
    console.error('📨 ADMIN Failed to send reply:', error)
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
      window.dispatchEvent(new CustomEvent('messageRead', { 
        detail: { conversationId }
      }))
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
        const count = result.data.total || result.data.count || 0
        unreadCount.value = count
        
        window.dispatchEvent(new CustomEvent('unreadCountUpdated', { 
          detail: { count } 
        }))
      }
    } catch (error) {
      console.error('Failed to load unread count:', error)
    }
  }

  // ─────────────────────────────────────────
  // Unsend message
  // ─────────────────────────────────────────
  const unsendMessage = async (messageId) => {
    try {
      const result = await adminChatApi.unsendMessage(messageId)
      if (result.success) {
        const index = messages.value.findIndex(m => (m.messageId || m._id) === messageId)
        if (index !== -1) {
          messages.value[index] = {
            ...messages.value[index],
            isDeleted: true,
            content: 'This message was unsent'
          }
        }
        await loadConversations()
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to unsend message:', error)
      return false
    }
  }

  // ─────────────────────────────────────────
  // Select conversation
  // ─────────────────────────────────────────
  const selectConversation = async (conversation) => {
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
    processedMessages.clear()
    pendingTempId = null
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
    unsendMessage,
    loadUnreadCount,
    handleTyping,
    updateConversationStatus,
    resolveFileUrl,
    cleanup,
    formatDate,
  }
}