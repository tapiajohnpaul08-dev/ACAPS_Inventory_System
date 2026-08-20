<template>
  <div class="p-8">
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-black text-gray-900">Feedback</h1>
        <p class="text-sm text-gray-500 mt-1">Manage and respond to customer reviews</p>
      </div>
      <button
        @click="refreshData"
        :disabled="isLoading"
        class="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-all shadow-sm"
      >
        <RefreshCw class="w-4 h-4" :class="{ 'animate-spin': isLoading }" />
        Refresh
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading && feedbacks.length === 0" class="flex flex-col items-center justify-center py-20 gap-3">
      <div class="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p class="text-gray-400 text-sm">Loading feedback...</p>
    </div>

    <template v-else>
      <!-- Stat Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 font-medium">Total Reviews</p>
              <p class="text-2xl font-black text-gray-900 mt-1">{{ stats.totalReviews }}</p>
            </div>
            <div class="w-11 h-11 bg-blue-100 rounded-xl flex items-center justify-center">
              <MessageSquare class="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 font-medium">Pending Review</p>
              <p class="text-2xl font-black text-yellow-600 mt-1">{{ stats.pending }}</p>
            </div>
            <div class="w-11 h-11 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Clock class="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 font-medium">Approved</p>
              <p class="text-2xl font-black text-green-600 mt-1">{{ stats.approved }}</p>
            </div>
            <div class="w-11 h-11 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle class="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 font-medium">Average Rating</p>
              <p class="text-2xl font-black text-purple-600 mt-1">{{ stats.averageRating.toFixed(1) }}</p>
            </div>
            <div class="w-11 h-11 bg-purple-100 rounded-xl flex items-center justify-center">
              <Star class="w-5 h-5 text-purple-600 fill-purple-400" />
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-6">
        <div class="flex flex-wrap items-center gap-4">
          <div class="flex-1 min-w-[180px]">
            <label class="text-xs font-medium text-gray-500 block mb-1">Search</label>
            <div class="relative">
              <Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                v-model="filters.search"
                @input="applyFilters"
                type="text"
                placeholder="Search by customer or comment..."
                class="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>
          </div>

          <div>
            <label class="text-xs font-medium text-gray-500 block mb-1">Status</label>
            <select
              v-model="filters.status"
              @change="applyFilters"
              class="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[140px]"
            >
              <option value="">All Status</option>
              <option value="pending">Pending Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="featured">Featured</option>
            </select>
          </div>

          <div>
            <label class="text-xs font-medium text-gray-500 block mb-1">Rating</label>
            <select
              v-model="filters.rating"
              @change="applyFilters"
              class="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[100px]"
            >
              <option value="">All</option>
              <option v-for="r in 5" :key="r" :value="r">{{ r }} ★</option>
            </select>
          </div>

          <div class="flex items-end gap-2">
            <button
              @click="clearFilters"
              class="px-4 py-1.5 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      <!-- Feedback Table -->
      <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div v-if="feedbacks.length === 0" class="flex flex-col items-center justify-center py-20 gap-3">
          <MessageSquare class="w-12 h-12 text-gray-300" />
          <p class="text-gray-500 font-medium">No feedback found</p>
          <p class="text-sm text-gray-400">Try adjusting your filters</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-200">
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Rating</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Feedback</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr
                v-for="feedback in feedbacks"
                :key="feedback.feedbackId || feedback._id"
                class="hover:bg-gray-50 transition-colors"
                :class="{ 'bg-yellow-50/50': feedback.status === 'pending' }"
              >
                <!-- Customer -->
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-xs">
                      {{ (feedback.customerName || 'U').charAt(0).toUpperCase() }}
                    </div>
                    <div>
                      <p class="font-medium text-gray-900 text-sm">{{ feedback.customerName || 'Anonymous' }}</p>
                      <p class="text-xs text-gray-400">{{ feedback.customerEmail }}</p>
                    </div>
                  </div>
                </td>

                <!-- Rating -->
                <td class="px-4 py-3">
                  <div class="flex items-center gap-1">
                    <div class="flex gap-0.5">
                      <Star
                        v-for="star in 5"
                        :key="star"
                        class="w-3.5 h-3.5"
                        :class="star <= feedback.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'"
                      />
                    </div>
                    <span class="text-xs text-gray-500 ml-1">{{ feedback.rating }}</span>
                  </div>
                </td>

                <!-- Feedback -->
                <td class="px-4 py-3 max-w-[250px]">
                  <p v-if="feedback.title" class="font-medium text-gray-800 text-sm">{{ feedback.title }}</p>
                  <p class="text-gray-600 text-sm truncate">{{ feedback.comment }}</p>
                  <div v-if="feedback.pros?.length || feedback.cons?.length" class="flex gap-2 mt-1">
                    <span v-if="feedback.pros?.length" class="text-xs text-green-600 flex items-center gap-0.5">
                      <ThumbsUp class="w-3 h-3" /> {{ feedback.pros.length }}
                    </span>
                    <span v-if="feedback.cons?.length" class="text-xs text-red-600 flex items-center gap-0.5">
                      <ThumbsDown class="w-3 h-3" /> {{ feedback.cons.length }}
                    </span>
                  </div>
                </td>

                <!-- Product -->
                <td class="px-4 py-3">
                  <span class="text-sm text-gray-600">{{ feedback.productName || 'N/A' }}</span>
                </td>

                <!-- Status -->
                <td class="px-4 py-3">
                  <span
                    class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                    :class="getStatusBadgeClass(feedback.status)"
                  >
                    <component :is="getStatusIcon(feedback.status)" class="w-3 h-3" />
                    {{ getStatusLabel(feedback.status) }}
                  </span>
                </td>

                <!-- Date -->
                <td class="px-4 py-3">
                  <span class="text-sm text-gray-500">{{ formatDate(feedback.submittedAt || feedback.createdAt) }}</span>
                </td>

                <!-- Actions -->
                <td class="px-4 py-3 text-right">
                  <div class="flex items-center justify-end gap-1">
                    <button
                      @click="viewFeedback(feedback)"
                      class="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                      title="View Details"
                    >
                      <Eye class="w-4 h-4" />
                    </button>
                    <button
                      v-if="feedback.status === 'pending'"
                      @click="approveFeedback(feedback)"
                      class="p-1.5 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                      title="Approve"
                    >
                      <CheckCircle class="w-4 h-4" />
                    </button>
                    <button
                      v-if="feedback.status === 'pending'"
                      @click="rejectFeedback(feedback)"
                      class="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      title="Reject"
                    >
                      <XCircle class="w-4 h-4" />
                    </button>
                    <button
                      @click="toggleFeatured(feedback)"
                      class="p-1.5 text-gray-400 hover:text-yellow-600 rounded-lg hover:bg-yellow-50 transition-colors"
                      :title="feedback.status === 'featured' ? 'Remove Featured' : 'Make Featured'"
                    >
                      <Star class="w-4 h-4" :class="{ 'fill-yellow-400 text-yellow-400': feedback.status === 'featured' }" />
                    </button>
                    <button
                      @click="deleteFeedback(feedback)"
                      class="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="px-4 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <p class="text-sm text-gray-500">
            Showing {{ (pagination.page - 1) * pagination.limit + 1 }} to
            {{ Math.min(pagination.page * pagination.limit, pagination.total) }} of
            {{ pagination.total }} results
          </p>
          <div class="flex items-center gap-2">
            <button
              @click="changePage(pagination.page - 1)"
              :disabled="pagination.page <= 1"
              class="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft class="w-4 h-4" />
            </button>
            <span class="text-sm text-gray-600">Page {{ pagination.page }} of {{ pagination.totalPages }}</span>
            <button
              @click="changePage(pagination.page + 1)"
              :disabled="pagination.page >= pagination.totalPages"
              class="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </template>

    <!-- View Feedback Modal -->
    <div v-if="selectedFeedback" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="selectedFeedback = null">
      <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <h3 class="text-lg font-bold text-gray-900">Feedback Details</h3>
          <button @click="selectedFeedback = null" class="text-gray-400 hover:text-gray-600">
            <X class="w-5 h-5" />
          </button>
        </div>

        <div class="p-6 space-y-4">
          <!-- Customer Info -->
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
              {{ (selectedFeedback.customerName || 'U').charAt(0).toUpperCase() }}
            </div>
            <div>
              <p class="font-medium text-gray-900">{{ selectedFeedback.customerName || 'Anonymous' }}</p>
              <p class="text-sm text-gray-500">{{ selectedFeedback.customerEmail }}</p>
            </div>
          </div>

          <!-- Rating -->
          <div class="flex items-center gap-3">
            <div class="flex gap-0.5">
              <Star
                v-for="star in 5"
                :key="star"
                class="w-5 h-5"
                :class="star <= selectedFeedback.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'"
              />
            </div>
            <span class="text-sm font-medium text-gray-700">{{ selectedFeedback.rating }}/5</span>
          </div>

          <!-- Title -->
          <div v-if="selectedFeedback.title">
            <p class="text-xs font-medium text-gray-500">Title</p>
            <p class="text-sm font-semibold text-gray-900">{{ selectedFeedback.title }}</p>
          </div>

          <!-- Comment -->
          <div>
            <p class="text-xs font-medium text-gray-500">Comment</p>
            <p class="text-sm text-gray-700">{{ selectedFeedback.comment }}</p>
          </div>

          <!-- Pros & Cons -->
          <div v-if="selectedFeedback.pros?.length || selectedFeedback.cons?.length" class="grid grid-cols-2 gap-4">
            <div v-if="selectedFeedback.pros?.length">
              <p class="text-xs font-medium text-green-600 flex items-center gap-1">
                <ThumbsUp class="w-3 h-3" /> Pros
              </p>
              <ul class="text-sm text-gray-700 list-disc list-inside">
                <li v-for="pro in selectedFeedback.pros" :key="pro">{{ pro }}</li>
              </ul>
            </div>
            <div v-if="selectedFeedback.cons?.length">
              <p class="text-xs font-medium text-red-600 flex items-center gap-1">
                <ThumbsDown class="w-3 h-3" /> Cons
              </p>
              <ul class="text-sm text-gray-700 list-disc list-inside">
                <li v-for="con in selectedFeedback.cons" :key="con">{{ con }}</li>
              </ul>
            </div>
          </div>

          <!-- Product -->
          <div>
            <p class="text-xs font-medium text-gray-500">Product</p>
            <p class="text-sm text-gray-700">{{ selectedFeedback.productName || 'N/A' }}</p>
          </div>

          <!-- Status -->
          <div>
            <p class="text-xs font-medium text-gray-500">Status</p>
            <span
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
              :class="getStatusBadgeClass(selectedFeedback.status)"
            >
              <component :is="getStatusIcon(selectedFeedback.status)" class="w-3 h-3" />
              {{ getStatusLabel(selectedFeedback.status) }}
            </span>
          </div>

          <!-- Admin Response -->
          <div>
            <p class="text-xs font-medium text-gray-500">Admin Response</p>
            <div v-if="selectedFeedback.adminResponse?.message" class="p-3 bg-blue-50 rounded-lg">
              <p class="text-sm text-blue-800">{{ selectedFeedback.adminResponse.message }}</p>
              <p class="text-xs text-blue-400 mt-1">
                {{ formatDate(selectedFeedback.adminResponse.respondedAt) }}
              </p>
            </div>
            <div v-else class="text-sm text-gray-400 italic">No response yet</div>
          </div>

          <!-- Admin Actions -->
          <div class="border-t border-gray-200 pt-4 mt-4">
            <label class="text-sm font-medium text-gray-700 block mb-2">Respond to Feedback</label>
            <div class="flex gap-3">
              <textarea
                v-model="adminResponseMessage"
                rows="2"
                placeholder="Write your response..."
                class="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
              <button
                @click="sendAdminResponse"
                :disabled="!adminResponseMessage.trim()"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirm Modal for Delete -->
    <ConfirmModal
      :show="confirmModal.show"
      :type="confirmModal.type"
      :title="confirmModal.title"
      :message="confirmModal.message"
      :confirm-text="'Delete'"
      :cancel-text="'Cancel'"
      @confirm="confirmDelete"
      @cancel="closeConfirmModal"
    />

    <!-- Toast Notification -->
    <Transition name="toast">
      <div
        v-if="toast.show"
        class="fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-semibold max-w-sm"
        :class="toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'"
      >
        <CheckCircle v-if="toast.type === 'success'" class="w-4 h-4" />
        <AlertCircle v-else class="w-4 h-4" />
        {{ toast.message }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { feedBackApi, adminProductApi } from '@/api/api'
import ConfirmModal from '@/modals/ConfirmModal.vue'
import {
  Star,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  X,
  ThumbsUp,
  ThumbsDown,
  Send,
  AlertCircle
} from 'lucide-vue-next'

// ─── State ──────────────────────────────────────────────────────────────
const feedbacks = ref([])
const isLoading = ref(false)
const selectedFeedback = ref(null)
const adminResponseMessage = ref('')
const toast = ref({ show: false, type: 'success', message: '' })
let toastTimer = null

const confirmModal = ref({
  show: false,
  type: 'danger',
  title: '',
  message: '',
  itemToDelete: null
})

const pagination = reactive({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0
})

const filters = reactive({
  search: '',
  status: '',
  rating: ''
})

const stats = reactive({
  totalReviews: 0,
  averageRating: 0,
  pending: 0,
  approved: 0,
  rejected: 0,
  featured: 0
})

// ─── Methods ────────────────────────────────────────────────────────────

function getStatusLabel(status) {
  const labels = {
    'pending': 'Pending Review',
    'approved': 'Approved',
    'rejected': 'Rejected',
    'featured': 'Featured'
  }
  return labels[status] || status || 'Unknown'
}

function getStatusBadgeClass(status) {
  const classes = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'approved': 'bg-green-100 text-green-800',
    'rejected': 'bg-red-100 text-red-800',
    'featured': 'bg-purple-100 text-purple-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

function getStatusIcon(status) {
  const icons = {
    'pending': Clock,
    'approved': CheckCircle,
    'rejected': XCircle,
    'featured': Star
  }
  return icons[status] || Clock
}

function formatDate(dateValue) {
  if (!dateValue) return ''
  try {
    const date = new Date(dateValue)
    if (isNaN(date.getTime())) return ''
    return date.toLocaleDateString('en-PH', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  } catch {
    return ''
  }
}

function showToast(type, message) {
  clearTimeout(toastTimer)
  toast.value = { show: true, type, message }
  toastTimer = setTimeout(() => { toast.value.show = false }, 3500)
}

// ─── Data Fetching ──────────────────────────────────────────────────────

async function loadFeedback() {
  isLoading.value = true
  try {
    const response = await feedBackApi.getAllFeedback(
      {
        search: filters.search || undefined,
        status: filters.status || undefined,
        rating: filters.rating ? parseInt(filters.rating) : undefined
      },
      pagination.limit,
      pagination.page
    )

    if (response.success) {
      feedbacks.value = response.data || []
      pagination.total = response.pagination?.total || 0
      pagination.totalPages = response.pagination?.pages || 0
    } else {
      showToast('error', response.message || 'Failed to load feedback')
    }
  } catch (error) {
    console.error('Error loading feedback:', error)
    showToast('error', 'Failed to load feedback')
  } finally {
    isLoading.value = false
  }
}

async function loadStats() {
  try {
    const response = await feedBackApi.getAdminFeedbackStats()
    if (response.success && response.data) {
      stats.totalReviews = response.data.totalReviews || 0
      stats.averageRating = response.data.averageRating || 0
      stats.pending = response.data.pending || 0
      stats.approved = response.data.approved || 0
      stats.rejected = response.data.rejected || 0
      stats.featured = response.data.featured || 0
    }
  } catch (error) {
    console.error('Error loading stats:', error)
  }
}

async function refreshData() {
  await Promise.all([loadFeedback(), loadStats()])
}

// ─── Filters ────────────────────────────────────────────────────────────

function applyFilters() {
  pagination.page = 1
  loadFeedback()
}

function clearFilters() {
  filters.search = ''
  filters.status = ''
  filters.rating = ''
  applyFilters()
}

function changePage(page) {
  if (page < 1 || page > pagination.totalPages) return
  pagination.page = page
  loadFeedback()
}

// ─── Actions ────────────────────────────────────────────────────────────

function viewFeedback(feedback) {
  selectedFeedback.value = feedback
  adminResponseMessage.value = feedback.adminResponse?.message || ''
}

async function approveFeedback(feedback) {
  const result = await feedBackApi.updateFeedbackStatus(
    feedback.feedbackId || feedback._id,
    'approved',
    null
  )
  if (result.success) {
    showToast('success', 'Feedback approved successfully')
    refreshData()
  } else {
    showToast('error', result.message || 'Failed to approve feedback')
  }
}

async function rejectFeedback(feedback) {
  const result = await feedBackApi.updateFeedbackStatus(
    feedback.feedbackId || feedback._id,
    'rejected',
    null
  )
  if (result.success) {
    showToast('success', 'Feedback rejected')
    refreshData()
  } else {
    showToast('error', result.message || 'Failed to reject feedback')
  }
}

async function toggleFeatured(feedback) {
  const newStatus = feedback.status === 'featured' ? 'approved' : 'featured'
  const result = await feedBackApi.updateFeedbackStatus(
    feedback.feedbackId || feedback._id,
    newStatus,
    null
  )
  if (result.success) {
    showToast('success', feedback.status === 'featured' ? 'Removed from featured' : 'Marked as featured')
    refreshData()
  } else {
    showToast('error', result.message || 'Failed to update status')
  }
}

async function sendAdminResponse() {
  if (!selectedFeedback.value || !adminResponseMessage.value.trim()) return

  const result = await feedBackApi.updateFeedbackStatus(
    selectedFeedback.value.feedbackId || selectedFeedback.value._id,
    selectedFeedback.value.status || 'approved',
    adminResponseMessage.value.trim()
  )

  if (result.success) {
    showToast('success', 'Response sent successfully')
    selectedFeedback.value.adminResponse = {
      message: adminResponseMessage.value.trim(),
      respondedAt: new Date().toISOString(),
      respondedBy: localStorage.getItem('adminName') || 'Admin'
    }
    adminResponseMessage.value = ''
    refreshData()
  } else {
    showToast('error', result.message || 'Failed to send response')
  }
}

async function deleteFeedback(feedback) {
  confirmModal.value = {
    show: true,
    type: 'danger',
    title: 'Delete Feedback',
    message: `Are you sure you want to delete feedback from "${feedback.customerName || 'Anonymous'}"? This action cannot be undone.`,
    itemToDelete: feedback
  }
}

async function confirmDelete() {
  const feedback = confirmModal.value.itemToDelete
  confirmModal.value.show = false

  const result = await feedBackApi.deleteFeedback(feedback.feedbackId || feedback._id)
  if (result.success) {
    showToast('success', 'Feedback deleted successfully')
    refreshData()
  } else {
    showToast('error', result.message || 'Failed to delete feedback')
  }
}

function closeConfirmModal() {
  confirmModal.value.show = false
}

// ─── Lifecycle ─────────────────────────────────────────────────────────

onMounted(async () => {
  await Promise.all([loadFeedback(), loadStats()])
})
</script>

<style scoped>
@keyframes spin { to { transform: rotate(360deg); } }
.animate-spin { animation: spin 0.7s linear infinite; }

.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(12px) scale(0.95); }
</style>