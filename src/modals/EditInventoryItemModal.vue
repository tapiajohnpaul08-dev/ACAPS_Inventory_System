<!-- modals/EditInventoryItemModal.vue -->
<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="closeModal"
      >
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300" @click="closeModal" />
        
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col transform transition-all duration-300 modal-slide-in">
          
          <!-- Loading Overlay -->
          <div v-if="isSubmitting" class="absolute inset-0 bg-white/90 rounded-2xl flex items-center justify-center z-10">
            <div class="text-center">
              <div class="inline-block w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <p class="mt-3 text-sm text-gray-600">Updating inventory...</p>
            </div>
          </div>

          <!-- Header -->
          <div class="flex items-start justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0 rounded-t-2xl bg-gradient-to-r from-blue-50 to-white">
            <div>
              <h2 class="text-xl font-bold text-gray-900">Edit Inventory Item</h2>
              <p class="text-sm text-gray-500 mt-0.5">{{ item?.name || 'Update stock information' }}</p>
            </div>
            <button @click="closeModal" class="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Form -->
          <div class="flex-1 overflow-y-auto px-6 py-5">
            <form @submit.prevent="handleSubmit" class="space-y-5">
              <!-- Item Info Display -->
              <div class="bg-gray-50 rounded-xl p-4">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-xs text-gray-500">Item Name</p>
                    <p class="font-semibold text-gray-900">{{ item?.name }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Item ID</p>
                    <p class="font-semibold text-gray-900">{{ item?.itemId }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Category</p>
                    <p class="font-semibold text-gray-900 capitalize">{{ item?.category }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Supplier</p>
                    <p class="font-semibold text-gray-900">{{ item?.supplier || 'N/A' }}</p>
                  </div>
                </div>
              </div>

              <!-- Stock Information -->
              <div class="bg-white border border-gray-200 rounded-xl p-5">
                <div class="flex items-center gap-2 mb-4">
                  <div class="w-1 h-5 bg-green-600 rounded-full"></div>
                  <p class="text-xs font-bold text-gray-500 uppercase tracking-wider">Stock Information</p>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Current Stock</label>
                    <div class="relative">
                      <input
                        v-model.number="formData.stock"
                        type="number"
                        required
                        min="0"
                        class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                      />
                      <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{{ formData.unit }}</span>
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Reorder Threshold</label>
                    <div class="relative">
                      <input
                        v-model.number="formData.threshold"
                        type="number"
                        min="0"
                        class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                      />
                      <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{{ formData.unit }}</span>
                    </div>
                    <p class="text-xs text-gray-400 mt-1">Alert when stock falls below this level</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Unit of Measure</label>
                    <select
                      v-model="formData.unit"
                      class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 bg-white"
                    >
                      <option value="piece">Piece (pc)</option>
                      <option value="kg">Kilogram (kg)</option>
                      <option value="liter">Liter (L)</option>
                      <option value="box">Box</option>
                      <option value="roll">Roll</option>
                      <option value="set">Set</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Unit Cost (₱)</label>
                    <div class="relative">
                      <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₱</span>
                      <input
                        v-model.number="formData.unitCost"
                        type="number"
                        min="0"
                        step="0.01"
                        class="w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>
                
                <!-- Stock Status Indicator -->
                <div class="mt-4 p-3 rounded-lg" :class="getStockStatusClass(formData.stock, formData.threshold)">
                  <div class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p class="text-sm font-medium">
                      Status: {{ getStockStatus(formData.stock, formData.threshold) }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Location Information -->
              <div class="bg-white border border-gray-200 rounded-xl p-5">
                <div class="flex items-center gap-2 mb-4">
                  <div class="w-1 h-5 bg-purple-600 rounded-full"></div>
                  <p class="text-xs font-bold text-gray-500 uppercase tracking-wider">Location</p>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Warehouse Location</label>
                    <input
                      v-model="formData.location"
                      type="text"
                      class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                      placeholder="e.g., Warehouse A"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Bin Location</label>
                    <input
                      v-model="formData.binLocation"
                      type="text"
                      class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                      placeholder="e.g., A-12"
                    />
                  </div>
                </div>
              </div>

              <!-- Notes -->
              <div class="bg-white border border-gray-200 rounded-xl p-5">
                <div class="flex items-center gap-2 mb-4">
                  <div class="w-1 h-5 bg-gray-600 rounded-full"></div>
                  <p class="text-xs font-bold text-gray-500 uppercase tracking-wider">Notes</p>
                </div>
                <textarea
                  v-model="formData.notes"
                  rows="3"
                  class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-none"
                  placeholder="Additional notes..."
                ></textarea>
              </div>

              <!-- Action Buttons -->
              <div class="flex gap-3 pt-4">
                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-sm font-semibold shadow-md hover:shadow-lg disabled:opacity-50"
                >
                  <svg v-if="!isSubmitting" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
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
                  class="flex-1 py-3 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200 text-sm font-semibold"
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
import { ref, watch } from 'vue'

const props = defineProps({
  show: { type: Boolean, required: true },
  item: { type: Object, required: true }
})

const emit = defineEmits(['close', 'update'])

const isSubmitting = ref(false)
const formData = ref({
  stock: 0,
  threshold: 100,
  unit: 'piece',
  unitCost: 0,
  location: 'Warehouse A',
  binLocation: '',
  notes: ''
})

function getStockStatus(stock, threshold) {
  const stockNum = Number(stock) || 0
  const thresholdNum = Number(threshold) || 0
  if (stockNum <= 0) return 'Out of Stock'
  if (stockNum <= thresholdNum) return 'Low Stock'
  return 'In Stock'
}

function getStockStatusClass(stock, threshold) {
  const stockNum = Number(stock) || 0
  const thresholdNum = Number(threshold) || 0
  if (stockNum <= 0) return 'bg-red-50 border border-red-200 text-red-700'
  if (stockNum <= thresholdNum) return 'bg-yellow-50 border border-yellow-200 text-yellow-700'
  return 'bg-green-50 border border-green-200 text-green-700'
}

watch(() => props.item, (newItem) => {
  if (newItem) {
    formData.value = {
      stock: newItem.stock || 0,
      threshold: newItem.threshold || 100,
      unit: newItem.unit || 'piece',
      unitCost: newItem.unitCost || 0,
      location: newItem.location || 'Warehouse A',
      binLocation: newItem.binLocation || '',
      notes: newItem.notes || ''
    }
  }
}, { immediate: true })

function closeModal() {
  emit('close')
}

async function handleSubmit() {
  isSubmitting.value = true
  
  const updatedItem = {
    ...props.item,
    stock: formData.value.stock,
    threshold: formData.value.threshold,
    unit: formData.value.unit,
    unitCost: formData.value.unitCost,
    location: formData.value.location,
    binLocation: formData.value.binLocation,
    notes: formData.value.notes
  }
  
  emit('update', updatedItem)
  isSubmitting.value = false
  closeModal()
}
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-slide-in {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>