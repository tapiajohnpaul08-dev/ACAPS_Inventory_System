<!-- modals/AddSupplyModal.vue -->
<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="close"
      >
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300" @click="close" />
        
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh]  transform transition-all duration-300 modal-slide-in">
          
          <!-- Loading Overlay -->
          <div v-if="loading" class="absolute inset-0 bg-white/90 rounded-2xl flex items-center justify-center z-10">            <div class="text-center">
              <div class="inline-block w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <p class="mt-2 text-sm text-gray-600">Creating supply...</p>
            </div>
          </div>

          <!-- Header -->
          <div class="sticky top-0 bg-gradient-to-r from-blue-50 to-white border-b border-gray-100 px-6 py-3 flex justify-between items-center rounded-t-2xl">
            <div>
              <h2 class="text-lg font-bold text-gray-900">Add New Supply</h2>
              <p class="text-xs text-gray-500 mt-0.5">Create a new supply item and add to inventory</p>
            </div>
            <button @click="close" class="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <form @submit.prevent="submit" class="p-5 space-y-4">
            
            <!-- Two Column Layout -->
            <div class="grid grid-cols-2 gap-4">
              <!-- Left Column -->
              <div class="space-y-4">
                <!-- Basic Information -->
                <div class="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-200">
                  <div class="flex items-center gap-2 mb-3">
                    <div class="w-1 h-4 bg-blue-600 rounded-full"></div>
                    <p class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Basic Information</p>
                  </div>
                  
                  <div class="space-y-3">
                    <div>
                      <label class="block text-xs font-medium text-gray-700 mb-1">
                        Supply Name <span class="text-red-500">*</span>
                      </label>
                      <input
                        v-model="form.name"
                        type="text"
                        required
                        class="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                        placeholder="e.g., Black Ink"
                      />
                    </div>
                    
                    <div>
                      <label class="block text-xs font-medium text-gray-700 mb-1">
                        Category <span class="text-red-500">*</span>
                      </label>
                      <select
                        v-model="form.category"
                        required
                        class="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 bg-white"
                      >
                        <option value="">Select category...</option>
                        <option v-for="cat in categories" :key="cat.value" :value="cat.value">
                          {{ cat.label }}
                        </option>
                      </select>
                    </div>
                    
                    <div>
                      <label class="block text-xs font-medium text-gray-700 mb-1">Supplier <span class="text-red-500">*</span></label>
                      <input
                        v-model="form.supplier"
                        type="text"
                        required
                        class="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                        placeholder="Supplier name"
                      />
                    </div>
                  </div>
                </div>

                <!-- Supplier Contact & Lead Time -->
                <div class="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-200">
                  <div class="flex items-center gap-2 mb-3">
                    <div class="w-1 h-4 bg-cyan-600 rounded-full"></div>
                    <p class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Supplier Details</p>
                  </div>
                  
                  <div class="space-y-3">
                    <div>
                      <label class="block text-xs font-medium text-gray-700 mb-1">Supplier Contact</label>
                      <input
                        v-model="form.supplierContact"
                        type="text"
                        class="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                        placeholder="Contact number or email"
                      />
                    </div>
                    <!-- <div>
                      <label class="block text-xs font-medium text-gray-700 mb-1">Lead Time (days)</label>
                      <input
                        v-model.number="form.leadTime"
                        type="number"
                        min="0"
                        class="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                        placeholder="7"
                      />
                      <p class="text-[10px] text-gray-400 mt-0.5">Days for delivery after order</p>
                    </div> -->
                  </div>
                </div>
              </div>

              <!-- Right Column -->
              <div class="space-y-4">
                <!-- Stock Information -->
                <div class="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-200">
                  <div class="flex items-center gap-2 mb-3">
                    <div class="w-1 h-4 bg-green-600 rounded-full"></div>
                    <p class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Stock Information</p>
                  </div>
                  
                  <div class="space-y-3">
                    <div class="grid grid-cols-2 gap-3">
                      <div>
                        <label class="block text-xs font-medium text-gray-700 mb-1">Initial Stock</label>
                        <input
                          v-model.number="form.stock"
                          type="number"
                          min="0"
                          class="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label class="block text-xs font-medium text-gray-700 mb-1">Unit of Measure *</label>
                        <select
                          v-model="form.unit"
                          required
                          class="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 bg-white"
                        >
                          <option value="piece">Piece (pc)</option>
                          <option value="kg">Kilogram (kg)</option>
                          <option value="liter">Liter (L)</option>
                          <option value="box">Box</option>
                          <option value="roll">Roll</option>
                          <option value="set">Set</option>
                        </select>
                      </div>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-3">
                      <div>
                        <label class="block text-xs font-medium text-gray-700 mb-1">Reorder Threshold</label>
                        <input
                          v-model.number="form.threshold"
                          type="number"
                          min="0"
                          class="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                          placeholder="100"
                        />
                        <p class="text-[10px] text-gray-400 mt-0.5">Alert when stock falls below this</p>
                      </div>
                      <div>
                        <label class="block text-xs font-medium text-gray-700 mb-1">Unit Cost (₱)</label>
                        <div class="relative">
                          <span class="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₱</span>
                          <input
                            v-model.number="form.unitCost"
                            type="number"
                            min="0"
                            step="0.01"
                            class="w-full pl-7 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Description & Notes -->
                <div class="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-200">
                  <div class="flex items-center gap-2 mb-3">
                    <div class="w-1 h-4 bg-purple-600 rounded-full"></div>
                    <p class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Details</p>
                  </div>
                  
                  <div class="space-y-3">
                    <div>
                      <label class="block text-xs font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        v-model="form.description"
                        rows="2"
                        class="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-none"
                        placeholder="Supply description..."
                      ></textarea>
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-gray-700 mb-1">Additional Notes</label>
                      <textarea
                        v-model="form.notes"
                        rows="1"
                        class="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-none"
                        placeholder="Any additional notes..."
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 flex items-start gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ errorMessage }}
            </div>

            <!-- Form Actions -->
            <div class="flex gap-3 pt-2 border-t border-gray-100">
              <button
                type="button"
                @click="close"
                class="flex-1 px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="loading"
                class="flex-1 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <span v-if="loading" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                {{ loading ? 'Creating...' : 'Create Supply' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  show: { type: Boolean, default: false },
  categories: { type: Array, required: true },
  // Parent controls the loading flag (it knows when the API resolves)
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['close', 'submit'])

const form = ref({
  name: '',
  category: '',
  supplier: '',
  supplierContact: '',
  leadTime: 7,
  stock: 0,
  unit: 'piece',
  threshold: 100,
  unitCost: 0,
  minOrderQuantity: 1,
  description: '',
  notes: ''
})
const localError = ref('')

const isSubmitting = ref(false)
const errorMessage = ref('')


watch(() => props.show, (newVal) => {
  if (newVal) {
    form.value = {
      name: '',
      category: '',
      supplier: '',
      supplierContact: '',
      leadTime: 7,
      stock: 0,
      unit: 'piece',
      threshold: 100,
      unitCost: 0,
      minOrderQuantity: 1,
      description: '',
      notes: ''
    }
    errorMessage.value = ''
  }
})

function validateForm() {
  if (!form.value.name.trim()) {
    errorMessage.value = 'Supply name is required'
    return false
  }
  if (!form.value.category) {
    errorMessage.value = 'Category is required'
    return false
  }
  if (!form.value.supplier.trim()) {
    errorMessage.value = 'Supplier is required'
    return false
  }
  if (form.value.stock < 0) {
    errorMessage.value = 'Stock cannot be negative'
    return false
  }
  return true
}

function submit() {
  if (!validateForm()) return
  // Just emit; the parent will flip `loading` while the API is in flight
  // and will unmount us on success (or leave us mounted with loading=false
  // on failure, so the admin can retry).
  emit('submit', { ...form.value })
}

function close() {
  emit('close')
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-slide-in {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes spin { to { transform: rotate(360deg); } }
.animate-spin { animation: spin 1s linear infinite; }
</style>