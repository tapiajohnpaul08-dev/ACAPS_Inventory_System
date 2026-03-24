<template>
  <Teleport to="body">
    <div 
      v-if="isOpen" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      @click.self="closeModal"
    >
      <!-- Backdrop -->
      <div 
        class="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        @click="closeModal"
      ></div>
      
      <!-- Modal Panel -->
      <div 
        class="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <!-- Header -->
        <div class="flex items-start justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 id="modal-title" class="text-lg font-semibold text-gray-900 leading-snug">
              {{ item?.name || 'Item Details' }} — {{ item?.size || '' }}
            </h2>
            <p class="text-sm text-gray-500 mt-0.5">Inventory Item Details</p>
          </div>
          <button 
            @click="closeModal"
            class="ml-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors flex-shrink-0"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto px-6 py-5">
          <div v-if="item" class="space-y-5">
            <!-- Product Info -->
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-blue-50 rounded-xl p-4">
                <p class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Product</p>
                <p class="text-sm font-bold text-gray-900">{{ item.name }}</p>
                <p class="text-xs text-gray-500 mt-0.5">{{ item.size }}</p>
              </div>
              <div class="bg-gray-50 rounded-xl p-4">
                <p class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">SKU / ID</p>
                <p class="text-sm font-mono font-semibold text-gray-900">{{ getSku(item) }}</p>
              </div>
            </div>

            <!-- Stock Status -->
            <div class="grid grid-cols-3 gap-3">
              <div 
                class="rounded-xl p-4"
                :class="isLowStock(item) ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'"
              >
                <p class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Stock</p>
                <p class="text-xl font-black" :class="isLowStock(item) ? 'text-red-700' : 'text-green-700'">
                  {{ item.stock.toLocaleString() }}
                </p>
                <p class="text-xs text-gray-500 mt-0.5">units</p>
              </div>
              <div class="bg-gray-50 rounded-xl p-4">
                <p class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Reorder At</p>
                <p class="text-xl font-black text-gray-700">500</p>
                <p class="text-xs text-gray-500 mt-0.5">units</p>
              </div>
              <div class="bg-gray-50 rounded-xl p-4">
                <p class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Orders</p>
                <p class="text-xl font-black text-blue-700">{{ item.orders }}</p>
                <p class="text-xs text-gray-500 mt-0.5">total</p>
              </div>
            </div>

            <!-- Additional Info -->
            <div class="border border-gray-200 rounded-xl divide-y divide-gray-100">
              <div class="flex items-center justify-between px-4 py-3">
                <span class="text-xs text-gray-500 font-medium">Supplier</span>
                <span class="text-sm font-semibold text-gray-900">{{ item.supplier }}</span>
              </div>
              <div class="flex items-center justify-between px-4 py-3">
                <span class="text-xs text-gray-500 font-medium">Last Restocked</span>
                <span class="text-sm font-semibold text-gray-900">{{ getLastRestocked() }}</span>
              </div>
              <div class="flex items-center justify-between px-4 py-3">
                <span class="text-xs text-gray-500 font-medium">Total Revenue</span>
                <span class="text-sm font-semibold text-gray-900">{{ item.revenue }}</span>
              </div>
            </div>

            <!-- Pricing Table -->
            <div class="border border-gray-200 rounded-xl overflow-hidden">
              <div class="bg-gray-50 px-4 py-2.5 border-b border-gray-200">
                <p class="text-xs font-bold text-gray-500 uppercase tracking-wide">Pricing by Quantity</p>
              </div>
              <div class="grid grid-cols-5 divide-x divide-gray-100">
                <div class="px-3 py-3 text-center">
                  <p class="text-xs text-gray-400">1 pc</p>
                  <p class="text-sm font-bold text-gray-900 mt-0.5">{{ getPricePerUnit() }}</p>
                </div>
                <div class="px-3 py-3 text-center">
                  <p class="text-xs text-gray-400">500</p>
                  <p class="text-sm font-bold text-gray-900 mt-0.5">{{ getBulkPrice(500) }}</p>
                </div>
                <div class="px-3 py-3 text-center">
                  <p class="text-xs text-gray-400">1000</p>
                  <p class="text-sm font-bold text-gray-900 mt-0.5">{{ getBulkPrice(1000) }}</p>
                </div>
                <div class="px-3 py-3 text-center">
                  <p class="text-xs text-gray-400">2000</p>
                  <p class="text-sm font-bold text-gray-900 mt-0.5">{{ getBulkPrice(2000) }}</p>
                </div>
                <div class="px-3 py-3 text-center">
                  <p class="text-xs text-gray-400">5000</p>
                  <p class="text-sm font-bold text-gray-900 mt-0.5">{{ getBulkPrice(5000) }}</p>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-3 pt-1">
              <button 
                @click="handleEdit"
                class="flex-1 flex items-center justify-center gap-2 py-2.5 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors text-sm font-semibold"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
                  <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"></path>
                </svg> 
                Edit Item
              </button>
              
              <!-- Notify button - only show if stock is less than 500 -->
              <button 
                v-if="isLowStock(item)"
                @click="handleNotify"
                class="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors text-sm font-semibold shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
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
import { onMounted, onUnmounted } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
    default: false
  },
  item: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'edit', 'notify'])

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
  emit('edit', props.item)
  closeModal()
}

function handleNotify() {
  emit('notify', props.item)
  closeModal()
}

function isLowStock(item) {
  return item && item.stock < 500
}

function getSku(item) {
  if (!item) return ''
  return `${item.name.toLowerCase().replace(/\s+/g, '-')}-${item.size.toLowerCase()}`
}

function getLastRestocked() {
  const date = new Date()
  date.setDate(date.getDate() - Math.floor(Math.random() * 30))
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function getPricePerUnit() {
  if (!props.item) return '₱0'
  const revenue = parseFloat(props.item.revenue.replace(/[₱,]/g, ''))
  if (isNaN(revenue) || props.item.orders === 0) return '₱0'
  const price = revenue / props.item.orders
  return `₱${price.toFixed(2)}`
}

function getBulkPrice(quantity) {
  if (!props.item) return '₱0'
  const pricePerUnit = parseFloat(getPricePerUnit().replace('₱', ''))
  if (isNaN(pricePerUnit)) return '₱0'
  
  let discount = 0
  if (quantity >= 5000) discount = 0.15
  else if (quantity >= 2000) discount = 0.1
  else if (quantity >= 1000) discount = 0.05
  else if (quantity >= 500) discount = 0.02
  
  const total = pricePerUnit * quantity * (1 - discount)
  return `₱${Math.round(total).toLocaleString()}`
}
</script>

<style scoped>
/* Animation classes */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
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

.animate-in {
  animation-duration: 0.2s;
  animation-fill-mode: both;
}

.fade-in {
  animation-name: fadeIn;
}

.zoom-in {
  animation-name: zoomIn;
}
</style>