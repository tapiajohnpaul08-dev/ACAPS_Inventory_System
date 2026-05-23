<template>
  <div class="p-8">
    <div class="mb-8 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-black text-gray-900">Inventory</h1>
        <p class="text-sm text-gray-500 mt-1">
          {{ activeTab === 'products' ? 'Manage your products (cups, paper cups)' : 'Manage your supplies & materials' }}
        </p>
      </div>
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
    
    <InventorySearch 
      v-model:search="searchQuery" 
      v-model:activeTab="activeTab"
      v-model:statusFilter="statusFilter"
      :items-count="filteredItems.length"
      :low-stock-count="lowStockCount"
      :products-count="products.length"  
      @update:activeTab="handleTabChange"
    />
    
    <InventoryTable 
      :items="displayItems" 
      :loading="loading"
      :type="activeTab"
      @edit="handleEdit" 
      @select="handleSelect"
      @delete="handleDelete"
    />
    
    <!-- Item Detail Modal -->
    <ItemDetailModal
      :is-open="modalOpen"
      :item="selectedItem"
      :type="activeTab"
      @close="closeModal"
      @edit="handleEdit"
      @notify="handleNotify"
    />
    
    <!-- Edit Inventory Item Modal (for supplies in inventory) -->
    <EditInventoryItemModal
      v-if="editInventoryItem"
      :show="true"
      :item="editInventoryItem"
      @close="closeEditInventoryModal"
      @update="handleUpdateInventoryItem"
    />
    
    <!-- Edit Product Modal -->
    <EditProductModal
      :show="editProductModal"
      :product="editProductData"
      :loading="loadingProducts"
      @close="editProductModal = false; editProductData = null"
      @update="handleUpdateProduct"
    />
    
    <!-- Add Supply Modal (creates supply and adds to inventory) -->
    <AddSupplyModal
      v-if="showAddSupplyModal"
      :show="true"
      :categories="supplyCategories"
      @close="closeAddSupplyModal"
      @submit="handleAddSupply"
    />
    
    <!-- Add Product Modal -->
    <AddProductModal
      v-if="showAddProductModal"
      :show="true"
      @close="closeAddProductModal"
      @submit="handleAddProduct"
    />
    
    <!-- Feedback Modal -->
    <FeedbackModal
      :show="feedback.show"
      :type="feedback.type"
      :title="feedback.title"
      :message="feedback.message"
      @close="closeFeedback"
    />
    
    <!-- Universal Confirm Modal -->
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
  </div>

  <Transition name="toast">
    <div
      v-if="toast.show"
      class="fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-semibold max-w-sm"
      :class="toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'"
    >
      <svg v-if="toast.type === 'success'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M20 6L9 17l-5-5"/>
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/>
      </svg>
      {{ toast.message }}
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
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
import { productApi, supplyApi, inventoryApi } from '@/api/api'

const route = useRoute()
const searchQuery = ref('')
const activeTab = ref('products') // 'products' or 'supplies'
const statusFilter = ref('all')
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


// Data from backend
const products = ref([])  // Products from Product model
const supplies = ref([])   // Supplies from Supply model
const inventoryItems = ref([]) // Unified inventory items

// Categories for supplies
const supplyCategories = [
  { value: 'inks', label: 'Inks' },
  { value: 'chemicals', label: 'Chemicals' },
  { value: 'packaging', label: 'Packaging' },
  { value: 'raw_materials', label: 'Raw Materials' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'other', label: 'Other' }
]

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

// Loading state for current tab
const loading = computed(() => {
  if (activeTab.value === 'products') return loadingProducts.value
  if (activeTab.value === 'supplies') return loadingSupplies.value
  return loadingInventory.value
})

// Display items based on active tab
const displayItems = computed(() => {
  if (activeTab.value === 'products') {
    return products.value.map(p => ({
      ...p,
      itemId: p.id,
      status: p.inStock ? 'In Stock' : 'Out of Stock'
    }))
  } else {
    // For supplies, show inventory items with populated supply data
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
  }
})

// Filtered items based on search and status
const filteredItems = computed(() => {
  let items = displayItems.value
  
  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    items = items.filter(item => 
      item.name?.toLowerCase().includes(query) ||
      item.category?.toLowerCase().includes(query) ||
      item.supplier?.toLowerCase().includes(query)
    )
  }
  
  // Apply status filter
  if (statusFilter.value !== 'all' && activeTab.value === 'supplies') {
    items = items.filter(item => {
      if (statusFilter.value === 'low-stock') return item.status === 'Low Stock'
      if (statusFilter.value === 'in-stock') return item.status === 'In Stock'
      if (statusFilter.value === 'out-of-stock') return item.status === 'Out of Stock'
      return true
    })
  }
  
  return items
})

// Low stock count for supplies
const lowStockCount = computed(() => {
  if (activeTab.value === 'products') return 0
  return displayItems.value.filter(item => item.status === 'Low Stock').length
})

// Load products from backend
const loadProducts = async () => {
  loadingProducts.value = true
  try {
    const response = await productApi.getAllProducts()
    console.log('Products API response:', response)
    
    if (response.success && response.data) {
      products.value = response.data.map(product => ({
        id: product.id,
        name: product.name,
        category: product.category,
        subcategory: product.subcategory,
        description: product.description,
        image: product.image,
        sizes: product.sizes?.map(size => ({
          ...size,
          bulkPrices: size.bulkPrices || {}
        })) || [],
        minOrder: product.minOrder,
        featured: product.featured,
        popular: product.popular,
        inStock: true, // Will be updated from inventory
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

// Load supplies
const loadSupplies = async () => {
  loadingSupplies.value = true
  try {
    const response = await supplyApi.getAllSupplies()
    console.log('Supplies API response:', response)
    
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

// Load unified inventory
const loadInventory = async () => {
  loadingInventory.value = true
  try {
    const response = await inventoryApi.getAllInventory()
    console.log('Inventory API response:', response)
    
    if (response.success && response.data) {
      inventoryItems.value = response.data
      console.log('Inventory items loaded:', inventoryItems.value.length)
    }
  } catch (error) {
    console.error('Error loading inventory:', error)
    showFeedback('error', 'Error', 'Failed to load inventory')
  } finally {
    loadingInventory.value = false
  }
}

// Handle tab change
const handleTabChange = (tab) => {
  console.log('Tab changed to:', tab)
}

// Initialize on mount
onMounted(async () => {
  console.log('Loading initial data...')
  await Promise.all([loadProducts(), loadSupplies(), loadInventory()])
  console.log('Products count:', products.value.length)
  console.log('Supplies count:', supplies.value.length)
  console.log('Inventory count:', inventoryItems.value.length)
  
  if (route.query.search) {
    searchQuery.value = route.query.search
  }
  if (route.query.status) {
    statusFilter.value = route.query.status
  }
})

// Watch for route changes
watch(() => route.query.search, (newSearch) => {
  if (newSearch) {
    searchQuery.value = newSearch
  } else {
    searchQuery.value = ''
  }
})

watch(() => route.query.status, (newStatus) => {
  if (newStatus) {
    statusFilter.value = newStatus
  } else {
    statusFilter.value = 'all'
  }
})

function handleSelect(item) {
  selectedItem.value = item
  modalOpen.value = true
}

function handleEdit(item) {
  console.log('handleEdit called with:', item)
  console.log('activeTab:', activeTab.value)
  
  if (activeTab.value === 'products') {
    console.log('Opening EditProductModal for product:', item)
    editProductData.value = item
    editProductModal.value = true
  } else {
    console.log('Opening EditInventoryItemModal for supply:', item)
    editInventoryItem.value = item
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
let toastTimer = null

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
  try {
    // Implement notification logic
    showFeedback('warning', 'Low Stock Alert', 
      `Notification would be sent to procurement department about ${item.name}.\nCurrent Stock: ${item.stock} units\nThreshold: ${item.threshold} units`)
  } catch (error) {
    console.error('Error sending notification:', error)
    showFeedback('error', 'Error', 'Failed to send notification')
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