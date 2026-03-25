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
          placeholder="Search by product name, size, or SKU..."
          class="w-full pl-10 pr-4 py-2.5 border border-gray-200 bg-gray-50 rounded-xl
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white
                 transition-all text-sm"
          @input="handleSearch"
        />
      </div>
    </div>

    <!-- Status Filter -->
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
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
          >
            {{ status.label }}
            <span v-if="status.value !== 'all'" class="ml-1 px-1.5 py-0.5 rounded-full text-xs"
              :class="statusFilter === status.value ? 'bg-white/20' : 'bg-gray-200'">
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
        :disabled="tab.disabled"
        class="flex-1 px-6 py-3.5 text-sm font-semibold transition-all flex items-center justify-center gap-2"
        :class="[
          activeTab === tab.key && !tab.disabled
            ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/60'
            : tab.disabled
              ? 'text-gray-400 cursor-not-allowed bg-gray-50'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50',
          tab.disabled && activeTab === tab.key ? 'border-b-2 border-gray-300' : ''
        ]"
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
        <span 
          class="px-1.5 py-0.5 text-white text-xs rounded-full font-bold"
          :class="tab.disabled ? 'bg-gray-400' : 'bg-red-500'"
        >
          {{ tab.lowStockCount }}
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
  statusFilter: { type: String, default: 'all' }
})

const emit = defineEmits(['update:search', 'update:activeTab', 'update:statusFilter'])

const router = useRouter()
const route = useRoute()
const activeTab = ref('cups')
const statusFilter = ref(props.statusFilter)

// Get user role from localStorage
const userRole = computed(() => localStorage.getItem('userRole') || 'production')

const statusFilters = [
  { value: 'all', label: 'All Items' },
  { value: 'in-stock', label: 'In Stock' },
  { value: 'low-stock', label: 'Low Stock' }
]

const tabs = computed(() => [
  { 
    key: 'cups', 
    label: 'Cups (30)', 
    lowStockCount: 4,
    disabled: false
  },
  { 
    key: 'supplies', 
    label: 'Supplies (17)', 
    lowStockCount: 7,
    disabled: userRole.value === 'sales'
  },
])

function getStatusCount(status) {
  // This will be passed from parent or calculated
  return 0
}

function setStatusFilter(value) {
  statusFilter.value = value
  emit('update:statusFilter', value)
  
  // Update URL
  router.replace({
    query: { ...route.query, status: value === 'all' ? undefined : value }
  })
}

// Initialize from URL on mount
onMounted(() => {
  if (route.query.tab && route.query.tab === 'supplies' && !tabs.value[1].disabled) {
    activeTab.value = 'supplies'
    emit('update:activeTab', 'supplies')
  } else if (route.query.tab === 'cups') {
    activeTab.value = 'cups'
    emit('update:activeTab', 'cups')
  }
  
  if (route.query.status) {
    statusFilter.value = route.query.status
    emit('update:statusFilter', route.query.status)
  }
})

// Watch for route changes
watch(() => route.query.tab, (newTab) => {
  if (newTab === 'supplies' && !tabs.value[1].disabled) {
    activeTab.value = 'supplies'
    emit('update:activeTab', 'supplies')
  } else if (newTab === 'cups') {
    activeTab.value = 'cups'
    emit('update:activeTab', 'cups')
  }
})

watch(() => route.query.status, (newStatus) => {
  if (newStatus) {
    statusFilter.value = newStatus
    emit('update:statusFilter', newStatus)
  } else {
    statusFilter.value = 'all'
    emit('update:statusFilter', 'all')
  }
})

function switchTab(tabKey) {
  if (tabKey === activeTab.value) return
  activeTab.value = tabKey
  emit('update:activeTab', tabKey)
  
  // Update URL without reloading the page
  router.replace({
    query: { ...route.query, tab: tabKey }
  })
}

function handleSearch(event) {
  const value = event.target.value
  emit('update:search', value)
  
  // Update URL query parameter without reloading the page
  const query = { ...route.query, search: value || undefined }
  if (!value) delete query.search
  router.replace({ query })
}
</script>