<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="closeModal"
      >
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeModal" />
        
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
          <div class="flex items-start justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
            <div>
              <h2 class="text-lg font-semibold text-gray-900 leading-snug">
                Edit Inventory Item
              </h2>
              <p class="text-sm text-gray-500 mt-0.5">{{ item?.name }} - {{ item?.size }}</p>
            </div>
            <button @click="closeModal" class="ml-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5">
                <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
              </svg>
            </button>
          </div>

          <div class="flex-1 overflow-y-auto px-6 py-5">
            <form @submit.prevent="handleSubmit" class="space-y-5">
              <!-- Basic Information -->
              <div class="border border-gray-200 rounded-xl p-4">
                <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">Basic Information</p>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Product Name *</label>
                    <input
                      v-model="formData.name"
                      type="text"
                      required
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Size</label>
                    <input
                      v-model="formData.size"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Supplier</label>
                    <input
                      v-model="formData.supplier"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Status</label>
                    <select
                      v-model="formData.status"
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="In Stock">In Stock</option>
                      <option value="Low Stock">Low Stock</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Stock Information -->
              <div class="border border-gray-200 rounded-xl p-4">
                <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">Stock Information</p>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Current Stock *</label>
                    <input
                      v-model.number="formData.stock"
                      type="number"
                      required
                      min="0"
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Reorder Threshold</label>
                    <input
                      v-model.number="formData.threshold"
                      type="number"
                      min="0"
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Orders Count</label>
                    <input
                      v-model.number="formData.orders"
                      type="number"
                      min="0"
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Revenue</label>
                    <input
                      v-model="formData.revenue"
                      type="text"
                      placeholder="₱0"
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex gap-3 pt-4">
                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-semibold disabled:opacity-50"
                >
                  <svg v-if="!isSubmitting" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                  <svg v-else class="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
                </button>
                <button
                  type="button"
                  @click="closeModal"
                  class="flex-1 flex items-center justify-center gap-2 py-2.5 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors text-sm font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  show: { type: Boolean, required: true },
  item: { type: Object, required: true }
})

const emit = defineEmits(['close', 'update'])

const isSubmitting = ref(false)
const formData = ref({
  name: '',
  size: '',
  supplier: '',
  status: '',
  stock: 0,
  threshold: 500,
  orders: 0,
  revenue: ''
})

// Watch for item changes to populate form
watch(() => props.item, (newItem) => {
  if (newItem) {
    populateForm(newItem)
  }
}, { immediate: true })

function populateForm(item) {
  formData.value = {
    name: item.name || '',
    size: item.size || '',
    supplier: item.supplier || '',
    status: item.status || 'In Stock',
    stock: item.stock || 0,
    threshold: item.threshold || 500,
    orders: item.orders || 0,
    revenue: item.revenue || '₱0'
  }
}

function handleEscKey(event) {
  if (event.key === 'Escape' && props.show) {
    closeModal()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscKey)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscKey)
})

function closeModal() {
  emit('close')
}

async function handleSubmit() {
  isSubmitting.value = true
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800))
  
  // Prepare updated item
  const updatedItem = {
    ...props.item,
    name: formData.value.name,
    size: formData.value.size,
    supplier: formData.value.supplier,
    status: formData.value.status,
    stock: formData.value.stock,
    threshold: formData.value.threshold,
    orders: formData.value.orders,
    revenue: formData.value.revenue
  }
  
  // Auto-update status based on threshold
  if (updatedItem.stock < updatedItem.threshold) {
    updatedItem.status = 'Low Stock'
  } else {
    updatedItem.status = 'In Stock'
  }
  
  emit('update', updatedItem)
  isSubmitting.value = false
  closeModal()
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .relative {
  transform: scale(0.95) translateY(8px);
  opacity: 0;
}
.modal-leave-to .relative {
  transform: scale(0.95) translateY(8px);
  opacity: 0;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>