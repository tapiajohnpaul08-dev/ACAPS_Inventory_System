<!-- components/ReceiptModal.vue -->
<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        @click.self="close"
      >
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <DeliveryReceipt 
            :order="order" 
            @close="close"
            @print="handlePrint"
          />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import DeliveryReceipt from './DeliveryReciept.vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  order: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'print'])

function close() {
  emit('close')
}

function handlePrint(data) {
  emit('print', data)
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
}
</style>