<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="close"
      >
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300" @click="close" />
        
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[85vh] overflow-y-auto transform transition-all duration-300 modal-slide-in">
          
          <div v-if="isSubmitting" class="absolute inset-0 bg-white/90 rounded-2xl flex items-center justify-center z-10">
            <div class="text-center">
              <div class="inline-block w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <p class="mt-2 text-sm text-gray-600">Creating product...</p>
            </div>
          </div>

          <div class="sticky top-0 bg-gradient-to-r from-blue-50 to-white border-b border-gray-100 px-6 py-3 flex justify-between items-center z-5 rounded-t-2xl">
            <div>
              <h2 class="text-lg font-bold text-gray-900">Add New Product</h2>
              <p class="text-xs text-gray-500">Create a new product with sizes and pricing</p>
            </div>
            <button @click="close" class="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <form @submit.prevent="submit" class="p-5 space-y-3" enctype="multipart/form-data">
            
            <!-- Two Column Layout -->
            <div class="grid grid-cols-2 gap-4">
              <!-- Left Column -->
              <div class="space-y-3">
                <!-- Basic Information -->
                <div class="bg-white border border-gray-200 rounded-xl p-3.5 hover:shadow-md transition-shadow duration-200">
                  <div class="flex items-center gap-2 mb-2.5">
                    <div class="w-1 h-4 bg-blue-600 rounded-full"></div>
                    <p class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Basic Information</p>
                  </div>
                  
                  <div class="space-y-2.5">
                    <div>
                      <label class="block text-xs font-medium text-gray-700 mb-1">
                        Product Name <span class="text-red-500">*</span>
                      </label>
                      <input
                        v-model="form.name"
                        type="text"
                        required
                        class="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="e.g., PP U-CUPS"
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
                        <option value="Plastic Cups">Plastic Cups</option>
                        <option value="Paper Cups">Paper Cups</option>
                        <option value="Containers">Containers</option>
                        <option value="Bags">Bags</option>
                        <option value="Utensils">Utensils</option>
                        <option value="Straws">Straws</option>
                      </select>
                    </div>
                  </div>
                </div>

                <!-- Product Settings -->
                <div class="bg-white border border-gray-200 rounded-xl p-3.5 hover:shadow-md transition-shadow duration-200">
                  <div class="flex items-center gap-2 mb-2.5">
                    <div class="w-1 h-4 bg-green-600 rounded-full"></div>
                    <p class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Product Settings</p>
                  </div>
                  
                  <div class="grid grid-cols-2 gap-2.5">
                    <div>
                      <label class="block text-xs font-medium text-gray-700 mb-1">Min Order</label>
                      <input
                        v-model.number="form.minOrder"
                        type="number"
                        min="0"
                        step="100"
                        class="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                        placeholder="500"
                      />
                    </div>
                    <div class="flex items-end gap-3">
                      <label class="flex items-center gap-1.5 cursor-pointer group">
                        <div class="relative">
                          <input type="checkbox" v-model="form.featured" class="sr-only peer" />
                          <div class="w-3.5 h-3.5 border-2 border-gray-300 rounded peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all duration-200"></div>
                          <svg v-if="form.featured" class="absolute top-0.5 left-0.5 w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span class="text-xs text-gray-700">Featured</span>
                      </label>
                      
                      <label class="flex items-center gap-1.5 cursor-pointer group">
                        <div class="relative">
                          <input type="checkbox" v-model="form.popular" class="sr-only peer" />
                          <div class="w-3.5 h-3.5 border-2 border-gray-300 rounded peer-checked:bg-purple-600 peer-checked:border-purple-600 transition-all duration-200"></div>
                          <svg v-if="form.popular" class="absolute top-0.5 left-0.5 w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span class="text-xs text-gray-700">Popular</span>
                      </label>
                    </div>
                  </div>
                </div>

                <!-- Description -->
                <div class="bg-white border border-gray-200 rounded-xl p-3.5 hover:shadow-md transition-shadow duration-200">
                  <div class="flex items-center gap-2 mb-2">
                    <div class="w-1 h-4 bg-purple-600 rounded-full"></div>
                    <p class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Description</p>
                  </div>
                  <textarea
                    v-model="form.description"
                    rows="2"
                    class="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-none"
                    placeholder="Product description..."
                  ></textarea>
                </div>
              </div>

              <!-- Right Column -->
              <div class="space-y-3">
                <!-- Image Upload -->
                <div class="bg-white border border-gray-200 rounded-xl p-3.5 hover:shadow-md transition-shadow duration-200">
                  <div class="flex items-center gap-2 mb-2.5">
                    <div class="w-1 h-4 bg-purple-600 rounded-full"></div>
                    <p class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Product Image</p>
                    <span v-if="uploadProgress > 0 && uploadProgress < 100" class="ml-auto text-[10px] text-blue-600">
                      {{ uploadProgress }}%
                    </span>
                  </div>
                  
                  <div class="flex items-start gap-3">
                    <div v-if="imagePreview" class="relative flex-shrink-0">
                      <img 
                        :src="optimizedPreview" 
                        alt="Preview" 
                        class="h-20 w-20 object-cover rounded-lg border-2 border-gray-200"
                        @error="handleImageError"
                      />
                      <button
                        type="button"
                        @click="removeImage"
                        class="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    <div 
                      class="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-blue-500 transition-colors cursor-pointer"
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
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mx-auto text-gray-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p class="text-xs text-gray-600">Click or drag to upload</p>
                      <p class="text-[10px] text-gray-400">PNG, JPG up to 5MB</p>
                    </div>
                  </div>
                  
                  <div v-if="uploadProgress > 0 && uploadProgress < 100" class="mt-2 w-full bg-gray-200 rounded-full h-1 overflow-hidden">
                    <div class="bg-gradient-to-r from-blue-500 to-blue-600 h-1 rounded-full transition-all duration-300" :style="{ width: uploadProgress + '%' }"></div>
                  </div>
                  <p v-if="uploadError" class="text-[10px] text-red-500 mt-1">{{ uploadError }}</p>
                </div>

                <!-- Sizes Section -->
                <div class="bg-white border border-gray-200 rounded-xl p-3.5 hover:shadow-md transition-shadow duration-200">
                  <div class="flex justify-between items-center mb-2.5">
                    <div class="flex items-center gap-2">
                      <div class="w-1 h-4 bg-orange-600 rounded-full"></div>
                      <p class="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Sizes</p>
                    </div>
                    <button
                      type="button"
                      @click="addSize"
                      class="flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                      </svg>
                      Add Size
                    </button>
                  </div>
                  
                  <div class="space-y-2 max-h-48 overflow-y-auto pr-1">
                    <div v-for="(size, index) in form.sizes" :key="index" class="bg-gray-50 rounded-lg p-2.5 border border-gray-200 hover:border-blue-300 transition-all duration-200">
                      <div class="flex justify-between items-center mb-1.5">
                        <span class="text-xs font-semibold text-gray-700">Size {{ index + 1 }}</span>
                        <button
                          type="button"
                          @click="removeSize(index)"
                          class="text-red-500 hover:text-red-700 text-[10px] flex items-center gap-1 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Remove
                        </button>
                      </div>
                      
                      <div class="grid grid-cols-3 gap-1.5">
                        <div>
                          <label class="block text-[9px] font-medium text-gray-700 mb-0.5">Name *</label>
                          <input
                            v-model="size.name"
                            type="text"
                            required
                            class="w-full px-2 py-1 text-[10px] border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            placeholder="e.g., 12oz"
                          />
                        </div>
                        <div>
                          <label class="block text-[9px] font-medium text-gray-700 mb-0.5">Price *</label>
                          <input
                            v-model.number="size.price"
                            type="number"
                            min="0"
                            step="0.01"
                            required
                            class="w-full px-2 py-1 text-[10px] border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            placeholder="1.80"
                            @input="updateBulkPrices(size)"
                          />
                        </div>
                        <div>
                          <label class="block text-[9px] font-medium text-gray-700 mb-0.5">Stock</label>
                          <input
                            v-model.number="size.stock"
                            type="number"
                            min="0"
                            class="w-full px-2 py-1 text-[10px] border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            placeholder="0"
                          />
                        </div>
                      </div>
                      
                      <div class="mt-1.5">
                        <button
                          type="button"
                          @click="size.showBulk = !size.showBulk"
                          class="text-[9px] text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-2 w-2" :class="{ 'rotate-180': size.showBulk }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                          </svg>
                          {{ size.showBulk ? 'Hide' : 'Show' }} Bulk
                        </button>
                        
                        <div v-if="size.showBulk" class="grid grid-cols-4 gap-1 mt-1 animate-slide-down">
                          <div>
                            <label class="block text-[8px] text-gray-500">500 pcs</label>
                            <input
                              :value="formatCurrency(size.bulkPrices[500])"
                              type="text"
                              class="w-full px-1.5 py-0.5 border border-gray-300 rounded text-[9px] bg-gray-50 text-gray-700 cursor-not-allowed"
                              readonly
                              disabled
                            />
                          </div>
                          <div>
                            <label class="block text-[8px] text-gray-500">1000 pcs</label>
                            <input
                              :value="formatCurrency(size.bulkPrices[1000])"
                              type="text"
                              class="w-full px-1.5 py-0.5 border border-gray-300 rounded text-[9px] bg-gray-50 text-gray-700 cursor-not-allowed"
                              readonly
                              disabled
                            />
                          </div>
                          <div>
                            <label class="block text-[8px] text-gray-500">2000 pcs</label>
                            <input
                              :value="formatCurrency(size.bulkPrices[2000])"
                              type="text"
                              class="w-full px-1.5 py-0.5 border border-gray-300 rounded text-[9px] bg-gray-50 text-gray-700 cursor-not-allowed"
                              readonly
                              disabled
                            />
                          </div>
                          <div>
                            <label class="block text-[8px] text-gray-500">5000 pcs</label>
                            <input
                              :value="formatCurrency(size.bulkPrices[5000])"
                              type="text"
                              class="w-full px-1.5 py-0.5 border border-gray-300 rounded text-[9px] bg-gray-50 text-gray-700 cursor-not-allowed"
                              readonly
                              disabled
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div v-if="form.sizes.length === 0" class="text-center py-3 border-2 border-dashed border-gray-200 rounded-lg">
                    <p class="text-gray-400 text-xs">No sizes added yet.</p>
                    <button
                      type="button"
                      @click="addSize"
                      class="mt-1 text-[10px] text-blue-600 hover:text-blue-700 font-medium"
                    >
                      + Add your first size
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="p-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 flex items-start gap-1.5">
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
                :disabled="isSubmitting || !imageFile"
                class="flex-1 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex items-center justify-center gap-2"
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
import { ref, watch, computed } from 'vue'
import { getOptimizedImage, isCloudinaryUrl } from '@/utils/imageUtils'
import { adminProductApi } from '@/api/api'

const props = defineProps({
  show: { type: Boolean, default: false }
})

// Parent-driven completion
defineExpose({
  handleSuccess: () => {
    isSubmitting.value = false
    uploadProgress.value = 0
    close()
  },
  handleError: (msg) => {
    isSubmitting.value = false
    errorMessage.value = msg
  },
})

const emit = defineEmits(['close', 'submit', 'success'])

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

const optimizedPreview = computed(() => {
  if (!imagePreview.value) return null
  if (isCloudinaryUrl(imagePreview.value)) {
    return getOptimizedImage(imagePreview.value, { width: 200, height: 200, crop: 'fill' })
  }
  return imagePreview.value
})

function formatCurrency(value) {
  if (!value && value !== 0) return '₱0.00'
  return `₱${Number(value).toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`
}

function calculateBulkPrices(unitPrice) {
  if (!unitPrice || unitPrice <= 0) {
    return { 500: null, 1000: null, 2000: null, 5000: null }
  }
  return {
    500: unitPrice * 500,
    1000: unitPrice * 1000,
    2000: unitPrice * 2000,
    5000: unitPrice * 5000
  }
}

function updateBulkPrices(size) {
  if (size.price && size.price > 0) {
    const calculatedPrices = calculateBulkPrices(size.price)
    size.bulkPrices[500] = calculatedPrices[500]
    size.bulkPrices[1000] = calculatedPrices[1000]
    size.bulkPrices[2000] = calculatedPrices[2000]
    size.bulkPrices[5000] = calculatedPrices[5000]
  }
}

function addSize() {
  const newSize = {
    name: '',
    price: 0,
    stock: 0,
    bulkPrices: { 500: null, 1000: null, 2000: null, 5000: null },
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
    isSubmitting.value = false
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
  if (imageFile.value) {
    uploadError.value = 'Only 1 image is allowed. Remove current image first.'
    return
  }
  
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    uploadError.value = 'Only JPG, JPEG, PNG, GIF, and WEBP files are allowed'
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

function handleImageError() {
  console.warn('Image failed to load, using fallback')
}

function removeImage() {
  imageFile.value = null
  imagePreview.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
  uploadError.value = ''
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
  formData.append('subcategory', form.value.subcategory || '')
  formData.append('minOrder', form.value.minOrder)
  formData.append('featured', form.value.featured)
  formData.append('popular', form.value.popular)
  formData.append('description', form.value.description || '')
  formData.append('sizes', JSON.stringify(form.value.sizes.map(size => ({
    name: size.name,
    price: size.price,
    stock: size.stock || 0,
    bulkPrices: size.bulkPrices
  }))))

  try {
    // ✅ Emit the submit event and wait for the parent to handle it
    // The parent's handleAddProduct will call the API and update the UI
    await emit('submit', formData)
    
    // ✅ Only close after parent successfully processes the submission
    // The parent will emit 'success' or handle errors
    uploadProgress.value = 100
    
    // Small delay to show completion
    await new Promise(resolve => setTimeout(resolve, 500))
    
  } catch (error) {
    console.error('Error submitting form:', error)
    errorMessage.value = error.message || 'Failed to create product. Please try again.'
  }
}

// ✅ Add a method to close from parent when success is emitted
function handleSuccess() {
  // The parent will call this when the product is successfully created
  isSubmitting.value = false
  uploadProgress.value = 0
  close()
}

function close() {
  if (!isSubmitting.value) {
    emit('close')
  }
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

.animate-slide-down {
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes spin { to { transform: rotate(360deg); } }
.animate-spin { animation: spin 1s linear infinite; }
</style>