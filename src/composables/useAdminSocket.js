// Admin Side
import { ref } from 'vue'
import io from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

let socketInstance = null
let reconnectAttempts = 0
const maxReconnectAttempts = Infinity
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

      // Auth failure (expired/invalid token) is terminal — retrying with
      // the same token will never succeed. Clear the session and send the
      // admin to login so they get a fresh token on the next click.
      const msg = (error?.message || '').toLowerCase()
      const isAuthFailure =
        msg.includes('authentication') ||
        msg.includes('invalid token') ||
        msg.includes('expired') ||
        msg.includes('jwt')

      if (isAuthFailure) {
        console.warn('🔒 Socket auth failed — clearing admin session')
        try {
          socketInstance.disconnect()
        } catch (_) {}

        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminUser')
        localStorage.removeItem('adminName')
        localStorage.removeItem('adminEmail')
        localStorage.removeItem('adminRole')

        // Only redirect if not already on the login page
        if (window.location.pathname !== '/' && window.location.pathname !== '/login') {
          window.location.href = '/'
        }
      }
    })
  

    return socketInstance
  }
  
  const disconnect = () => {
    if (socketInstance) {
      // Remove every listener BEFORE tearing down so a fresh connect
      // can't accidentally inherit stale callbacks from a previous
      // login. Also prevents memory leaks across long-running tabs.
      try {
        socketInstance.removeAllListeners()
      } catch (_) {}
      socketInstance.disconnect()
      socketInstance = null
    }
    isConnected.value = false
    isConnecting.value = false   // ← reset this; it was never cleared on disconnect
    socketId.value = null
    reconnectAttempts = 0
    console.log('🔌 Admin socket fully disconnected and reset')
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
  console.log('🟢 ADMIN Socket sendMessage with replyToMessageId:', replyToMessageId,)
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
    const onOrderNegotiationUpdated = (callback) => {
    if (socketInstance) {
      socketInstance.on('order-negotiation-updated', callback)
    }
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
      console.log('🧷 [useAdminSocket] onNewMessage attached to socket', socketInstance.id, '| connected:', socketInstance.connected)
      socketInstance.on('new-message', callback)
    } else {
      console.warn('🧷 [useAdminSocket] onNewMessage called with NO socketInstance — listener dropped')
    }
  }
  
  const onMessageSent = (callback) => {
    if (socketInstance) {
      socketInstance.on('message-sent', callback)
    }
  }

  const onMessageUnsent = (callback) => {
    if (socketInstance) {
      socketInstance.on('message-unsent', callback)
    }
  }

    const onPaymentRequestUpdated = (callback) => {
    if (socketInstance) {
      socketInstance.on('payment-request-updated', callback)
    }
  }

  const onPaymentProofUpdated = (callback) => {
    if (socketInstance) {
      socketInstance.on('payment-proof-updated', callback)
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

    const onConversationOrderLinked = (callback) => {
    if (socketInstance) {
      socketInstance.on('conversation-order-linked', callback)
    }
  }
  
  const onError = (callback) => {
    if (socketInstance) {
      socketInstance.on('error', callback)
    }
  }

    // Fires on every successful connection (including reconnects after a
  // network blip or a fresh login). Used by useAdminChat to rebind
  // listeners to the current socket instance.
  const onConnect = (callback) => {
    if (socketInstance) {
      socketInstance.on('connect', callback)
    }
  }
  
  const off = (event) => {
    if (socketInstance) {
      socketInstance.off(event)
    }
  }


  // ── Realtime: order / inventory events ─────────────────────────────
  // `off` before `on` so re-registration replaces rather than stacks.
  const onOrderChanged = (cb) => {
    if (!socketInstance) return
    socketInstance.off('order:changed')
    socketInstance.on('order:changed', cb)
  };
  const onInventoryChanged = (cb) => {
    if (!socketInstance) return
    socketInstance.off('inventory:changed')
    socketInstance.on('inventory:changed', cb)
  };
  
  return {
    isConnected,
    isConnecting,
    socketId,
    onOrderNegotiationUpdated,
    onOrderChanged,          // ← ADD
    onInventoryChanged, 
    connect,
    disconnect,
    joinConversation,
    leaveConversation,
    sendMessage,
    onMessageUnsent,
    onPaymentRequestUpdated,
    onPaymentProofUpdated,
    sendTyping,
    markAsRead,
    onNewMessage,
    onMessageSent,
    onUserTyping,
    onMessagesRead,
    onConversationOrderLinked,
    onError,
    onConnect,
    off
  }
}