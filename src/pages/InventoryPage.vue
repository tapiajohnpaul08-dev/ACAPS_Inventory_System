<template>
  <div class="p-8">
    <InventorySearch 
      v-model:search="searchQuery" 
      v-model:activeTab="activeTab"
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
      @edit="handleEditFromModal"
      @notify="handleNotify"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import InventorySearch from '@/components/inventory/InventorySearch.vue'
import InventoryTable from '@/components/inventory/InventoryTable.vue'
import ItemDetailModal from '@/modals/ItemDetailModal.vue'
import { allInventoryItems } from '@/data/dummyData'

const route = useRoute()
const searchQuery = ref('')
const activeTab = ref('cups')
const modalOpen = ref(false)
const selectedItem = ref(null)

// Filter items based on active tab
const itemsByTab = computed(() => {
  if (activeTab.value === 'cups') {
    return allInventoryItems.filter(item => item.category === 'cups')
  } else {
    return allInventoryItems.filter(item => item.category === 'supplies')
  }
})

// Filter items based on search query
const filteredItems = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  if (!q) return itemsByTab.value
  return itemsByTab.value.filter(i =>
    i.name.toLowerCase().includes(q) ||
    i.size.toLowerCase().includes(q) ||
    i.supplier.toLowerCase().includes(q)
  )
})

// Initialize from URL on mount
onMounted(() => {
  if (route.query.search) {
    searchQuery.value = route.query.search
  }
  if (route.query.tab === 'supplies') {
    activeTab.value = 'supplies'
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

function handleSelect(item) {
  console.log('Selected item:', item)
  selectedItem.value = item
  modalOpen.value = true
}

function handleEdit(item) {
  console.log('Edit from table:', item)
  // You can open edit modal or emit to parent
  selectedItem.value = item
  modalOpen.value = true
}

function handleEditFromModal(item) {
  console.log('Edit from modal:', item)
  // Implement edit functionality here
  // You could open another modal for editing or emit to parent
  alert(`Edit item: ${item.name} (${item.size})`)
}

function handleNotify(item) {
  console.log('Notify authority about low stock:', item)
  alert(`⚠️ Low Stock Alert!\n\nProduct: ${item.name} (${item.size})\nCurrent Stock: ${item.stock} units\nThreshold: ${item.threshold || 500} units\n\nNotification sent to procurement department.`)
}

function closeModal() {
  modalOpen.value = false
  selectedItem.value = null
}
</script>