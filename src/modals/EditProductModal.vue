<!-- modals/EditProductModal.vue -->
<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto" @click.self="close">
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300"></div>
        
        <div class="flex min-h-full items-center justify-center p-4">
          <div class="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] transform transition-all duration-300 modal-slide-in">
            
            <div v-if="loading" class="absolute inset-0 bg-white/90 rounded-2xl flex items-center justify-center z-10">
              <div class="text-center">
                <div class="inline-block w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <p class="mt-3 text-sm text-gray-600">Saving changes...</p>
              </div>
            </div>

            <div class="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center rounded-t-2xl">
              <div>
                <h2 class="text-xl font-bold text-gray-900">Edit Product</h2>
                <p class="text-sm text-gray-500 mt-0.5">Update product information and pricing</p>
              </div>
              <button @click="close" class="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form @submit.prevent="handleSubmit" class="p-6 space-y-6 overflow-y-auto" style="max-height: calc(90vh - 80px)">
              <div class="space-y-4">
                <div class="flex items-center gap-2">
                  <div class="w-1 h-5 bg-blue-600 rounded-full"></div>
                  <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wider">Basic Information</h3>
                </div>
                
                <div class="bg-gray-50 rounded-xl p-4 space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Product Name <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="form.name"
                      type="text"
                      required
                      class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                      placeholder="Enter product name"
                    />
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Category <span class="text-red-500">*</span>
                      </label>
                      <select
                        v-model="form.category"
                        required
                        class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 bg-white"
                      >
                        <option value="Plastic Cups">Plastic Cups</option>
                        <option value="Paper Cups">Paper Cups</option>
                      </select>
                    </div>
                    
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      v-model="form.description"
                      rows="3"
                      class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white resize-none"
                      placeholder="Product description..."
                    ></textarea>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                    <div class="flex gap-3">
                      <input
                        v-model="form.image"
                        type="text"
                        class="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                        placeholder="https://..."
                      />
                      <button
                        v-if="form.image"
                        type="button"
                        @click="previewImage = !previewImage"
                        class="px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        {{ previewImage ? 'Hide' : 'Preview' }}
                      </button>
                    </div>
                    <div v-if="previewImage && form.image" class="mt-3">
                      <img :src="form.image" alt="Preview" class="h-32 w-32 object-cover rounded-lg border border-gray-200" @error="imageError = true" />
                      <p v-if="imageError" class="text-xs text-red-500 mt-1">Failed to load image</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="space-y-4">
                <div class="flex items-center gap-2">
                  <div class="w-1 h-5 bg-green-600 rounded-full"></div>
                  <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wider">Product Settings</h3>
                </div>
                
                <div class="bg-gray-50 rounded-xl p-4 space-y-4">
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Minimum Order Quantity</label>
                      <input
                        v-model.number="form.minOrder"
                        type="number"
                        min="0"
                        step="100"
                        class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                      />
                    </div>
                  </div>

                  <div class="flex flex-wrap gap-4">
                    <label class="flex items-center gap-2 cursor-pointer group">
                      <div class="relative">
                        <input v-model="form.featured" type="checkbox" class="sr-only peer" />
                        <div class="w-5 h-5 border-2 border-gray-300 rounded-md peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all duration-200"></div>
                        <svg v-if="form.featured" class="absolute top-0.5 left-0.5 w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span class="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">Featured Product</span>
                    </label>
                    
                    <label class="flex items-center gap-2 cursor-pointer group">
                      <div class="relative">
                        <input v-model="form.popular" type="checkbox" class="sr-only peer" />
                        <div class="w-5 h-5 border-2 border-gray-300 rounded-md peer-checked:bg-purple-600 peer-checked:border-purple-600 transition-all duration-200"></div>
                        <svg v-if="form.popular" class="absolute top-0.5 left-0.5 w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span class="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">Popular Product</span>
                    </label>
                  </div>
                </div>
              </div>

              <div class="space-y-4">
                <div class="flex justify-between items-center">
                  <div class="flex items-center gap-2">
                    <div class="w-1 h-5 bg-orange-600 rounded-full"></div>
                    <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wider">Sizes & Pricing</h3>
                  </div>
                  <button
                    type="button"
                    @click="addSize"
                    class="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Size
                  </button>
                </div>

                <div class="space-y-3">
                  <div v-for="(size, index) in form.sizes" :key="index" class="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-blue-300 transition-all duration-200">
                    <div class="flex justify-between items-center mb-3">
                      <h4 class="font-medium text-gray-900">Size {{ index + 1 }}</h4>
                      <button
                        type="button"
                        @click="removeSize(index)"
                        class="text-red-600 hover:text-red-700 text-sm flex items-center gap-1 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Remove
                      </button>
                    </div>
                    
                    <div class="grid grid-cols-3 gap-3 mb-3">
                      <div>
                        <label class="block text-xs font-medium text-gray-700 mb-1">Size Name *</label>
                        <input
                          v-model="size.name"
                          type="text"
                          required
                          class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                          placeholder="e.g., 8oz, 12oz"
                        />
                      </div>
                      <div>
                        <label class="block text-xs font-medium text-gray-700 mb-1">Unit Price (₱) *</label>
                        <input
                          v-model.number="size.price"
                          type="number"
                          step="0.01"
                          required
                          class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <label class="block text-xs font-medium text-gray-700 mb-1">Stock Quantity</label>
                        <input
                          v-model.number="size.stock"
                          type="number"
                          min="0"
                          class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                          placeholder="0"
                        />
                      </div>
                    </div>

                    <div>
                      <button
                        type="button"
                        @click="size.showBulk = !size.showBulk"
                        class="text-xs text-blue-600 hover:text-blue-700 mb-2 flex items-center gap-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" :class="{ 'rotate-180': size.showBulk }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                        {{ size.showBulk ? 'Hide' : 'Show' }} Bulk Pricing
                      </button>
                      
                      <div v-if="size.showBulk" class="grid grid-cols-2 gap-3 mt-2 animate-slide-down">
                        <div>
                          <label class="text-xs text-gray-500">500 pcs</label>
                          <input
                            :value="size.bulkPrices?.[500]"
                            @input="updateBulkPrice(index, 500, $event.target.value)"
                            type="number"
                            step="0.01"
                            class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            placeholder="₱0.00"
                          />
                        </div>
                        <div>
                          <label class="text-xs text-gray-500">1000 pcs</label>
                          <input
                            :value="size.bulkPrices?.[1000]"
                            @input="updateBulkPrice(index, 1000, $event.target.value)"
                            type="number"
                            step="0.01"
                            class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            placeholder="₱0.00"
                          />
                        </div>
                        <div>
                          <label class="text-xs text-gray-500">2000 pcs</label>
                          <input
                            :value="size.bulkPrices?.[2000]"
                            @input="updateBulkPrice(index, 2000, $event.target.value)"
                            type="number"
                            step="0.01"
                            class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            placeholder="₱0.00"
                          />
                        </div>
                        <div>
                          <label class="text-xs text-gray-500">5000 pcs</label>
                          <input
                            :value="size.bulkPrices?.[5000]"
                            @input="updateBulkPrice(index, 5000, $event.target.value)"
                            type="number"
                            step="0.01"
                            class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            placeholder="₱0.00"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="form.sizes.length === 0" class="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <p class="text-gray-400 text-sm">No sizes added yet.</p>
                  <button
                    type="button"
                    @click="addSize"
                    class="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    + Add your first size
                  </button>
                </div>
              </div>

              <div class="flex gap-3 pt-4 border-t border-gray-200 sticky bottom-0 bg-white py-4 -mx-6 px-6">
                <button
                  type="button"
                  @click="close"
                  class="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="loading || !isFormValid"
                  class="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                >
                  <span v-if="loading">Saving...</span>
                  <span v-else>Save Changes</span>
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
import { ref, watch, computed } from 'vue'

const props = defineProps({
  show: { type: Boolean, default: false },
  product: { type: Object, default: null },
  loading: { type: Boolean, default: false }
})

const emit = defineEmits(['close', 'update'])

const previewImage = ref(false)
const imageError = ref(false)

const form = ref({
  name: '',
  category: 'Plastic Cups',
  subcategory: '',
  description: '',
  image: '',
  minOrder: 500,
  featured: false,
  popular: false,
  sizes: []
})

const isFormValid = computed(() => {
  if (!form.value.name) return false
  if (!form.value.category) return false
  if (form.value.sizes.length === 0) return false
  for (const size of form.value.sizes) {
    if (!size.name || !size.price || size.price <= 0) return false
  }
  return true
})

watch(() => props.product, (newProduct) => {
  if (newProduct) {
    form.value = {
      name: newProduct.name || '',
      category: newProduct.category,
      subcategory: newProduct.subcategory || '',
      description: newProduct.description || '',
      image: newProduct.image || '',
      minOrder: newProduct.minOrder || 500,
      featured: newProduct.featured || false,
      popular: newProduct.popular || false,
      sizes: newProduct.sizes ? JSON.parse(JSON.stringify(newProduct.sizes.map(s => ({ ...s, showBulk: false })))) : []
    }
    imageError.value = false
  }
}, { immediate: true, deep: true })

function addSize() {
  form.value.sizes.push({
    name: '',
    price: 0,
    stock: 0,
    bulkPrices: {},
    showBulk: false
  })
}

function removeSize(index) {
  form.value.sizes.splice(index, 1)
}

function updateBulkPrice(sizeIndex, quantity, value) {
  if (!form.value.sizes[sizeIndex].bulkPrices) {
    form.value.sizes[sizeIndex].bulkPrices = {}
  }
  const numValue = value === '' ? undefined : parseFloat(value)
  if (numValue === undefined || isNaN(numValue)) {
    delete form.value.sizes[sizeIndex].bulkPrices[quantity]
  } else {
    form.value.sizes[sizeIndex].bulkPrices[quantity] = numValue
  }
}

function handleSubmit() {
  if (!isFormValid.value) return
  emit('update', form.value)
}

function close() {
  emit('close')
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
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-down {
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>