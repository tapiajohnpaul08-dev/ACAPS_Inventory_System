<template>
  <div class="p-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Customer Messages</h1>
      <p class="text-gray-500 mt-1">Communicate with your customers</p>
    </div>

    <MessageStatCards :messages="allMessages" />

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <MessageList
        :messages="allMessages"
        :selected-id="selectedMessage?.id ?? null"
        @select="selectMessage"
      />
      <MessageDetail
        :message="selectedMessage"
        @reply="handleReply"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import MessageStatCards from '@/components/messages/MessageStatCards.vue'
import MessageList from '@/components/messages/MessageList.vue'
import MessageDetail from '@/components/messages/MessageDetail.vue'
import { messages } from '@/data/dummyData'

const selectedMessage = ref(null)
const allMessages = ref([...messages])

function selectMessage(msg) {
  selectedMessage.value = msg
  const found = allMessages.value.find(m => m.id === msg.id)
  if (found && !found.read) {
    found.read = true
  }
}

function handleReply({ messageId, text }) {
  const found = allMessages.value.find(m => m.id === messageId)
  if (found) {
    found.replyStatus = 'replied'
  }
  console.log(`Reply to ${messageId}:`, text)
  alert(`Reply sent to ${found?.name || 'customer'}`)
}
</script>