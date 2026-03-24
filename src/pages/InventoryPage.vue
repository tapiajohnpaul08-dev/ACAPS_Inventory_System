<template>
  <div class="p-8">
    <InventorySearch v-model:search="searchQuery" />
    <InventoryTable :items="filteredItems" @edit="handleEdit" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import InventorySearch from '@/components/inventory/InventorySearch.vue'
import InventoryTable from '@/components/inventory/InventoryTable.vue'
import { inventoryItems } from '@/data/dummyData'

const searchQuery = ref('')

const filteredItems = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  if (!q) return inventoryItems
  return inventoryItems.filter(i =>
    i.name.toLowerCase().includes(q) ||
    i.size.toLowerCase().includes(q) ||
    i.supplier.toLowerCase().includes(q)
  )
})

function handleEdit(item) {
  console.log('Edit:', item)
  alert(`Edit item: ${item.name} (${item.size})`)
}
</script>