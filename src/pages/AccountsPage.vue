<template>
  <div class="p-8">
    <div class="mb-8 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-black text-gray-900">Account Management</h1>
        <p class="text-sm text-gray-500 mt-1">Manage customers, admin accounts, and drivers</p>
      </div>
      <button
        v-if="activeTab !== 'customers'"
        :disabled="activeTab === 'customers'"
        @click="openAddModal"
        class="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors shadow-sm bg-blue-600 hover:bg-blue-700 text-white"
      >
        <Plus class="w-4 h-4" />
        Add New {{ activeTab === 'drivers' ? 'Driver' : activeTab === 'sales' ? ' Staff' : activeTab === 'production' ? ' Staff' : 'Admin' }}
      </button>
    </div>

    <AccountsSearch 
      v-model:search="searchQuery" 
      v-model:activeTab="activeTab"
      :customers-count="customers.length"
      :sales-count="salesAdmins.length"
      :production-count="productionAdmins.length"
      :super-admin-count="superAdmins.length"
      :drivers-count="drivers.length"
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
      v-if="selectedAccount && activeTab !== 'drivers'"
      :show="true"
      :account="selectedAccount"
      :account-type="activeTab"
      @close="closeDetailModal"
      @edit="openEditModal"
    />

    <!-- Driver Detail Modal -->
    <DriverDetailModal
      v-if="selectedAccount && activeTab === 'drivers'"
      :show="true"
      :driver="selectedAccount"
      @close="closeDetailModal"
      @edit="openEditModal"
    />

    <!-- Edit Account Modal -->
    <EditAccountModal
      v-if="editAccount && activeTab !== 'drivers'"
      :show="true"
      :account="editAccount"
      :account-type="activeTab === 'customers' ? 'customer' : activeTab"
      @close="closeEditModal"
      @update="handleUpdateAccount"
    />

    <!-- Edit Driver Modal -->
    <EditDriverModal
      v-if="editAccount && activeTab === 'drivers'"
      :show="true"
      :driver="editAccount"
      @close="closeEditModal"
      @submit="handleUpdateDriver"
    />

    <!-- Add User Modal -->
    <AddUserModal
      v-if="showAddModal && activeTab !== 'drivers'"
      :show="true"
      :user-type="activeTab === 'customers' ? 'customer' : 'admin'"
      @close="closeAddModal"
      @submit="handleAddUser"
    />

    <!-- Add Driver Modal -->
    <AddDriverModal
      v-if="showAddModal && activeTab === 'drivers'"
      :show="true"
      @close="closeAddModal"
      @submit="handleAddDriver"
    />

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="inline-block w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
      <span class="ml-3 text-gray-500">Loading accounts...</span>
    </div>
  </div>

  <ConfirmModal
    :show="confirmModal.show"
    :type="confirmModal.type"
    :title="confirmModal.title"
    :message="confirmModal.message"
    :confirm-text="'Delete'"
    :cancel-text="'Cancel'"
    @confirm="confirmModal.onConfirm && confirmModal.onConfirm()"
    @cancel="confirmModal.show = false"
  />

  <Transition name="toast">
    <div
      v-if="toast.show"
      class="fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-semibold max-w-sm"
      :class="toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'"
    >
      <CheckCircle v-if="toast.type === 'success'" class="w-4 h-4" />
      <XCircle v-else class="w-4 h-4" />
      {{ toast.message }}
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Plus, CheckCircle, XCircle } from 'lucide-vue-next'
import AccountsSearch from '@/components/accounts/AccountsSearch.vue'
import AccountsTable from '@/components/accounts/AccountsTable.vue'
import AccountDetailModal from '@/modals/AccountDetailModal.vue'
import EditAccountModal from '@/modals/EditAccountModal.vue'
import AddUserModal from '@/modals/AddUserModal.vue'
import AddDriverModal from '@/modals/DriverModals/AddDriverModal.vue'
import EditDriverModal from '@/modals/DriverModals/EditDriverModal.vue'
import DriverDetailModal from '@/modals/DriverModals/DriverDetailModal.vue'
import ConfirmModal from '@/modals/ConfirmModal.vue'
import { adminCustomerApi, adminManagementApi, adminDriverApi } from '@/api/api'

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
const superAdmins = ref([])
const drivers = ref([])

const toast = ref({ show: false, type: 'success', message: '' })
const confirmModal = ref({ show: false, type: 'danger', title: '', message: '', onConfirm: null })

let toastTimer = null

function showToast(type, message) {
  clearTimeout(toastTimer)
  toast.value = { show: true, type, message }
  toastTimer = setTimeout(() => { toast.value.show = false }, 3500)
}

// Initialize from URL on mount
if (route.query.tab === 'sales') {
  activeTab.value = 'sales'
} else if (route.query.tab === 'production') {
  activeTab.value = 'production'
} else if (route.query.tab === 'drivers') {
  activeTab.value = 'drivers'
} else if (route.query.tab === 'superadmin') {
  activeTab.value = 'superadmin'
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
    } else if (activeTab.value === 'sales' || activeTab.value === 'production' || activeTab.value === 'superadmin') {
      const response = await adminManagementApi.getAllAdmins()
      if (response.success && response.data) {
        const roleMap = {
          'sales': 'Sales',
          'production': 'Production',
          'superadmin': 'Super Admin'
        }
        const role = roleMap[activeTab.value]
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
          department: admin.role === 'Sales' ? 'Sales Department' : admin.role === 'Production' ? 'Production Department' : 'Super Admin',
          lastLogin: admin.lastLogin ? new Date(admin.lastLogin).toLocaleDateString() : 'N/A',
          createdAt: admin.createdAt
        }))
        
        if (activeTab.value === 'sales') {
          salesAdmins.value = adminList
        } else if (activeTab.value === 'production') {
          productionAdmins.value = adminList
        } else if (activeTab.value === 'superadmin') {
          superAdmins.value = adminList
        }
      }
    } else if (activeTab.value === 'drivers') {
      const response = await adminDriverApi.getAllDrivers()
      if (response.success && response.data) {
        drivers.value = response.data.map(driver => ({
          id: driver._id,
          driverId: driver.driverId,
          firstName: driver.firstName,
          middleName: driver.middleName || '',
          lastName: driver.lastName,
          name: `${driver.firstName || ''} ${driver.lastName || ''}`.trim(),
          email: driver.email,
          phoneNumber: driver.phoneNumber,
          username: driver.username,
          plateNumber: driver.plateNumber,
          vehicleDescription: driver.vehicleDescription || '',
          available: driver.available,
          status: driver.available ? 'Available' : 'Unavailable',
          assignedOrders: driver.assignedOrdersCount || 0,
          lastLogin: driver.lastLogin ? new Date(driver.lastLogin).toLocaleDateString() : 'N/A',
          createdAt: driver.createdAt
        }))
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
    case 'superadmin':
      return superAdmins.value
    case 'drivers':
      return drivers.value
    default:
      return []
  }
})

// Filter accounts based on search query
const filteredAccounts = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  if (!q) return accountsByTab.value
  
  return accountsByTab.value.filter(account => {
    const name = account.name || account.firstName || ''
    const email = account.email || ''
    const id = account.userId || account.driverId || ''
    return name.toLowerCase().includes(q) ||
           email.toLowerCase().includes(q) ||
           id.toLowerCase().includes(q)
  })
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
        showToast('success', `Customer "${userData.firstName} ${userData.lastName}" has been created successfully!`)
        closeAddModal()
      } else {
        showToast('error', response.message || 'Failed to create customer')
      }
    } else {
      const response = await adminManagementApi.createAdmin({
        firstName: userData.firstName,
        middleName: userData.middleName || '',
        lastName: userData.lastName,
        username: userData.username,
        email: userData.email,
        password: userData.password,
        phone: userData.phone || '',
        role: activeTab.value === 'sales' ? 'Sales' : activeTab.value === 'production' ? 'Production' : 'Super Admin'
      })
      
      if (response.success) {
        await loadData()
        showToast('success', `Admin "${userData.firstName} ${userData.lastName}" has been created successfully!`)
        closeAddModal()
      } else {
        showToast('error', response.message || 'Failed to create admin')
      }
    }
  } catch (error) {
    console.error('Error creating user:', error)
    showToast('error', 'Failed to create user. Please try again.')
  } finally {
    loading.value = false
  }
}

async function handleAddDriver(driverData) {
  loading.value = true
  try {
    const response = await adminDriverApi.createDriver(driverData)
    
    if (response.success) {
      await loadData()
      showToast('success', `Driver "${driverData.firstName} ${driverData.lastName}" has been created successfully!`)
      closeAddModal()
    } else {
      showToast('error', response.message || 'Failed to create driver')
    }
  } catch (error) {
    console.error('Error creating driver:', error)
    showToast('error', 'Failed to create driver. Please try again.')
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
        showToast('success', `Customer "${updatedAccount.name}" has been updated successfully!`)
        closeEditModal()
      } else {
        showToast('error', response.message || 'Failed to update customer')
      }
    } else {
      const response = await adminManagementApi.updateAdmin(updatedAccount.userId, {
        firstName: updatedAccount.firstName,
        lastName: updatedAccount.lastName,
        phone: updatedAccount.phone,
        role: activeTab.value === 'sales' ? 'Sales' : activeTab.value === 'production' ? 'Production' : 'Super Admin'
      })
      
      if (response.success) {
        await loadData()
        showToast('success', `Admin "${updatedAccount.name}" has been updated successfully!`)
        closeEditModal()
      } else {
        showToast('error', response.message || 'Failed to update admin')
      }
    }
  } catch (error) {
    console.error('Error updating account:', error)
    showToast('error', 'Failed to update account. Please try again.')
  } finally {
    loading.value = false
  }
}

async function handleUpdateDriver(driverData) {
  loading.value = true
  try {
    const response = await adminDriverApi.updateDriver(editAccount.value.driverId, driverData)
    
    if (response.success) {
      await loadData()
      showToast('success', `Driver "${driverData.firstName} ${driverData.lastName}" has been updated successfully!`)
      closeEditModal()
    } else {
      showToast('error', response.message || 'Failed to update driver')
    }
  } catch (error) {
    console.error('Error updating driver:', error)
    showToast('error', 'Failed to update driver. Please try again.')
  } finally {
    loading.value = false
  }
}

async function handleDelete(account) {
  confirmModal.value = {
    show: true,
    type: 'danger',
    title: 'Delete Account',
    message: `Are you sure you want to delete ${account.name || account.firstName}? This action cannot be undone.`,
    onConfirm: () => confirmDelete(account)
  }
}

async function confirmDelete(account) {
  confirmModal.value.show = false
  loading.value = true
  try {
    if (activeTab.value === 'customers') {
      const response = await adminCustomerApi.deleteCustomer(account.userId)
      if (response.success) {
        await loadData()
        showToast('success', `Customer "${account.name}" has been deleted successfully!`)
      } else {
        showToast('error', response.message || 'Failed to delete customer')
      }
    } else if (activeTab.value === 'drivers') {
      const response = await adminDriverApi.deleteDriver(account.driverId)
      if (response.success) {
        await loadData()
        showToast('success', `Driver "${account.firstName} ${account.lastName}" has been deleted successfully!`)
      } else {
        showToast('error', response.message || 'Failed to delete driver')
      }
    } else {
      const response = await adminManagementApi.deleteAdmin(account.userId)
      if (response.success) {
        await loadData()
        showToast('success', `Admin "${account.name}" has been deleted successfully!`)
      } else {
        showToast('error', response.message || 'Failed to delete admin')
      }
    }
  } catch (error) {
    console.error('Error deleting account:', error)
    showToast('error', 'Failed to delete account. Please try again.')
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

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}
</style>