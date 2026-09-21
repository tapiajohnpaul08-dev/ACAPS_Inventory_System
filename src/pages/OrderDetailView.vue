<template>
  <div class="space-y-4">

    <!-- ═══════════════════════════════════════════════════════════════
         ALERT BANNERS — full-width, above everything, only when relevant
         ═══════════════════════════════════════════════════════════════ -->
    <div
      v-if="localStatus === 'Pending' && localPayment === 'Unpaid'"
      class="flex items-start gap-3 p-3.5 bg-amber-50 border border-amber-200 rounded-2xl"
    >
      <div class="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-amber-600">
          <path d="M10.268 21a2 2 0 0 0 3.464 0" />
          <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
        </svg>
      </div>
      <div class="flex-1 min-w-0">
        <p class="font-bold text-amber-800 text-sm">Downpayment required before confirmation</p>
        <p class="text-xs text-amber-700 mt-0.5">
          Send payment details and verify the customer's downpayment in the <strong>Messages</strong> page. The order will be confirmed automatically once verified.
        </p>
      </div>
    </div>

    <div
      v-if="productionLockedByOtherOrder && localStatus === 'Scheduled'"
      class="flex items-start gap-3 p-3.5 bg-blue-50 border border-blue-200 rounded-2xl"
    >
      <div class="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-blue-600">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4" />
          <path d="M12 16h.01" />
        </svg>
      </div>
      <div class="flex-1 min-w-0">
        <p class="font-bold text-blue-800 text-sm">Production line busy</p>
        <p class="text-xs text-blue-700 mt-0.5">
          Another order is currently <strong>In Production</strong>. This order can't move forward until that one is completed or cancelled.
        </p>
      </div>
    </div>

    <div
      v-if="order.status === 'Ready to Pick-up' && order?.receivingMode === 'Pick-up' && localPayment === 'Partial'"
      class="flex items-start gap-3 p-3.5 bg-orange-50 border border-orange-200 rounded-2xl"
    >
      <div class="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-orange-600">
          <rect width="20" height="14" x="2" y="5" rx="2" />
          <line x1="2" x2="22" y1="10" y2="10" />
        </svg>
      </div>
      <div class="flex-1 min-w-0">
        <label class="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            v-model="codCollectedAdmin"
            :disabled="isSaving"
            class="mt-0.5 w-4 h-4 rounded border-orange-300 text-orange-600 focus:ring-orange-500 flex-shrink-0"
          />
          <div>
            <p class="font-bold text-orange-800 text-sm">
              Collect {{ formatCurrency(getRemainingBalance()) }} in cash
            </p>
            <p class="text-xs text-orange-700 mt-0.5">
              Check this only if the customer has paid the remaining balance at pickup.
            </p>
          </div>
        </label>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════
         STATUS FLOW BAR — full-width, primary control, always visible
         ═══════════════════════════════════════════════════════════════ -->
<div class="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden sticky top-[88px] z-20">      <div class="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" :class="statusBadge(localStatus)">
            <component :is="statusIcon(localStatus)" class="w-4.5 h-4.5" style="width: 18px; height: 18px;" />
          </div>
          <div class="min-w-0">
            <p class="text-xs font-bold text-gray-400 uppercase tracking-wide">Current Status</p>
            <p class="text-sm font-black text-gray-900 truncate">{{ getStatusDisplayName(localStatus) }}</p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button
            v-if="localStatus !== 'Cancelled' && localStatus !== 'Completed'"
            @click="handleCancelClick"
            :disabled="isSaving"
            class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition-colors disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <circle cx="12" cy="12" r="10" />
              <path d="m15 9-6 6" />
              <path d="m9 9 6 6" />
            </svg>
            Cancel Order
          </button>
        </div>
      </div>

      <!-- Progress steps -->
      <div class="px-5 py-4">
        <div v-if="localStatus === 'Cancelled'" class="flex items-center justify-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-red-600">
            <circle cx="12" cy="12" r="10" />
            <path d="m15 9-6 6" />
            <path d="m9 9 6 6" />
          </svg>
          <span class="text-sm font-bold text-red-700">Order Cancelled</span>
        </div>
        <div v-else-if="localStatus === 'Completed'" class="flex items-center justify-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-green-600">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          <span class="text-sm font-bold text-green-700">Order Completed</span>
        </div>

        <!-- The step chain -->
        <div v-else class="flex items-stretch">
          <template v-for="(status, index) in statusFlow" :key="status">
            <button
              @click="handleStatusClickWithPrompt(status)"
              :disabled="
                isSaving ||
                isStatusDisabled(status) ||
                isStatusCompleted(status) ||
                (status === 'Confirmed' && localPayment === 'Unpaid') ||
                (status === 'In Production' && productionLockedByOtherOrder)
              "
              class="group relative flex flex-col items-center gap-1.5 px-1 py-2 rounded-xl transition-all disabled:cursor-not-allowed flex-1 min-w-0"
              :class="getStatusButtonClass(status)"
              :title="
                status === 'Confirmed' && localPayment === 'Unpaid'
                  ? 'Verify a downpayment in the Messages page first'
                  : status === 'In Production' && productionLockedByOtherOrder
                    ? 'Another order is currently in production'
                    : getStatusButtonTitle(status)
              "
            >
              <span class="flex items-center justify-center w-7 h-7 flex-shrink-0">
                <template v-if="isStatusCompleted(status)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-gray-500">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </template>
                <template v-else-if="isCurrentStatus(status)">
                  <span class="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
                </template>
                <template v-else>
                  <span class="w-7 h-7 rounded-full bg-white border-2 flex items-center justify-center text-xs font-black" :class="getStepCircleClass(status)">
                    {{ index + 1 }}
                  </span>
                </template>
              </span>
              <span class="text-[11px] font-semibold leading-tight text-center" :class="getStatusTextClass(status)">
                {{ getStatusDisplayName(status) }}
              </span>
            </button>

            <!-- Connector -->
            <div v-if="index < statusFlow.length - 1" class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" :class="getArrowClass(statusFlow[index + 1])">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </div>

          </template>
        </div>

        <!-- Ready to pickup banner (Out for Delivery + Pick-up) -->
        <div
          v-if="localStatus === 'Out for Delivery' && order.receivingMode === 'Pick-up'"
          class="mt-3 flex items-center justify-center gap-2 p-2.5 bg-cyan-50 border border-cyan-200 rounded-xl"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-cyan-600">
            <path d="M3 12h3l3-9 3 18 3-9h3" />
          </svg>
          <span class="text-sm font-bold text-cyan-700">Ready for Pickup</span>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════
         MAIN CONTENT — Two columns: details (left) + actions (right)
         ═══════════════════════════════════════════════════════════════ -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">

      <!-- ══════════════ LEFT: Order Details (2/3 width) ══════════════ -->
      <div class="lg:col-span-2 space-y-4">

        <!-- Customer + Schedule + Delivery in one panel -->
        <div class="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div class="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">

            <!-- Customer -->
            <div class="p-4">
              <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2.5">Customer</p>
              <div class="flex items-center gap-2.5">
                <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-base flex-shrink-0">
                  {{ (order.customer || '?')[0].toUpperCase() }}
                </div>
                <div class="min-w-0">
                  <p class="text-sm font-bold text-gray-900 truncate">{{ order.customer }}</p>
                  <p class="text-xs text-gray-400">{{ order.supplyType || 'N/A' }}</p>
                </div>
              </div>
              <div class="mt-3 space-y-1.5 text-xs">
                <div v-if="order.email && order.email !== 'N/A'" class="flex items-center gap-2 text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" class="text-gray-400 flex-shrink-0 w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <span class="truncate">{{ order.email }}</span>
                </div>
                <div v-if="order.phone" class="flex items-center gap-2 text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" class="text-gray-400 flex-shrink-0 w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span>{{ order.phone }}</span>
                </div>
              </div>
            </div>

            <!-- Delivery / Ordering -->
            <div class="p-4">
              <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2.5">Delivery</p>
              <div class="space-y-2 text-xs">
                <div class="flex items-center gap-2">
                  <span class="text-gray-500 w-16 flex-shrink-0">Type</span>
                  <span class="font-semibold text-gray-900 capitalize">{{ order.receivingMode || order.deliveryMethod || 'Pick-up' }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-gray-500 w-16 flex-shrink-0">Ordered</span>
                  <span class="font-semibold text-gray-900">{{ order.date }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-gray-500 w-16 flex-shrink-0">Expected</span>
                  <span class="font-semibold text-gray-900">{{ order.expectedDelivery || 'N/A' }}</span>
                </div>
                <div v-if="order.productionSchedule" class="flex items-center gap-2">
                  <span class="text-gray-500 w-16 flex-shrink-0">Production</span>
                  <span class="font-semibold text-blue-600">{{ formatDateTime(order.productionSchedule) }}</span>
                </div>
              </div>
              <div v-if="order.address && (order.receivingMode === 'Delivery' || order.deliveryMethod === 'Delivery')" class="mt-3 pt-3 border-t border-gray-100">
                <p class="text-xs text-gray-500 mb-1">Delivery Address</p>
                <p class="text-xs text-gray-700 leading-snug">{{ order.address }}</p>
              </div>
            </div>

            <!-- Driver -->
            <div class="p-4">
              <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2.5">Assigned Driver</p>
              <div v-if="podDriverDetails && podDriverDetails.driverName" class="space-y-2 text-xs">
                <div class="flex items-center gap-2">
                  <User class="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  <span class="font-semibold text-gray-900">{{ podDriverDetails.driverName }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <Phone class="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  <span class="text-gray-700">{{ podDriverDetails.driverPhone || 'N/A' }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <Car class="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  <span class="text-gray-700">{{ podDriverDetails.plateNumber || 'N/A' }}</span>
                </div>
                <div v-if="podDriverDetails.truckDescription" class="flex items-start gap-2">
                  <Truck class="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span class="text-gray-700">{{ podDriverDetails.truckDescription }}</span>
                </div>
              </div>
              <div v-else class="text-xs text-gray-400 italic">No driver assigned yet</div>
            </div>
          </div>
        </div>



        <!-- Design Preview -->
        <div v-if="hasDesignData" class="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div class="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <p class="text-sm font-bold text-gray-900">Design Preview</p>
              <span v-if="designSource" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium" :class="designSourceBadgeClass">
                {{ designSourceLabel }}
              </span>
            </div>
            <div class="flex items-center gap-3 text-xs text-gray-500">
              <span v-if="printSize">Size: <strong class="text-gray-700">{{ printSize }}</strong></span>
              <span v-if="printPlacement">·</span>
              <span v-if="printPlacement">Placement: <strong class="text-gray-700">{{ printPlacement }}</strong></span>
            </div>
          </div>
          <div class="p-4 space-y-3">
<!-- Design Preview -->
<div
  v-if="designImageUrl"
  class="rounded-xl overflow-hidden border border-gray-200 bg-gray-50 overflow-hidden relative cursor-pointer group"
  @click="previewDesignImage"
>
  <img
    :src="designImageUrl"
    alt="Design preview"
    class="w-full h-auto max-h-96 object-contain transition-opacity group-hover:opacity-95 z-0"
    @error="handleImageError"
  />
  <div class="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none">
    <span class="bg-white/90 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" class="text-gray-700">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    </span>
  </div>
</div>
            <div v-else-if="hasDesignWithoutImage" class="flex flex-col items-center justify-center py-8 bg-amber-50 rounded-xl border border-amber-200">
              <p class="text-sm font-medium text-amber-700">Design uploaded but image URL missing</p>
              <p class="text-xs text-amber-600 mt-1">Print Size: {{ printSize || 'N/A' }} · Placement: {{ printPlacement || 'N/A' }}</p>
            </div>

            <div v-if="designNotes" class="p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <p class="text-xs font-bold text-amber-700 uppercase tracking-wide mb-1">Design Notes</p>
              <p class="text-xs text-amber-900">{{ designNotes }}</p>
            </div>

            <!-- <div v-if="designFiles.length > 0">
              <p class="text-xs font-medium text-gray-600 mb-1.5">Attached Files ({{ designFiles.length }})</p>
              <div class="flex flex-wrap gap-1.5">
                <button
                  v-for="(file, idx) in designFiles"
                  :key="idx"
                  @click="previewFile(file)"
                  class="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <span class="max-w-[140px] truncate font-medium text-gray-700">{{ file.name || 'File ' + (idx + 1) }}</span>
                  <span class="text-gray-400 text-[10px]">{{ formatFileSize(file.size) }}</span>
                </button>
              </div>
            </div> -->
          </div>
        </div>

        <!-- Notes -->
        <div v-if="order.notes" class="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div class="px-5 py-3 border-b border-gray-100">
            <p class="text-sm font-bold text-gray-900">Order Notes</p>
          </div>
          <p class="px-5 py-3 text-sm text-gray-700 whitespace-pre-line">{{ order.notes }}</p>
        </div>

        <!-- Status History (timeline) -->
        <div v-if="order.statusHistory && order.statusHistory.length" class="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div class="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
            <p class="text-sm font-bold text-gray-900">Status History</p>
            <span class="text-xs text-gray-400">{{ order.statusHistory.length }} entries</span>
          </div>
          <div class="p-5">
            <ol class="relative border-l-2 border-gray-100 ml-2 space-y-5">
              <li v-for="(h, i) in [...order.statusHistory].reverse()" :key="i" class="ml-5">
                <span class="absolute -left-[11px] flex items-center justify-center w-5 h-5 rounded-full border-2 border-white" :class="historyBg(h.status)">
                  <component :is="statusIcon(h.status)" class="w-2.5 h-2.5" style="width: 10px; height: 10px;" />
                </span>
                <div class="flex items-center justify-between flex-wrap gap-1">
                  <p class="text-sm font-bold" :class="historyText(h.status)">
                    {{ h.status === 'Out for Delivery' && order.receivingMode === 'Pick-up' ? 'Ready for Pickup' : h.status }}
                  </p>
                  <p class="text-xs text-gray-400">{{ formatDateTime(h.timestamp) }}</p>
                </div>
                <p v-if="h.notes" class="text-xs text-gray-500 mt-1">{{ h.notes }}</p>
                <p v-if="h.updatedBy" class="text-xs text-blue-500 mt-0.5">by {{ h.updatedBy }}</p>
              </li>
            </ol>
          </div>
        </div>
      </div>

      <!-- ══════════════ RIGHT: Payment + Actions (1/3 width) ═════════ -->
      <div class="lg:col-span-1 space-y-4">

                            <!-- Items + Fee breakdown in ONE card -->
        <div class="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div class="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <p class="text-sm font-bold text-gray-900">Order Items</p>
              <span class="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-bold rounded-full">
                {{ order.items?.length || 1 }}
              </span>
            </div>
          </div>

          <div class="divide-y divide-gray-100">
            <template v-if="order.items && order.items.length > 0">
              <div v-for="(item, i) in order.items" :key="i" class="px-5 py-3 flex items-center gap-3">
                <div class="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" class="text-blue-600 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" />
                    <path d="M12 22V12" />
                    <polyline points="3.29 7 12 12 20.71 7" />
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-gray-900 truncate">{{ item.name }}</p>
                  <p class="text-xs text-gray-400">{{ item.size || 'N/A' }} · {{ (item.quantity || 0).toLocaleString() }} pcs</p>
                </div>
                <p class="text-sm font-bold text-gray-900 flex-shrink-0">
                  {{ formatCurrency(item.estimatedTotal || 0) }}
                </p>
              </div>
            </template>
            <div v-else class="px-5 py-3 flex items-center justify-between">
              <p class="text-sm font-semibold text-gray-900">{{ order.product || 'Product' }}</p>
              <p class="text-sm font-bold text-gray-900">{{ formatCurrency(order.rawAmount) }}</p>
            </div>
          </div>

          <!-- Fee / total breakdown -->
          <div class="bg-gray-50 px-5 py-3 space-y-1.5 border-t border-gray-100">
            <div v-if="order.hasDesign" class="flex items-center justify-between text-xs">
              <span class="text-gray-500">Design &amp; Printing Fee</span>
              <span class="font-bold text-gray-800">{{ formatCurrency(order.designFee) }}</span>
            </div>
            <div
              v-if="Number(order.shippingFee) > 0 && (order.receivingMode === 'Delivery' || order.deliveryMethod === 'Delivery')"
              class="flex items-center justify-between text-xs"
            >
              <span class="text-gray-500">Shipping Fee</span>
              <span class="font-bold text-gray-800">{{ formatCurrency(order.shippingFee) }}</span>
            </div>
            <div class="flex items-center justify-between pt-1.5 border-t border-gray-200">
              <span class="text-sm font-bold text-gray-700">Total</span>
              <span class="text-base font-black text-gray-900">{{ formatCurrency(order.rawAmount || 0) }}</span>
            </div>
          </div>
        </div>
        <!-- Payment summary card — bold and prominent -->
        <div class="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden ">
         
            <div class="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
            <p class="text-sm font-bold text-gray-900">Payment</p>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold" :class="paymentBadge(localPayment)">
              {{ localPayment }}
            </span>
          </div>

          <div class="p-5 space-y-4">
            <!-- Big amount summary -->
            <div class="grid grid-cols-2 gap-3">
              <div class="text-center p-3 bg-green-50 rounded-xl border border-green-100">
                <p class="text-xs font-bold text-green-700 uppercase tracking-wide">Paid</p>
                <p class="text-lg font-black text-green-700 mt-1">{{ formatCurrency(getTotalPaid()) }}</p>
              </div>
              <div class="text-center p-3 rounded-xl border" :class="getRemainingBalance() > 0 ? 'bg-orange-50 border-orange-100' : 'bg-gray-50 border-gray-100'">
                <p class="text-xs font-bold uppercase tracking-wide" :class="getRemainingBalance() > 0 ? 'text-orange-700' : 'text-gray-500'">Balance</p>
                <p class="text-lg font-black mt-1" :class="getRemainingBalance() > 0 ? 'text-orange-700' : 'text-gray-500'">
                  {{ formatCurrency(getRemainingBalance()) }}
                </p>
              </div>
            </div>

            <!-- Status buttons -->
            <!-- <div>
              <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Change Status</p>
              <div class="grid grid-cols-3 gap-1.5">
                <button
                  v-for="ps in paymentStatuses"
                  :key="ps.value"
                  @click="handlePaymentClick(ps.value)"
                  :disabled="isSaving || order.status === 'Completed'"
                  class="py-2 rounded-lg text-xs font-bold capitalize border-2 transition-all disabled:opacity-50"
                  :class="localPayment === ps.value ? 'border-current ' + ps.activeClass : 'border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600'"
                >
                  {{ ps.label }}
                </button>
              </div>
            </div> -->

            <!-- Payment history -->
            <div>
              <p class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">
                Payment History
                <span v-if="order.partialPayments?.length" class="text-gray-500 font-normal normal-case">({{ order.partialPayments.length }})</span>
              </p>
              <div v-if="order.partialPayments && order.partialPayments.length" class="space-y-1.5 max-h-64 overflow-y-auto">
                <div
                  v-for="(payment, idx) in order.partialPayments"
                  :key="idx"
                  class="flex items-center justify-between gap-2 px-2.5 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-100 transition-colors"
                >
                  <div class="flex items-center gap-2 min-w-0">
                    <div class="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" class="text-green-600">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <div class="min-w-0">
                      <p class="text-xs font-bold text-gray-900">{{ formatCurrency(payment.amount) }}</p>
                      <p class="text-[10px] text-gray-400 truncate">{{ formatDate(payment.date) }} · {{ payment.referenceNumber || 'no ref' }}</p>
                    </div>
                  </div>
                  <!-- <button
                    @click="removePartialPayment(idx)"
                    :disabled="isSaving || order.status === 'Completed'"
                    class="p-1 text-gray-300 hover:text-red-500 transition-colors disabled:opacity-50 flex-shrink-0"
                    title="Remove"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M3 6h18" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                    </svg>
                  </button> -->
                </div>
              </div>
              <div v-else class="p-3 text-center text-xs text-gray-400 border border-dashed border-gray-200 rounded-lg">
                No payments recorded yet
              </div>
            </div>
          </div>
        </div>

        <!-- Proof of Delivery (right column) -->
        <div class="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div class="px-5 py-3 border-b border-gray-100">
            <p class="text-sm font-bold text-gray-900">Proof of Delivery</p>
          </div>
          <div v-if="podImageUrl" class="p-4">
            <div class="relative rounded-xl overflow-hidden border border-gray-200 cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all" @click="previewPODImage">
              <img :src="podImageUrl" alt="Proof of Delivery" class="w-full h-auto max-h-64 object-contain bg-gray-50" @error="handleImageError" />
            </div>
          </div>
          <div v-else class="p-6 text-center text-xs text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="mx-auto mb-2 text-gray-300">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
            No proof of delivery yet
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ──────────────────────────────────────────────────────────────
       MODALS (unchanged behavior)
       ────────────────────────────────────────────────────────────── -->

  <!-- Production Schedule Modal -->
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="showScheduleModal" class="fixed inset-0 z-[60] flex items-center justify-center p-4" @click.self="closeScheduleModal">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeScheduleModal" />
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
          <div class="p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4">Set Production Schedule</h3>
            <div class="mb-4">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Production Date &amp; Time</label>
              <input v-model="scheduleDate" type="datetime-local" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" :min="minDateTime" />
            </div>
            <div class="mb-4">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Notes (Optional)</label>
              <textarea v-model="scheduleNotes" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none" placeholder="Add any production notes..."></textarea>
            </div>
            <div class="flex gap-3">
              <button @click="confirmSchedule" :disabled="!scheduleDate" class="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50">Confirm Schedule</button>
              <button @click="closeScheduleModal" class="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- Driver Assignment Modal -->
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="showDriverModal" class="fixed inset-0 z-[60] flex items-center justify-center p-4" @click.self="closeDriverModal">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeDriverModal" />
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
          <div class="p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Truck class="w-5 h-5 text-blue-600" />
              Assign Driver
            </h3>
            <div class="space-y-3">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Select Driver <span class="text-red-500">*</span></label>
                <div v-if="isLoadingDrivers" class="flex items-center gap-2 text-sm text-gray-500">
                  <Loader2 class="w-4 h-4 animate-spin" /> Loading...
                </div>
                <select v-else v-model="selectedDriverId" @change="onDriverSelect" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" :class="{ 'border-red-400 ring-1 ring-red-300': driverError }">
                  <option value="">Select a driver...</option>
                  <option v-for="driver in availableDrivers" :key="driver.driverId" :value="driver.driverId">
                    {{ driver.fullName || driver.firstName + ' ' + driver.lastName }} - {{ driver.plateNumber }}
                  </option>
                </select>
                <p v-if="driverError" class="text-xs text-red-500 mt-1">{{ driverError }}</p>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Notes</label>
                <textarea v-model="driverNotes" rows="2" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Additional delivery notes..."></textarea>
              </div>
            </div>
            <div class="flex gap-3 mt-6">
              <button @click="confirmDriver" :disabled="!selectedDriverId || isSaving" class="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                <Loader2 v-if="isSaving" class="w-4 h-4 animate-spin" />
                {{ isSaving ? 'Assigning...' : 'Confirm' }}
              </button>
              <button @click="closeDriverModal" class="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- Complete Order Confirmation Modal -->
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="showCompleteConfirmModal" class="fixed inset-0 z-[60] flex items-center justify-center p-4" @click.self="closeCompleteConfirmModal">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeCompleteConfirmModal" />
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
          <div class="p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4">Complete Order</h3>
            <p class="text-sm text-gray-600 mb-4">Confirm that the customer has picked up this order.</p>
            <div class="mb-4">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Notes (Optional)</label>
              <textarea v-model="completeNotes" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none" placeholder="Add any completion notes..."></textarea>
            </div>
            <div class="flex gap-3">
              <button @click="confirmComplete" :disabled="localPayment === 'Partial' && !codCollectedAdmin" class="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold">Confirm Complete</button>
              <button @click="closeCompleteConfirmModal" class="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold">Cancel</button>
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
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6 6 18" /><path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
          <div class="p-6 flex items-center justify-center min-h-[300px]">
            <img v-if="previewFileData && isImageFile(previewFileData)" :src="getFileUrl(previewFileData)" :alt="previewFileData.name" class="max-w-full max-h-[50vh] object-contain" @error="handleImageError" />
            <div v-else class="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-gray-400 mx-auto mb-3">
                <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" />
              </svg>
              <p class="text-gray-500 text-sm">Preview not available</p>
            </div>
          </div>
          <div class="flex justify-end px-6 py-3 border-t border-gray-100">
            <a v-if="previewFileData" :href="getFileUrl(previewFileData)" download class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold">Download</a>
            <button @click="closePreviewModal" class="px-4 py-2 ml-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-semibold">Close</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- Cancel Order Confirmation Modal -->
  <ConfirmModal
    :show="showCancelModal"
    type="danger"
    title="Cancel Order"
    :message="`Cancel order ${order?.orderId || order?.id}? This cannot be undone.`"
    confirm-text="Yes, Cancel Order"
    cancel-text="Keep Order"
    @confirm="confirmCancelOrder"
    @cancel="showCancelModal = false"
  />

  <!-- Receipt Modal -->
  <ReceiptModal :show="showReceiptModal" :order="order" @close="closeReceiptModal" @handlePrint="handleReceiptPrint" />
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { h } from 'vue'
import { Truck, User, Phone, Car, Loader2 } from 'lucide-vue-next'
import { adminDriverApi } from '@/api/api'
import ReceiptModal from '@/components/receipt/ReceiptModal.vue'
import ConfirmModal from '@/modals/ConfirmModal.vue'

const props = defineProps({
  order: { type: Object, required: true },
  inProductionOrderId: { type: String, default: null },
})

const emit = defineEmits(['statusUpdate', 'paymentUpdate', 'edit'])

const isSaving = ref(false)
const localStatus = ref(props.order?.status || 'Pending')
const localPayment = ref(props.order?.paymentStatus)
const partialAmount = ref(0)
const codCollectedAdmin = ref(false)

// ── Inner modals state ──────────────────────────────────────────────
const showReceiptModal = ref(false)
const showScheduleModal = ref(false)
const showDriverModal = ref(false)
const showCompleteConfirmModal = ref(false)
const showPreviewModal = ref(false)
const showCancelModal = ref(false)
const previewFileData = ref(null)
const pendingStatus = ref(null)
const scheduleDate = ref('')
const scheduleNotes = ref('')
const completeNotes = ref('')
const driverNotes = ref('')

// ── Driver assignment state ────────────────────────────────────────
const availableDrivers = ref([])
const selectedDriverId = ref('')
const isLoadingDrivers = ref(false)
const driverError = ref('')
const driverDetails = ref({ driverName: '', driverPhone: '', plateNumber: '', truckDescription: '' })

// ── Current admin ──────────────────────────────────────────────────
const currentAdmin = JSON.parse(localStorage.getItem('adminUser') || '{}')
function getAdminName() {
  if (currentAdmin?.firstName && currentAdmin?.lastName) return `${currentAdmin.firstName} ${currentAdmin.lastName}`
  return currentAdmin?.email || 'Admin'
}

// ── Cloudinary helper ──────────────────────────────────────────────
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'vwrxijez'
function getFullImageUrl(path) {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  if (path.startsWith('beverage/') || path.includes('beverage/')) {
    const cleanPath = path.replace(/^\/+/, '')
    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${cleanPath}`
  }
  if (path.startsWith('uploads/')) {
    const filename = path.split('/').pop()
    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/beverage/designs/${filename}`
  }
  return path
}

// ── Design data ────────────────────────────────────────────────────
const designFiles = computed(() => {
  const files = []
  if (props.order?.items) {
    for (const item of props.order.items) {
      if (Array.isArray(item.files)) files.push(...item.files.filter(f => f.path || f.url || f.name))
    }
  }
  if (props.order?.designDetails) {
    for (const d of props.order.designDetails) {
      if (Array.isArray(d.files)) files.push(...d.files.filter(f => f.path || f.url || f.name))
    }
  }
  if (Array.isArray(props.order?.files)) {
    files.push(...props.order.files.filter(f => f.path || f.url || f.name))
  }
  return files
})

const designSource = computed(() => {
  if (props.order?.items) {
    for (const item of props.order.items) if (item.designSource) return item.designSource
  }
  if (props.order?.designDetails) {
    for (const d of props.order.designDetails) if (d.designSource) return d.designSource
  }
  if (designFiles.value.length > 0) return 'upload'
  if (selectedTemplate.value) return 'saved'
  return null
})

const designSourceLabel = computed(() => ({
  upload: 'Uploaded Design',
  saved: 'Saved Template',
  'no-design': 'No Design',
}[designSource.value] || 'Unknown'))

const designSourceBadgeClass = computed(() => {
  if (designSource.value === 'upload') return 'bg-blue-100 text-blue-700'
  if (designSource.value === 'saved') return 'bg-purple-100 text-purple-700'
  return 'bg-gray-100 text-gray-500'
})

const printSize = computed(() => {
  if (props.order?.items) for (const i of props.order.items) if (i.printSize) return i.printSize
  if (props.order?.designDetails) for (const d of props.order.designDetails) if (d.printSize) return d.printSize
  return props.order?.printSize || selectedTemplate.value?.printSize || null
})

const printPlacement = computed(() => {
  if (props.order?.items) for (const i of props.order.items) if (i.printPlacement) return i.printPlacement
  if (props.order?.designDetails) for (const d of props.order.designDetails) if (d.printPlacement) return d.printPlacement
  return props.order?.printPlacement || selectedTemplate.value?.placement || null
})

const designNotes = computed(() => {
  if (props.order?.items) for (const i of props.order.items) if (i.designNotes) return i.designNotes
  if (props.order?.designDetails) for (const d of props.order.designDetails) if (d.designNotes) return d.designNotes
  return props.order?.designNotes || selectedTemplate.value?.notes || null
})

const selectedTemplate = computed(() => {
  if (props.order?.selectedTemplate) return props.order.selectedTemplate
  if (props.order?.items) for (const i of props.order.items) if (i.selectedTemplate) return i.selectedTemplate
  return null
})

const designImageUrl = computed(() => {
  if (!props.order) return ''
  if (props.order.items) {
    for (const item of props.order.items) {
      if (item.designImage?.length > 0) return getFullImageUrl(item.designImage)
    }
  }
  if (props.order.items) {
    for (const item of props.order.items) {
      if (Array.isArray(item.files)) {
        for (const file of item.files) {
          if (file.path?.length > 0) return getFullImageUrl(file.path)
          if (file.url?.length > 0) return file.url
        }
      }
    }
  }
  if (selectedTemplate.value) {
    const t = selectedTemplate.value
    if (t.thumbnail?.length > 0) return getFullImageUrl(t.thumbnail)
    if (t.imagePath?.length > 0) return getFullImageUrl(t.imagePath)
  }
  if (props.order.designDetails) {
    for (const d of props.order.designDetails) {
      if (Array.isArray(d.imagePaths) && d.imagePaths.length > 0 && d.imagePaths[0]?.length > 0) {
        return getFullImageUrl(d.imagePaths[0])
      }
    }
  }
  return ''
})

const hasDesignData = computed(() => !!(
  designImageUrl.value || designSource.value || printSize.value ||
  printPlacement.value || designNotes.value || designFiles.value.length > 0 ||
  selectedTemplate.value
))

const hasDesignWithoutImage = computed(() => !designImageUrl.value && (
  designSource.value === 'upload' || designFiles.value.length > 0 ||
  printSize.value || printPlacement.value
))

const podImageUrl = computed(() => getFullImageUrl(props.order?.proofOfDelivery))

const podDriverDetails = computed(() => {
  if (props.order?.driverDetails?.driverName) return props.order.driverDetails
  const history = props.order?.statusHistory
  if (history?.length > 0) {
    const last = history[history.length - 1]
    if (last?.driverDetails?.driverName) return last.driverDetails
  }
  return null
})

const productionLockedByOtherOrder = computed(() => {
  if (!props.inProductionOrderId) return false
  return props.inProductionOrderId !== props.order?.id
})

// ── File preview ───────────────────────────────────────────────────
function isImageFile(file) {
  const exts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'avif']
  const ext = file.name?.split('.').pop()?.toLowerCase()
  return exts.includes(ext) || file.type?.startsWith('image/')
}
function getFileUrl(file) {
  if (!file) return ''
  if (file.url) return file.url
  if (file.path) return getFullImageUrl(file.path)
  return ''
}
function previewFile(file) { previewFileData.value = file; showPreviewModal.value = true }
function previewPODImage() {
  if (!podImageUrl.value) return
  previewFile({ name: 'Proof of Delivery', url: podImageUrl.value, type: 'image/jpeg' })
}
function previewDesignImage() {
  if (!designImageUrl.value) return
  previewFile({
    name: 'Design Preview',
    url: designImageUrl.value,
    type: 'image/jpeg'
  })
}
function closePreviewModal() { showPreviewModal.value = false; previewFileData.value = null }

function handleImageError(e) {
  const img = e.target
  img.style.display = 'none'
  const parent = img.parentElement
  if (parent) {
    const fallback = document.createElement('div')
    fallback.className = 'flex flex-col items-center justify-center p-4 bg-gray-100 rounded-lg w-full min-h-[100px]'
    fallback.innerHTML = `<span class="text-2xl">🖼️</span><span class="text-xs text-gray-500">Image unavailable</span>`
    parent.appendChild(fallback)
  }
}

function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// ── Currency + dates ───────────────────────────────────────────────
function formatCurrency(amount) {
  if (amount === null || amount === undefined || amount === '') return '₱0.00'
  if (typeof amount === 'string' && amount.includes('₱')) {
    const n = parseFloat(amount.replace(/[₱,]/g, '').trim())
    return isNaN(n) ? '₱0.00' : `₱${n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }
  if (typeof amount === 'string') {
    const n = parseFloat(amount.replace(/,/g, '').trim())
    return isNaN(n) ? '₱0.00' : `₱${n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }
  if (typeof amount === 'number') {
    return isNaN(amount) ? '₱0.00' : `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }
  return '₱0.00'
}
function formatDate(date) {
  if (!date) return 'N/A'
  try {
    return new Date(date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch { return 'N/A' }
}
function formatDateTime(ts) {
  if (!ts) return ''
  return new Date(ts).toLocaleString('en-PH', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

// ── Partial payments ───────────────────────────────────────────────
function getTotalPaid() {
  if (!props.order?.partialPayments?.length) return 0
  return props.order.partialPayments.reduce((sum, p) => sum + (p.amount || 0), 0)
}
function getRemainingBalance() {
  let total = props.order?.amount || props.order?.totalAmount || 0
  if (typeof total === 'string') total = parseFloat(total.replace(/[₱,]/g, '').trim()) || 0
  return Math.max(0, total - getTotalPaid())
}

async function removePartialPayment(index) {
  if (isSaving.value) return
  if (!confirm('Remove this partial payment record?')) return
  const payment = props.order.partialPayments[index]
  if (!payment) return
  isSaving.value = true
  const updatedPayments = [...props.order.partialPayments]
  updatedPayments.splice(index, 1)
  props.order.partialPayments = updatedPayments
  const totalPaid = getTotalPaid()
  const totalAmount = parseFloat(props.order?.amount || props.order?.totalAmount || 0)
  let newStatus = 'Unpaid'
  if (totalPaid > 0 && totalPaid < totalAmount) newStatus = 'Partial'
  else if (totalPaid >= totalAmount) newStatus = 'Paid'
  emit('paymentUpdate', { orderId: props.order.id, paymentStatus: newStatus, amountPaid: totalPaid, partialPayments: updatedPayments })
  localPayment.value = newStatus
  if (newStatus === 'Partial') partialAmount.value = getRemainingBalance()
  else partialAmount.value = 0
  setTimeout(() => { isSaving.value = false }, 1500)
}

// ── Watch: keep local state in sync when parent swaps orders ───────
watch(() => props.order, (o) => {
  if (o) {
    localStatus.value = o.status || 'Pending'
    localPayment.value = o.paymentStatus || 'Unpaid'
    codCollectedAdmin.value = false
    partialAmount.value = localPayment.value === 'Partial' ? getRemainingBalance() : 0
  }
}, { immediate: true, deep: true })

// ── Status flow helpers ────────────────────────────────────────────
const statusFlow = ['Pending', 'Confirmed', 'Scheduled', 'In Production', 'Out for Delivery', 'Completed']
const paymentStatuses = [
  { value: 'Paid', label: 'Paid', activeClass: 'border-green-500 bg-green-50 text-green-700' },
  { value: 'Partial', label: 'Partial', activeClass: 'border-orange-400 bg-orange-50 text-orange-700' },
  { value: 'Unpaid', label: 'Unpaid', activeClass: 'border-red-400 bg-red-50 text-red-600' },
]

function normalizeStatus(s) { return s === 'Ready to Pick-up' ? 'Out for Delivery' : s }
function currentNormalized() { return normalizeStatus(localStatus.value) }

function isCurrentStatus(status) { return normalizeStatus(status) === currentNormalized() }
function isStatusCompleted(status) {
  return statusFlow.indexOf(normalizeStatus(status)) < statusFlow.indexOf(currentNormalized())
}
function isStatusDisabled(status) {
  const ci = statusFlow.indexOf(currentNormalized())
  const si = statusFlow.indexOf(normalizeStatus(status))
  if (localStatus.value === 'Out for Delivery' && status === 'Ready to Pick-up' && props.order?.receivingMode === 'Pick-up') return false
  return si > ci + 1
}
function getStatusDisplayName(status) {
  if (status === 'Out for Delivery' && props.order?.receivingMode === 'Pick-up') return 'Ready to Pick-up'
  return ({
    Pending: 'Pending', Confirmed: 'Confirmed', Scheduled: 'Scheduled',
    'In Production': 'In Production', 'Out for Delivery': 'Out for Delivery',
    'Ready to Pick-up': 'Ready', Completed: 'Completed',
  })[status] || status
}
function getStatusButtonClass(status) {
  const ci = statusFlow.indexOf(currentNormalized())
  const si = statusFlow.indexOf(normalizeStatus(status))
  if (isCurrentStatus(status)) return 'bg-green-50 ring-3 ring-green-300 cursor-default'
  if (isStatusCompleted(status)) return 'bg-gray-100 ring-2 ring-gray-300 cursor-not-allowed opacity-70'
  if (si === ci + 1) return 'bg-blue-50/50 hover:bg-blue-100 cursor-pointer ring-1 ring-blue-200'
  return 'bg-transparent cursor-not-allowed'
}
function getStatusTextClass(status) {
  if (isCurrentStatus(status)) return 'text-green-700'
  if (isStatusCompleted(status)) return 'text-gray-500'
  if (!isStatusDisabled(status)) return 'text-blue-600'
  return 'text-gray-400'
}
function getStepCircleClass(status) {
  if (isCurrentStatus(status)) return 'border-green-500 text-green-700'
  if (isStatusCompleted(status)) return 'border-green-400 text-green-500'
  if (!isStatusDisabled(status)) return 'border-blue-300 text-blue-600'
  return 'border-gray-200 text-gray-400'
}
function getArrowClass(status) {
  if (isStatusCompleted(status)) return 'text-gray-600'
  if (isCurrentStatus(status)) return 'text-green-400'
  if (!isStatusDisabled(status)) return 'text-blue-300'
  return 'text-gray-200'
}
function getStatusButtonTitle(status) {
  if (isStatusCompleted(status)) return `${getStatusDisplayName(status)} - Already completed`
  if (isCurrentStatus(status)) return `${getStatusDisplayName(status)} - Current status`
  if (isStatusDisabled(status)) return `Cannot skip to ${getStatusDisplayName(status)}`
  return `Set to: ${getStatusDisplayName(status)}`
}

// ── Driver assignment ──────────────────────────────────────────────
const selectedDriver = computed(() => availableDrivers.value.find(d => d.driverId === selectedDriverId.value))

async function fetchAvailableDrivers() {
  isLoadingDrivers.value = true
  try {
    const response = await adminDriverApi.getAvailableDrivers()
    if (response.success && response.data) availableDrivers.value = response.data
  } catch (e) { console.error('Error fetching drivers:', e) }
  finally { isLoadingDrivers.value = false }
}
function onDriverSelect() {
  driverError.value = ''
  if (!selectedDriverId.value) {
    driverDetails.value = { driverName: '', driverPhone: '', plateNumber: '', truckDescription: '' }
    return
  }
  const d = selectedDriver.value
  if (d) {
    driverDetails.value = {
      driverName: d.fullName || `${d.firstName} ${d.lastName}`,
      driverPhone: d.phoneNumber,
      plateNumber: d.plateNumber,
      truckDescription: d.vehicleDescription || '',
    }
  }
}
async function confirmDriver() {
  if (!selectedDriverId.value) { driverError.value = 'Please select a driver'; return }
  const d = selectedDriver.value
  if (!d) { driverError.value = 'Driver not found'; return }
  const payload = {
    orderId: props.order.id,
    status: pendingStatus.value,
    notes: driverNotes.value || `Assigned driver: ${d.fullName || d.firstName + ' ' + d.lastName}`,
    driverId: d.driverId,
    driverDetails: {
      driverId: d.driverId,
      driverName: d.fullName || `${d.firstName} ${d.lastName}`,
      driverPhone: d.phoneNumber,
      plateNumber: d.plateNumber,
      truckDescription: d.vehicleDescription || '',
    },
  }
  emit('statusUpdate', payload)
  localStatus.value = pendingStatus.value
  closeDriverModal()
}
function openDriverModal(status) {
  pendingStatus.value = status
  selectedDriverId.value = ''
  driverNotes.value = ''
  driverError.value = ''
  driverDetails.value = { driverName: '', driverPhone: '', plateNumber: '', truckDescription: '' }
  fetchAvailableDrivers()
  showDriverModal.value = true
}

// ── Status updates ─────────────────────────────────────────────────
async function updateStatus(status, notes, productionSchedule = null) {
  isSaving.value = true
  localStatus.value = status
  const payload = { orderId: props.order.id, status, notes: notes || '' }
  if (productionSchedule) payload.productionSchedule = productionSchedule
  if (status === 'Completed') payload.codCollected = codCollectedAdmin.value
  emit('statusUpdate', payload)
  setTimeout(() => { isSaving.value = false }, 1500)
}

function handleStatusClickWithPrompt(status) {
  if (isStatusDisabled(status) || isStatusCompleted(status) || isCurrentStatus(status) || isSaving.value) return
  let updateStatusParam = status === 'Ready to Pick-up' ? 'Out for Delivery' : status

  if (status === 'Confirmed') {
    if (localPayment.value === 'Unpaid') {
      alert('Please verify a downpayment in the Messages page before confirming this order.')
      return
    }
    updateStatus(updateStatusParam, 'Order confirmed')
    return
  }

  if (status === 'Scheduled') {
    pendingStatus.value = status
    scheduleDate.value = ''
    scheduleNotes.value = ''
    showScheduleModal.value = true
    return
  }

  if (status === 'Out for Delivery' || status === 'Ready to Pick-up') {
    if (props.order?.receivingMode === 'Pick-up') {
      if (status === 'Ready to Pick-up') {
        if (localPayment.value === 'Partial' && !codCollectedAdmin.value) {
          alert(`Please check "Collect ${formatCurrency(getRemainingBalance())} in cash" before completing.`)
          return
        }
        pendingStatus.value = 'Completed'
        completeNotes.value = 'Customer picked up the order'
        showCompleteConfirmModal.value = true
      } else {
        updateStatus('Out for Delivery', 'Order ready for pickup')
      }
    } else {
      if (status === 'Out for Delivery') openDriverModal(status)
    }
    return
  }

  updateStatus(updateStatusParam, '')
}

// ── Payment updates ────────────────────────────────────────────────
async function handlePaymentClick(paymentDisplayValue) {
  const backendValue = paymentDisplayValue
  if (localPayment.value === backendValue || isSaving.value) return
  if (backendValue === 'Partial') {
    localPayment.value = backendValue
    partialAmount.value = getRemainingBalance()
    return
  }
  isSaving.value = true
  localPayment.value = backendValue
  let totalAmount = props.order?.amount || props.order?.totalAmount || 0
  if (typeof totalAmount === 'string') totalAmount = parseFloat(totalAmount.replace(/[₱,]/g, '').trim()) || 0
  let amountPaid = 0
  let partialPayments = []

  if (backendValue === 'Paid') {
    amountPaid = totalAmount
    const existing = Array.isArray(props.order.partialPayments) ? [...props.order.partialPayments] : []
    const alreadyPaid = existing.reduce((s, p) => s + (Number(p.amount) || 0), 0)
    const remaining = Math.max(0, Number(totalAmount) - alreadyPaid)
    if (remaining > 0) {
      existing.push({ amount: remaining, referenceNumber: null, date: new Date().toISOString(), updatedBy: getAdminName() })
    }
    partialPayments = existing
    if (localStatus.value === 'Confirmed') {
      emit('statusUpdate', { orderId: props.order.id, status: 'Scheduled', notes: 'Full payment received - moving to production' })
      localStatus.value = 'Scheduled'
    }
  } else if (backendValue === 'Unpaid') {
    props.order.partialPayments = []
    amountPaid = 0
  }

  emit('paymentUpdate', { orderId: props.order.id, paymentStatus: backendValue, amountPaid, partialPayments })
  setTimeout(() => { isSaving.value = false }, 1500)
}

async function confirmSchedule() {
  if (!scheduleDate.value) return
  await updateStatus(pendingStatus.value, scheduleNotes.value, scheduleDate.value)
  closeScheduleModal()
}
async function confirmComplete() {
  await updateStatus(pendingStatus.value, completeNotes.value || 'Customer picked up the order')
  closeCompleteConfirmModal()
}

// ── Cancel flow ────────────────────────────────────────────────────
function handleCancelClick() {
  if (isSaving.value) return
  showCancelModal.value = true
}
function confirmCancelOrder() {
  showCancelModal.value = false
  if (isSaving.value) return
  isSaving.value = true
  localStatus.value = 'Cancelled'
  emit('statusUpdate', { orderId: props.order.id, status: 'Cancelled', notes: 'Cancelled by admin' })
  setTimeout(() => { isSaving.value = false }, 1500)
}

// ── Modal control ──────────────────────────────────────────────────
function closeScheduleModal() { showScheduleModal.value = false; pendingStatus.value = null }
function closeDriverModal() { showDriverModal.value = false; pendingStatus.value = null }
function closeCompleteConfirmModal() { showCompleteConfirmModal.value = false; pendingStatus.value = null }

// ── Receipt ────────────────────────────────────────────────────────
function openReceiptModal() { showReceiptModal.value = true }
function closeReceiptModal() { showReceiptModal.value = false }
function handleReceiptPrint(data) {
  console.log('Receipt printed:', data)
  showReceiptModal.value = false
}

// ── Badges / Icons ─────────────────────────────────────────────────
function paymentBadge(payment) {
  return ({
    Paid: 'bg-green-100 text-green-700',
    Partial: 'bg-orange-100 text-orange-700',
    Unpaid: 'bg-red-100 text-red-600',
  })[payment] ?? 'bg-gray-100 text-gray-500'
}
function statusBadge(status) {
  return ({
    Pending: 'bg-yellow-100 text-yellow-700',
    Confirmed: 'bg-green-100 text-green-700',
    Scheduled: 'bg-purple-100 text-purple-700',
    'In Production': 'bg-blue-100 text-blue-700',
    'Out for Delivery': 'bg-cyan-100 text-cyan-700',
    'Ready to Pick-up': 'bg-cyan-100 text-cyan-700',
    Completed: 'bg-green-100 text-green-700',
    Cancelled: 'bg-red-100 text-red-600',
  })[status] ?? 'bg-gray-100 text-gray-500'
}
function historyBg(status) {
  return ({
    Completed: 'bg-green-100', Confirmed: 'bg-green-100', 'In Production': 'bg-blue-100',
    Scheduled: 'bg-purple-100', Pending: 'bg-yellow-100', 'Out for Delivery': 'bg-cyan-100',
    'Ready to Pick-up': 'bg-cyan-100', Cancelled: 'bg-red-100',
  })[status] ?? 'bg-gray-100'
}
function historyText(status) {
  return ({
    Completed: 'text-green-700', Confirmed: 'text-green-700', 'In Production': 'text-blue-700',
    Scheduled: 'text-purple-700', Pending: 'text-yellow-700', 'Out for Delivery': 'text-cyan-700',
    'Ready to Pick-up': 'text-cyan-700', Cancelled: 'text-red-600',
  })[status] ?? 'text-gray-600'
}

const CheckIcon = () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }, [h('path', { d: 'M20 6L9 17l-5-5' })])
const PackageIcon = () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }, [h('path', { d: 'M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z' }), h('path', { d: 'M12 22V12' }), h('polyline', { points: '3.29 7 12 12 20.71 7' })])
const ClockIcon = () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }, [h('circle', { cx: 12, cy: 12, r: 10 }), h('polyline', { points: '12 6 12 12 16 14' })])
const CalendarIcon = () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }, [h('rect', { x: 3, y: 4, width: 18, height: 18, rx: 2 }), h('line', { x1: 16, y1: 2, x2: 16, y2: 6 }), h('line', { x1: 8, y1: 2, x2: 8, y2: 6 }), h('line', { x1: 3, y1: 10, x2: 21, y2: 10 })])
const TruckIcon = () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }, [h('path', { d: 'M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2' }), h('path', { d: 'M15 18H9' }), h('path', { d: 'M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14' }), h('circle', { cx: 17, cy: 18, r: 2 }), h('circle', { cx: 7, cy: 18, r: 2 })])
const XIcon = () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }, [h('circle', { cx: 12, cy: 12, r: 10 }), h('path', { d: 'm15 9-6 6' }), h('path', { d: 'm9 9 6 6' })])

function statusIcon(status) {
  return ({
    Completed: CheckIcon, Confirmed: CheckIcon, 'In Production': PackageIcon,
    Scheduled: CalendarIcon, Pending: ClockIcon, 'Out for Delivery': TruckIcon,
    'Ready to Pick-up': TruckIcon, Cancelled: XIcon,
  })[status] ?? ClockIcon
}

// ── Schedule min date ──────────────────────────────────────────────
const minDateTime = computed(() => {
  const now = new Date()
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
  return now.toISOString().slice(0, 16)
})

defineExpose({ openReceiptModal })
</script>

<style scoped>
@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.7; }
}
.animate-pulse { animation: pulse 1.5s ease-in-out infinite; }

.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-active .relative, .modal-leave-active .relative { transition: transform 0.2s ease, opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .relative { transform: scale(0.95) translateY(8px); opacity: 0; }
.modal-leave-to .relative { transform: scale(0.95) translateY(8px); opacity: 0; }

@keyframes spin { to { transform: rotate(360deg); } }
.animate-spin { animation: spin 0.7s linear infinite; }
</style>