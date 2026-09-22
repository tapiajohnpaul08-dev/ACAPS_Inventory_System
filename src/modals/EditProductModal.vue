<!-- modals/EditProductModal.vue -->
<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto" @click.self="close">
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300"></div>
        
        <div class="flex min-h-full items-center justify-center p-4">
          <div class="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] transform transition-all duration-300 modal-slide-in">
            
            <div v-if="loading" class="absolute inset-0 bg-white/90 rounded-2xl flex items-center justify-center z-10">
              <div class="text-center">
                <div class="inline-block w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <p class="mt-2 text-sm text-gray-600">Saving changes...</p>
              </div>
            </div>

            <div class="sticky top-0 bg-white border-b border-gray-100 px-6 py-3 flex justify-between items-center rounded-t-2xl">
              <div>
                <h2 class="text-xl font-bold text-gray-900">Edit Product</h2>
                <p class="text-sm text-gray-500">Update product information and pricing</p>
              </div>
              <button @click="close" class="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form @submit.prevent="handleSubmit" class="p-6 space-y-4 overflow-y-auto" style="max-height: calc(90vh - 80px)">
              <div class="grid grid-cols-2 gap-4">
                <!-- Left Column -->
                <div class="space-y-4">
                  <!-- Basic Information -->
                  <div class="bg-gray-50 rounded-xl p-4 space-y-3">
                    <div class="flex items-center gap-2">
                      <div class="w-1 h-4 bg-blue-600 rounded-full"></div>
                      <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wider">Basic Information</h3>
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">
                        Product Name <span class="text-red-500">*</span>
                      </label>
                      <input
                        v-model="form.name"
                        type="text"
                        required
                        class="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-sm"
                        placeholder="Enter product name"
                      />
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                          Category <span class="text-red-500">*</span>
                        </label>
                        <select
                          v-model="form.category"
                          required
                          class="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 bg-white text-sm"
                        >
                          <option value="Plastic Cups">Plastic Cups</option>
                        <option value="Paper Cups">Paper Cups</option>
                        <option value="Containers">Containers</option>
                        <option value="Bags">Bags</option>
                        <option value="Utensils">Utensils</option>
                        <option value="Straws">Straws</option>
                        <option value="Lids">Lids</option>
                        </select>
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Min Order</label>
                        <input
                          v-model.number="form.minOrder"
                          type="number"
                          min="0"
                          step="100"
                          class="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        v-model="form.description"
                        rows="2"
                        class="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white resize-none text-sm"
                        placeholder="Product description..."
                      ></textarea>
                    </div>
                  </div>

                  <!-- Image -->
                  <div class="bg-gray-50 rounded-xl p-4 space-y-2">
                    <div class="flex items-center gap-2">
                      <div class="w-1 h-4 bg-purple-600 rounded-full"></div>
                      <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wider">Product Image</h3>
                    </div>
                    <div class="flex gap-3">
                      <input
                        v-model="form.image"
                        type="text"
                        class="flex-1 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-sm"
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
                    <div v-if="previewImage && form.image" class="mt-2">
                      <img :src="form.image" alt="Preview" class="h-20 w-20 object-cover rounded-lg border border-gray-200" @error="imageError = true" />
                      <p v-if="imageError" class="text-xs text-red-500 mt-1">Failed to load image</p>
                    </div>
                  </div>

                  <!-- Tags -->
                  <div class="bg-gray-50 rounded-xl p-4 space-y-2">
                    <div class="flex items-center gap-2">
                      <div class="w-1 h-4 bg-green-600 rounded-full"></div>
                      <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wider">Product Tags</h3>
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
                        <span class="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">Featured</span>
                      </label>
                      
                      <label class="flex items-center gap-2 cursor-pointer group">
                        <div class="relative">
                          <input v-model="form.popular" type="checkbox" class="sr-only peer" />
                          <div class="w-5 h-5 border-2 border-gray-300 rounded-md peer-checked:bg-purple-600 peer-checked:border-purple-600 transition-all duration-200"></div>
                          <svg v-if="form.popular" class="absolute top-0.5 left-0.5 w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span class="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">Popular</span>
                      </label>
                    </div>
                  </div>
                </div>

                <!-- Right Column - Sizes -->
                <div class="space-y-4">
                  <div class="bg-gray-50 rounded-xl p-4 space-y-3">
                    <div class="flex justify-between items-center">
                      <div class="flex items-center gap-2">
                        <div class="w-1 h-4 bg-orange-600 rounded-full"></div>
                        <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wider">Sizes & Pricing</h3>
                      </div>
                      <button
                        type="button"
                        @click="addSize"
                        class="flex items-center gap-1 px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Add Size
                      </button>
                    </div>

                    <div class="space-y-2 max-h-105 overflow-y-auto pr-1">
                      <div v-for="(size, index) in form.sizes" :key="index" class="bg-white rounded-lg p-3 border border-gray-200 hover:border-blue-300 transition-all duration-200">
                        <div class="flex justify-between items-center mb-2">
                          <span class="font-medium text-gray-900 text-sm">Size {{ index + 1 }}</span>
                          <button
                            type="button"
                            @click="removeSize(index)"
                            class="text-red-600 hover:text-red-700 text-xs flex items-center gap-1 transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Remove
                          </button>
                        </div>
                        
                        <div class="grid grid-cols-3 gap-2">
                          <div>
                            <label class="block text-xs font-medium text-gray-700 mb-1">Name *</label>
                            <input
                              v-model="size.name"
                              type="text"
                              required
                              class="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                              placeholder="e.g., 8oz"
                            />
                          </div>
                          <div>
                            <label class="block text-xs font-medium text-gray-700 mb-1">Price (₱) *</label>
                            <input
                              v-model.number="size.price"
                              type="number"
                              step="0.01"
                              required
                              class="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                              placeholder="0.00"
                            />
                          </div>
                          <div>
                            <label class="block text-xs font-medium text-gray-700 mb-1">Stock</label>
                            <input
                              v-model.number="size.stock"
                              type="number"
                              min="0"
                              class="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                              placeholder="0"
                            />
                          </div>
                        </div>

                        <div class="mt-2">
                          <button
                            type="button"
                            @click="size.showBulk = !size.showBulk"
                            class="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" :class="{ 'rotate-180': size.showBulk }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                            </svg>
                            {{ size.showBulk ? 'Hide' : 'Show' }} Bulk Pricing
                          </button>
                          
                          <div v-if="size.showBulk" class="grid grid-cols-4 gap-2 mt-2 animate-slide-down">
                            <div>
                              <label class="text-xs text-gray-500">500 pcs</label>
                              <input
                                :value="size.bulkPrices?.[500]"
                                @input="updateBulkPrice(index, 500, $event.target.value)"
                                type="number"
                                step="0.01"
                                class="w-full px-2 py-1 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                placeholder="0.00"
                              />
                            </div>
                            <div>
                              <label class="text-xs text-gray-500">1000 pcs</label>
                              <input
                                :value="size.bulkPrices?.[1000]"
                                @input="updateBulkPrice(index, 1000, $event.target.value)"
                                type="number"
                                step="0.01"
                                class="w-full px-2 py-1 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                placeholder="0.00"
                              />
                            </div>
                            <div>
                              <label class="text-xs text-gray-500">2000 pcs</label>
                              <input
                                :value="size.bulkPrices?.[2000]"
                                @input="updateBulkPrice(index, 2000, $event.target.value)"
                                type="number"
                                step="0.01"
                                class="w-full px-2 py-1 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                placeholder="0.00"
                              />
                            </div>
                            <div>
                              <label class="text-xs text-gray-500">5000 pcs</label>
                              <input
                                :value="size.bulkPrices?.[5000]"
                                @input="updateBulkPrice(index, 5000, $event.target.value)"
                                type="number"
                                step="0.01"
                                class="w-full px-2 py-1 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                placeholder="0.00"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div v-if="form.sizes.length === 0" class="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
                      <p class="text-gray-400 text-sm">No sizes added yet.</p>
                      <button
                        type="button"
                        @click="addSize"
                        class="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        + Add your first size
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Footer -->
              <div class="flex gap-3 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  @click="close"
                  class="flex-1 px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="loading || !isFormValid"
                  class="flex-1 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
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
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-slide-down {
  animation: slideDown 0.2s ease-out;
}
@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>