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
          placeholder="Search by name, email, or ID..."
          class="w-full pl-10 pr-4 py-2.5 border border-gray-200 bg-gray-50 rounded-xl
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white
                 transition-all text-sm"
          @input="$emit('update:search', $event.target.value)"
        />
      </div>
    </div>

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
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        {{ tab.label }}
        <span 
          class="px-1.5 py-0.5 text-white text-xs rounded-full font-bold"
          :class="tab.count > 0 ? 'bg-red-500' : 'bg-gray-400'"
        >
          {{ tab.count }}
        </span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { accountsData } from '@/data/accountsData'

const props = defineProps({
  search: { type: String, default: '' },
  activeTab: { type: String, default: 'customers' }
})

const emit = defineEmits(['update:search', 'update:activeTab'])

const router = useRouter()
const route = useRoute()

const tabs = computed(() => [
  { 
    key: 'customers', 
    label: 'Customers', 
    count: accountsData.customers.length,
    disabled: false
  },
  { 
    key: 'sales', 
    label: 'Sales Admin', 
    count: accountsData.salesAdmins.length,
    disabled: false
  },
  { 
    key: 'production', 
    label: 'Production Admin', 
    count: accountsData.productionAdmins.length,
    disabled: false
  },
])

function switchTab(tabKey) {
  if (tabKey === props.activeTab) return
  emit('update:activeTab', tabKey)
  
  // Update URL without reloading the page
  router.replace({
    query: { ...route.query, tab: tabKey }
  })
}
</script>