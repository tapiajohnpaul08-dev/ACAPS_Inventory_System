// composables/useAdminSocket.js - Matches customer's socket implementation
import { ref, onUnmounted } from 'vue'
import io from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

let socketInstance = null
let reconnectAttempts = 0
const maxReconnectAttempts = 5

export function useAdminSocket() {
  const isConnected = ref(false)
  const isConnecting = ref(false)
  const socketId = ref(null)
  
  const connect = (token, adminId, userType = 'admin') => {
    if (socketInstance?.connected) {
      console.log('Admin socket already connected')
      return
    }
    
    if (isConnecting.value) {
      console.log('Admin socket already connecting')
      return
    }
    
    isConnecting.value = true
    
    socketInstance = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000
    })
    
    socketInstance.on('connect', () => {
      console.log('🔌 Admin socket connected')
      isConnected.value = true
      isConnecting.value = false
      socketId.value = socketInstance.id
      reconnectAttempts = 0
    })
    
    socketInstance.on('disconnect', (reason) => {
      console.log('🔌 Admin socket disconnected:', reason)
      isConnected.value = false
      socketId.value = null
    })
    
    socketInstance.on('connect_error', (error) => {
      console.error('Admin socket connection error:', error.message)
      isConnecting.value = false
      reconnectAttempts++
    })
    
    return socketInstance
  }
  
  const disconnect = () => {
    if (socketInstance) {
      socketInstance.disconnect()
      socketInstance = null
    }
    isConnected.value = false
    socketId.value = null
  }
  
  const joinConversation = (conversationId) => {
    if (socketInstance?.connected && conversationId) {
      socketInstance.emit('join-conversation', { conversationId })
      console.log(`Admin joined conversation: ${conversationId}`)
    }
  }
  
  const leaveConversation = (conversationId) => {
    if (socketInstance?.connected && conversationId) {
      socketInstance.emit('leave-conversation', { conversationId })
    }
  }
  
 // composables/useAdminSocket.js
const sendMessage = (conversationId, content, attachments = [], replyToMessageId = null) => {
  console.log('🟢 ADMIN Socket sendMessage with replyToMessageId:', replyToMessageId)
  if (socketInstance?.connected) {
    socketInstance.emit('send-message', {
      conversationId,
      content,
      attachments,
      replyToMessageId
    })
    return true
  }
  console.log('🟢 ADMIN Socket not connected')
  return false
}
  
  const sendTyping = (conversationId, isTyping) => {
    if (socketInstance?.connected) {
      socketInstance.emit('typing', { conversationId, isTyping })
    }
  }
  
  const markAsRead = (conversationId) => {
    if (socketInstance?.connected) {
      socketInstance.emit('mark-read', { conversationId })
    }
  }
  
  // Event listeners (same as customer)
  const onNewMessage = (callback) => {
    if (socketInstance) {
      socketInstance.on('new-message', callback)
    }
  }
  
  const onMessageSent = (callback) => {
    if (socketInstance) {
      socketInstance.on('message-sent', callback)
    }
  }
  
  const onUserTyping = (callback) => {
    if (socketInstance) {
      socketInstance.on('user-typing', callback)
    }
  }
  
  const onMessagesRead = (callback) => {
    if (socketInstance) {
      socketInstance.on('messages-read', callback)
    }
  }
  
  const onError = (callback) => {
    if (socketInstance) {
      socketInstance.on('error', callback)
    }
  }
  
  const off = (event) => {
    if (socketInstance) {
      socketInstance.off(event)
    }
  }
  
  onUnmounted(() => {
    disconnect()
  })
  
  return {
    isConnected,
    isConnecting,
    socketId,
    connect,
    disconnect,
    joinConversation,
    leaveConversation,
    sendMessage,
    sendTyping,
    markAsRead,
    onNewMessage,
    onMessageSent,
    onUserTyping,
    onMessagesRead,
    onError,
    off
  }
}