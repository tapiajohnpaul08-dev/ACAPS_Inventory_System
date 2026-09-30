<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="close">
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm"></div>
        
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 modal-slide-in">
          <div class="relative p-6">
            <!-- Header -->
            <div class="flex items-center justify-between mb-5">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl" :class="type === 'in' ? 'bg-green-100' : 'bg-red-100'">
                  <svg v-if="type === 'in'" class="w-5 h-5 text-green-600 m-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  <svg v-else class="w-5 h-5 text-red-600 m-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-bold text-gray-900">
                    {{ type === 'in' ? 'Stock In' : 'Stock Out' }}
                  </h3>
                  <p class="text-xs text-gray-500">{{ item?.name }}</p>
                </div>
              </div>
              <button @click="close" class="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Size Dropdown for Products -->
            <div v-if="itemType === 'product' && item?.sizes?.length > 0" class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Select Size <span class="text-red-500">*</span>
              </label>
              <select
                v-model="selectedSize"
                @change="updateCurrentStock"
                class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white"
              >
                <option value="">Select a size</option>
                <option 
                  v-for="size in item.sizes" 
                  :key="size.name" 
                  :value="size.name"
                >
                  {{ size.name }} - Stock: {{ formatNumber(size.stock || 0) }} pcs - ₱{{ formatPrice(size.price) }}
                </option>
              </select>
            </div>

            <!-- Current Stock Display -->
            <div class="mb-5 p-4 bg-gray-50 rounded-xl">
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-500">Current Stock</span>
                <span class="text-2xl font-bold text-gray-900">
                  {{ formatNumber(currentStock) }} 
                  <span class="text-sm font-normal text-gray-500">
                    {{ itemType === 'product' ? 'pcs' : (item?.unit || 'units') }}
                  </span>
                </span>
              </div>
            </div>

            <!-- Stock Movement Form -->
            <form @submit.prevent="submit">
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Quantity <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <input
                      v-model.number="quantity"
                      type="number"
                      required
                      min="1"
                      class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg font-semibold"
                      :class="{ 'border-green-500 focus:ring-green-500': type === 'in' && quantity > 0, 'border-red-500 focus:ring-red-500': type === 'out' && quantity > 0 }"
                      placeholder="Enter quantity"
                      autofocus
                    />
                    <span class="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                      {{ itemType === 'product' ? 'pcs' : (item?.unit || 'units') }}
                    </span>
                  </div>
                </div>

<div>
  <label class="block text-sm font-medium text-gray-700 mb-2">
    Reason / Notes <span class="text-red-500">*</span>
  </label>
  <textarea
    v-model="note"
    rows="2"
    required
    minlength="3"
    placeholder="e.g., Received from supplier PO-12345 / Damaged in storage / Pulled for production"
    class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
    :class="{ 'border-red-300 ring-1 ring-red-200': noteTouched && !isNoteValid }"
    @blur="noteTouched = true"
  ></textarea>
  <p v-if="noteTouched && !isNoteValid" class="text-xs text-red-500 mt-1">
    Please enter at least 3 characters explaining this adjustment.
  </p>
</div>

<div>
  <label class="block text-sm font-medium text-gray-700 mb-2">Attachment (optional)</label>

  <div v-if="imagePreview" class="relative mb-2 inline-block">
    <img :src="imagePreview" class="h-24 rounded-xl border border-gray-200 object-cover" />
    <button
      type="button"
      @click="clearImage"
      class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
    >
      <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>

  <label
    v-else
    class="flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-xl px-4 py-3 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all"
  >
    <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
    <span class="text-sm font-medium text-gray-600">
      {{ uploadingImage ? 'Uploading…' : 'Add a photo (receipt, damage, PO)' }}
    </span>
    <input type="file" accept="image/*" class="hidden" @change="handleImageUpload" :disabled="uploadingImage" />
  </label>
</div>

                <!-- Preview New Stock -->
                <div class="p-4 rounded-xl" :class="type === 'in' ? 'bg-green-50' : 'bg-red-50'">
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-600">After this transaction:</span>
                    <span class="font-bold text-lg" :class="getPreviewColorClass">
                      {{ formatNumber(currentStock + (type === 'in' ? quantity : -quantity)) }} 
                      {{ itemType === 'product' ? 'pcs' : (item?.unit || 'units') }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex gap-3 mt-6">
                <button
                  type="button"
                  @click="close"
                  class="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="!isValid"
                  class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  :class="type === 'in' ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800' : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800'"
                >
                  <svg v-if="isSubmitting" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span v-else>{{ type === 'in' ? 'Add Stock' : 'Remove Stock' }}</span>
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
import { ref, computed, watch } from 'vue'
import { inventoryApi } from '@/api/api'

const props = defineProps({
  show:     { type: Boolean, default: false },
  item:     { type: Object,  default: null },
  type:     { type: String,  default: 'in' },
  itemType: { type: String,  default: 'supply' },
})

const emit = defineEmits(['close', 'submit'])

const quantity = ref(1)
const note = ref('')
const noteTouched = ref(false)
const imageUrl = ref('')
const imagePublicId = ref('')
const imagePreview = ref('')
const uploadingImage = ref(false)
const isSubmitting = ref(false)
const selectedSize = ref('')
const selectedSizeStock = ref(0)

watch(() => props.item, () => {
  selectedSize.value = ''
  selectedSizeStock.value = 0
  quantity.value = 1
  note.value = ''
  noteTouched.value = false
  clearImage()
}, { immediate: true, deep: true })

watch(() => props.show, (v) => {
  if (v) {
    selectedSize.value = ''
    selectedSizeStock.value = 0
    quantity.value = 1
    note.value = ''
    noteTouched.value = false
    isSubmitting.value = false
    clearImage()
  }
})

function updateCurrentStock() {
  if (props.itemType === 'product' && selectedSize.value && props.item?.sizes) {
    const size = props.item.sizes.find(s => s.name === selectedSize.value)
    selectedSizeStock.value = size?.stock || 0
  }
}

const currentStock = computed(() => {
  if (props.itemType === 'product') {
    if (selectedSize.value && props.item?.sizes) {
      return props.item.sizes.find(s => s.name === selectedSize.value)?.stock || 0
    }
    return 0
  }
  return props.item?.stock || 0
})

const isNoteValid = computed(() => note.value.trim().length >= 3)

const isValid = computed(() => {
  if (!quantity.value || quantity.value <= 0) return false
  if (props.itemType === 'product' && !selectedSize.value) return false
  if (props.type === 'out' && currentStock.value < quantity.value) return false
  if (!isNoteValid.value) return false
  return true
})

const getPreviewColorClass = computed(() => {
  const newStock = currentStock.value + (props.type === 'in' ? quantity.value : -quantity.value)
  if (newStock <= 0) return 'text-red-600'
  const threshold = props.itemType === 'product' ? 100 : (props.item?.threshold || 100)
  if (newStock <= threshold) return 'text-yellow-600'
  return 'text-green-600'
})

function formatNumber(v) { return v?.toLocaleString() || '0' }
function formatPrice(v) {
  if (v == null) return '0.00'
  const n = typeof v === 'number' ? v : parseFloat(v)
  return isNaN(n) ? '0.00' : n.toFixed(2)
}

async function handleImageUpload(e) {
  const file = e.target.files?.[0]
  if (!file) return
  uploadingImage.value = true
  try {
    const res = await inventoryApi.uploadMovementImage(file)
    if (res.success) {
      imageUrl.value = res.url
      imagePublicId.value = res.public_id
      imagePreview.value = res.url
    } else {
      alert(res.message || 'Image upload failed')
    }
  } catch (err) {
    console.error('Upload error:', err)
    alert('Image upload failed')
  } finally {
    uploadingImage.value = false
    e.target.value = ''
  }
}

function clearImage() {
  imageUrl.value = ''
  imagePublicId.value = ''
  imagePreview.value = ''
}

function close() {
  quantity.value = 1
  note.value = ''
  noteTouched.value = false
  selectedSize.value = ''
  selectedSizeStock.value = 0
  isSubmitting.value = false
  clearImage()
  emit('close')
}

function submit() {
  noteTouched.value = true
  if (!isValid.value) return
  isSubmitting.value = true

  let newStockValue
  if (props.type === 'in') newStockValue = currentStock.value + quantity.value
  else newStockValue = Math.max(0, currentStock.value - quantity.value)

  emit('submit', {
    item: props.item,
    itemType: props.itemType,
    sizeName: props.itemType === 'product' ? selectedSize.value : null,
    quantity: quantity.value,
    type: props.type,
    note: note.value.trim(),
    imageUrl: imageUrl.value,
    imagePublicId: imagePublicId.value,
    currentStock: currentStock.value,
    newStock: newStockValue,
  })
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

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>