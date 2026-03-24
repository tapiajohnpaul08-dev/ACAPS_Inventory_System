<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
    <div
      v-for="stat in stats"
      :key="stat.label"
      class="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
    >
      <p class="text-sm text-gray-500">{{ stat.label }}</p>
      <p class="text-2xl font-bold mt-1" :class="stat.color">{{ stat.value }}</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  messages: { type: Array, required: true },
})

const stats = [
  { label: 'Total Messages', value: props.messages.length,                                      color: 'text-gray-900'   },
  { label: 'Unread',         value: props.messages.filter(m => !m.read).length,                 color: 'text-blue-600'   },
  { label: 'Pending Reply',  value: props.messages.filter(m => m.replyStatus !== 'replied').length, color: 'text-yellow-600' },
]
</script>