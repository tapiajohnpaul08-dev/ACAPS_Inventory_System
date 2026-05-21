<template>
  <Teleport to="body">
    <div 
      v-if="isOpen" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      @click.self="closeModal"
    >
      <!-- Backdrop -->
      <div 
        class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        @click="closeModal"
      ></div>
      
      <!-- Modal Panel -->
      <div 
        class="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-300"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <!-- Header -->
        <div class="flex items-start justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0 rounded-t-2xl"
          :class="type === 'products' ? 'bg-gradient-to-r from-green-50 to-white' : 'bg-gradient-to-r from-blue-50 to-white'">
          <div>
            <h2 id="modal-title" class="text-xl font-bold text-gray-900 leading-snug">
              {{ displayName }}
            </h2>
            <p class="text-sm text-gray-500 mt-0.5 capitalize">
              {{ type === 'products' ? (item?.subcategory || item?.category || 'Product') : getCategoryLabel(item?.category) + ' Supply' }}
            </p>
          </div>
          <button 
            @click="closeModal"
            class="ml-4 p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto px-6 py-5">
          <!-- Loading State -->
          <div v-if="!item" class="flex flex-col items-center justify-center py-12">
            <div class="inline-block w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p class="mt-4 text-gray-500">Loading item details...</p>
          </div>
          
          <div v-else class="space-y-5">
            
            <!-- PRODUCT VIEW -->
            <template v-if="type === 'products'">
              <!-- Product Info -->
              <div class="grid grid-cols-2 gap-4">
                <div class="bg-green-50 rounded-xl p-4">
                  <p class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Product Name</p>
                  <p class="text-sm font-bold text-gray-900">{{ item.name || 'N/A' }}</p>
                  <p class="text-xs text-gray-500 mt-0.5">ID: {{ item.id || 'N/A' }}</p>
                </div>
                <div class="bg-gray-50 rounded-xl p-4">
                  <p class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Category</p>
                  <p class="text-sm font-semibold text-gray-900 capitalize">{{ item.subcategory || item.category }}</p>
                </div>
              </div>

              <!-- Total Stock Information -->
              <div class="border border-gray-200 rounded-xl p-4">
                <p class="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Stock Information</p>
                <div class="grid grid-cols-2 gap-4">
                  <div class="p-3 rounded-lg" :class="getStockStatusClass(calculateTotalStock(item.sizes), item.threshold)">
                    <p class="text-xs text-gray-500 mb-1">Total Stock</p>
                    <p class="text-xl font-black">{{ formatNumber(calculateTotalStock(item.sizes)) }} <span class="text-sm font-normal">pcs</span></p>
                  </div>
                  <div class="bg-gray-50 rounded-lg p-3">
                    <p class="text-xs text-gray-500 mb-1">Minimum Order</p>
                    <p class="text-xl font-black text-gray-700">{{ formatNumber(item.minOrder) }} <span class="text-sm font-normal">pcs</span></p>
                  </div>
                </div>
                <div class="mt-3 flex items-center justify-between">
                  <span class="text-xs text-gray-500">Stock Status</span>
                  <span class="text-sm font-semibold" :class="getStockStatusColor(calculateTotalStock(item.sizes), item.threshold)">
                    {{ getStockStatus(calculateTotalStock(item.sizes), item.threshold) }}
                  </span>
                </div>
              </div>

              <!-- Product Details -->
              <div class="border border-gray-200 rounded-xl divide-y divide-gray-100">
                <div class="flex items-center justify-between px-4 py-3">
                  <span class="text-xs text-gray-500 font-medium">Base Price</span>
                  <span class="text-sm font-semibold text-green-600">₱{{ formatPrice(item.sizes?.[0]?.price || 0) }} / pc</span>
                </div>
                <div class="flex items-center justify-between px-4 py-3">
                  <span class="text-xs text-gray-500 font-medium">Availability</span>
                  <span class="text-sm font-semibold" :class="calculateTotalStock(item.sizes) > 0 ? 'text-green-600' : 'text-red-600'">
                    {{ calculateTotalStock(item.sizes) > 0 ? 'In Stock' : 'Out of Stock' }}
                  </span>
                </div>
                <div v-if="item.featured || item.popular" class="flex items-center justify-between px-4 py-3">
                  <span class="text-xs text-gray-500 font-medium">Tags</span>
                  <div class="flex gap-2">
                    <span v-if="item.featured" class="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full">Featured</span>
                    <span v-if="item.popular" class="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">Popular</span>
                  </div>
                </div>
              </div>

              <!-- Sizes Section with Stock -->
              <div v-if="item.sizes && item.sizes.length > 0" class="border border-gray-200 rounded-xl p-4">
                <p class="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Available Sizes, Stock & Pricing</p>
                <div class="space-y-3">
                  <div v-for="size in item.sizes" :key="size.name" class="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                    <div class="flex justify-between items-center mb-1">
                      <div>
                        <span class="font-semibold text-gray-900">{{ size.name }}</span>
                        <span class="text-xs text-gray-500 ml-2">Stock: {{ formatNumber(size.stock || 0) }}</span>
                      </div>
                      <span class="text-green-600 font-bold">₱{{ formatPrice(size.price) }}</span>
                    </div>
                    <div v-if="size.bulkPrices && Object.keys(size.bulkPrices).length > 0" class="grid grid-cols-2 gap-2 mt-2">
                      <div v-for="(price, qty) in size.bulkPrices" :key="qty" class="text-xs text-gray-500">
                        {{ formatNumber(qty) }}+ pcs: <span class="text-gray-700">₱{{ formatPrice(price) }}</span>
                      </div>
                    </div>
                    <!-- Stock status for each size -->
                    <div class="mt-2">
                      <span class="text-xs" :class="getStockStatusForSize(size.stock, item.threshold)">
                        {{ getStockStatus(size.stock || 0, item.threshold || 100) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Estimated Value -->
              <div class="border border-gray-200 rounded-xl p-4 bg-green-50">
                <div class="flex items-center justify-between">
                  <p class="text-xs font-bold text-gray-500 uppercase tracking-wide">Estimated Stock Value</p>
                  <p class="text-xl font-black text-green-700">
                    ₱{{ formatNumber(calculateTotalValue(item.sizes)) }}
                  </p>
                </div>
              </div>

              <div v-if="item.description" class="border border-gray-200 rounded-xl p-4">
                <p class="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Description</p>
                <p class="text-sm text-gray-700 leading-relaxed">{{ item.description }}</p>
              </div>
            </template>

            <!-- SUPPLY VIEW -->
            <template v-else>
              <!-- Item Info -->
              <div class="grid grid-cols-2 gap-4">
                <div class="bg-blue-50 rounded-xl p-4">
                  <p class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Item Name</p>
                  <p class="text-sm font-bold text-gray-900">{{ item.name || 'N/A' }}</p>
                  <p class="text-xs text-gray-500 mt-0.5">ID: {{ item.itemId || item.id || 'N/A' }}</p>
                </div>
                <div class="bg-gray-50 rounded-xl p-4">
                  <p class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Category</p>
                  <p class="text-sm font-semibold text-gray-900 capitalize">{{ getCategoryLabel(item.category) }}</p>
                </div>
              </div>

              <!-- Stock Status -->
              <div class="grid grid-cols-3 gap-3">
                <div 
                  class="rounded-xl p-4"
                  :class="getStockStatusClass(item.stock, item.threshold)"
                >
                  <p class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Current Stock</p>
                  <p class="text-xl font-black" :class="getStockStatusTextColor(item.stock, item.threshold)">
                    {{ formatNumber(item.stock) }}
                  </p>
                  <p class="text-xs text-gray-500 mt-0.5">{{ item.unit || 'units' }}</p>
                </div>
                <div class="bg-gray-50 rounded-xl p-4">
                  <p class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Reorder At</p>
                  <p class="text-xl font-black text-gray-700">{{ formatNumber(item.threshold) }}</p>
                  <p class="text-xs text-gray-500 mt-0.5">{{ item.unit || 'units' }}</p>
                </div>
                <div class="bg-gray-50 rounded-xl p-4">
                  <p class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Status</p>
                  <p class="text-xl font-black" :class="getStockStatusTextColor(item.stock, item.threshold)">
                    {{ getStockStatus(item.stock, item.threshold) }}
                  </p>
                </div>
              </div>

              <!-- Additional Info -->
              <div class="border border-gray-200 rounded-xl divide-y divide-gray-100">
                <div class="flex items-center justify-between px-4 py-3">
                  <span class="text-xs text-gray-500 font-medium">Supplier</span>
                  <span class="text-sm font-semibold text-gray-900">{{ item.supplier || 'No supplier' }}</span>
                </div>
                <div class="flex items-center justify-between px-4 py-3">
                  <span class="text-xs text-gray-500 font-medium">Unit of Measure</span>
                  <span class="text-sm font-semibold text-gray-900 capitalize">{{ item.unit || 'piece' }}</span>
                </div>
                <div class="flex items-center justify-between px-4 py-3">
                  <span class="text-xs text-gray-500 font-medium">Unit Cost</span>
                  <span class="text-sm font-semibold text-gray-900">₱{{ formatPrice(item.unitCost) }} / {{ item.unit || 'unit' }}</span>
                </div>
                <div class="flex items-center justify-between px-4 py-3">
                  <span class="text-xs text-gray-500 font-medium">Last Restocked</span>
                  <span class="text-sm font-semibold text-gray-900">{{ formatDate(item.lastRestocked) }}</span>
                </div>
                <div v-if="item.notes" class="flex items-start justify-between px-4 py-3">
                  <span class="text-xs text-gray-500 font-medium">Notes</span>
                  <span class="text-sm text-gray-700 max-w-[60%] text-right">{{ item.notes }}</span>
                </div>
              </div>

              <!-- Estimated Value -->
              <div class="border border-gray-200 rounded-xl p-4 bg-blue-50">
                <div class="flex items-center justify-between">
                  <p class="text-xs font-bold text-gray-500 uppercase tracking-wide">Estimated Total Value</p>
                  <p class="text-xl font-black text-blue-700">
                    ₱{{ formatNumber((item.stock || 0) * (item.unitCost || 0)) }}
                  </p>
                </div>
              </div>
            </template>

            <!-- Action Buttons -->
            <div class="flex gap-3 pt-2">
              <button 
                @click="handleEdit"
                class="flex-1 flex items-center justify-center gap-2 py-3 border-2 rounded-xl transition-all duration-200 text-sm font-semibold transform hover:scale-[1.02]"
                :class="type === 'products' ? 'border-green-600 text-green-600 hover:bg-green-50' : 'border-blue-600 text-blue-600 hover:bg-blue-50'"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"></path>
                </svg> 
                Edit {{ type === 'products' ? 'Product' : 'Item' }}
              </button>
              
              <!-- Notify button - only show for low stock supplies -->
              <button 
                v-if="type !== 'products' && isLowStock(item.stock, item.threshold)"
                @click="handleNotify"
                class="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl transition-all duration-200 text-sm font-semibold shadow-md hover:shadow-lg transform hover:scale-[1.02]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M10.268 21a2 2 0 0 0 3.464 0"></path>
                  <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"></path>
                </svg> 
                Notify Authority
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  isOpen: { type: Boolean, required: true, default: false },
  item: { type: Object, default: null },
  type: { type: String, default: 'products' }
})

const emit = defineEmits(['close', 'edit', 'notify'])

// Computed display name
const displayName = computed(() => {
  if (!props.item) return 'Item Details'
  return props.item.name || 'Inventory Item'
})

// Calculate total stock from sizes array
function calculateTotalStock(sizes) {
  if (!sizes || !Array.isArray(sizes)) return 0
  return sizes.reduce((total, size) => total + (size.stock || 0), 0)
}

// Calculate total value from sizes
function calculateTotalValue(sizes) {
  if (!sizes || !Array.isArray(sizes)) return 0
  return sizes.reduce((total, size) => total + ((size.stock || 0) * (size.price || 0)), 0)
}

// Stock status helpers
function getStockStatus(stock, threshold) {
  const stockNum = Number(stock) || 0
  const thresholdNum = Number(threshold) || 0
  if (stockNum <= 0) return 'Out of Stock'
  if (stockNum <= thresholdNum) return 'Low Stock'
  return 'In Stock'
}

function getStockStatusForSize(stock, threshold) {
  const stockNum = Number(stock) || 0
  const thresholdNum = Number(threshold) || 0
  if (stockNum <= 0) return 'text-red-600'
  if (stockNum <= thresholdNum) return 'text-yellow-600'
  return 'text-green-600'
}

function getStockStatusClass(stock, threshold) {
  const stockNum = Number(stock) || 0
  const thresholdNum = Number(threshold) || 0
  if (stockNum <= 0) return 'bg-red-50 border border-red-200'
  if (stockNum <= thresholdNum) return 'bg-yellow-50 border border-yellow-200'
  return 'bg-green-50 border border-green-200'
}

function getStockStatusColor(stock, threshold) {
  const stockNum = Number(stock) || 0
  const thresholdNum = Number(threshold) || 0
  if (stockNum <= 0) return 'text-red-600'
  if (stockNum <= thresholdNum) return 'text-yellow-600'
  return 'text-green-600'
}

function getStockStatusTextColor(stock, threshold) {
  const stockNum = Number(stock) || 0
  const thresholdNum = Number(threshold) || 0
  if (stockNum <= 0) return 'text-red-700'
  if (stockNum <= thresholdNum) return 'text-yellow-700'
  return 'text-green-700'
}

function isLowStock(stock, threshold) {
  const stockNum = Number(stock) || 0
  const thresholdNum = Number(threshold) || 0
  return stockNum > 0 && stockNum <= thresholdNum
}

// Safe price formatting
function formatPrice(value) {
  if (value === null || value === undefined) return '0.00'
  const num = typeof value === 'number' ? value : parseFloat(value)
  if (isNaN(num)) return '0.00'
  return num.toFixed(2)
}

// Safe number formatting
function formatNumber(value) {
  if (value === null || value === undefined) return '0'
  const num = typeof value === 'number' ? value : parseInt(value, 10)
  if (isNaN(num)) return '0'
  return num.toLocaleString()
}

// Get category label for supplies
function getCategoryLabel(category) {
  const labels = {
    inks: 'Ink',
    chemicals: 'Chemical',
    packaging: 'Packaging',
    raw_materials: 'Raw Material',
    maintenance: 'Maintenance',
    other: 'Other'
  }
  return labels[category] || category || 'Supply'
}

// Format date
function formatDate(dateString) {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return 'N/A'
  }
}

// Close modal with ESC key
function handleEscKey(event) {
  if (event.key === 'Escape' && props.isOpen) {
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

function handleEdit() {
  if (!props.item) return
  emit('edit', props.item)
  closeModal()
}

function handleNotify() {
  if (!props.item) return
  emit('notify', props.item)
  closeModal()
}
</script>

<style scoped>
/* Animation classes */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.animate-in {
  animation-duration: 0.3s;
  animation-fill-mode: both;
}

.fade-in {
  animation-name: fadeIn;
}

.zoom-in {
  animation-name: zoomIn;
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>