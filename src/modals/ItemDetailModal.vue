<template>
  <Teleport to="body">
    <div 
      v-if="isOpen" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      @click.self="closeModal"
    >
      <!-- Backdrop -->
      <div 
        class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        @click="closeModal"
      ></div>
      
      <!-- Modal Panel -->
      <div 
        class="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col animate-in fade-in zoom-in duration-300"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <!-- Header -->
        <div class="flex items-start justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0 rounded-t-2xl"
          :class="type === 'products' ? 'bg-gradient-to-r from-green-50 to-white' : 'bg-gradient-to-r from-blue-50 to-white'">
          <div>
            <h2 id="modal-title" class="text-xl font-bold text-gray-900 leading-snug">
              {{ displayName }}
            </h2>
            <p class="text-sm text-gray-500 mt-0.5 capitalize">
              {{ type === 'products' ? (item?.category || 'Product') : getCategoryLabel(item?.category) + ' Supply' }}
            </p>
          </div>
          <button 
            @click="closeModal"
            class="ml-4 p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto px-6 py-4">
          <div v-if="!item" class="flex flex-col items-center justify-center py-8">
            <div class="inline-block w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p class="mt-3 text-gray-500">Loading item details...</p>
          </div>
          
          <div v-else class="space-y-4">
            
            <!-- PRODUCT VIEW -->
            <template v-if="type === 'products'">
              <!-- Product Info -->
              <div class="grid grid-cols-3 gap-3">
                <div class="bg-green-50 rounded-xl p-3">
                  <p class="text-xs font-bold text-gray-500 uppercase tracking-wide">Product Name</p>
                  <p class="text-sm font-bold text-gray-900 truncate">{{ item.name || 'N/A' }}</p>
                  <p class="text-xs text-gray-500">ID: {{ item.id || 'N/A' }}</p>
                </div>
                <div class="bg-gray-50 rounded-xl p-3">
                  <p class="text-xs font-bold text-gray-500 uppercase tracking-wide">Category</p>
                  <p class="text-sm font-semibold text-gray-900 capitalize">{{ item.subcategory || item.category }}</p>
                </div>
                <div class="bg-gray-50 rounded-xl p-3">
                  <p class="text-xs font-bold text-gray-500 uppercase tracking-wide">Status</p>
                  <p class="text-sm font-semibold" :class="calculateTotalStock(item.sizes) > 0 ? 'text-green-600' : 'text-red-600'">
                    {{ calculateTotalStock(item.sizes) > 0 ? 'In Stock' : 'Out of Stock' }}
                  </p>
                </div>
              </div>

              <!-- Stock Information -->
              <div class="border border-gray-200 rounded-xl p-3">
                <div class="grid grid-cols-4 gap-3">
                  <div class="p-2 rounded-lg" :class="getStockStatusClass(calculateTotalStock(item.sizes), 800)">
                    <p class="text-xs text-gray-500">Total Stock</p>
                    <p class="text-lg font-black">{{ formatNumber(calculateTotalStock(item.sizes)) }}</p>
                  </div>
                  <div class="bg-gray-50 rounded-lg p-2">
                    <p class="text-xs text-gray-500">Min Order</p>
                    <p class="text-lg font-black text-gray-700">{{ formatNumber(item.minOrder) }}</p>
                  </div>
                  <div class="bg-gray-50 rounded-lg p-2">
                    <p class="text-xs text-gray-500">Base Price</p>
                    <p class="text-lg font-black text-green-600">₱{{ formatPrice(item.sizes?.[0]?.price || 0) }}</p>
                  </div>
                  <div class="bg-gray-50 rounded-lg p-2">
                    <p class="text-xs text-gray-500">Stock Value</p>
                    <p class="text-lg font-black text-blue-600">₱{{ formatNumber(calculateTotalValue(item.sizes)) }}</p>
                  </div>
                </div>
              </div>

              <!-- Sizes Section -->
              <div v-if="item.sizes && item.sizes.length > 0" class="border border-gray-200 rounded-xl overflow-hidden">
                <div class="bg-gray-50 px-4 py-2 border-b border-gray-200">
                  <p class="text-xs font-bold text-gray-500 uppercase tracking-wide">Available Sizes</p>
                </div>
                <div class="divide-y divide-gray-100 max-h-48 overflow-y-auto">
                  <div v-for="size in item.sizes" :key="size.name" class="px-4 py-2 flex items-center justify-between hover:bg-gray-50">
<div class="flex items-center gap-4">
  <span class="font-semibold text-gray-900 w-16">{{ size.name }}</span>
  <span
    v-if="size.rimDiameter"
    class="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full"
  >
    {{ size.rimDiameter }}mm
  </span>
  <span class="text-xs text-gray-500">Stock: {{ formatNumber(size.stock || 0) }}</span>
  <span class="text-green-600 font-bold">₱{{ formatPrice(size.price) }}</span>
</div>
                    <div class="flex items-center gap-2">
                      <!-- Stock Status Badge -->
                      <span v-if="isSizeOutOfStock(size.stock)" class="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                        Out of Stock
                      </span>
                      <span v-else-if="isSizeLowStock(size.stock, item.threshold || 800)" class="text-xs font-semibold text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full">
                        Low Stock
                      </span>
                      <span v-else class="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                        In Stock
                      </span>
                      
                      <!-- Notify button for product size -->
                      <button 
                        v-if="needsUrgentAttention(size.stock, item.threshold || 800)"
                        @click="handleNotifyForSize(size)"
                        :disabled="notifyingSize === size.name"
                        :class="isSizeOutOfStock(size.stock) ? 'bg-red-500 hover:bg-red-600' : 'bg-yellow-500 hover:bg-yellow-600'"
                        class="px-2 py-1 text-xs font-semibold text-white rounded-lg transition-all duration-200 flex items-center gap-1 disabled:opacity-50"
                      >
                        <svg v-if="notifyingSize === size.name" class="animate-spin" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                        </svg>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M10.268 21a2 2 0 0 0 3.464 0"></path>
                          <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"></path>
                        </svg>
                        {{ notifyingSize === size.name ? 'Sending...' : 'Notify' }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Description -->
              <div v-if="item.description" class="border border-gray-200 rounded-xl p-3">
                <p class="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Description</p>
                <p class="text-sm text-gray-700 leading-relaxed">{{ item.description }}</p>
              </div>
            </template>

            <!-- SUPPLY VIEW -->
            <template v-else>
              <!-- Item Info -->
              <div class="grid grid-cols-3 gap-3">
                <div class="bg-blue-50 rounded-xl p-3">
                  <p class="text-xs font-bold text-gray-500 uppercase tracking-wide">Item Name</p>
                  <p class="text-sm font-bold text-gray-900 truncate">{{ item.name || 'N/A' }}</p>
                  <p class="text-xs text-gray-500">ID: {{ item.itemId || item.id || 'N/A' }}</p>
                </div>
                <div class="bg-gray-50 rounded-xl p-3">
                  <p class="text-xs font-bold text-gray-500 uppercase tracking-wide">Category</p>
                  <p class="text-sm font-semibold text-gray-900 capitalize">{{ getCategoryLabel(item.category) }}</p>
                </div>
                <div class="bg-gray-50 rounded-xl p-3">
                  <p class="text-xs font-bold text-gray-500 uppercase tracking-wide">Supplier</p>
                  <p class="text-sm font-semibold text-gray-900">{{ item.supplier || 'No supplier' }}</p>
                </div>
              </div>

              <!-- Stock Status -->
              <div class="grid grid-cols-4 gap-3">
                <div class="rounded-xl p-3" :class="getStockStatusClass(item.stock, item.threshold)">
                  <p class="text-xs text-gray-500">Current Stock</p>
                  <p class="text-xl font-black" :class="getStockStatusTextColor(item.stock, item.threshold)">
                    {{ formatNumber(item.stock) }}
                  </p>
                  <p class="text-xs text-gray-500">{{ item.unit || 'units' }}</p>
                </div>
                <div class="bg-gray-50 rounded-xl p-3">
                  <p class="text-xs text-gray-500">Reorder At</p>
                  <p class="text-xl font-black text-gray-700">{{ formatNumber(item.threshold) }}</p>
                </div>
                <div class="bg-gray-50 rounded-xl p-3">
                  <p class="text-xs text-gray-500">Unit Cost</p>
                  <p class="text-xl font-black text-gray-700">₱{{ formatPrice(item.unitCost) }}</p>
                </div>
                <div class="bg-gray-50 rounded-xl p-3">
                  <p class="text-xs text-gray-500">Total Value</p>
                  <p class="text-xl font-black text-blue-600">₱{{ formatNumber((item.stock || 0) * (item.unitCost || 0)) }}</p>
                </div>
              </div>

              <!-- Additional Info -->
              <div class="border border-gray-200 rounded-xl overflow-hidden">
                <div class="grid grid-cols-2 divide-x divide-gray-200">
                  <div class="px-4 py-2 flex justify-between">
                    <span class="text-xs text-gray-500">Unit of Measure</span>
                    <span class="text-sm font-semibold text-gray-900 capitalize">{{ item.unit || 'piece' }}</span>
                  </div>
                  <div class="px-4 py-2 flex justify-between">
                    <span class="text-xs text-gray-500">Last Restocked</span>
                    <span class="text-sm font-semibold text-gray-900">{{ formatDate(item.lastRestocked) }}</span>
                  </div>
                </div>
                <div v-if="item.notes" class="px-4 py-2 border-t border-gray-200 flex justify-between">
                  <span class="text-xs text-gray-500">Notes</span>
                  <span class="text-sm text-gray-700 max-w-[60%] text-right">{{ item.notes }}</span>
                </div>
              </div>
            </template>

            <!-- ═══════════ STOCK MOVEMENT HISTORY ═══════════ -->
<div class="border border-gray-200 rounded-xl overflow-hidden">
  <button
    type="button"
    @click="showHistory = !showHistory"
    class="w-full px-4 py-2.5 bg-gray-50 border-b border-gray-200 flex items-center justify-between hover:bg-gray-100 transition-colors"
  >
    <div class="flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="2"
        class="text-gray-500">
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
        <path d="M21 3v5h-5" />
        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
        <path d="M8 16H3v5" />
      </svg>
      <span class="text-xs font-bold text-gray-500 uppercase tracking-wider">Stock Movement History</span>
      <span v-if="movements.length > 0"
        class="ml-1 px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">
        {{ movements.length }}
      </span>
    </div>
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" stroke-width="2.5"
      class="text-gray-400 transition-transform"
      :class="{ 'rotate-180': !showHistory }">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  </button>

  <div v-show="showHistory" class="bg-white">
    <!-- Loading -->
    <div v-if="isLoadingMovements" class="px-4 py-6 flex items-center justify-center gap-2 text-sm text-gray-500">
      <svg class="animate-spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
        fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      Loading history…
    </div>

    <!-- Error -->
    <div v-else-if="movementsError" class="px-4 py-4 text-sm text-red-600 bg-red-50">
      {{ movementsError }}
    </div>

    <!-- Empty -->
    <div v-else-if="movements.length === 0" class="px-4 py-6 text-center text-sm text-gray-400">
      No stock movements recorded yet.
    </div>

    <!-- Timeline -->
    <div v-else class="divide-y divide-gray-100 max-h-72 overflow-y-auto">
      <div v-for="(m, i) in movements" :key="m._id || i" class="px-4 py-3 hover:bg-gray-50 transition-colors">
        <div class="flex items-start gap-3">

          <!-- Direction badge -->
          <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
            :class="m.type === 'in' ? 'bg-green-100' : 'bg-red-100'">
            <svg v-if="m.type === 'in'" xmlns="http://www.w3.org/2000/svg" width="14" height="14"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"
              class="text-green-600">
              <path d="M12 19V5" /><path d="m5 12 7-7 7 7" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="14" height="14"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"
              class="text-red-600">
              <path d="M12 5v14" /><path d="m19 12-7 7-7-7" />
            </svg>
          </div>

          <div class="flex-1 min-w-0">
            <!-- Line 1: qty + delta + size -->
            <div class="flex items-center flex-wrap gap-x-2 gap-y-0.5">
              <span class="text-sm font-bold"
                :class="m.type === 'in' ? 'text-green-700' : 'text-red-700'">
                {{ m.type === 'in' ? '+' : '−' }}{{ (m.quantity || 0).toLocaleString() }}
              </span>
              <span class="text-xs text-gray-400">·</span>
              <span class="text-xs text-gray-500">
                {{ (m.previousStock || 0).toLocaleString() }} → {{ (m.newStock || 0).toLocaleString() }}
              </span>
              <span v-if="m.sizeName"
                class="text-[10px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                {{ m.sizeName }}
              </span>
            </div>

            <!-- Line 2: note -->
            <p class="text-xs text-gray-700 mt-0.5 whitespace-pre-line break-words">
              {{ m.note }}
            </p>

            <!-- Line 3: meta -->
            <div class="flex items-center flex-wrap gap-x-2 gap-y-0.5 mt-1 text-[10px] text-gray-400">
              <span>{{ formatMovementDate(m.createdAt) }}</span>
              <span v-if="m.performedBy">· {{ m.performedBy }}</span>
            </div>
          </div>

          <!-- Image thumbnail -->
          <button v-if="m.imageUrl" type="button" @click="openLightbox(m.imageUrl)"
            class="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0 hover:ring-2 hover:ring-blue-300 transition-all">
            <img :src="m.imageUrl" class="w-full h-full object-cover" @error="e => e.target.style.display='none'" />
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

            <!-- Action Buttons -->
            <div class="flex gap-3 pt-2">
              <button 
                @click="handleEdit"
                class="flex-1 flex items-center justify-center gap-2 py-2.5 border-2 rounded-xl transition-all duration-200 text-sm font-semibold"
                :class="type === 'products' ? 'border-green-600 text-green-600 hover:bg-green-50' : 'border-blue-600 text-blue-600 hover:bg-blue-50'"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"></path>
                </svg> 
                Edit
              </button>
              
              <!-- Notify button for supplies -->
              <button 
                v-if="type !== 'products' && needsUrgentAttention(item.stock, item.threshold)"
                @click="handleNotify"
                :disabled="notifyingSupply"
                :class="isSizeOutOfStock(item.stock) ? 'bg-red-600 hover:bg-red-700' : 'bg-yellow-600 hover:bg-yellow-700'"
                class="flex-1 flex items-center justify-center gap-2 py-2.5 text-white rounded-xl transition-all duration-200 text-sm font-semibold shadow-md hover:shadow-lg disabled:opacity-60"
              >
                <svg v-if="notifyingSupply" class="animate-spin" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M10.268 21a2 2 0 0 0 3.464 0"></path>
                  <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"></path>
                </svg>
                {{ notifyingSupply ? 'Sending...' : (isSizeOutOfStock(item.stock) ? 'Notify - Out of Stock' : 'Notify - Low Stock') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- ═══════════ IMAGE LIGHTBOX ═══════════ -->
<Teleport to="body">
  <Transition name="lb-fade">
    <div v-if="lightbox.show" class="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style="background: rgba(0,0,0,0.92);" @click.self="closeLightbox">
      <div class="relative max-w-3xl max-h-full">
        <img :src="lightbox.url" class="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl" />
        <button @click="closeLightbox"
          class="absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          style="background: rgba(255,255,255,0.15); backdrop-filter: blur(8px);">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M18 6 6 18" /><path d="m6 6 12 12" />
          </svg>
        </button>
        <a :href="lightbox.url" download
          class="absolute -bottom-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          style="background: rgba(255,255,255,0.15); backdrop-filter: blur(8px);">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </a>
      </div>
    </div>
  </Transition>
</Teleport>

  <!-- Toast Notification -->
  <!-- <div v-if="toast.show" class="fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-semibold max-w-sm bg-gray-900 text-white animate-slide-in-right">
    <svg v-if="toast.type === 'success'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <path d="M20 6L9 17l-5-5"/>
    </svg>
    <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/>
    </svg>
    {{ toast.message }}
  </div> -->
</template>

<script setup>
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import { alertApi, inventoryApi, adminProductApi } from '@/api/api'

const props = defineProps({
  isOpen: { type: Boolean, required: true, default: false },
  item: { type: Object, default: null },
  type: { type: String, default: 'products' }
})

const emit = defineEmits(['close', 'edit', 'notify', 'stockIn', 'stockOut'])

// Toast notification
const toast = ref({ show: false, type: 'success', message: '' })
const notifyingSupply = ref(false)
const notifyingSize = ref(null) // Track which size is being notified

// ── Movement history ──────────────────────────────────────────────
const movements = ref([])
const isLoadingMovements = ref(false)
const movementsError = ref('')
const showHistory = ref(true)     // collapsed/expanded toggle
const lightbox = ref({ show: false, url: '' })

async function loadMovements() {
  if (!props.item) return
  movements.value = []
  movementsError.value = ''
  isLoadingMovements.value = true

  try {
    const res = props.type === 'products'
      ? await adminProductApi.getProductMovementHistory(props.item.id, 50)
      : await inventoryApi.getMovementHistory(props.item.itemId || props.item.id, 50)

    if (res.success) {
      movements.value = Array.isArray(res.data) ? res.data : []
    } else {
      movementsError.value = res.message || 'Failed to load history'
    }
  } catch (err) {
    console.error('loadMovements error:', err)
    movementsError.value = err.response?.data?.message || err.message || 'Failed to load history'
  } finally {
    isLoadingMovements.value = false
  }
}

// Reload whenever the modal opens for a different item
watch(
  () => [props.isOpen, props.item?.id, props.item?.itemId, props.type],
  ([isOpen, id, itemId]) => {
    if (isOpen && (id || itemId)) loadMovements()
  },
  { immediate: true },
)

function openLightbox(url) {
  if (!url) return
  lightbox.value = { show: true, url }
}

function closeLightbox() {
  lightbox.value = { show: false, url: '' }
}

function formatMovementDate(d) {
  if (!d) return ''
  const date = new Date(d)
  if (isNaN(date.getTime())) return ''
  return date.toLocaleString('en-PH', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

let toastTimeout = null

function showToast(type, message) {
  if (toastTimeout) clearTimeout(toastTimeout)
  toast.value = { show: true, type, message }
  toastTimeout = setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

// Computed display name
const displayName = computed(() => {
  if (!props.item) return 'Item Details'
  return props.item.name || 'Inventory Item'
})

// Calculate total stock from sizes array
function calculateTotalStock(sizes) {
  if (!sizes || !Array.isArray(sizes)) return 0
  return sizes.reduce((total, size) => total + (size.stock || 0), 0)
}

// Calculate total value from sizes
function calculateTotalValue(sizes) {
  if (!sizes || !Array.isArray(sizes)) return 0
  return sizes.reduce((total, size) => total + ((size.stock || 0) * (size.price || 0)), 0)
}

// Stock status helper functions
function needsAttention(stock, threshold) {
  const stockNum = Number(stock) || 0
  const thresholdNum = Number(threshold) || 0
  if (stockNum === 0) return 'out-of-stock'
  if (stockNum > 0 && stockNum <= thresholdNum) return 'low-stock'
  return 'in-stock'
}

function isSizeLowStock(stock, threshold) {
  const stockNum = Number(stock) || 0
  const thresholdNum = Number(threshold) || 0
  return stockNum > 0 && stockNum <= thresholdNum
}

function isSizeOutOfStock(stock) {
  return (Number(stock) || 0) === 0
}

function needsUrgentAttention(stock, threshold) {
  const stockNum = Number(stock) || 0
  const thresholdNum = Number(threshold) || 0
  return stockNum === 0 || (stockNum > 0 && stockNum <= thresholdNum)
}

function getStockStatus(stock, threshold) {
  const stockNum = Number(stock) || 0
  const thresholdNum = Number(threshold) || 0
  if (stockNum <= 0) return 'Out of Stock'
  if (stockNum <= thresholdNum) return 'Low Stock'
  return 'In Stock'
}

function getStockStatusClass(stock, threshold) {
  const stockNum = Number(stock) || 0
  const thresholdNum = Number(threshold) || 0
  if (stockNum <= 0) return 'bg-red-50 border border-red-200'
  if (stockNum <= thresholdNum) return 'bg-yellow-50 border border-yellow-200'
  return 'bg-green-50 border border-green-200'
}

function getStockStatusColor(stock, threshold) {
  const stockNum = Number(stock) || 0
  const thresholdNum = Number(threshold) || 0
  if (stockNum <= 0) return 'text-red-600'
  if (stockNum <= thresholdNum) return 'text-yellow-600'
  return 'text-green-600'
}

function getStockStatusTextColor(stock, threshold) {
  const stockNum = Number(stock) || 0
  const thresholdNum = Number(threshold) || 0
  if (stockNum <= 0) return 'text-red-700'
  if (stockNum <= thresholdNum) return 'text-yellow-700'
  return 'text-green-700'
}

function formatPrice(value) {
  if (value === null || value === undefined) return '0.00'
  const num = typeof value === 'number' ? value : parseFloat(value)
  if (isNaN(num)) return '0.00'
  return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) 
}

function formatNumber(value) {
  if (value === null || value === undefined) return '0'
  const num = typeof value === 'number' ? value : parseInt(value, 10)
  if (isNaN(num)) return '0'
  return num.toLocaleString()
}

function getCategoryLabel(category) {
  const labels = {
    inks: 'Ink',
    chemicals: 'Chemical',
    packaging: 'Packaging',
    raw_materials: 'Raw Material',
    maintenance: 'Maintenance',
    other: 'Other'
  }
  return labels[category] || category || 'Supply'
}

function formatDate(dateString) {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return 'N/A'
  }
}

// ✅ Handle notify for a specific product size
async function handleNotifyForSize(size) {
  if (notifyingSize.value) return // Prevent double click
  
  const productId = props.item?.id
  const sizeName = size.name
  
  if (!productId || !sizeName) {
    showToast('error', 'Missing product or size information')
    return
  }
  
  notifyingSize.value = sizeName
  
  try {
    const result = await alertApi.sendProductSizeAlert(productId, sizeName)
    if (result.success) {
      const isOutOfStock = isSizeOutOfStock(size.stock)
      showToast('success', `${isOutOfStock ? 'Out of stock' : 'Low stock'} alert emailed for ${props.item.name} - ${sizeName}`)
      emit('notify', { productId, sizeName, type: 'product_size' })
    } else {
      showToast('error', result.message || 'Failed to send notification')
    }
  } catch (err) {
    console.error('Notify error:', err)
    showToast('error', 'Failed to send notification')
  } finally {
    notifyingSize.value = null
  }
}

// Handle notify for supply item
async function handleNotify() {
  if (!props.item || notifyingSupply.value) return
  
  const itemId = props.item.itemId || props.item.id
  if (!itemId) {
    showToast('error', 'Missing item ID')
    return
  }
  
  notifyingSupply.value = true
  try {
    const result = await alertApi.sendItemAlert(itemId, true)
    if (result.success) {
      const isOutOfStock = isSizeOutOfStock(props.item.stock)
      emit('notify', props.item)
      showToast('success', `${isOutOfStock ? 'Out of stock' : 'Low stock'} alert emailed for ${props.item?.name}`)
    } else {
      showToast('error', result.message || 'Failed to send notification')
    }
  } catch (err) {
    console.error('Notify error:', err)
    showToast('error', 'Failed to send notification')
  } finally {
    notifyingSupply.value = false
  }
}

function handleEscKey(event) {
  if (event.key === 'Escape' && props.isOpen) {
    closeModal()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscKey)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscKey)
  if (toastTimeout) clearTimeout(toastTimeout)
})

function closeModal() {
  emit('close')
}

function handleEdit() {
  if (!props.item) return
  emit('edit', props.item)
  closeModal()
}
</script>

<style scoped>
/* (Same styles as before) */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.animate-in {
  animation-duration: 0.3s;
  animation-fill-mode: both;
}

.fade-in {
  animation-name: fadeIn;
}

.zoom-in {
  animation-name: zoomIn;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

.animate-slide-in-right {
  animation: slideInRight 0.3s ease-out;
}

.lb-fade-enter-active, .lb-fade-leave-active { transition: opacity 0.2s ease; }
.lb-fade-enter-from, .lb-fade-leave-to { opacity: 0; }
</style>