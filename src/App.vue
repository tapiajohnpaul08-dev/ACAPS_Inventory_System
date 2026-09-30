<template>
  <router-view />
  <MessageToast />
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import MessageToast from '@/components/notifications/MessageToast.vue'
import { useMessageNotifications } from '@/composables/useMessageNotifications'

const { notify, resetTabCounter } = useMessageNotifications()

function handleNewMessageNotification(e) {
  if (e.detail) notify(e.detail)
}

function handleVisibilityChange() {
  if (!document.hidden) resetTabCounter()
}

onMounted(() => {
  window.addEventListener('admin:new-message-notification', handleNewMessageNotification)
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onUnmounted(() => {
  window.removeEventListener('admin:new-message-notification', handleNewMessageNotification)
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})
</script>