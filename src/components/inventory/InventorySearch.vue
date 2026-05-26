<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
    <div class="p-5 border-b border-gray-100">
      <div class="relative">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          style="width:18px;height:18px">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
        </svg>
        <input
          :value="search"
          type="text"
          placeholder="Search by name..."
          class="w-full pl-10 pr-4 py-2.5 border border-gray-200 bg-gray-50 rounded-xl
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white
                 transition-all text-sm"
          @input="handleSearch"
        />
      </div>
    </div>

    <!-- Category Filter - Shows for both products and supplies -->
    <div class="px-5 py-3 border-b border-gray-100 bg-gray-50/50">
      <div class="flex items-center gap-4 flex-wrap">
        <span class="text-xs font-medium text-gray-500">Filter by category:</span>
        <div class="flex gap-2 flex-wrap">
          <button
            v-for="cat in categoryFilters"
            :key="cat.value"
            @click="setCategoryFilter(cat.value)"
            class="px-3 py-1.5 text-xs font-medium rounded-lg transition-all"
            :class="categoryFilter === cat.value
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
          >
            {{ cat.label }}
            <span v-if="cat.value !== 'all'" class="ml-1 px-1.5 py-0.5 rounded-full text-xs"
              :class="categoryFilter === cat.value ? 'bg-white/20' : 'bg-gray-300'">
              {{ getCategoryCount(cat.value) }}
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- Status Filter - Shows for both products and supplies -->
    <div class="px-5 py-3 border-b border-gray-100 bg-gray-50/50">
      <div class="flex items-center gap-4">
        <span class="text-xs font-medium text-gray-500">Filter by status:</span>
        <div class="flex gap-2">
          <button
            v-for="status in statusFilters"
            :key="status.value"
            @click="setStatusFilter(status.value)"
            class="px-3 py-1.5 text-xs font-medium rounded-lg transition-all"
            :class="statusFilter === status.value
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
          >
            {{ status.label }}
            <span v-if="status.value !== 'all'" class="ml-1 px-1.5 py-0.5 rounded-full text-xs"
              :class="statusFilter === status.value ? 'bg-white/20' : 'bg-gray-300'">
              {{ getStatusCount(status.value) }}
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- Category Tabs -->
    <div class="flex">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="flex-1 px-6 py-3.5 text-sm font-semibold transition-all flex items-center justify-center gap-2"
        :class="activeTab === tab.key
          ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/60'
          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'"
        @click="switchTab(tab.key)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          style="width:16px;height:16px">
          <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/>
          <path d="M12 22V12"/>
          <polyline points="3.29 7 12 12 20.71 7"/>
        </svg>
        {{ tab.label }}
        <span class="px-1.5 py-0.5 text-white text-xs rounded-full font-bold" 
          :class="activeTab === tab.key ? 'bg-blue-600' : 'bg-gray-400'">
          {{ tab.count }}
        </span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const props = defineProps({
  search: { type: String, default: '' },
  activeTab: { type: String, default: 'products' },
  statusFilter: { type: String, default: 'all' },
  categoryFilter: { type: String, default: 'all' },
  itemsCount: { type: Number, default: 0 },
  lowStockCount: { type: Number, default: 0 },
  outOfStockCount: { type: Number, default: 0 },
  inStockCount: { type: Number, default: 0 },
  productsCount: { type: Number, default: 0 },
  productCategories: { type: Array, default: () => [] },
  supplyCategories: { type: Array, default: () => [] },
  categoryCounts: { type: Object, default: () => ({}) }
})

const emit = defineEmits(['update:search', 'update:activeTab', 'update:statusFilter', 'update:categoryFilter'])

const router = useRouter()
const route = useRoute()

// Local reactive state
const activeTab = ref(props.activeTab)
const statusFilter = ref(props.statusFilter)
const categoryFilter = ref(props.categoryFilter)

// Status filter options (for both products and supplies)
const statusFilters = [
  { value: 'all', label: 'All Items' },
  { value: 'in-stock', label: 'In Stock' },
  { value: 'low-stock', label: 'Low Stock' },
  { value: 'out-of-stock', label: 'Out of Stock' }
]

// Category filters based on active tab
const categoryFilters = computed(() => {
  if (activeTab.value === 'products') {
    return [
      { value: 'all', label: 'All Categories' },
      ...props.productCategories.map(cat => ({ value: cat, label: cat }))
    ]
  } else {
    return [
      { value: 'all', label: 'All Categories' },
      ...props.supplyCategories.map(cat => ({ value: cat, label: cat.charAt(0).toUpperCase() + cat.slice(1).replace('_', ' ') }))
    ]
  }
})

// Tabs configuration
const tabs = computed(() => [
  { key: 'products', label: 'Products', count: props.productsCount || 0 },
  { key: 'supplies', label: 'Supplies', count: props.itemsCount || 0 }
])

// Get count for category
function getCategoryCount(category) {
  return props.categoryCounts[category] || 0
}

// Get count for status filter
function getStatusCount(status) {
  if (status === 'in-stock') {
    return props.inStockCount || 0
  }
  if (status === 'low-stock') {
    return props.lowStockCount || 0
  }
  if (status === 'out-of-stock') {
    return props.outOfStockCount || 0
  }
  return 0
}

// Set status filter
function setStatusFilter(value) {
  statusFilter.value = value
  emit('update:statusFilter', value)
  
  // Update URL query
  const query = { ...route.query }
  if (value === 'all') {
    delete query.status
  } else {
    query.status = value
  }
  router.replace({ query })
}

// Set category filter
function setCategoryFilter(value) {
  categoryFilter.value = value
  emit('update:categoryFilter', value)
  
  // Update URL query
  const query = { ...route.query }
  if (value === 'all') {
    delete query.category
  } else {
    query.category = value
  }
  router.replace({ query })
}

// Switch between products and supplies tabs
function switchTab(tabKey) {
  if (tabKey === activeTab.value) return
  
  activeTab.value = tabKey
  emit('update:activeTab', tabKey)
  
  // Update URL query
  const query = { ...route.query, tab: tabKey }
  // Reset filters when switching tabs
  delete query.status
  delete query.category
  statusFilter.value = 'all'
  categoryFilter.value = 'all'
  emit('update:statusFilter', 'all')
  emit('update:categoryFilter', 'all')
  
  router.replace({ query })
}

// Handle search input
function handleSearch(event) {
  const value = event.target.value
  emit('update:search', value)
  
  // Update URL query
  const query = { ...route.query }
  if (value) {
    query.search = value
  } else {
    delete query.search
  }
  router.replace({ query })
}

// Watch for prop changes from parent
watch(() => props.activeTab, (newVal) => {
  if (newVal !== activeTab.value) {
    activeTab.value = newVal
  }
})

watch(() => props.statusFilter, (newVal) => {
  if (newVal !== statusFilter.value) {
    statusFilter.value = newVal
  }
})

watch(() => props.categoryFilter, (newVal) => {
  if (newVal !== categoryFilter.value) {
    categoryFilter.value = newVal
  }
})

// Initialize from URL on mount
onMounted(() => {
  // Handle tab from URL query
  if (route.query.tab === 'supplies') {
    activeTab.value = 'supplies'
    emit('update:activeTab', 'supplies')
  } else if (route.query.tab === 'products') {
    activeTab.value = 'products'
    emit('update:activeTab', 'products')
  }
  
  // Handle status from URL query
  if (route.query.status) {
    const status = route.query.status
    if (['all', 'in-stock', 'low-stock', 'out-of-stock'].includes(status)) {
      statusFilter.value = status
      emit('update:statusFilter', status)
    }
  }
  
  // Handle category from URL query
  if (route.query.category) {
    categoryFilter.value = route.query.category
    emit('update:categoryFilter', route.query.category)
  }
  
  // Handle search from URL query
  if (route.query.search) {
    emit('update:search', route.query.search)
  }
})

// Watch for route changes
watch(() => route.query.tab, (newTab) => {
  if (newTab === 'supplies' && activeTab.value !== 'supplies') {
    activeTab.value = 'supplies'
    emit('update:activeTab', 'supplies')
  } else if (newTab === 'products' && activeTab.value !== 'products') {
    activeTab.value = 'products'
    emit('update:activeTab', 'products')
  }
})

watch(() => route.query.status, (newStatus) => {
  if (newStatus && ['all', 'in-stock', 'low-stock', 'out-of-stock'].includes(newStatus)) {
    statusFilter.value = newStatus
    emit('update:statusFilter', newStatus)
  } else if (!newStatus) {
    statusFilter.value = 'all'
    emit('update:statusFilter', 'all')
  }
})

watch(() => route.query.category, (newCategory) => {
  if (newCategory) {
    categoryFilter.value = newCategory
    emit('update:categoryFilter', newCategory)
  } else if (newCategory === undefined) {
    categoryFilter.value = 'all'
    emit('update:categoryFilter', 'all')
  }
})

watch(() => route.query.search, (newSearch) => {
  if (newSearch !== undefined) {
    emit('update:search', newSearch)
  }
})
</script>

<style scoped>
button:active {
  transform: scale(0.98);
}

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}
</style>