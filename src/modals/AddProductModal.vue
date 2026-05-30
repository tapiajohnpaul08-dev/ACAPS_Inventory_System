<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="close"
      >
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300" @click="close" />
        
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 modal-slide-in">
          
          <div v-if="isSubmitting" class="absolute inset-0 bg-white/90 rounded-2xl flex items-center justify-center z-10">
            <div class="text-center">
              <div class="inline-block w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <p class="mt-3 text-sm text-gray-600">Creating product...</p>
            </div>
          </div>

          <div class="sticky top-0 bg-gradient-to-r from-blue-50 to-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
            <div>
              <h2 class="text-xl font-bold text-gray-900">Add New Product</h2>
              <p class="text-sm text-gray-500 mt-0.5">Create a new product with sizes and pricing</p>
            </div>
            <button @click="close" class="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <form @submit.prevent="submit" class="p-6 space-y-5" enctype="multipart/form-data">
            
            <div class="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow duration-200">
              <div class="flex items-center gap-2 mb-4">
                <div class="w-1 h-5 bg-blue-600 rounded-full"></div>
                <p class="text-xs font-bold text-gray-500 uppercase tracking-wider">Basic Information</p>
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div class="col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Product Name <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="form.name"
                    type="text"
                    required
                    class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="e.g., PP U-CUPS"
                  />
                </div>
                
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
            </div>

            <!-- Image Upload Section -->
            <div class="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow duration-200">
              <div class="flex items-center gap-2 mb-4">
                <div class="w-1 h-5 bg-purple-600 rounded-full"></div>
                <p class="text-xs font-bold text-gray-500 uppercase tracking-wider">Product Image</p>
              </div>
              
              <div class="space-y-4">
                <div v-if="imagePreview" class="relative inline-block">
                  <img :src="imagePreview" alt="Preview" class="h-32 w-32 object-cover rounded-lg border-2 border-gray-200" />
                  <button
                    type="button"
                    @click="removeImage"
                    class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div 
                  class="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition-colors cursor-pointer"
                  :class="{ 'border-blue-500 bg-blue-50': isDragOver }"
                  @click="triggerFileInput"
                  @dragover.prevent="isDragOver = true"
                  @dragleave.prevent="isDragOver = false"
                  @drop.prevent="handleDrop"
                >
                  <input
                    ref="fileInput"
                    type="file"
                    accept="image/*"
                    class="hidden"
                    @change="handleFileSelect"
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p class="text-sm text-gray-600">Click or drag and drop to upload image</p>
                  <p class="text-xs text-gray-400 mt-1">PNG, JPG, JPEG up to 5MB</p>
                </div>
                
                <div v-if="uploadProgress > 0 && uploadProgress < 100" class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-blue-600 h-2 rounded-full transition-all duration-300" :style="{ width: uploadProgress + '%' }"></div>
                </div>
                
                <p v-if="uploadError" class="text-xs text-red-500">{{ uploadError }}</p>
              </div>
            </div>

            <div class="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow duration-200">
              <div class="flex items-center gap-2 mb-4">
                <div class="w-1 h-5 bg-green-600 rounded-full"></div>
                <p class="text-xs font-bold text-gray-500 uppercase tracking-wider">Product Settings</p>
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Minimum Order Quantity</label>
                  <input
                    v-model.number="form.minOrder"
                    type="number"
                    min="0"
                    step="100"
                    class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    placeholder="500"
                  />
                </div>
              </div>
              
              <div class="flex flex-wrap gap-4 mt-4">
                <label class="flex items-center gap-2 cursor-pointer group">
                  <div class="relative">
                    <input type="checkbox" v-model="form.featured" class="sr-only peer" />
                    <div class="w-5 h-5 border-2 border-gray-300 rounded-md peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all duration-200"></div>
                    <svg v-if="form.featured" class="absolute top-0.5 left-0.5 w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span class="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">Featured Product</span>
                </label>
                
                <label class="flex items-center gap-2 cursor-pointer group">
                  <div class="relative">
                    <input type="checkbox" v-model="form.popular" class="sr-only peer" />
                    <div class="w-5 h-5 border-2 border-gray-300 rounded-md peer-checked:bg-purple-600 peer-checked:border-purple-600 transition-all duration-200"></div>
                    <svg v-if="form.popular" class="absolute top-0.5 left-0.5 w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span class="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">Popular Product</span>
                </label>
              </div>
            </div>

            <!-- Sizes Section -->
            <div class="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow duration-200">
              <div class="flex justify-between items-center mb-4">
                <div class="flex items-center gap-2">
                  <div class="w-1 h-5 bg-orange-600 rounded-full"></div>
                  <p class="text-xs font-bold text-gray-500 uppercase tracking-wider">Sizes & Pricing</p>
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
              
              <div v-for="(size, index) in form.sizes" :key="index" class="mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-200">
                <div class="flex justify-between items-center mb-3">
                  <span class="text-sm font-semibold text-gray-700">Size {{ index + 1 }}</span>
                  <button
                    type="button"
                    @click="removeSize(index)"
                    class="text-red-500 hover:text-red-700 text-sm flex items-center gap-1 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Remove
                  </button>
                </div>
                
                <div class="grid grid-cols-3 gap-3 mb-3">
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Size Name <span class="text-red-500">*</span></label>
                    <input
                      v-model="size.name"
                      type="text"
                      required
                      class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      placeholder="e.g., 12oz, 16oz"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Base Price (₱) <span class="text-red-500">*</span></label>
                    <input
                      v-model.number="size.price"
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      placeholder="1.80"
                      @input="updateBulkPrices(size)"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Stock Quantity</label>
                    <input
                      v-model.number="size.stock"
                      type="number"
                      min="0"
                      class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      placeholder="0"
                    />
                  </div>
                </div>
                
                <div class="mt-3">
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
                  
                  <!-- Bulk prices - auto-update when base price changes, but editable -->
                  <div v-if="size.showBulk" class="grid grid-cols-2 gap-3 mt-2 animate-slide-down">
                    <div>
                      <label class="block text-xs text-gray-500 mb-1">500 pcs</label>
                      <input
                        :value="formatCurrency(size.bulkPrices[500])"
                        type="text"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-700 cursor-not-allowed"
                        readonly
                        disabled
                      />
                    </div>
                    <div>
                      <label class="block text-xs text-gray-500 mb-1">1000 pcs</label>
                      <input
                        :value="formatCurrency(size.bulkPrices[1000])"
                        type="text"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-700 cursor-not-allowed"
                        readonly
                        disabled
                      />
                    </div>
                    <div>
                      <label class="block text-xs text-gray-500 mb-1">2000 pcs</label>
                      <input
                        :value="formatCurrency(size.bulkPrices[2000])"
                        type="text"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-700 cursor-not-allowed"
                        readonly
                        disabled
                      />
                    </div>
                    <div>
                      <label class="block text-xs text-gray-500 mb-1">5000 pcs</label>
                      <input
                        :value="formatCurrency(size.bulkPrices[5000])"
                        type="text"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-700 cursor-not-allowed"
                        readonly
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div v-if="form.sizes.length === 0" class="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
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

            <div class="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow duration-200">
              <div class="flex items-center gap-2 mb-4">
                <div class="w-1 h-5 bg-purple-600 rounded-full"></div>
                <p class="text-xs font-bold text-gray-500 uppercase tracking-wider">Description</p>
              </div>
              <textarea
                v-model="form.description"
                rows="3"
                class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-none"
                placeholder="Product description..."
              ></textarea>
            </div>

            <div v-if="errorMessage" class="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ errorMessage }}
            </div>

            <div class="flex gap-3 pt-4">
              <button
                type="button"
                @click="close"
                class="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="isSubmitting || !imageFile"
                class="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <span v-if="isSubmitting" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                {{ isSubmitting ? 'Creating...' : 'Create Product' }}
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
  show: { type: Boolean, default: false }
})

const emit = defineEmits(['close', 'submit'])

const fileInput = ref(null)
const imageFile = ref(null)
const imagePreview = ref('')
const isDragOver = ref(false)
const uploadProgress = ref(0)
const uploadError = ref('')

const form = ref({
  name: '',
  category: 'Plastic Cups',
  subcategory: '',
  minOrder: 500,
  featured: false,
  popular: false,
  description: '',
  sizes: []
})

const isSubmitting = ref(false)
const errorMessage = ref('')

// Format currency for display
function formatCurrency(value) {
  if (!value && value !== 0) return '₱0.00'
  return `₱${Number(value).toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`
}

// Calculate bulk prices based on unit price (no discounts)
function calculateBulkPrices(unitPrice) {
  if (!unitPrice || unitPrice <= 0) {
    return {
      500: null,
      1000: null,
      2000: null,
      5000: null
    }
  }
  
  return {
    500: unitPrice * 500,
    1000: unitPrice * 1000,
    2000: unitPrice * 2000,
    5000: unitPrice * 5000
  }
}

// Update ALL bulk prices when unit price changes (always recalculate)
function updateBulkPrices(size) {
  if (size.price && size.price > 0) {
    const calculatedPrices = calculateBulkPrices(size.price)
    size.bulkPrices[500] = calculatedPrices[500]
    size.bulkPrices[1000] = calculatedPrices[1000]
    size.bulkPrices[2000] = calculatedPrices[2000]
    size.bulkPrices[5000] = calculatedPrices[5000]
  }
}

// Add new size with auto-calculated bulk prices
function addSize() {
  const newSize = {
    name: '',
    price: 0,
    stock: 0,
    bulkPrices: {
      500: null,
      1000: null,
      2000: null,
      5000: null
    },
    showBulk: false
  }
  form.value.sizes.push(newSize)
}

watch(() => props.show, (newVal) => {
  if (newVal) {
    form.value = {
      name: '',
      category: 'Plastic Cups',
      subcategory: '',
      minOrder: 500,
      featured: false,
      popular: false,
      description: '',
      sizes: []
    }
    imageFile.value = null
    imagePreview.value = ''
    uploadError.value = ''
    uploadProgress.value = 0
    errorMessage.value = ''
  }
})

function triggerFileInput() {
  fileInput.value?.click()
}

function handleFileSelect(event) {
  const file = event.target.files[0]
  if (file) {
    validateAndSetImage(file)
  }
}

function handleDrop(event) {
  isDragOver.value = false
  const file = event.dataTransfer.files[0]
  if (file) {
    validateAndSetImage(file)
  }
}

function validateAndSetImage(file) {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
  if (!allowedTypes.includes(file.type)) {
    uploadError.value = 'Only JPG, JPEG, and PNG files are allowed'
    return
  }
  
  if (file.size > 5 * 1024 * 1024) {
    uploadError.value = 'File size must be less than 5MB'
    return
  }
  
  uploadError.value = ''
  imageFile.value = file
  
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target.result
  }
  reader.readAsDataURL(file)
}

function removeImage() {
  imageFile.value = null
  imagePreview.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

function removeSize(index) {
  form.value.sizes.splice(index, 1)
}

function validateForm() {
  if (!form.value.name.trim()) {
    errorMessage.value = 'Product name is required'
    return false
  }
  if (!imageFile.value) {
    errorMessage.value = 'Product image is required'
    return false
  }
  if (form.value.sizes.length === 0) {
    errorMessage.value = 'At least one size is required'
    return false
  }
  for (const size of form.value.sizes) {
    if (!size.name.trim()) {
      errorMessage.value = 'All sizes must have a name'
      return false
    }
    if (!size.price || size.price <= 0) {
      errorMessage.value = `Size "${size.name}" must have a valid price`
      return false
    }
  }
  return true
}

async function submit() {
  if (!validateForm()) return
  
  isSubmitting.value = true
  errorMessage.value = ''
  uploadProgress.value = 0
  
  const formData = new FormData()
  formData.append('image', imageFile.value)
  formData.append('name', form.value.name)
  formData.append('category', form.value.category)
  formData.append('subcategory', form.value.subcategory)
  formData.append('minOrder', form.value.minOrder)
  formData.append('featured', form.value.featured)
  formData.append('popular', form.value.popular)
  formData.append('description', form.value.description)
  formData.append('sizes', JSON.stringify(form.value.sizes.map(size => ({
    name: size.name,
    price: size.price,
    stock: size.stock || 0,
    bulkPrices: size.bulkPrices
  }))))
  
  const interval = setInterval(() => {
    if (uploadProgress.value < 90) {
      uploadProgress.value += 10
    }
  }, 200)
  
  emit('submit', formData)
  
  clearInterval(interval)
  uploadProgress.value = 100
  
  setTimeout(() => {
    uploadProgress.value = 0
    isSubmitting.value = false
  }, 500)
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
  from {
    opacity: 0;
    transform: translateY(-20px);
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

@keyframes spin {
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>