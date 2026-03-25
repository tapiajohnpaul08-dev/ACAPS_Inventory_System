<template>
  <div class="p-8">
    <div class="mb-8">
      <h1 class="text-2xl font-black text-gray-900">Account Management</h1>
      <p class="text-sm text-gray-500 mt-1">Manage customers and admin accounts</p>
    </div>

    <AccountsSearch 
      v-model:search="searchQuery" 
      v-model:activeTab="activeTab"
    />
    
    <AccountsTable 
      :accounts="filteredAccounts" 
      :type="activeTab"
      @select="handleSelect"
      @edit="handleEdit"
    />

    <!-- View Details Modal -->
    <AccountDetailModal
      v-if="selectedAccount"
      :show="true"
      :account="selectedAccount"
      @close="closeDetailModal"
      @edit="openEditModal"
    />

    <!-- Edit Account Modal -->
    <EditAccountModal
      v-if="editAccount"
      :show="true"
      :account="editAccount"
      :account-type="activeTab === 'customers' ? 'customer' : (activeTab === 'sales' ? 'sales' : 'production')"
      @close="closeEditModal"
      @update="handleUpdateAccount"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import AccountsSearch from '@/components/accounts/AccountsSearch.vue'
import AccountsTable from '@/components/accounts/AccountsTable.vue'
import AccountDetailModal from '@/modals/AccountDetailModal.vue'
import EditAccountModal from '@/modals/EditAccountModal.vue'
import { accountsData } from '@/data/accountsData'

const route = useRoute()
const searchQuery = ref('')
const activeTab = ref('customers')
const selectedAccount = ref(null)
const editAccount = ref(null)

// Initialize from URL on mount
if (route.query.tab === 'sales') {
  activeTab.value = 'sales'
} else if (route.query.tab === 'production') {
  activeTab.value = 'production'
}

// Get accounts based on active tab - using reactive refs
const customers = ref([...accountsData.customers])
const salesAdmins = ref([...accountsData.salesAdmins])
const productionAdmins = ref([...accountsData.productionAdmins])

// Get accounts based on active tab
const accountsByTab = computed(() => {
  switch(activeTab.value) {
    case 'customers':
      return customers.value
    case 'sales':
      return salesAdmins.value
    case 'production':
      return productionAdmins.value
    default:
      return []
  }
})

// Filter accounts based on search query
const filteredAccounts = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  if (!q) return accountsByTab.value
  
  return accountsByTab.value.filter(account =>
    account.name.toLowerCase().includes(q) ||
    account.email.toLowerCase().includes(q) ||
    account.userId.toLowerCase().includes(q)
  )
})

function handleSelect(account) {
  selectedAccount.value = account
}

function handleEdit(account) {
  editAccount.value = account
}

function openEditModal(account) {
  editAccount.value = account
  selectedAccount.value = null
}

function closeDetailModal() {
  selectedAccount.value = null
}

function closeEditModal() {
  editAccount.value = null
}

function handleUpdateAccount(updatedAccount) {
  // Update the appropriate array based on account type
  if (updatedAccount.type === 'customer') {
    const index = customers.value.findIndex(a => a.id === updatedAccount.id)
    if (index !== -1) {
      customers.value[index] = { ...customers.value[index], ...updatedAccount }
    }
  } else if (updatedAccount.type === 'sales-admin') {
    const index = salesAdmins.value.findIndex(a => a.id === updatedAccount.id)
    if (index !== -1) {
      salesAdmins.value[index] = { ...salesAdmins.value[index], ...updatedAccount }
    }
  } else if (updatedAccount.type === 'production-admin') {
    const index = productionAdmins.value.findIndex(a => a.id === updatedAccount.id)
    if (index !== -1) {
      productionAdmins.value[index] = { ...productionAdmins.value[index], ...updatedAccount }
    }
  }
  
  // Show success message
  alert(`Account "${updatedAccount.name}" has been updated successfully!`)
  
  // Close edit modal
  closeEditModal()
}
</script>