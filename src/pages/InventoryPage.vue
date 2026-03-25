<template>
  <div class="p-8">
    <div class="mb-8">
      <h1 class="text-2xl font-black text-gray-900">Inventory</h1>
      <p class="text-sm text-gray-500 mt-1">Manage your inventory items</p>
    </div>
    
    <InventorySearch 
      v-model:search="searchQuery" 
      v-model:activeTab="activeTab"
      v-model:statusFilter="statusFilter"
    />
    
    <InventoryTable 
      :items="filteredItems" 
      @edit="handleEdit" 
      @select="handleSelect" 
    />
    
    <!-- Item Detail Modal -->
    <ItemDetailModal
      :is-open="modalOpen"
      :item="selectedItem"
      @close="closeModal"
      @edit="openEditModal"
      @notify="handleNotify"
    />
    
    <!-- Edit Item Modal -->
    <EditItemModal
      v-if="editItem"
      :show="true"
      :item="editItem"
      @close="closeEditModal"
      @update="handleUpdateItem"
    />
    
    <!-- Feedback Modal -->
    <FeedbackModal
      :show="feedback.show"
      :type="feedback.type"
      :title="feedback.title"
      :message="feedback.message"
      @close="closeFeedback"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import InventorySearch from '@/components/inventory/InventorySearch.vue'
import InventoryTable from '@/components/inventory/InventoryTable.vue'
import ItemDetailModal from '@/modals/ItemDetailModal.vue'
import EditItemModal from '@/modals/EditITemModal.vue'
import FeedbackModal from '@/modals/FeedbackModal.vue'
import { allInventoryItems } from '@/data/dummyData'

const route = useRoute()
const searchQuery = ref('')
const activeTab = ref('cups')
const statusFilter = ref('all')
const modalOpen = ref(false)
const selectedItem = ref(null)
const editItem = ref(null)

// Feedback modal state
const feedback = ref({
  show: false,
  type: 'success',
  title: '',
  message: ''
})

// Filter items based on active tab
const itemsByTab = computed(() => {
  if (activeTab.value === 'cups') {
    return allInventoryItems.filter(item => item.category === 'cups')
  } else {
    return allInventoryItems.filter(item => item.category === 'supplies')
  }
})

// Filter items based on search query and status
const filteredItems = computed(() => {
  let items = itemsByTab.value
  
  // Apply search filter
  const q = searchQuery.value.toLowerCase().trim()
  if (q) {
    items = items.filter(i =>
      i.name.toLowerCase().includes(q) ||
      i.size.toLowerCase().includes(q) ||
      i.supplier.toLowerCase().includes(q)
    )
  }
  
  // Apply status filter
  if (statusFilter.value === 'in-stock') {
    items = items.filter(i => i.status === 'In Stock')
  } else if (statusFilter.value === 'low-stock') {
    items = items.filter(i => i.status === 'Low Stock')
  }
  
  return items
})

// Initialize from URL on mount
onMounted(() => {
  if (route.query.search) {
    searchQuery.value = route.query.search
  }
  if (route.query.tab === 'supplies') {
    activeTab.value = 'supplies'
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

watch(() => route.query.tab, (newTab) => {
  if (newTab === 'supplies') {
    activeTab.value = 'supplies'
  } else if (newTab === 'cups') {
    activeTab.value = 'cups'
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
  editItem.value = item
}

function openEditModal(item) {
  editItem.value = item
  modalOpen.value = false
}

function closeEditModal() {
  editItem.value = null
}

function handleUpdateItem(updatedItem) {
  // Find and update the item in allInventoryItems
  const index = allInventoryItems.findIndex(i => i.id === updatedItem.id)
  if (index !== -1) {
    allInventoryItems[index] = { ...allInventoryItems[index], ...updatedItem }
    
    // Show success feedback
    showFeedback('success', 'Success!', `Item "${updatedItem.name}" has been updated successfully.`)
  }
}

function handleNotify(item) {
  showFeedback('warning', 'Low Stock Alert', 
    `Notification sent to procurement department about ${item.name} (${item.size}).\nCurrent Stock: ${item.stock} units\nThreshold: ${item.threshold || 500} units`)
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