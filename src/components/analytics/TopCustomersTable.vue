<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
    <div class="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87" />
              <path d="M16 3.13a4 4 0 010 7.75" />
            </svg>
            Top Customers
          </h2>
          <p class="text-xs text-gray-400 mt-0.5">By total spend</p>
        </div>
        <span class="px-2.5 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
          Top {{ customers.length }}
        </span>
      </div>
    </div>

    <div v-if="!customers.length" class="text-center py-16 text-gray-400 flex-1">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
      <p class="text-sm">No customer data available</p>
    </div>

    <div v-else class="divide-y divide-gray-100 flex-1 overflow-y-auto">
      <div 
        v-for="(customer, index) in customers" 
        :key="customer._id"
        class="flex items-center justify-between p-4 hover:bg-gray-50 transition-all duration-200 cursor-pointer group"
        @click="handleCustomerClick(customer)"
      >
        <div class="flex items-center gap-4 flex-1">
          <!-- Rank Badge -->
          <div class="flex-shrink-0 w-10">
            <div 
              class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all group-hover:scale-110"
              :class="getRankClass(index)"
            >
              {{ index + 1 }}
            </div>
          </div>
          
          <!-- Customer Info -->
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-gray-800 group-hover:text-purple-600 transition-colors truncate">
              {{ customer.name || 'Guest' }}
            </p>
            <p class="text-xs text-gray-400 truncate">{{ customer._id }}</p>
          </div>
        </div>
        
        <!-- Stats -->
        <div class="flex items-center gap-6">
          <div class="text-right">
            <p class="text-sm font-bold text-gray-700">{{ customer.totalOrders.toLocaleString() }}</p>
            <p class="text-xs text-gray-400">orders</p>
          </div>
          <div class="text-right min-w-[100px]">
            <p class="text-base font-bold text-purple-600">₱{{ customer.totalSpent.toLocaleString() }}</p>
            <p class="text-xs text-gray-400">₱{{ Math.round(customer.totalSpent / customer.totalOrders).toLocaleString() }}/order</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Total row - fixed at bottom -->
    <div class="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white border-t border-gray-100 mt-auto">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p class="text-sm font-semibold text-gray-800">Total Spent</p>
        </div>
      </div>
      <div class="text-right">
        <p class="text-xl font-bold text-purple-600">₱{{ totalSpent.toLocaleString() }}</p>
        <p class="text-xs text-gray-400">across all customers</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ 
  customers: { type: Array, required: true } 
})

const totalSpent = computed(() => {
  return props.customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0)
})

function getRankClass(index) {
  if (index === 0) return 'bg-yellow-100 text-yellow-700 ring-2 ring-yellow-200'
  if (index === 1) return 'bg-gray-100 text-gray-600'
  if (index === 2) return 'bg-orange-100 text-orange-700'
  return 'bg-gray-50 text-gray-400'
}

function handleCustomerClick(customer) {
  // Detail drill-down: handled by parent or future modal
  console.log('Customer clicked:', customer)
}
</script>