<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="closeModal"
      >
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeModal" />

        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">

          <!-- Header -->
          <div class="flex items-start justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
            <div>
              <div class="flex items-center gap-2.5">
                <h1 class="text-lg font-bold text-gray-900">Order ID:</h1>
                <h2 class="text-lg font-bold text-gray-900">{{ order?.orderId || order?.id || 'N/A' }}</h2>
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold" :class="statusBadge(localStatus)">
                  <component :is="statusIcon(localStatus)" class="w-3 h-3" />
                  {{ getStatusDisplayName(localStatus) }}
                </span>
              </div>
              <p class="text-sm text-gray-500 mt-0.5">{{ order?.customer }} · {{ order?.date }}</p>
            </div>
            <div class="flex items-center gap-2 ml-4">
              <button
                @click="$emit('edit', order)"
                class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/></svg>
                Edit Order
              </button>
              <button @click="closeModal" class="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
          </div>

          <!-- Scrollable body -->
          <div class="flex-1 overflow-y-auto px-6 py-5">
            <div v-if="order" class="space-y-5">

              <!-- Dates row -->
              <div class="grid grid-cols-3 gap-3">
                <div class="bg-gray-50 rounded-xl p-3.5">
                  <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Type</p>
                  <p class="text-sm font-bold text-gray-900">{{ order.supplyType || 'N/A' }}</p>
                </div>
                <div class="bg-gray-50 rounded-xl p-3.5">
                  <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Ordered</p>
                  <p class="text-sm font-bold text-gray-900">{{ order.date }}</p>
                </div>
                
                <div class="bg-gray-50 rounded-xl p-3.5">
                  <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Expected Delivery</p>
                  <p class="text-sm font-bold text-gray-900">{{ order.expectedDelivery || 'N/A' }}</p>
                </div>
              </div>

              <!-- Customer Information -->
              <div class="border border-gray-200 rounded-xl overflow-hidden">
                <div class="bg-gray-50 px-4 py-2.5 border-b border-gray-100">
                  <p class="text-xs font-bold text-gray-400 uppercase tracking-wide">Customer</p>
                </div>
                <div class="p-4 space-y-3">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-black text-base flex-shrink-0">
                      {{ (order.customer?.[0] || '?').toUpperCase() }}
                    </div>
                    <div>
                      <p class="text-sm font-bold text-gray-900">{{ order.customer }}</p>
                      <p class="text-xs text-gray-400">{{ order.supplyType }}</p>
                    </div>
                  </div>
                  <div class="grid grid-cols-1 gap-1.5 text-sm">
                    <div v-if="order.email" class="flex items-center gap-2 text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" class="text-gray-400 flex-shrink-0" style="width:14px;height:14px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                      <span>{{ order.email }}</span>
                    </div>
                    <div v-if="order.phone" class="flex items-center gap-2 text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" class="text-gray-400 flex-shrink-0" style="width:14px;height:14px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                      <span>{{ order.phone }}</span>
                    </div>
                    <div class="flex items-center gap-2 text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" class="text-gray-400 flex-shrink-0" style="width:14px;height:14px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>
                      <span class="capitalize">{{ order.deliveryMethod || 'Pick-up' }}</span>
                      <span v-if="order.deliveryMethod === 'Pick-up'" class="text-gray-400">· Company Address</span>
                    </div>
                    <div v-if="order.address && order.deliveryMethod == 'Delivery'" class="flex items-center gap-2 text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" class="text-gray-400 flex-shrink-0" style="width:14px;height:14px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
                      <span>{{ order.address }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Order Items -->
              <div class="border border-gray-200 rounded-xl overflow-hidden">
                <div class="bg-gray-50 px-4 py-2.5 border-b border-gray-100">
                  <p class="text-xs font-bold text-gray-400 uppercase tracking-wide">Order Items</p>
                </div>
                <div class="p-4 space-y-3">
                  <template v-if="order.items && order.items.length > 0">
                    <div v-for="(item, i) in order.items" :key="i" class="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" class="text-blue-600" style="width:14px;height:14px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><polyline points="3.29 7 12 12 20.71 7"/></svg>
                        </div>
                        <div>
                          <p class="text-sm font-semibold text-gray-900">{{ item.name }}</p>
                          <p class="text-xs text-gray-400">{{ item.size || 'N/A' }} · {{ (item.quantity || 0).toLocaleString() }} pcs</p>
                        </div>
                      </div>
                      <p class="text-sm font-bold text-gray-900">₱{{ (item.estimatedTotal || 0).toLocaleString() }}</p>
                    </div>
                  </template>
                  <template v-else>
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-3">
                        <div class="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" class="text-blue-600" style="width:16px;height:16px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><polyline points="3.29 7 12 12 20.71 7"/></svg>
                        </div>
                        <div>
                          <p class="text-sm font-bold text-gray-900">{{ order.product }}</p>
                          <p class="text-xs text-gray-400">{{ order.size || 'N/A' }} · {{ (order.qty || 0).toLocaleString() }} pcs</p>
                        </div>
                      </div>
                      <p class="text-sm font-bold text-gray-900">{{ order.amount }}</p>
                    </div>
                  </template>
                  <div class="border-t border-gray-100 pt-3 flex items-center justify-between">
                    <span class="text-sm font-bold text-gray-700">Total</span>
                    <span class="text-base font-black text-gray-900">{{ order.amount }}</span>
                  </div>
                </div>
              </div>

              <!-- DESIGN PREVIEW SECTION -->
              <div v-if="hasDesignData" class="border border-gray-200 rounded-xl overflow-hidden">
    <div class="bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-2.5 border-b border-gray-100">
      <div class="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-purple-600"><path d="M14 3v4a1 1 0 0 0 1 1h4"/><path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z"/><path d="M9 13h6"/><path d="M9 17h4"/></svg>
        <p class="text-xs font-bold text-purple-700 uppercase tracking-wide">Customer Design / Artwork</p>
      </div>
    </div>
    <div class="p-4 space-y-4">

      <!-- Main Design Image - Unified display -->
      <div v-if="designImageUrl" class="mb-4">
        <p class="text-xs font-semibold text-gray-600 mb-2">Design Image</p>
        <div class="rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
          <img 
            :src="designImageUrl" 
            alt="Design" 
            class="w-full max-h-64 object-contain"
            @error="handleImageError"
          />
        </div>
      </div>
                  
                  <!-- Design Source Badge -->
      <div class="flex items-center gap-2">
        <span class="text-xs font-semibold text-gray-500">Design Source:</span>
        <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium" :class="designSourceBadgeClass">
          <svg v-if="designSource === 'upload'" xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-4.5-4.5L12 15"/></svg>
          {{ designSource === 'upload' ? 'Customer Upload' : 'Saved Template' }}
        </span>
      </div>

                  <!-- Uploaded Files Preview -->
                  <div v-if="uploadedFiles.length > 0">
                    <p class="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-4.5-4.5L12 15"/></svg>
                      Uploaded Files ({{ uploadedFiles.length }})
                    </p>
                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div 
                        v-for="(file, idx) in uploadedFiles" 
                        :key="idx"
                        class="relative group bg-gray-50 rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                        @click="previewFile(file)"
                      >
                        <!-- Image Preview -->
                        <div v-if="isImageFile(file)" class="aspect-square bg-gray-100 flex items-center justify-center">
                          <img 
                            :src="getFileUrl(file)" 
                            :alt="file.name"
                            class="w-50 h-full object-cover"
                            @error="handleImageError"
                          />
                        </div>
                        <!-- Non-image File Icon -->
                        <div v-else class="aspect-square bg-gray-100 flex flex-col items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-gray-400">
                            <path d="M14 3v4a1 1 0 0 0 1 1h4"/>
                            <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z"/>
                          </svg>
                          <p class="text-xs text-gray-500 mt-1 truncate w-full px-1 text-center">{{ file.name?.split('.').pop()?.toUpperCase() }}</p>
                        </div>
                        <!-- File Name Overlay -->
                        <div class="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 truncate">
                          {{ file.name }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Selected Template Preview -->
                  <div v-if="selectedTemplate">
                    <p class="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><path d="M9 9h6v6H9z"/></svg>
                      Selected Template
                    </p>
                    <div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                      <div class="flex gap-4">
                        <!-- Template Thumbnail -->
                        <div v-if="selectedTemplate.thumbnail" class="w-20 h-20 rounded-lg overflow-hidden bg-white border border-purple-200 flex-shrink-0">
                          <img :src="getTemplateImageUrl(selectedTemplate.thumbnail)" class="w-full h-full object-cover" @error="handleImageError" />
                        </div>
                        <div v-else class="w-20 h-20 rounded-lg bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-purple-500"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg>
                        </div>
                        <div class="flex-1">
                          <p class="font-semibold text-gray-900">{{ selectedTemplate.name || 'Custom Template' }}</p>
                          <p class="text-xs text-gray-500 mt-1">{{ selectedTemplate.printSize || 'N/A' }} · {{ selectedTemplate.placement || 'N/A' }}</p>
                          <p v-if="selectedTemplate.notes" class="text-xs text-gray-500 mt-1 italic">"{{ selectedTemplate.notes }}"</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Additional Files (if multiple)
      <div v-if="additionalFiles.length > 0">
        <p class="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-4.5-4.5L12 15"/></svg>
          Additional Files ({{ additionalFiles.length }})
        </p>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div 
            v-for="(file, idx) in additionalFiles" 
            :key="idx"
            class="relative group bg-gray-50 rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            @click="previewFile(file)"
          >
            <div class="aspect-square bg-gray-100 flex items-center justify-center">
              <img 
                v-if="isImageFile(file)" 
                :src="getFileUrl(file)" 
                :alt="file.name"
                class="w-full h-full object-cover"
                @error="handleImageError"
              />
              <div v-else class="flex flex-col items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-gray-400">
                  <path d="M14 3v4a1 1 0 0 0 1 1h4"/>
                  <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z"/>
                </svg>
                <p class="text-xs text-gray-500 mt-1">{{ file.name?.split('.').pop()?.toUpperCase() }}</p>
              </div>
            </div>
            <div class="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 truncate">
              {{ file.name }}
            </div>
          </div>
        </div>
      </div> -->

                 <!-- Design Specifications -->
      <div class="grid grid-cols-2 gap-3">
        <div v-if="printSize" class="bg-gray-50 rounded-lg p-2">
          <p class="text-xs text-gray-400">Print Size</p>
          <p class="text-sm font-medium text-gray-700">{{ printSize }}</p>
        </div>
        <div v-if="printPlacement" class="bg-gray-50 rounded-lg p-2">
          <p class="text-xs text-gray-400">Placement</p>
          <p class="text-sm font-medium text-gray-700">{{ printPlacement }}</p>
        </div>
        <div v-if="designNotes" class="col-span-2 bg-amber-50 rounded-lg p-2">
          <p class="text-xs text-amber-600">Design Notes</p>
          <p class="text-sm text-amber-800">{{ designNotes }}</p>
        </div>
      </div>

                </div>
              </div>

              <!-- Payment Status -->
              <div v-if="localStatus !== 'Cancelled' && localStatus !== 'Completed'">
                <div class="flex items-center justify-between mb-2.5">
                  <p class="text-xs font-bold text-gray-400 uppercase tracking-wide">Payment Status</p>
                  <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold capitalize" :class="paymentBadge(localPayment)">
                    {{ localPayment }}
                  </span>
                </div>
                <div class="flex gap-2">
                  <button
                    v-for="ps in paymentStatuses"
                    :key="ps.value"
                    @click="handlePaymentClick(ps.value)"
                    :disabled="isSaving"
                    class="flex-1 py-2 rounded-xl text-xs font-bold capitalize border-2 transition-all disabled:opacity-50"
                    :class="localPayment === ps.value
                      ? 'border-current ' + ps.activeClass
                      : 'border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600'"
                  >
                    {{ ps.label }}
                  </button>
                </div>
              </div>

              <!-- Order Status Flow -->
              <div>
                <div class="flex items-center justify-between mb-3">
                  <p class="text-xs font-bold text-gray-400 uppercase tracking-wide">Order Status</p>
                  <button
                    v-if="localStatus !== 'Cancelled' && localStatus !== 'Completed'"
                    @click="handleCancelClick"
                    :disabled="isSaving"
                    class="text-xs font-semibold text-red-500 hover:text-red-700 hover:bg-red-50 px-2.5 py-1 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Cancel Order
                  </button>
                </div>

                <!-- Cancelled banner -->
                <div v-if="localStatus === 'Cancelled'" class="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 font-semibold mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
                  This order has been cancelled
                </div>

                <!-- Completed banner -->
                <div v-else-if="localStatus === 'Completed'" class="p-3 bg-green-50 border border-green-200 rounded-xl">
                  <div class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>
                    <span class="text-sm font-semibold text-green-700">Order Completed</span>
                  </div>
                  <p class="text-xs text-green-600 mt-1">This order has been completed and cannot be modified.</p>
                </div>

                <!-- Info banner for Ready to Pick Up status -->
                <div v-else-if="localStatus === 'Out for Delivery' && order?.receivingMode === 'Pick-up'" class="mb-3 p-3 bg-green-50 border border-green-200 rounded-xl">
                  <div class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h3l3-9 3 18 3-9h3"/></svg>
                    <span class="text-sm font-semibold text-green-700">Ready for Pick Up - Awaiting customer pickup</span>
                  </div>
                  <p class="text-xs text-green-600 mt-1">Click "Completed" below when customer has picked up the order.</p>
                </div>

                <!-- Progress flow -->
                <div v-if="localStatus !== 'Completed' && localStatus !== 'Cancelled'" class="flex items-center gap-1">
                  <div v-for="(status, index) in statusFlow" :key="status" class="flex items-center flex-1">
                    <button
                      @click="handleStatusClickWithPrompt(status)"
                      :disabled="isSaving || isStatusDisabled(status)"
                      class="flex-1 flex flex-col items-center gap-1.5 py-2.5 px-1 rounded-xl text-center transition-all disabled:cursor-not-allowed"
                      :class="getStatusButtonClass(status)"
                      :title="getStatusButtonTitle(status)"
                    >
                      <span class="flex items-center justify-center w-6 h-6">
                        <component v-if="isStatusCompleted(status)" :is="statusIcon(status)" class="w-4 h-4" />
                        <span v-else class="text-xs font-black">{{ index + 1 }}</span>
                      </span>
                      <span class="text-xs font-semibold leading-tight">
                        {{ getStatusDisplayName(status) }}
                      </span>
                    </button>
                    <svg v-if="index < statusFlow.length - 1" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="flex-shrink-0 mx-0.5" :class="isStatusCompleted(statusFlow[index + 1]) ? 'text-green-400' : 'text-gray-200'">
                      <path d="m9 18 6-6-6-6"/>
                    </svg>
                  </div>
                </div>

                <!-- Display production schedule if set -->
                <div v-if="order?.productionSchedule" class="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                  <div class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    <span class="text-xs font-semibold text-blue-700">Production Schedule:</span>
                    <span class="text-sm text-blue-600">{{ formatDateTime(order.productionSchedule) }}</span>
                  </div>
                </div>

                <!-- Display driver details if set for delivery -->
                <div v-if="order?.driverDetails?.driverName && localStatus === 'Out for Delivery' && order?.receivingMode === 'Delivery'" class="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-xl">
                  <p class="text-xs font-bold text-purple-700 uppercase tracking-wide mb-2">Driver Details</p>
                  <div class="space-y-1 text-sm">
                    <div class="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      <span class="text-purple-600"><strong>Driver:</strong> {{ order.driverDetails.driverName }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                      <span class="text-purple-600"><strong>Phone:</strong> {{ order.driverDetails.driverPhone }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M9 12h6"/></svg>
                      <span class="text-purple-600"><strong>Plate #:</strong> {{ order.driverDetails.plateNumber }}</span>
                    </div>
                    <div v-if="order.driverDetails.truckDescription" class="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>
                      <span class="text-purple-600"><strong>Truck:</strong> {{ order.driverDetails.truckDescription }}</span>
                    </div>
                  </div>
                </div>

                <!-- Confirmation modal for completing pickup order -->
                <div v-if="showCompleteConfirmModal" class="fixed inset-0 z-[70] flex items-center justify-center p-4" @click.self="closeCompleteConfirmModal">
                  <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeCompleteConfirmModal" />
                  <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
                    <div class="p-6">
                      <div class="flex items-center gap-3 mb-4">
                        <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-green-600"><path d="M3 12h3l3-9 3 18 3-9h3"/></svg>
                        </div>
                        <h3 class="text-lg font-bold text-gray-900">Confirm Order Completion</h3>
                      </div>
                      <p class="text-gray-600 mb-4">
                        Have you confirmed that the customer has <strong>picked up</strong> their order?
                      </p>
                      <div class="mb-4">
                        <label class="block text-sm font-semibold text-gray-700 mb-2">Pickup Notes (Optional)</label>
                        <textarea 
                          v-model="completeNotes" 
                          rows="2" 
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                          placeholder="Add any pickup confirmation notes..."
                        ></textarea>
                      </div>
                      <div class="flex gap-3">
                        <button @click="confirmComplete" class="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold">
                          Confirm Pickup & Complete
                        </button>
                        <button @click="closeCompleteConfirmModal" class="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Saving indicator -->
                <div v-if="isSaving" class="flex items-center gap-2 mt-2 text-xs text-gray-400">
                  <div class="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </div>
              </div>

              <!-- Special Instructions -->
              <div v-if="order.notes" class="flex items-start gap-2.5 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" class="text-amber-600 flex-shrink-0 mt-0.5" style="width:15px;height:15px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
                <div>
                  <p class="text-xs font-bold text-amber-600 uppercase tracking-wide mb-1">Special Instructions</p>
                  <p class="text-sm text-amber-900">{{ order.notes }}</p>
                </div>
              </div>

              <!-- Status History -->
              <div v-if="order.statusHistory && order.statusHistory.length">
                <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Status History</p>
                <div class="space-y-2">
                  <div
                    v-for="(h, i) in [...order.statusHistory].reverse()"
                    :key="i"
                    class="flex items-start gap-3 px-4 py-3 bg-gray-50 rounded-xl"
                  >
                    <div class="mt-0.5 flex-shrink-0 p-1.5 rounded-full" :class="historyBg(h.status)">
                      <component :is="statusIcon(h.status)" class="w-3.5 h-3.5" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center justify-between">
                        <p class="text-xs font-bold" :class="historyText(h.status)">
                          {{ h.status === 'Out for Delivery' && order?.receivingMode === 'Pick-up' ? 'Ready to Pick Up' : h.status }}
                        </p>
                        <p class="text-xs text-gray-400">{{ formatDateTime(h.timestamp) }}</p>
                      </div>
                      <p v-if="h.notes" class="text-xs text-gray-500 mt-0.5">{{ h.notes }}</p>
                      <p v-if="h.productionSchedule" class="text-xs text-blue-600 mt-0.5">📅 Scheduled: {{ formatDateTime(h.productionSchedule) }}</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-end px-6 py-4 border-t border-gray-100 flex-shrink-0">
            <button
              @click="closeModal"
              class="px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-100 rounded-xl transition-colors font-semibold"
            >
              Close
            </button>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- Production Schedule Modal -->
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="showScheduleModal" class="fixed inset-0 z-[60] flex items-center justify-center p-4" @click.self="closeScheduleModal">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeScheduleModal" />
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
          <div class="p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4">Set Production Schedule</h3>
            <div class="mb-4">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Production Date & Time</label>
              <input 
                v-model="scheduleDate" 
                type="datetime-local" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                :min="minDateTime"
              />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Notes (Optional)</label>
              <textarea 
                v-model="scheduleNotes" 
                rows="3" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="Add any production notes..."
              ></textarea>
            </div>
            <div class="flex gap-3">
              <button @click="confirmSchedule" :disabled="!scheduleDate" class="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50">
                Confirm Schedule
              </button>
              <button @click="closeScheduleModal" class="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- Driver Details Modal -->
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="showDriverModal" class="fixed inset-0 z-[60] flex items-center justify-center p-4" @click.self="closeDriverModal">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeDriverModal" />
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
          <div class="p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4">Assign Driver for Delivery</h3>
            <div class="space-y-3">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Driver Name *</label>
                <input v-model="driverDetails.driverName" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Driver Phone *</label>
                <input v-model="driverDetails.driverPhone" type="tel" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Plate Number *</label>
                <input v-model="driverDetails.plateNumber" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="e.g., ABC-1234" />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Truck Description</label>
                <input v-model="driverDetails.truckDescription" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="e.g., White Isuzu Elf" />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Notes (Optional)</label>
                <textarea v-model="driverNotes" rows="2" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Additional delivery notes..."></textarea>
              </div>
            </div>
            <div class="flex gap-3 mt-6">
              <button @click="confirmDriver" :disabled="!isDriverValid" class="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50">
                Confirm & Update
              </button>
              <button @click="closeDriverModal" class="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- File Preview Modal -->
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="showPreviewModal" class="fixed inset-0 z-[80] flex items-center justify-center p-4" @click.self="closePreviewModal">
        <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="closePreviewModal" />
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 class="font-semibold text-gray-900">{{ previewFileData?.name || 'File Preview' }}</h3>
            <button @click="closePreviewModal" class="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
          <div class="p-6 flex items-center justify-center min-h-[400px]">
            <img 
              v-if="previewFileData && isImageFile(previewFileData)" 
              :src="getFileUrl(previewFileData)" 
              :alt="previewFileData.name"
              class="max-w-full max-h-[60vh] object-contain"
              @error="handleImageError"
            />
            <div v-else class="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-gray-400 mx-auto mb-4">
                <path d="M14 3v4a1 1 0 0 0 1 1h4"/>
                <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z"/>
              </svg>
              <p class="text-gray-500">Preview not available for this file type</p>
              <p class="text-xs text-gray-400 mt-1">{{ previewFileData?.name }}</p>
            </div>
          </div>
          <div class="flex justify-end px-6 py-4 border-t border-gray-100">
            <a 
              v-if="previewFileData" 
              :href="getFileUrl(previewFileData)" 
              download 
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold"
            >
              Download File
            </a>
            <button @click="closePreviewModal" class="px-4 py-2 ml-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-semibold">
              Close
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { h } from 'vue'

const props = defineProps({
  show: { type: Boolean, required: true },
  order: { type: Object, required: true },
})

const emit = defineEmits(['close', 'statusUpdate', 'paymentUpdate', 'edit'])

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const isSaving = ref(false)
const localStatus = ref(props.order?.status || 'Pending')
const localPayment = ref(props.order?.payment || 'Unpaid')

// Modal states
const showScheduleModal = ref(false)
const showDriverModal = ref(false)
const showCompleteConfirmModal = ref(false)
const showPreviewModal = ref(false)
const previewFileData = ref(null)
const pendingStatus = ref(null)
const scheduleDate = ref('')
const scheduleNotes = ref('')
const completeNotes = ref('')
const driverDetails = ref({
  driverName: '',
  driverPhone: '',
  plateNumber: '',
  truckDescription: ''
})
const driverNotes = ref('')

// ============================================================
// DESIGN PREVIEW COMPUTED PROPERTIES
// ============================================================

// Get all uploaded files from order items
const uploadedFiles = computed(() => {
  const files = []
  if (props.order?.items) {
    for (const item of props.order.items) {
      if (item.files && Array.isArray(item.files)) {
        files.push(...item.files)
      }
    }
  }
  if (props.order?.files && Array.isArray(props.order.files)) {
    files.push(...props.order.files)
  }
  return files
})

// Get selected template
const selectedTemplate = computed(() => {
  if (props.order?.selectedTemplate) {
    return props.order.selectedTemplate
  }
  if (props.order?.items) {
    for (const item of props.order.items) {
      if (item.selectedTemplate) {
        return item.selectedTemplate
      }
    }
  }
  return null
})

// Get design source
const designSource = computed(() => {
  if (uploadedFiles.value.length > 0) return 'upload'
  if (selectedTemplate.value) return 'saved'
  return null
})

// Get design specs
const printSize = computed(() => {
  if (props.order?.printSize) return props.order.printSize
  if (props.order?.items?.[0]?.printSize) return props.order.items[0].printSize
  if (selectedTemplate.value?.printSize) return selectedTemplate.value.printSize
  return null
})

const printPlacement = computed(() => {
  if (props.order?.printPlacement) return props.order.printPlacement
  if (props.order?.items?.[0]?.printPlacement) return props.order.items[0].printPlacement
  if (selectedTemplate.value?.placement) return selectedTemplate.value.placement
  return null
})

const designNotes = computed(() => {
  if (props.order?.designNotes) return props.order.designNotes
  if (props.order?.items?.[0]?.designNotes) return props.order.items[0].designNotes
  if (selectedTemplate.value?.notes) return selectedTemplate.value.notes
  return null
})

const hasDesignSpecs = computed(() => {
  return !!(printSize.value || printPlacement.value || designNotes.value)
})

const hasDesignData = computed(() => {
  return designImageUrl.value || additionalFiles.value.length > 0 || hasDesignSpecs.value
})

const designSourceBadgeClass = computed(() => {
  return designSource.value === 'upload' 
    ? 'bg-blue-100 text-blue-700' 
    : 'bg-purple-100 text-purple-700'
})


// Get the unified design image URL
const designImageUrl = computed(() => {
  for (const item of props.order.items) {
    if (item.designImage) {  // ← This will have the path for BOTH
      let cleanPath = item.designImage.replace(/^\/+/, '')
      if (cleanPath.startsWith('uploads/')) {
        return `${API_BASE_URL}/${cleanPath}`
      }
      return `${API_BASE_URL}/uploads/${cleanPath}`
    }
  }
  return ''
})

// Get additional files (excluding the main design image)
const additionalFiles = computed(() => {
  const allFiles = []
  if (props.order?.items) {
    for (const item of props.order.items) {
      if (item.files && Array.isArray(item.files)) {
        // If we have a main design image, exclude the first file if it matches
        const filesToShow = [...item.files]
        if (designImageUrl.value && filesToShow.length > 0 && filesToShow[0].path === designImageUrl.value.replace(`${API_BASE_URL}/`, '')) {
          filesToShow.shift() // Remove the first file if it's the main design image
        }
        allFiles.push(...filesToShow)
      }
    }
  }
  return allFiles
})

// Helper functions for files
function isImageFile(file) {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp']
  const ext = file.name?.split('.').pop()?.toLowerCase()
  return imageExtensions.includes(ext) || file.type?.startsWith('image/')
}

function getFileUrl(file) {
  if (!file) return ''
  
  // If file has a path (from server upload)
  if (file.path) {
    let cleanPath = file.path.replace(/^\/+/, '')
    if (cleanPath.startsWith('uploads/')) {
      return `${API_BASE_URL}/${cleanPath}`
    }
    return `${API_BASE_URL}/uploads/designs/${cleanPath}`
  }
  
  // If file has base64 data (legacy)
  if (file.data) {
    return file.data
  }
  
  // If it's just a string
  if (typeof file === 'string') {
    if (file.startsWith('http')) return file
    if (file.startsWith('data:')) return file
    return `${API_BASE_URL}/uploads/designs/${file}`
  }
  
  return ''
}

function getTemplateImageUrl(imagePath) {
  if (!imagePath) return ''
  if (imagePath.startsWith('http')) return imagePath
  let cleanPath = imagePath.replace(/^\/+/, '')
  if (cleanPath.startsWith('uploads/')) {
    return `${API_BASE_URL}/${cleanPath}`
  }
  if (cleanPath.startsWith('templates/')) {
    return `${API_BASE_URL}/uploads/${cleanPath}`
  }
  return `${API_BASE_URL}/uploads/templates/${cleanPath}`
}

function handleImageError(e) {
  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%23999" stroke-width="1"%3E%3Crect x="3" y="3" width="18" height="18" rx="2"%3E%3C/rect%3E%3C/svg%3E'
}

function previewFile(file) {
  previewFileData.value = file
  showPreviewModal.value = true
}

function closePreviewModal() {
  showPreviewModal.value = false
  previewFileData.value = null
}

// Get minimum datetime (now)
const minDateTime = computed(() => {
  const now = new Date()
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
  return now.toISOString().slice(0, 16)
})

const isDriverValid = computed(() => {
  return driverDetails.value.driverName.trim() && 
         driverDetails.value.driverPhone.trim() && 
         driverDetails.value.plateNumber.trim()
})

// Keep local state in sync
watch(() => props.order, (o) => {
  if (o) {
    localStatus.value = o.status || 'Pending'
    localPayment.value = o.payment || 'Unpaid'
  }
}, { deep: true, immediate: true })

// Status flow
const statusFlow = ['Pending', 'Scheduled', 'In Production', 'Out for Delivery', 'Completed']
const paymentStatuses = [
  { value: 'Paid', label: 'Paid', activeClass: 'border-green-500 bg-green-50 text-green-700' },
  { value: 'Partial', label: 'Partial', activeClass: 'border-orange-400 bg-orange-50 text-orange-700' },
  { value: 'Unpaid', label: 'Unpaid', activeClass: 'border-red-400 bg-red-50 text-red-600' },
]

// Get display name based on receiving mode
function getStatusDisplayName(status) {
  if (status === 'Out for Delivery') {
    return props.order?.receivingMode === 'Pick-up' ? 'Ready' : 'Out for Delivery'
  }
  const names = { 
    'Pending': 'Pending', 
    'Scheduled': 'Scheduled', 
    'In Production': 'In Prod.', 
    'Completed': 'Done' 
  }
  return names[status] || status
}

function getStatusButtonTitle(status) {
  if (status === 'Completed' && localStatus.value === 'Out for Delivery' && props.order?.receivingMode === 'Pick-up') {
    return 'Click to confirm customer pickup and complete order'
  }
  return isStatusDisabled(status) ? `Cannot skip to ${getStatusDisplayName(status)}` : `Set to: ${getStatusDisplayName(status)}`
}

function isStatusCompleted(status) {
  const ci = statusFlow.indexOf(localStatus.value)
  const si = statusFlow.indexOf(status)
  return si <= ci
}

function isStatusDisabled(status) {
  const ci = statusFlow.indexOf(localStatus.value)
  const si = statusFlow.indexOf(status)
  if (localStatus.value === 'Out for Delivery' && status === 'Completed' && props.order?.receivingMode === 'Pick-up') {
    return false
  }
  return si > ci + 1
}

function getStatusButtonClass(status) {
  const ci = statusFlow.indexOf(localStatus.value)
  const si = statusFlow.indexOf(status)
  const isActive = localStatus.value === status
  const isCompletedHighlight = (status === 'Completed' && localStatus.value === 'Out for Delivery' && props.order?.receivingMode === 'Pick-up')
  
  if (isActive) return 'bg-green-100 text-green-700 ring-2 ring-inset ring-green-400 cursor-default'
  if (isCompletedHighlight) return 'bg-green-100 text-green-700 hover:bg-green-200 cursor-pointer border border-green-300'
  if (si < ci) return 'bg-green-50 text-green-600'
  if (si === ci + 1) return 'bg-blue-50 text-blue-600 hover:bg-blue-100 cursor-pointer'
  return 'bg-gray-50 text-gray-300 cursor-not-allowed'
}

function handleStatusClickWithPrompt(status) {
  if (isStatusDisabled(status) || localStatus.value === status || isSaving.value) return
  
  if (status === 'Completed' && localStatus.value === 'Out for Delivery' && props.order?.receivingMode === 'Pick-up') {
    pendingStatus.value = status
    completeNotes.value = ''
    showCompleteConfirmModal.value = true
    return
  }
  
  if (status === 'Scheduled') {
    pendingStatus.value = status
    scheduleDate.value = ''
    scheduleNotes.value = ''
    showScheduleModal.value = true
  } else if (status === 'Out for Delivery') {
    pendingStatus.value = status
    if (props.order?.receivingMode === 'Pick-up') {
      updateStatus(status, '')
    } else {
      driverDetails.value = { driverName: '', driverPhone: '', plateNumber: '', truckDescription: '' }
      driverNotes.value = ''
      showDriverModal.value = true
    }
  } else {
    updateStatus(status, '')
  }
}

async function confirmSchedule() {
  if (!scheduleDate.value) return
  await updateStatus(pendingStatus.value, scheduleNotes.value, scheduleDate.value)
  closeScheduleModal()
}

async function confirmDriver() {
  if (!isDriverValid.value) return
  await updateStatus(pendingStatus.value, driverNotes.value, null, driverDetails.value)
  closeDriverModal()
}

async function confirmComplete() {
  await updateStatus(pendingStatus.value, completeNotes.value || 'Customer picked up the order')
  closeCompleteConfirmModal()
}

async function updateStatus(status, notes, productionSchedule = null, driverDetailsData = null) {
  isSaving.value = true
  localStatus.value = status
  
  const payload = { 
    orderId: props.order.id, 
    status: status, 
    notes: notes || ''
  }
  
  if (productionSchedule) {
    payload.productionSchedule = productionSchedule
  }
  
  if (driverDetailsData) {
    payload.driverDetails = driverDetailsData
  }
  
  emit('statusUpdate', payload)
  
  setTimeout(() => { isSaving.value = false }, 1500)
}

async function handlePaymentClick(paymentDisplayValue) {
  const backendValue = paymentDisplayValue
  if (localPayment.value === backendValue || isSaving.value) return
  isSaving.value = true
  localPayment.value = backendValue
  emit('paymentUpdate', { orderId: props.order.id, paymentStatus: backendValue, amountPaid: null })
  setTimeout(() => { isSaving.value = false }, 1500)
}

async function handleCancelClick() {
  if (isSaving.value) return
  if (!confirm(`Cancel order ${props.order.orderId || props.order.id}? This cannot be undone.`)) return
  isSaving.value = true
  localStatus.value = 'Cancelled'
  emit('statusUpdate', { orderId: props.order.id, status: 'Cancelled', notes: 'Cancelled by admin' })
  setTimeout(() => { isSaving.value = false }, 1500)
}

function closeModal() { emit('close') }
function closeScheduleModal() { showScheduleModal.value = false; pendingStatus.value = null }
function closeDriverModal() { showDriverModal.value = false; pendingStatus.value = null }
function closeCompleteConfirmModal() { showCompleteConfirmModal.value = false; pendingStatus.value = null }

function statusBadge(status) {
  const displayStatus = getStatusDisplayName(status)
  const classes = {
    'Completed': 'bg-green-100 text-green-700',
    'In Production': 'bg-blue-100 text-blue-700',
    'Scheduled': 'bg-purple-100 text-purple-700',
    'Pending': 'bg-yellow-100 text-yellow-700',
    'Out for Delivery': 'bg-cyan-100 text-cyan-700',
    'Ready': 'bg-green-100 text-green-700',
    'Cancelled': 'bg-red-100 text-red-600',
  }
  return classes[displayStatus] ?? classes[status] ?? 'bg-gray-100 text-gray-500'
}

function paymentBadge(payment) {
  const classes = {
    'Paid': 'bg-green-100 text-green-700',
    'Partial': 'bg-orange-100 text-orange-700',
    'Unpaid': 'bg-red-100 text-red-600',
  }
  return classes[payment] ?? 'bg-gray-100 text-gray-500'
}

function historyBg(status) {
  const classes = {
    'Completed': 'bg-green-100',
    'In Production': 'bg-blue-100',
    'Scheduled': 'bg-purple-100',
    'Pending': 'bg-yellow-100',
    'Out for Delivery': 'bg-cyan-100',
    'Cancelled': 'bg-red-100',
  }
  return classes[status] ?? 'bg-gray-100'
}

function historyText(status) {
  const classes = {
    'Completed': 'text-green-700',
    'In Production': 'text-blue-700',
    'Scheduled': 'text-purple-700',
    'Pending': 'text-yellow-700',
    'Out for Delivery': 'text-cyan-700',
    'Cancelled': 'text-red-600',
  }
  return classes[status] ?? 'text-gray-600'
}

function formatDateTime(ts) {
  if (!ts) return ''
  return new Date(ts).toLocaleString('en-PH', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

// Status icons
const CheckIcon = () => h('svg', { xmlns:'http://www.w3.org/2000/svg', viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', 'stroke-width':2 }, [h('path',{d:'M20 6L9 17l-5-5'})])
const PackageIcon = () => h('svg', { xmlns:'http://www.w3.org/2000/svg', viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', 'stroke-width':2 }, [h('path',{d:'M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z'}), h('path',{d:'M12 22V12'}), h('polyline',{points:'3.29 7 12 12 20.71 7'})])
const ClockIcon = () => h('svg', { xmlns:'http://www.w3.org/2000/svg', viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', 'stroke-width':2 }, [h('circle',{cx:12,cy:12,r:10}), h('polyline',{points:'12 6 12 12 16 14'})])
const CalendarIcon = () => h('svg', { xmlns:'http://www.w3.org/2000/svg', viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', 'stroke-width':2 }, [h('rect',{x:3,y:4,width:18,height:18,rx:2}), h('line',{x1:16,y1:2,x2:16,y2:6}), h('line',{x1:8,y1:2,x2:8,y2:6}), h('line',{x1:3,y1:10,x2:21,y2:10})])
const TruckIcon = () => h('svg', { xmlns:'http://www.w3.org/2000/svg', viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', 'stroke-width':2 }, [h('path',{d:'M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2'}), h('path',{d:'M15 18H9'}), h('path',{d:'M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14'}), h('circle',{cx:17,cy:18,r:2}), h('circle',{cx:7,cy:18,r:2})])
const XIcon = () => h('svg', { xmlns:'http://www.w3.org/2000/svg', viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', 'stroke-width':2 }, [h('circle',{cx:12,cy:12,r:10}), h('path',{d:'m15 9-6 6'}), h('path',{d:'m9 9 6 6'})])

function statusIcon(status) {
  const icons = {
    'Completed': CheckIcon,
    'In Production': PackageIcon,
    'Scheduled': CalendarIcon,
    'Pending': ClockIcon,
    'Out for Delivery': TruckIcon,
    'Cancelled': XIcon
  }
  return icons[status] ?? ClockIcon
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-active .relative, .modal-leave-active .relative { transition: transform 0.2s ease, opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .relative { transform: scale(0.95) translateY(8px); opacity: 0; }
.modal-leave-to .relative { transform: scale(0.95) translateY(8px); opacity: 0; }
@keyframes spin { to { transform: rotate(360deg); } }
.animate-spin { animation: spin 0.7s linear infinite; }
</style>