<template>
  <div class="p-8">
    <div class="mb-8 flex justify-between items-center flex-wrap gap-4">
      <div>
        <h1 class="text-2xl font-black text-gray-900">Inventory</h1>
        <p class="text-sm text-gray-500 mt-1">
          {{ activeTab === 'products' ? 'Manage your products (cups, paper cups)' : 'Manage your supplies & materials' }}
        </p>
      </div>
      <div class="flex items-center gap-2 flex-wrap">
        <button
          @click="handleScanAll"
          :disabled="isScanningAll"
          class="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors shadow-sm text-sm font-semibold"
        >
          <svg v-if="isScanningAll" class="animate-spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10.268 21a2 2 0 0 0 3.464 0"/>
            <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/>
          </svg>
          {{ isScanningAll ? 'Scanning...' : 'Scan & Notify All' }}
        </button>
        <button
          v-if="activeTab === 'supplies'"
          @click="openAddSupplyModal"
          class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Add New Supply
        </button>
        <button
          v-if="activeTab === 'products'"
          @click="openAddProductModal"
          class="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Add New Product
        </button>
      </div>
    </div>
    
    <InventorySearch 
      v-model:search="searchQuery" 
      v-model:activeTab="activeTab"
      v-model:statusFilter="statusFilter"
      v-model:categoryFilter="categoryFilter"
      :items-count="allSupplyItems.length"
      :low-stock-count="lowStockCount"
      :out-of-stock-count="outOfStockCount"
      :in-stock-count="inStockCount"
      :products-count="products.length"
      :product-categories="productCategories"
      :supply-categories="supplyCategoryValues"
      :category-counts="categoryCounts"
      @update:activeTab="handleTabChange"
    />
    
    <InventoryTable 
      :items="filteredItems" 
      :loading="loading"
      :type="activeTab"
      @edit="handleEdit" 
      @select="handleSelect"
      @delete="handleDelete"
      @stock-in="openStockMovementModal"
      @stock-out="openStockMovementModal"
    />
    
    <!-- Rest of your modals remain the same -->
    <ItemDetailModal
      :is-open="modalOpen"
      :item="selectedItem"
      :type="activeTab"
      @close="closeModal"
      @edit="handleEdit"
      @notify="handleNotify"
      @stock-in="openStockMovementModal"
      @stock-out="openStockMovementModal"
    />
    
    <EditInventoryItemModal
      v-if="editInventoryItem"
      :show="true"
      :item="editInventoryItem"
      @close="closeEditInventoryModal"
      @update="handleUpdateInventoryItem"
    />
    
    <EditProductModal
      :show="editProductModal"
      :product="editProductData"
      :loading="loadingProducts"
      @close="editProductModal = false; editProductData = null"
      @update="handleUpdateProduct"
    />
    
    <AddSupplyModal
      v-if="showAddSupplyModal"
      :show="true"
      :categories="supplyCategories"
      @close="closeAddSupplyModal"
      @submit="handleAddSupply"
    />
    
    <AddProductModal
      v-if="showAddProductModal"
      :show="true"
      @close="closeAddProductModal"
      @submit="handleAddProduct"
    />
    
    <FeedbackModal
      :show="feedback.show"
      :type="feedback.type"
      :title="feedback.title"
      :message="feedback.message"
      @close="closeFeedback"
    />
    
    <ConfirmModal
      :show="confirmModal.show"
      :type="confirmModal.type"
      :title="confirmModal.title"
      :message="confirmModal.message"
      :confirm-text="'Delete'"
      :cancel-text="'Cancel'"
      @confirm="confirmModal.onConfirm && confirmModal.onConfirm()"
      @cancel="closeConfirmModal"
    />
    
    <StockMovementModal
      :show="stockMovementModal.show"
      :item="stockMovementModal.item"
      :type="stockMovementModal.type"
      :item-type="stockMovementModal.itemType"
      @close="closeStockMovementModal"
      @submit="handleStockMovement"
    />
  </div>

  <Transition name="toast">
    <div
      v-if="toast.show"
      class="fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-semibold max-w-sm"
      :class="toast.type === 'success' ? 'bg-green-600 text-white' : toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-gray-800 text-white'"
    >
      <svg v-if="toast.type === 'success'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M20 6L9 17l-5-5"/>
      </svg>
      <svg v-else-if="toast.type === 'error'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/>
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/>
      </svg>
      {{ toast.message }}
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick  } from 'vue'
import { useRoute } from 'vue-router'
import InventorySearch from '@/components/inventory/InventorySearch.vue'
import InventoryTable from '@/components/inventory/InventoryTable.vue'
import ItemDetailModal from '@/modals/ItemDetailModal.vue'
import EditInventoryItemModal from '@/modals/EditInventoryItemModal.vue'
import EditProductModal from '@/modals/EditProductModal.vue'
import AddSupplyModal from '@/modals/AddSupplyModal.vue'
import AddProductModal from '@/modals/AddProductModal.vue'
import FeedbackModal from '@/modals/FeedbackModal.vue'
import ConfirmModal from '@/modals/ConfirmModal.vue'
import { productApi, supplyApi, inventoryApi, alertApi } from '@/api/api'
import StockMovementModal from '@/modals/StockMovementModal.vue'

const route = useRoute()
const searchQuery = ref('')
const activeTab = ref('products')
const statusFilter = ref('all')
const categoryFilter = ref('all')
const modalOpen = ref(false)
const selectedItem = ref(null)
const editInventoryItem = ref(null)
const editProductModal = ref(false)
const editProductData = ref(null)
const showAddSupplyModal = ref(false)
const showAddProductModal = ref(false)
const loadingProducts = ref(false)
const loadingSupplies = ref(false)
const loadingInventory = ref(false)
const toast = ref({ show: false, type: 'success', message: '' })
const isScanningAll = ref(false)
const stockMovementModal = ref({ show: false, item: null, type: 'in', itemType: 'supply' })
const highlightedItemIdFromQuery = ref(null)

// Data from backend
const products = ref([])
const supplies = ref([])
const inventoryItems = ref([])

// Categories for supplies
const supplyCategories = [
  { value: 'inks', label: 'Inks' },
  { value: 'chemicals', label: 'Chemicals' },
  { value: 'packaging', label: 'Packaging' },
  { value: 'raw_materials', label: 'Raw Materials' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'other', label: 'Other' }
]

const supplyCategoryValues = computed(() => {
  return supplyCategories.map(cat => cat.value)
})

// Extract unique categories from products
const productCategories = computed(() => {
  const categories = new Set()
  products.value.forEach(product => {
    if (product.category) categories.add(product.category)
  })
  return Array.from(categories).sort()
})

// Calculate category counts
const categoryCounts = computed(() => {
  const counts = {}
  
  if (activeTab.value === 'products') {
    // Count products by category
    productCategories.value.forEach(cat => {
      counts[cat] = products.value.filter(p => p.category === cat).length
    })
  } else {
    // Count supplies by category
    supplyCategoryValues.value.forEach(cat => {
      counts[cat] = allSupplyItems.value.filter(item => item.category === cat).length
    })
  }
  
  counts['all'] = activeTab.value === 'products' ? products.value.length : allSupplyItems.value.length
  return counts
})

const confirmModal = ref({
  show: false,
  type: 'danger',
  title: '',
  message: '',
  onConfirm: null,
  itemToDelete: null
})

const feedback = ref({
  show: false,
  type: 'success',
  title: '',
  message: ''
})

let toastTimer = null

// Loading state for current tab
const loading = computed(() => {
  if (activeTab.value === 'products') return loadingProducts.value
  if (activeTab.value === 'supplies') return loadingSupplies.value
  return loadingInventory.value
})

// All supply items from inventory
const allSupplyItems = computed(() => {
  return inventoryItems.value
    .filter(item => item.itemType === 'supply')
    .map(item => ({
      id: item.itemId,
      itemId: item.itemId,
      name: item.itemRef?.name || 'Unknown',
      category: item.itemRef?.category || 'other',
      supplier: item.itemRef?.supplier || 'No supplier',
      stock: item.stock,
      unit: item.unit,
      threshold: item.threshold,
      unitCost: item.unitCost,
      status: item.status,
      lastRestocked: item.lastRestocked,
      notes: item.notes,
      supplyId: item.itemRef?.supplyId
    }))
})

// Display items based on active tab with status
const displayItems = computed(() => {
  if (activeTab.value === 'products') {
    return products.value.map(p => {
      const totalStock = p.sizes?.reduce((sum, size) => sum + (size.stock || 0), 0) || 0
      let status = 'In Stock'
      if (totalStock === 0) {
        status = 'Out of Stock'
      } else if (totalStock <= 500) {
        status = 'Low Stock'
      }
      
      return {
        ...p,
        id: p.id,
        itemId: p.id,
        totalStock: totalStock,
        status: status
      }
    })
  } else {
    return allSupplyItems.value
  }
})

// Filter items based on search (name only), category, and status
const filteredItems = computed(() => {
  let items = displayItems.value || []
  
  // Filter by search (name only)
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase().trim()
    items = items.filter(item => 
      item.name?.toLowerCase().includes(query)
    )
  }
  
  // Filter by category
  if (categoryFilter.value !== 'all') {
    items = items.filter(item => {
      const itemCategory = activeTab.value === 'products' ? item.category : item.category
      return itemCategory === categoryFilter.value
    })
  }
  
  // Filter by status (for both products and supplies)
  if (statusFilter.value !== 'all') {
    items = items.filter(item => {
      if (statusFilter.value === 'in-stock') return item.status === 'In Stock'
      if (statusFilter.value === 'low-stock') return item.status === 'Low Stock'
      if (statusFilter.value === 'out-of-stock') return item.status === 'Out of Stock'
      return true
    })
  }
  
  return items
})

// Status counts for products
const productInStockCount = computed(() => {
  return displayItems.value.filter(item => item.status === 'In Stock').length
})

const productLowStockCount = computed(() => {
  return displayItems.value.filter(item => item.status === 'Low Stock').length
})

const productOutOfStockCount = computed(() => {
  return displayItems.value.filter(item => item.status === 'Out of Stock').length
})

// Status counts for supplies
const supplyInStockCount = computed(() => {
  return allSupplyItems.value.filter(item => item.status === 'In Stock').length
})

const supplyLowStockCount = computed(() => {
  return allSupplyItems.value.filter(item => item.status === 'Low Stock').length
})

const supplyOutOfStockCount = computed(() => {
  return allSupplyItems.value.filter(item => item.status === 'Out of Stock').length
})

// Combined counts based on active tab
const inStockCount = computed(() => {
  return activeTab.value === 'products' ? productInStockCount.value : supplyInStockCount.value
})

const lowStockCount = computed(() => {
  return activeTab.value === 'products' ? productLowStockCount.value : supplyLowStockCount.value
})

const outOfStockCount = computed(() => {
  return activeTab.value === 'products' ? productOutOfStockCount.value : supplyOutOfStockCount.value
})

// Load data functions
const loadProducts = async () => {
  loadingProducts.value = true
  try {
    const response = await productApi.getAllProducts()
    if (response.success && response.data) {
      products.value = response.data.map(product => ({
        ...product,
        id: product.id,
        sizes: product.sizes || [],
        totalStock: (product.sizes || []).reduce((sum, size) => sum + (size.stock || 0), 0),
        unitCost: product.sizes?.[0]?.price || 0
      }))
      console.log('Products loaded:', products.value.length)
    }
  } catch (error) {
    console.error('Error loading products:', error)
    showFeedback('error', 'Error', 'Failed to load products')
  } finally {
    loadingProducts.value = false
  }
}

const loadSupplies = async () => {
  loadingSupplies.value = true
  try {
    const response = await supplyApi.getAllSupplies()
    if (response.success && response.data) {
      supplies.value = response.data
      console.log('Supplies loaded:', supplies.value.length)
    }
  } catch (error) {
    console.error('Error loading supplies:', error)
    showFeedback('error', 'Error', 'Failed to load supplies')
  } finally {
    loadingSupplies.value = false
  }
}

const loadInventory = async () => {
  loadingInventory.value = true
  try {
    const response = await inventoryApi.getAllInventory()
    if (response.success && response.data) {
      inventoryItems.value = response.data
      console.log('Inventory loaded:', inventoryItems.value.length)
    }
  } catch (error) {
    console.error('Error loading inventory:', error)
    showFeedback('error', 'Error', 'Failed to load inventory')
  } finally {
    loadingInventory.value = false
  }
}

// Initialize on mount
onMounted(async () => {
  await Promise.all([loadProducts(), loadSupplies(), loadInventory()])
  
  if (route.query.search) {
    searchQuery.value = route.query.search
  }
  if (route.query.status) {
    statusFilter.value = route.query.status
  }
  if (route.query.category) {
    categoryFilter.value = route.query.category
  }
  if (route.query.highlight) {
    highlightedItemIdFromQuery.value = route.query.highlight
    setTimeout(() => {
      highlightAndScrollToItem(route.query.highlight)
    }, 1000)
  }
})

// Watch for route changes
watch(() => route.query.search, (newSearch) => {
  searchQuery.value = newSearch || ''
})

watch(() => route.query.status, (newStatus) => {
  statusFilter.value = newStatus || 'all'
})

watch(() => route.query.category, (newCategory) => {
  categoryFilter.value = newCategory || 'all'
})

// Helper functions

async function highlightAndScrollToItem(itemId) {
  if (!itemId) return
  
  // Find the item in the current filtered items
  const item = filteredItems.value.find(i => (i.id === itemId || i.itemId === itemId))
  if (item) {
    highlightedItemIdFromQuery.value = itemId
    
    // Scroll to the item after a short delay
    await nextTick()
    const element = document.querySelector(`[data-item-id="${itemId}"]`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      element.classList.add('highlight-pulse')
      setTimeout(() => {
        element.classList.remove('highlight-pulse')
      }, 3000)
    }
    
    setTimeout(() => {
      highlightedItemIdFromQuery.value = null
    }, 5000)
  }
}

function handleTabChange(tab) {
  console.log('Tab changed to:', tab)
  // Reset filters when tab changes
  statusFilter.value = 'all'
  categoryFilter.value = 'all'
  searchQuery.value = ''
}

function handleSelect(item) {
  selectedItem.value = item
  modalOpen.value = true
}

function handleEdit(item) {
  if (activeTab.value === 'products') {
    editProductData.value = item
    editProductModal.value = true
  } else {
    editInventoryItem.value = item
  }
}

function openStockMovementModal(data) {
  const { item, type, itemType } = data
  
  if (itemType === 'supply' && type === 'out' && item.stock === 0) {
    showToast('error', 'Cannot remove stock from out of stock item')
    return
  }
  
  stockMovementModal.value = { 
    show: true, 
    item, 
    type, 
    itemType 
  }
}


function closeStockMovementModal() {
  stockMovementModal.value = { show: false, item: null, type: 'in', itemType: 'supply' }
}

async function handleStockMovement(data) {
  const { 
    item, 
    itemType, 
    sizeName, 
    quantity, 
    type, 
    reference,
    newStock: newStockValue
  } = data
  
  if (!quantity || quantity <= 0) {
    showToast('error', 'Invalid quantity')
    closeStockMovementModal()
    return
  }
  
  try {
    showToast('info', 'Updating stock...')
    
    if (itemType === 'product') {
      if (!sizeName) {
        showToast('error', 'Please select a size')
        closeStockMovementModal()
        return
      }
      
      const productCustomId = item.id
      
      if (!productCustomId) {
        showToast('error', 'Invalid product ID')
        closeStockMovementModal()
        return
      }
      
      let response
      if (type === 'in') {
        response = await productApi.updateSizeStock(productCustomId, sizeName, newStockValue)
      } else {
        response = await productApi.reduceSizeStock(productCustomId, sizeName, quantity)
      }
      
      if (response.success) {
        await loadProducts()
        showToast('success', `${type === 'in' ? 'Added' : 'Removed'} ${quantity} pcs from ${item.name} (${sizeName})`)
        
        const updatedProduct = products.value.find(p => p.id === productCustomId)
        const updatedSize = updatedProduct?.sizes?.find(s => s.name === sizeName)
        if (updatedSize && (updatedSize.stock === 0 || updatedSize.stock <= 100)) {
          await alertApi.sendProductSizeAlert(productCustomId, sizeName).catch(err => console.error('Alert error:', err))
        }
      } else {
        showToast('error', response.message || 'Failed to update stock')
      }
    } else {
      const itemId = item.itemId || item.id
      const threshold = item.threshold || 100
      
      let newStatus = 'In Stock'
      if (newStockValue <= 0) {
        newStatus = 'Out of Stock'
      } else if (newStockValue <= threshold) {
        newStatus = 'Low Stock'
      }
      
      const notes = reference 
        ? `${type === 'in' ? 'Stock In' : 'Stock Out'}: ${reference}${item.notes ? '\n' + item.notes : ''}`
        : item.notes
      
      const response = await inventoryApi.updateInventoryItem(itemId, {
        stock: newStockValue,
        unitCost: item.unitCost,
        unit: item.unit,
        threshold: threshold,
        notes: notes,
        status: newStatus
      })
      
      if (response.success) {
        await loadInventory()
        showToast('success', `${type === 'in' ? 'Added' : 'Removed'} ${quantity} ${item.unit || 'units'} from ${item.name}`)
        
        if (newStatus === 'Low Stock' || newStatus === 'Out of Stock') {
          await alertApi.sendItemAlert(itemId).catch(err => console.error('Alert error:', err))
        }
      } else {
        showToast('error', response.message || 'Failed to update stock')
      }
    }
  } catch (error) {
    console.error('Stock movement error:', error)
    showToast('error', error.response?.data?.message || error.message || 'Failed to update stock')
  } finally {
    closeStockMovementModal()
  }
}

async function handleUpdateProduct(updatedData) {
  loadingProducts.value = true
  try {
    const response = await productApi.updateProduct(editProductData.value.id, updatedData)
    if (response.success) {
      await loadProducts()
      showFeedback('success', 'Success', `Product "${updatedData.name}" has been updated successfully.`)
      editProductModal.value = false
      editProductData.value = null
    } else {
      showFeedback('error', 'Error', response.message || 'Failed to update product')
    }
  } catch (error) {
    console.error('Error updating product:', error)
    showFeedback('error', 'Error', 'Failed to update product')
  } finally {
    loadingProducts.value = false
  }
}

async function handleUpdateInventoryItem(updatedItem) {
  loadingInventory.value = true
  try {
    const response = await inventoryApi.updateInventoryItem(updatedItem.itemId, {
      stock: updatedItem.stock,
      threshold: updatedItem.threshold,
      unitCost: updatedItem.unitCost,
      unit: updatedItem.unit,
      notes: updatedItem.notes,
      location: updatedItem.location
    })
    
    if (response.success) {
      await loadInventory()
      showFeedback('success', 'Success', `Inventory item "${updatedItem.name}" has been updated successfully.`)
      closeEditInventoryModal()
    } else {
      showFeedback('error', 'Error', response.message || 'Failed to update inventory item')
    }
  } catch (error) {
    console.error('Error updating inventory item:', error)
    showFeedback('error', 'Error', 'Failed to update inventory item')
  } finally {
    loadingInventory.value = false
  }
}

function closeConfirmModal() {
  confirmModal.value.show = false
}

function openAddSupplyModal() {
  showAddSupplyModal.value = true
}

function closeAddSupplyModal() {
  showAddSupplyModal.value = false
}

function openAddProductModal() {
  showAddProductModal.value = true
}

function closeAddProductModal() {
  showAddProductModal.value = false
}

function closeEditInventoryModal() {
  editInventoryItem.value = null
}

function showToast(type, message) {
  clearTimeout(toastTimer)
  toast.value = { show: true, type, message }
  toastTimer = setTimeout(() => { toast.value.show = false }, 3500)
}

async function handleAddSupply(supplyData) {
  loadingSupplies.value = true
  try {
    const supplyResponse = await supplyApi.createSupply({
      name: supplyData.name,
      category: supplyData.category,
      supplier: supplyData.supplier,
      supplierContact: supplyData.supplierContact,
      leadTime: supplyData.leadTime || 7,
      unit: supplyData.unit,
      unitCost: supplyData.unitCost,
      description: supplyData.description,
      minOrderQuantity: supplyData.minOrderQuantity || 1
    })
    
    if (!supplyResponse.success) {
      showToast('error', supplyResponse.message || 'Failed to create supply')
      return
    }
    
    const inventoryResponse = await inventoryApi.addSupplyToInventory(
      supplyResponse.data.supplyId,
      {
        stock: supplyData.stock || 0,
        threshold: supplyData.threshold || 100,
        unitCost: supplyData.unitCost,
        unit: supplyData.unit,
        notes: supplyData.notes,
        location: supplyData.location || 'Warehouse A'
      }
    )
    
    if (inventoryResponse.success) {
      await Promise.all([loadSupplies(), loadInventory()])
      showToast('success', `Supply "${supplyData.name}" has been created and added to inventory.`)
      closeAddSupplyModal()
    } else {
      showToast('error', inventoryResponse.message || 'Failed to add supply to inventory')
    }
  } catch (error) {
    console.error('Error creating supply:', error)
    showToast('error', 'Failed to create supply')
  } finally {
    loadingSupplies.value = false
  }
}

async function handleAddProduct(productData) {
  loadingProducts.value = true
  try {
    const response = await productApi.createProduct(productData)
    if (response.success) {
      await loadProducts()
      showFeedback('success', 'Success', `Product "${productData.name}" has been created successfully.`)
      closeAddProductModal()
    } else {
      showFeedback('error', 'Error', response.message || 'Failed to create product')
    }
  } catch (error) {
    console.error('Error creating product:', error)
    showFeedback('error', 'Error', 'Failed to create product')
  } finally {
    loadingProducts.value = false
  }
}

async function handleDelete(item) {
  confirmModal.value = {
    show: true,
    type: 'danger',
    title: 'Delete Item',
    message: `Are you sure you want to delete "${item.name}"? This action cannot be undone.`,
    onConfirm: () => confirmDelete(item),
    itemToDelete: item
  }
}

async function confirmDelete(item) {
  confirmModal.value.show = false
  
  if (activeTab.value === 'products') {
    loadingProducts.value = true
    try {
      const response = await productApi.deleteProduct(item.id)
      if (response.success) {
        await loadProducts()
        showFeedback('success', 'Success', `Product "${item.name}" has been deleted successfully.`)
      } else {
        showFeedback('error', 'Error', response.message || 'Failed to delete product')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      showFeedback('error', 'Error', 'Failed to delete product')
    } finally {
      loadingProducts.value = false
    }
  } else {
    loadingInventory.value = true
    try {
      const response = await inventoryApi.deleteInventoryItem(item.itemId)
      if (response.success) {
        await loadInventory()
        showFeedback('success', 'Success', `Supply "${item.name}" has been deleted from inventory.`)
      } else {
        showFeedback('error', 'Error', response.message || 'Failed to delete supply')
      }
    } catch (error) {
      console.error('Error deleting supply:', error)
      showFeedback('error', 'Error', 'Failed to delete supply')
    } finally {
      loadingInventory.value = false
    }
  }
}

async function handleNotify(item) {
  showToast('success', `Alert emailed for ${item.name}`)
}

async function handleScanAll() {
  isScanningAll.value = true
  try {
    const result = await alertApi.scanAndAlertAll()
    if (result.success) {
      showToast('success', `Scan complete — ${result.alertsSent} alert(s) sent`)
    } else {
      showToast('error', result.message || 'Scan failed')
    }
  } catch (err) {
    console.error('Scan all error:', err)
    showToast('error', 'Failed to scan inventory')
  } finally {
    isScanningAll.value = false
  }
}

function showFeedback(type, title, message) {
  feedback.value = {
    show: true,
    type,
    title,
    message
  }
}

function closeFeedback() {
  feedback.value.show = false
}

function closeModal() {
  modalOpen.value = false
  selectedItem.value = null
}
</script>

<style scoped>
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>