<template>
  <div class="p-8">
    <div class="mb-8 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-black text-gray-900">Account Management</h1>
        <p class="text-sm text-gray-500 mt-1">Manage customers and admin accounts</p>
      </div>
      <button
        @click="openAddModal"
        class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 5v14M5 12h14"/>
        </svg>
        Add New User
      </button>
    </div>

    <AccountsSearch 
      v-model:search="searchQuery" 
      v-model:activeTab="activeTab"
      :customers-count="customers.length"
      :sales-count="salesAdmins.length"
      :production-count="productionAdmins.length"
    />
    
    <AccountsTable 
      :accounts="filteredAccounts" 
      :type="activeTab"
      @select="handleSelect"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <!-- View Details Modal -->
    <AccountDetailModal
      v-if="selectedAccount"
      :show="true"
      :account="selectedAccount"
      :account-type="activeTab"
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

    <!-- Add User Modal -->
    <AddUserModal
      v-if="showAddModal"
      :show="true"
      :user-type="activeTab === 'customers' ? 'customer' : 'admin'"
      @close="closeAddModal"
      @submit="handleAddUser"
    />

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="inline-block w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
      <span class="ml-3 text-gray-500">Loading accounts...</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import AccountsSearch from '@/components/accounts/AccountsSearch.vue'
import AccountsTable from '@/components/accounts/AccountsTable.vue'
import AccountDetailModal from '@/modals/AccountDetailModal.vue'
import EditAccountModal from '@/modals/EditAccountModal.vue'
import AddUserModal from '@/modals/AddUserModal.vue'
import { adminCustomerApi, adminManagementApi } from '@/api/api'

const route = useRoute()
const searchQuery = ref('')
const activeTab = ref('customers')
const selectedAccount = ref(null)
const editAccount = ref(null)
const showAddModal = ref(false)
const loading = ref(false)

// Data from backend
const customers = ref([])
const salesAdmins = ref([])
const productionAdmins = ref([])

// Initialize from URL on mount
if (route.query.tab === 'sales') {
  activeTab.value = 'sales'
} else if (route.query.tab === 'production') {
  activeTab.value = 'production'
}

// Load data based on active tab
const loadData = async () => {
  loading.value = true
  try {
    if (activeTab.value === 'customers') {
      const response = await adminCustomerApi.getAllCustomers()
      if (response.success && response.data) {
        customers.value = response.data.map(customer => ({
          id: customer._id,
          userId: customer.customerId,
          name: `${customer.firstName || ''} ${customer.lastName || ''}`.trim(),
          firstName: customer.firstName,
          lastName: customer.lastName,
          middleName: customer.middleName || '',
          email: customer.email,
          phone: customer.phone || 'N/A',
          status: 'Active',
          ordersCount: customer.orders?.length || 0,
          totalSpent: '₱0',
          lastActive: customer.lastLogin ? new Date(customer.lastLogin).toLocaleDateString() : 'N/A',
          provider: customer.provider || 'local',
          createdAt: customer.createdAt
        }))
      }
    } else if (activeTab.value === 'sales' || activeTab.value === 'production') {
      const response = await adminManagementApi.getAllAdmins()
      if (response.success && response.data) {
        const role = activeTab.value === 'sales' ? 'Sales' : 'Production'
        const filteredAdmins = response.data.filter(admin => admin.role === role)
        
        const adminList = filteredAdmins.map(admin => ({
          id: admin._id,
          userId: admin.adminId,
          name: `${admin.firstName || ''} ${admin.lastName || ''}`.trim(),
          firstName: admin.firstName,
          lastName: admin.lastName,
          email: admin.email,
          phone: admin.phone || 'N/A',
          status: 'Active',
          role: admin.role,
          department: admin.role === 'Sales' ? 'Sales Department' : 'Production Department',
          lastLogin: admin.lastLogin ? new Date(admin.lastLogin).toLocaleDateString() : 'N/A',
          createdAt: admin.createdAt
        }))
        
        if (activeTab.value === 'sales') {
          salesAdmins.value = adminList
        } else {
          productionAdmins.value = adminList
        }
      }
    }
  } catch (error) {
    console.error('Error loading accounts:', error)
  } finally {
    loading.value = false
  }
}

// Watch for tab changes
watch(activeTab, () => {
  loadData()
}, { immediate: true })

onMounted(() => {
  loadData()
})

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

function openAddModal() {
  showAddModal.value = true
}

function closeAddModal() {
  showAddModal.value = false
}

async function handleAddUser(userData) {
  loading.value = true
  try {
    if (activeTab.value === 'customers') {
      // Register as customer
      const response = await adminCustomerApi.createCustomer({
        firstName: userData.firstName,
        middleName: userData.middleName || '',
        lastName: userData.lastName,
        username: userData.username,
        email: userData.email,
        password: userData.password,
        phone: userData.phone || '',
        companyName: userData.companyName || null
      })
      
      if (response.success) {
        await loadData()
        alert(`Customer "${userData.firstName} ${userData.lastName}" has been created successfully!`)
        closeAddModal()
      } else {
        alert(response.message || 'Failed to create customer')
      }
    } else {
      // Create admin
      const response = await adminManagementApi.createAdmin({
        firstName: userData.firstName,
        middleName: userData.middleName || '',
        lastName: userData.lastName,
        username: userData.username,
        email: userData.email,
        password: userData.password,
        phone: userData.phone || '',
        role: activeTab.value === 'sales' ? 'Sales' : 'Production'
      })
      
      if (response.success) {
        await loadData()
        alert(`Admin "${userData.firstName} ${userData.lastName}" has been created successfully!`)
        closeAddModal()
      } else {
        alert(response.message || 'Failed to create admin')
      }
    }
  } catch (error) {
    console.error('Error creating user:', error)
    alert('Failed to create user. Please try again.')
  } finally {
    loading.value = false
  }
}

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

async function handleUpdateAccount(updatedAccount) {
  loading.value = true
  try {
    if (activeTab.value === 'customers') {
      const response = await adminCustomerApi.updateCustomer(updatedAccount.userId, {
        firstName: updatedAccount.firstName,
        middleName: updatedAccount.middleName || '',
        lastName: updatedAccount.lastName,
        phone: updatedAccount.phone
      })
      
      if (response.success) {
        await loadData()
        alert(`Customer "${updatedAccount.name}" has been updated successfully!`)
        closeEditModal()
      } else {
        alert(response.message || 'Failed to update customer')
      }
    } else {
      const response = await adminManagementApi.updateAdmin(updatedAccount.userId, {
        firstName: updatedAccount.firstName,
        lastName: updatedAccount.lastName,
        phone: updatedAccount.phone,
        role: activeTab.value === 'sales' ? 'Sales' : 'Production'
      })
      
      if (response.success) {
        await loadData()
        alert(`Admin "${updatedAccount.name}" has been updated successfully!`)
        closeEditModal()
      } else {
        alert(response.message || 'Failed to update admin')
      }
    }
  } catch (error) {
    console.error('Error updating account:', error)
    alert('Failed to update account. Please try again.')
  } finally {
    loading.value = false
  }
}

async function handleDelete(account) {
  if (!confirm(`Are you sure you want to delete ${account.name}? This action cannot be undone.`)) {
    return
  }
  
  loading.value = true
  try {
    if (activeTab.value === 'customers') {
      const response = await adminCustomerApi.deleteCustomer(account.userId)
      if (response.success) {
        await loadData()
        alert(`Customer "${account.name}" has been deleted successfully!`)
      } else {
        alert(response.message || 'Failed to delete customer')
      }
    } else {
      const response = await adminManagementApi.deleteAdmin(account.userId)
      if (response.success) {
        await loadData()
        alert(`Admin "${account.name}" has been deleted successfully!`)
      } else {
        alert(response.message || 'Failed to delete admin')
      }
    }
  } catch (error) {
    console.error('Error deleting account:', error)
    alert('Failed to delete account. Please try again.')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@keyframes spin {
  to { transform: rotate(360deg); }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
</style>