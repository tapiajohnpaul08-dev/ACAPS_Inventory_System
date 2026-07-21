<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="inline-block w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
      <span class="ml-3 text-gray-500">Loading...</span>
    </div>
    
    <div v-else-if="paginatedItems.length === 0" class="text-center py-12">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="mx-auto text-gray-300 mb-3">
        <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/>
        <path d="M12 22V12"/>
        <polyline points="3.29 7 12 12 20.71 7"/>
      </svg>
      <p class="text-gray-400">No {{ type === 'products' ? 'products' : 'supplies' }} found.</p>
      <p class="text-xs text-gray-400 mt-1">Click "Add New" to get started.</p>
    </div>
    
    <div v-else>
      <div class="overflow-x-auto">
        <table class="w-full min-w-[800px]">
          <thead class="bg-gray-50 border-b border-gray-100">
            <tr>
              <th v-for="col in columns" :key="col" class="px-5 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                {{ col }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr
              v-for="item in paginatedItems"
              :key="item.id || item.itemId"
              :data-item-id="item.id || item.itemId"
              class="group transition-all duration-200 hover:shadow-md"
              :class="[
                getItemRowClass(item),
                isHighlighted(item) ? 'animate-pulse bg-yellow-50 border-l-4 border-yellow-400' : '',
                props.highlightId === (item.id || item.itemId) ? 'ring-2 ring-blue-500 bg-blue-50' : ''
              ]"
            >
              <!-- Product/Item Name Column -->
              <td class="px-5 py-4 cursor-pointer" @click="handleSelect(item)">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105" 
                    :class="type === 'products' ? 'bg-green-100' : 'bg-blue-100'">
                    <svg v-if="type === 'products'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-green-600" style="width:18px;height:18px">
                      <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/>
                      <path d="M12 22V12"/>
                      <polyline points="3.29 7 12 12 20.71 7"/>
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-blue-600" style="width:18px;height:18px">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-gray-900">{{ item.name }}</p>
                    <p class="text-xs text-gray-400">
                      {{ type === 'products' ? (item.subcategory || item.category) : (item.supplier || 'No supplier') }}
                    </p>
                  </div>
                </div>
              </td>
              
              <!-- Category/Unit Column -->
              <td class="px-5 py-4 cursor-pointer" @click="handleSelect(item)">
                <span class="px-2.5 py-1 rounded-full text-xs font-semibold" 
                  :class="type === 'products' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'">
                  {{ type === 'products' ? (item.category || 'Product') : (item.unit || 'piece') }}
                </span>
              </td>
              
              <!-- Stock Column - Shows sizes and their statuses for products -->
              <td class="px-5 py-4 flex justify-center cursor-pointer" @click="handleSelect(item)">
                <div v-if="type === 'products' && item.sizes && item.sizes.length > 0" class="space-y-1.5">
                  <div v-for="size in item.sizes" :key="size.name" class="flex items-center gap-2">
                    <!-- Size name -->
                    <span class="text-xs font-medium text-gray-600 w-12 flex-shrink-0">{{ size.name }}</span>
                    <!-- Stock count -->
                    <span class="text-xs font-bold" :class="getStockTextColorForSize(size.stock, item.threshold || 500)">
                      {{ size.stock || 0 }}
                    </span>
                    <!-- Status dot -->
                    <div class="flex-1 flex items-center gap-1">
                      <div class="w-2 h-2 rounded-full flex-shrink-0" :class="getSizeStatusDotColor(size.stock, item.threshold || 500)"></div>
                      <span class="text-[10px] font-medium" :class="getSizeStatusTextColor(size.stock, item.threshold || 500)">
                        {{ getSizeStatusText(size.stock, item.threshold || 500) }}
                      </span>
                    </div>
                  </div>
                </div>
                <div v-else-if="type === 'products'">
                  <p class="text-sm text-gray-400">No sizes available</p>
                </div>
                <div v-else>
                  <div class="flex flex-col">
                    <p class="text-sm font-bold" :class="getStockTextColor(item)">
                      {{ (item.stock?.toLocaleString() || 0) }} {{ item.unit || 'pcs' }}
                    </p>
                  </div>
                </div>
              </td>
              
              <!-- Status Column - Removed for products (shown in stock column), kept for supplies -->
              <td class="px-5 py-4 cursor-pointer" @click="handleSelect(item)">
                <div v-if="type === 'supplies'" class="flex items-center gap-1.5 justify-center">
                  <div class="w-2 h-2 rounded-full" :class="getStatusDotColor(item.status)"></div>
                  <span class="text-xs font-semibold" :class="getStatusColor(item.status)">
                    {{ item.status }}
                  </span>
                </div>
                <div v-else class="text-center text-xs text-gray-400">
                  <!-- Empty for products since status is shown in stock column -->
                  <span class="text-gray-300">—</span>
                </div>
              </td>
              
              <!-- Price/Unit Cost Column -->
              <td class="px-5 py-4 cursor-pointer" @click="handleSelect(item)">
                <p class="text-sm font-semibold" :class="type === 'products' ? 'text-green-600' : 'text-gray-700'">
                  {{ type === 'products' ? `₱${formatPrice(item.unitCost)}` : `₱${formatPrice(item.unitCost)}` }}
                </p>
                <p class="text-xs text-gray-400">{{ type === 'products' ? 'starting from' : `per ${item.unit || 'unit'}` }}</p>
              </td>
              
              <!-- Actions Column -->
              <td class="px-5 py-4">
                <div class="flex items-center gap-1 justify-center">
                  <button 
                    class="p-1.5 text-green-600 hover:bg-green-100 rounded-lg transition-all duration-200"
                    title="Add Stock"
                    @click.stop="handleStockIn(item)"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                  
                  <button 
                    class="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Remove Stock"
                    :disabled="(type === 'supplies' && item.stock === 0) || (type === 'products' && getTotalProductStock(item) === 0)"
                    @click.stop="handleStockOut(item)"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M20 12H4" />
                    </svg>
                  </button>
                  
                  <button 
                    class="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-200"
                    title="Edit"
                    @click.stop="handleEdit(item)">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>
                    </svg>
                  </button>
                  
                  <button 
                    class="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200"
                    title="Delete"
                    @click.stop="handleDelete(item)">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div class="px-5 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between flex-wrap gap-4">
        <div class="text-sm text-gray-500">
          Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ items.length }} items
        </div>
        <div class="flex gap-2">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="px-3 py-1.5 text-sm font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            :class="currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
          >
            Previous
          </button>
          <div class="flex gap-1">
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="goToPage(page)"
              class="px-3 py-1.5 text-sm font-medium rounded-lg transition-all"
              :class="currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
            >
              {{ page }}
            </button>
          </div>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="px-3 py-1.5 text-sm font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            :class="currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  items: { type: Array, required: true },
  loading: { type: Boolean, default: false },
  type: { type: String, default: 'products' },
  highlightId: { type: String, default: null }
})

const emit = defineEmits(['edit', 'select', 'delete', 'stockIn', 'stockOut'])

const route = useRoute()
const highlightedItemId = ref(null)
const currentPage = ref(1)
const itemsPerPage = 10

// Stock threshold for products (Low Stock <= threshold)
const PRODUCT_THRESHOLD = 500

const columns = computed(() => {
  if (props.type === 'products') {
    return ['Product', 'Category', 'Stock (Size / Qty / Status)', 'Status', 'Base Price', 'Actions']
  }
  return ['Item', 'Unit', 'Stock', 'Status', 'Unit Cost', 'Actions']
})

// Pagination computed properties
const totalPages = computed(() => Math.ceil(props.items.length / itemsPerPage))

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, props.items.length))

const paginatedItems = computed(() => {
  return props.items.slice(startIndex.value, endIndex.value)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

function goToPage(page) {
  currentPage.value = page
}

// Reset to first page when items change
watch(() => props.items.length, () => {
  currentPage.value = 1
})

// Product stock helper functions
function getTotalProductStock(product) {
  if (!product.sizes || product.sizes.length === 0) return 0
  return product.sizes.reduce((total, size) => total + (size.stock || 0), 0)
}

// ========== SIZE STATUS HELPER FUNCTIONS ==========

// Get status text for a size
function getSizeStatusText(stock, threshold) {
  const stockNum = Number(stock) || 0
  const thresholdNum = Number(threshold) || 0
  if (stockNum <= 0) return 'Out of Stock'
  if (stockNum <= thresholdNum) return 'Low Stock'
  return 'In Stock'
}

// Get status dot color for a size
function getSizeStatusDotColor(stock, threshold) {
  const stockNum = Number(stock) || 0
  const thresholdNum = Number(threshold) || 0
  if (stockNum <= 0) return 'bg-red-500'
  if (stockNum <= thresholdNum) return 'bg-yellow-500'
  return 'bg-green-500'
}

// Get status text color for a size
function getSizeStatusTextColor(stock, threshold) {
  const stockNum = Number(stock) || 0
  const thresholdNum = Number(threshold) || 0
  if (stockNum <= 0) return 'text-red-600'
  if (stockNum <= thresholdNum) return 'text-yellow-600'
  return 'text-green-600'
}

// Get stock text color for size
function getStockTextColorForSize(stock, threshold) {
  const stockNum = Number(stock) || 0
  const thresholdNum = Number(threshold) || 0
  if (stockNum <= 0) return 'text-red-600'
  if (stockNum <= thresholdNum) return 'text-yellow-600'
  return 'text-green-600'
}

// Get product status text based on threshold
function getProductStatusText(product) {
  const totalStock = getTotalProductStock(product)
  
  if (totalStock === 0) {
    return 'Out of Stock'
  } else if (totalStock <= PRODUCT_THRESHOLD) {
    return 'Low Stock'
  } else {
    return 'In Stock'
  }
}

// Get product status color based on threshold
function getProductStatusColor(product) {
  const totalStock = getTotalProductStock(product)
  
  if (totalStock === 0) {
    return 'text-red-600'
  } else if (totalStock <= PRODUCT_THRESHOLD) {
    return 'text-yellow-600'
  } else {
    return 'text-green-600'
  }
}

// Get product status dot color
function getProductStatusDotColor(product) {
  const totalStock = getTotalProductStock(product)
  
  if (totalStock === 0) {
    return 'bg-red-500'
  } else if (totalStock <= PRODUCT_THRESHOLD) {
    return 'bg-yellow-500'
  } else {
    return 'bg-green-500'
  }
}

// Get row background class based on status
function getItemRowClass(item) {
  if (props.type === 'products') {
    const totalStock = getTotalProductStock(item)
    
    if (totalStock === 0) {
      return 'bg-red-50/50 hover:bg-red-100/70'
    } else if (totalStock <= PRODUCT_THRESHOLD) {
      return 'bg-yellow-50/50 hover:bg-yellow-100/70'
    } else {
      return 'hover:bg-green-50/50'
    }
  } else {
    if (item.status === 'Low Stock') {
      return 'bg-yellow-50/50 hover:bg-yellow-100/70'
    } else if (item.status === 'Out of Stock') {
      return 'bg-red-50/50 hover:bg-red-100/70'
    } else {
      return 'hover:bg-blue-50/50'
    }
  }
}

function getStockTextColor(item) {
  if (props.type === 'products') {
    const totalStock = getTotalProductStock(item)
    
    if (totalStock === 0) return 'text-red-600'
    if (totalStock <= PRODUCT_THRESHOLD) return 'text-yellow-600'
    return 'text-green-600'
  } else {
    if (item.stock === 0) return 'text-red-600'
    if (item.stock <= item.threshold) return 'text-yellow-600'
    return 'text-green-600'
  }
}

function getStockBarColorClass(item) {
  if (props.type === 'products') {
    const totalStock = getTotalProductStock(item)
    
    if (totalStock === 0) return 'bg-red-500'
    if (totalStock <= PRODUCT_THRESHOLD) return 'bg-yellow-500'
    return 'bg-green-500'
  } else {
    if (item.stock === 0) return 'bg-red-500'
    if (item.stock <= item.threshold) return 'bg-yellow-500'
    return 'bg-green-500'
  }
}

function getStockPercentageValue(item) {
  if (props.type === 'products') {
    const totalStock = getTotalProductStock(item)
    const maxStock = PRODUCT_THRESHOLD * 2
    const percentage = (totalStock / maxStock) * 100
    return Math.min(percentage, 100)
  } else {
    const maxStock = Math.max(item.stock, item.threshold) * 2
    const percentage = (item.stock / maxStock) * 100
    return Math.min(percentage, 100)
  }
}

function getStatusColor(status) {
  switch (status) {
    case 'In Stock': return 'text-green-600'
    case 'Low Stock': return 'text-yellow-600'
    case 'Out of Stock': return 'text-red-600'
    default: return 'text-gray-600'
  }
}

function getStatusDotColor(status) {
  switch (status) {
    case 'In Stock': return 'bg-green-500'
    case 'Low Stock': return 'bg-yellow-500'
    case 'Out of Stock': return 'bg-red-500'
    default: return 'bg-gray-400'
  }
}

function formatPrice(value) {
  if (value === null || value === undefined) return '0.00'
  const num = typeof value === 'number' ? value : parseFloat(value)
  if (isNaN(num)) return '0.00'
  return num.toFixed(2)
}

watch(() => route.query.search, (searchQuery) => {
  if (searchQuery && props.items.length > 0) {
    const matchedItem = props.items.find(item => 
      item.name?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    if (matchedItem) {
      highlightedItemId.value = matchedItem.id || matchedItem.itemId
      setTimeout(() => {
        highlightedItemId.value = null
      }, 3000)
    }
  }
}, { immediate: true })

function isHighlighted(item) {
  return highlightedItemId.value === (item.id || item.itemId)
}

function handleSelect(item) {
  emit('select', item)
}

function handleEdit(item) {
  emit('edit', item)
}

function handleDelete(item) {
  emit('delete', item)
}

function handleStockIn(item) {
  const itemType = item.sizes ? 'product' : 'supply'
  emit('stockIn', { item, type: 'in', itemType })
}

function handleStockOut(item) {
  const itemType = item.sizes ? 'product' : 'supply'
  if (itemType === 'supply' && item.stock === 0) {
    return
  }
  if (itemType === 'product' && getTotalProductStock(item) === 0) {
    return
  }
  emit('stockOut', { item, type: 'out', itemType })
}
</script>

<style scoped>
@keyframes pulse {
  0%, 100% { background-color: rgb(254, 249, 195); }
  50% { background-color: rgb(254, 240, 138); }
}
.animate-pulse {
  animation: pulse 1s ease-in-out 3;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
</style>