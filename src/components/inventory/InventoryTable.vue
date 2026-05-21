<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="inline-block w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
      <span class="ml-3 text-gray-500">Loading...</span>
    </div>
    
    <div v-else-if="items.length === 0" class="text-center py-12">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="mx-auto text-gray-300 mb-3">
        <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/>
        <path d="M12 22V12"/>
        <polyline points="3.29 7 12 12 20.71 7"/>
      </svg>
      <p class="text-gray-400">No {{ type === 'products' ? 'products' : 'supplies' }} found.</p>
      <p class="text-xs text-gray-400 mt-1">Click "Add New" to get started.</p>
    </div>
    
    <table v-else class="w-full">
      <thead class="bg-gray-50 border-b border-gray-100">
        <tr>
          <th v-for="col in columns" :key="col" class="px-5 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
            {{ col }}
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-50">
        <tr
          v-for="item in items"
          :key="item.id || item.itemId"
          class="cursor-pointer transition-all duration-200"
          :class="[
            item.status === 'Low Stock' && type === 'supplies'
              ? 'bg-red-50 hover:bg-red-100'
              : type === 'products' ? 'hover:bg-green-50/50' : 'hover:bg-blue-50/50',
            isHighlighted(item) ? 'animate-pulse bg-yellow-50 border-l-4 border-yellow-400' : ''
          ]"
          @click="handleSelect(item)"
        >
          <!-- Product/Item Name Column -->
          <td class="px-5 py-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" 
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
          <td class="px-5 py-4">
            <span class="px-2.5 py-1 rounded-full text-xs font-semibold" 
              :class="type === 'products' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'">
              {{ type === 'products' ? (item.category || 'Product') : (item.unit || 'piece') }}
            </span>
          </td>
          
          <!-- Min Order/Stock Column -->
          <td class="px-5 py-4">
            <p class="text-sm font-bold" :class="item.status === 'Low Stock' && type === 'supplies' ? 'text-red-600' : 'text-gray-900'">
              {{ type === 'products' ? (item.minOrder?.toLocaleString() || 'N/A') : (item.stock?.toLocaleString() || 0) }}
            </p>
            <p class="text-xs text-gray-400">{{ type === 'products' ? 'min order' : 'units' }}</p>
          </td>
          
          <!-- Status Column -->
          <td class="px-5 py-4">
            <span v-if="type === 'products'" class="flex items-center gap-1.5 text-xs font-semibold text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px">
                <path d="M21.801 10A10 10 0 1 1 17 3.335"/>
                <path d="m9 11 3 3L22 4"/>
              </svg>
              {{ item.inStock !== false ? 'Available' : 'Out of Stock' }}
            </span>
            <span v-else class="flex items-center gap-1.5 text-xs font-semibold" 
              :class="getStatusColor(item.status)">
              <svg v-if="item.status === 'In Stock'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px">
                <path d="M21.801 10A10 10 0 1 1 17 3.335"/>
                <path d="m9 11 3 3L22 4"/>
              </svg>
              <svg v-else-if="item.status === 'Low Stock'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px">
                <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px">
                <path d="M21.73 18l-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z"/>
                <path d="M12 9v4m0 4h.01"/>
              </svg>
              {{ item.status }}
            </span>
          </td>
          
          <!-- Price/Unit Cost Column -->
          <td class="px-5 py-4">
            <p class="text-sm font-semibold" :class="type === 'products' ? 'text-green-600' : 'text-gray-700'">
              {{ type === 'products' ? `₱${formatPrice(item.unitCost)}` : `₱${formatPrice(item.unitCost)}` }}
            </p>
            <p class="text-xs text-gray-400">{{ type === 'products' ? 'starting from' : `per ${item.unit || 'unit'}` }}</p>
          </td>
          
          <!-- Actions Column -->
          <td class="px-5 py-4">
            <div class="flex items-center gap-2">
              <button 
                class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200"
                :class="type === 'products' ? 'text-green-600 hover:bg-green-100 hover:text-green-800' : 'text-blue-600 hover:bg-blue-100 hover:text-blue-800'"
                @click.stop="handleEdit(item)">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:13px;height:13px">
                  <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>
                </svg>
                Edit
              </button>
              <button 
                class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 hover:text-red-800 rounded-lg transition-all duration-200"
                @click.stop="handleDelete(item)">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:13px;height:13px">
                  <path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
                Delete
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  items: { type: Array, required: true },
  loading: { type: Boolean, default: false },
  type: { type: String, default: 'products' } // Changed from 'cups' to 'products'
})

console.log('props in InventoryTable:', props.items?.length, props.loading, props.type)

const emit = defineEmits(['edit', 'select', 'delete'])

const route = useRoute()
const highlightedItemId = ref(null)

const columns = computed(() => {
  if (props.type === 'products') {
    return ['Product', 'Category', 'Min Order', 'Status', 'Base Price', 'Actions']
  }
  return ['Item', 'Unit', 'Stock', 'Status', 'Unit Cost', 'Actions']
})

function getStatusColor(status) {
  switch (status) {
    case 'In Stock': return 'text-green-600'
    case 'Low Stock': return 'text-yellow-600'
    case 'Out of Stock': return 'text-red-600'
    default: return 'text-gray-600'
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