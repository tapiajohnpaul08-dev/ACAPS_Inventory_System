<!-- ADMIN SIDE -->

<template>
  <div class="h-full flex flex-col rounded-2xl overflow-hidden border" style="background: #fff; border-color: var(--border, #e5e7eb);">

    <!-- Empty state -->
    <div v-if="!message" class="flex-1 flex flex-col items-center justify-center p-12 text-center">
      <div class="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style="background: #f3f4f6;">
        <svg class="w-8 h-8" style="color: #d1d5db;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"/>
        </svg>
      </div>
      <p class="text-sm font-semibold" style="color: #374151;">Select a conversation</p>
      <p class="text-xs mt-1" style="color: #9ca3af;">Choose a conversation from the left to start replying</p>
    </div>

    <!-- Active conversation -->
    <template v-else>
      <!-- ── Conversation Header ── -->
      <div class="shrink-0 px-5 py-3.5 border-b flex items-center justify-between" style="border-color: #e5e7eb;">
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm uppercase shrink-0"
            :style="{ background: getAvatarColor(message.name) }"
          >
            {{ (message.name || '?')[0] }}
          </div>
          <div>
            <p class="text-sm font-semibold leading-tight" style="color: #111827;">{{ message.name }}</p>
            <p class="text-xs" style="color: #6b7280;">{{ message.email }}</p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <span class="hidden sm:inline-block text-xs px-2.5 py-1 rounded-full font-medium" style="background: #eff6ff; color: #2563eb;">
            {{ message.subject || 'General Support' }}
          </span>
        </div>
      </div>

      <!-- ── Messages area ── -->
      <div
        ref="messagesContainer"
        class="flex-1 overflow-y-auto px-5 py-4 space-y-3"
        style="background: #f9fafb;"
      >

        <!-- Loading messages -->
        <div v-if="isLoadingMessages" class="flex flex-col gap-3 pt-4">
          <div v-for="i in 4" :key="i" class="flex" :class="i % 2 === 0 ? 'justify-end' : 'justify-start'">
            <div class="rounded-2xl px-4 py-2.5 animate-pulse"
              :class="i % 2 === 0 ? 'bg-blue-100 w-40' : 'bg-gray-200 w-56'"
              style="height: 48px;">
            </div>
          </div>
        </div>

        <!-- Actual messages -->
        <template v-else>
                    <template v-for="(group, gi) in groupedMessages" :key="gi">
            <div class="flex items-center gap-3 my-3">
              <div class="flex-1 h-px" style="background: #e5e7eb;"></div>
              <span class="text-xs font-medium px-2" style="color: #9ca3af;">{{ group.label }}</span>
              <div class="flex-1 h-px" style="background: #e5e7eb;"></div>
            </div>

            <template v-for="msg in group.messages" :key="msg.messageId || msg._id">

                            <!-- ─── DELAY NOTICE CARD ────────────────────────────── -->
              <div
                v-if="msg.contentType === 'delay-notice'"
                class="w-full flex justify-start my-2"
              >
                <div class="max-w-md w-full bg-white border-2 border-amber-300 rounded-2xl shadow-sm overflow-hidden">
                  <div class="bg-gradient-to-r from-amber-50 to-amber-100 px-4 py-3 border-b border-amber-200 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-amber-600">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span class="font-bold text-amber-800 text-sm">Order Delay Notice</span>
                  </div>
                  <div class="p-4 space-y-2 text-sm">
                    <div class="flex justify-between">
                      <span class="text-gray-500">Order</span>
                      <span class="font-mono font-semibold text-xs">{{ msg.delayNoticeData?.orderId }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-500">Category</span>
                      <span class="font-semibold capitalize">
                        {{ (msg.delayNoticeData?.category || 'other').replace('_', ' ') }}
                      </span>
                    </div>
                    <div class="pt-2 border-t border-gray-100">
                      <p class="text-xs text-gray-500 mb-0.5">Reason</p>
                      <p class="text-sm text-gray-800">{{ msg.delayNoticeData?.reason }}</p>
                    </div>
                    <div
                      v-if="msg.delayNoticeData?.originalExpectedDelivery || msg.delayNoticeData?.newExpectedDelivery"
                      class="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 text-xs"
                    >
                      <div v-if="msg.delayNoticeData?.originalExpectedDelivery">
                        <p class="text-gray-400">Original ETA</p>
                        <p class="text-gray-600 line-through">
                          {{ formatDayLabel(new Date(msg.delayNoticeData.originalExpectedDelivery)) }}
                        </p>
                      </div>
                      <div v-if="msg.delayNoticeData?.newExpectedDelivery">
                        <p class="text-gray-400">New ETA</p>
                        <p class="font-bold text-amber-700">
                          {{ formatDayLabel(new Date(msg.delayNoticeData.newExpectedDelivery)) }}
                        </p>
                      </div>
                    </div>
                    <p class="text-[11px] text-gray-400 italic pt-2 border-t border-gray-100">
                      We're sorry for the inconvenience. Reply here if you have questions.
                    </p>
                  </div>
                </div>
              </div>

              <!-- ─── PAYMENT REQUEST CARD ─────────────────────────── -->
              <div
                v-if="msg.contentType === 'payment-request'"
                class="w-full flex justify-start my-2"
              >
                <div class="max-w-md w-full bg-white border-2 border-amber-200 rounded-2xl shadow-sm overflow-hidden">
                  <div class="bg-gradient-to-r from-amber-50 to-amber-100 px-4 py-3 border-b border-amber-200 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-amber-600">
                      <rect x="2" y="5" width="20" height="14" rx="2"/>
                      <line x1="2" y1="10" x2="22" y2="10"/>
                    </svg>
                    <span class="font-bold text-amber-800 text-sm">Payment Request</span>
                    <span
                      v-if="msg.paymentRequestData?.status"
                      class="ml-auto text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
                      :class="{
                        'bg-yellow-200 text-yellow-800': msg.paymentRequestData.status === 'pending',
                        'bg-blue-200 text-blue-800': msg.paymentRequestData.status === 'proof-submitted',
                        'bg-green-200 text-green-800': msg.paymentRequestData.status === 'verified',
                        'bg-red-200 text-red-800': msg.paymentRequestData.status === 'rejected',
                        'bg-gray-200 text-gray-700': msg.paymentRequestData.status === 'superseded',
                      }"
                    >
                      {{ msg.paymentRequestData.status }}
                    </span>
                  </div>
                  <div class="p-4 space-y-2 text-sm">
                    <div class="flex justify-between">
                      <span class="text-gray-500">Method</span>
                      <span class="font-semibold">
                        {{ msg.paymentRequestData?.method === 'gcash' ? 'GCash' : 'Bank Transfer' }}
                      </span>
                    </div>
                    <div v-if="msg.paymentRequestData?.bankName" class="flex justify-between">
                      <span class="text-gray-500">Bank</span>
                      <span class="font-semibold">{{ msg.paymentRequestData.bankName }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-500">Account Name</span>
                      <span class="font-semibold">{{ msg.paymentRequestData?.accountName }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-500">Account Number</span>
                      <span class="font-mono font-semibold">{{ msg.paymentRequestData?.accountNumber }}</span>
                    </div>
                    <div class="flex justify-between pt-2 border-t border-gray-100">
                      <span class="text-gray-500">Amount Due</span>
                      <span class="font-bold text-amber-700">
                        ₱{{ (msg.paymentRequestData?.amountDue || 0).toLocaleString() }}
                      </span>
                    </div>
                    <p
                      v-if="msg.paymentRequestData?.notes"
                      class="text-xs text-gray-500 italic pt-2 border-t border-gray-100"
                    >
                      {{ msg.paymentRequestData.notes }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- ─── PAYMENT PROOF CARD ───────────────────────────── -->
              <div
                v-else-if="msg.contentType === 'payment-proof'"
                class="w-full flex justify-start my-2"
              >
                <div class="max-w-md w-full bg-white border-2 border-blue-200 rounded-2xl shadow-sm overflow-hidden">
                  <div class="bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-3 border-b border-blue-200 flex items-center justify-between">
                    <span class="font-bold text-blue-800 text-sm">Payment Proof Submitted</span>
                    <span
                      class="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
                      :class="{
                        'bg-yellow-200 text-yellow-800': msg.paymentProofData?.status === 'pending-review',
                        'bg-green-200 text-green-800': msg.paymentProofData?.status === 'approved',
                        'bg-red-200 text-red-800': msg.paymentProofData?.status === 'rejected',
                      }"
                    >
                      {{ (msg.paymentProofData?.status || '').replace('-', ' ') }}
                    </span>
                  </div>
                  <div class="p-4 space-y-3 text-sm">
                    <div class="flex justify-between">
                      <span class="text-gray-500">Amount Paid</span>
                      <span class="font-bold text-blue-700">
                        ₱{{ (msg.paymentProofData?.amountPaid || 0).toLocaleString() }}
                      </span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-500">Reference</span>
                      <span class="font-mono text-xs">
                        {{ msg.paymentProofData?.referenceNumber || '—' }}
                      </span>
                    </div>
                    <img
                      v-if="msg.paymentProofData?.proofImageUrl"
                      :src="msg.paymentProofData.proofImageUrl"
                      alt="Proof"
                      class="w-full rounded-lg border border-blue-200 cursor-pointer hover:opacity-90 transition-opacity"
                      @click="openImageViewer(msg.paymentProofData.proofImageUrl)"
                    />
                    <p
                      v-if="msg.paymentProofData?.note"
                      class="text-xs text-gray-500 italic pt-2 border-t border-gray-100"
                    >
                      {{ msg.paymentProofData.note }}
                    </p>
                    <div
                      v-if="msg.paymentProofData?.status === 'pending-review'"
                      class="flex gap-2 pt-2 border-t border-gray-100"
                    >
                      <button
                        @click="openVerifyModal(msg)"
                        class="flex-1 py-2 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 transition-colors"
                      >
                        Verify &amp; Confirm
                      </button>
                      <button
                        @click="openRejectModal(msg)"
                        class="flex-1 py-2 bg-red-100 text-red-700 rounded-lg text-xs font-bold hover:bg-red-200 transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- ─── REGULAR MESSAGE ROW ──────────────────────────── -->
              <div
                v-else
                class="flex items-start group"
                :class="isAdminMessage(msg) ? 'justify-end' : 'justify-start'"
              >
                <!-- Avatar for customer (left side) -->
                <div
                  v-if="!isAdminMessage(msg)"
                  class="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2 shrink-0 self-end mb-1"
                  :style="{ background: getAvatarColor(message.name) }"
                >
                  {{ (message.name || '?')[0] }}
                </div>

                                <!-- Message Bubble with actions -->
                <div class="flex items-center gap-1.5 max-w-[75%]">

                  <!-- Action buttons - LEFT SIDE (admin messages only) -->
                  <div
                    v-if="isAdminMessage(msg)"
                    class="flex flex-row gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <!-- Reply button -->
                    <button
                      v-if="!msg.isDeleted"
                      @click="setReplyTo(msg)"
                      class="p-1.5 rounded-full hover:bg-blue-200 transition-colors"
                      title="Reply to this message"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="text-blue-200 hover:text-white">
                        <path d="M3 10a7 7 0 0 1 14 0v4a7 7 0 0 1-14 0z"/>
                        <path d="M21 15l-5-5 5-5"/>
                      </svg>
                    </button>

                    <!-- Unsend button -->
                    <button
                      v-if="canUnsendMessage(msg)"
                      @click="openUnsendModal(msg)"
                      class="p-1.5 rounded-full hover:bg-red-200 transition-colors"
                      title="Unsend message"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="text-blue-200 hover:text-red-300">
                        <path d="M3 6h18"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        <path d="M10 11v6"/>
                        <path d="M14 11v6"/>
                      </svg>
                    </button>
                  </div>

                  <!-- Regular text/attachment bubble -->
                  <div
                    class="message-bubble relative group"
                    :class="isAdminMessage(msg) ? 'bubble-admin' : 'bubble-customer'"
                  >
                    <!-- Reply indicator -->
                    <div
                      v-if="msg.replyTo"
                      class="text-xs mb-1.5 p-1.5 rounded bg-opacity-20"
                      :class="isAdminMessage(msg) ? 'bg-blue-500 bg-opacity-20' : 'bg-gray-100'"
                    >
                      <span class="text-[10px] opacity-70">↩️ Replying to:</span>
                      <p
                        class="text-xs truncate max-w-[200px]"
                        :class="isAdminMessage(msg) ? 'text-blue-200' : 'text-gray-500'"
                      >
                        {{ msg.replyTo.content }}
                      </p>
                    </div>

                    <!-- Text content -->
                    <p
                      v-if="msg.content && !msg.isDeleted"
                      class="text-sm leading-relaxed whitespace-pre-wrap break-words"
                    >
                      {{ msg.content }}
                    </p>

                    <!-- Unsend indicator -->
                    <p
                      v-if="msg.isDeleted"
                      class="text-sm leading-relaxed whitespace-pre-wrap break-words italic"
                      :class="isAdminMessage(msg) ? 'text-blue-300' : 'text-gray-400'"
                    >
                      This message was unsent
                    </p>

                    <!-- Attachments -->
                    <div
                      v-if="msg.attachments && msg.attachments.length > 0 && !msg.isDeleted"
                      class="mt-2 space-y-2"
                    >
                      <div v-for="(file, idx) in msg.attachments" :key="idx">
                        <!-- Image attachment -->
                        <div v-if="isImageFile(file)" class="relative">
                          <img
                            :src="getFileUrl(file)"
                            :alt="file.name || 'Image'"
                            class="max-w-full max-h-48 rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                            @click="openImageViewer(getFileUrl(file))"
                            @error="handleImageError"
                          />
                          <p
                            class="text-xs mt-1"
                            :class="isAdminMessage(msg) ? 'text-blue-200' : 'text-gray-500'"
                          >
                            📷 {{ file.name || 'Image' }}
                          </p>
                        </div>

                        <!-- File attachment -->
                        <div
                          v-else
                          class="flex items-center gap-2 p-2 rounded-lg"
                          :class="isAdminMessage(msg) ? 'bg-blue-700' : 'bg-gray-100'"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" stroke-width="2"
                            :class="isAdminMessage(msg) ? 'text-blue-300' : 'text-gray-500'">
                            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                            <polyline points="14 2 14 8 20 8"/>
                          </svg>
                          <a
                            :href="getFileUrl(file)"
                            target="_blank"
                            class="text-sm hover:underline truncate flex-1"
                            :class="isAdminMessage(msg) ? 'text-blue-200' : 'text-blue-600'"
                          >
                            {{ file.name || 'Download' }}
                          </a>
                          <span
                            class="text-xs"
                            :class="isAdminMessage(msg) ? 'text-blue-300' : 'text-gray-400'"
                          >
                            {{ formatFileSize(file.size) }}
                          </span>
                        </div>
                      </div>
                    </div>

                    <!-- Timestamp + read status -->
                    <div
                      class="flex items-center gap-1 mt-1.5"
                      :class="isAdminMessage(msg) ? 'justify-end' : 'justify-start'"
                    >
                      <span
                        class="text-[10px]"
                        :class="isAdminMessage(msg) ? 'text-blue-200' : 'text-gray-400'"
                      >
                        {{ formatTime(msg.createdAt || msg.timestamp) }}
                      </span>
                      <svg
                        v-if="isAdminMessage(msg) && msg.isRead"
                        class="w-3 h-3 text-blue-200"
                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor" stroke-width="2.5"
                      >
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>

                    <!-- Sent By -->
                    <div v-if="isAdminMessage(msg)" class="text-[10px] mt-0.5" :class="isAdminMessage(msg) ? 'text-blue-200 text-right' : 'text-gray-400'">
                      Sent By: {{ isAdminMessage(msg) ? currentAdmin : (msg.senderName || 'Customer') }}
                    </div>
                  </div>

                  <!-- Action buttons - RIGHT SIDE (customer messages only) -->
                  <div
                    v-if="!isAdminMessage(msg)"
                    class="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <!-- Reply button -->
                    <button
                      v-if="!msg.isDeleted"
                      @click="setReplyTo(msg)"
                      class="p-1.5 rounded-full hover:bg-blue-200 transition-colors"
                      title="Reply to this message"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="text-gray-400 hover:text-blue-600">
                        <path d="M3 10a7 7 0 0 1 14 0v4a7 7 0 0 1-14 0z"/>
                        <path d="M21 15l-5-5 5-5"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Avatar for admin (right side) -->
                <div
                  v-if="isAdminMessage(msg)"
                  class="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold ml-2 shrink-0 self-end mb-1"
                  style="background: #7c3aed;"
                >
                  A
                </div>
              </div>

            </template>
          </template>

          <!-- Typing indicator -->
          <div v-if="isTyping" class="flex justify-start">
            <div class="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2 shrink-0"
              :style="{ background: getAvatarColor(message.name) }">
              {{ (message.name || '?')[0] }}
            </div>
            <div class="bubble-customer px-4 py-3">
              <div class="flex gap-1 items-center h-4">
                <span class="typing-dot"></span>
                <span class="typing-dot" style="animation-delay: 160ms;"></span>
                <span class="typing-dot" style="animation-delay: 320ms;"></span>
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- Reply indicator -->
      <div v-if="replyToMessage" class="border-t px-4 py-2 bg-blue-50 border-blue-100 flex items-center justify-between">
        <div class="flex items-center gap-2 min-w-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-blue-600 flex-shrink-0">
            <path d="M3 10a7 7 0 0 1 14 0v4a7 7 0 0 1-14 0z"/>
            <path d="M21 15l-5-5 5-5"/>
          </svg>
          <div class="min-w-0">
            <span class="text-xs text-blue-600 font-medium">Replying to:</span>
            <p class="text-sm text-gray-600 truncate">{{ replyToMessage.content || '📎 Attachment' }}</p>
          </div>
        </div>
        <button @click="clearReply" class="text-gray-400 hover:text-gray-600 flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
          </svg>
        </button>
      </div>

      <!-- ── Reply composer ── -->
      <div class="shrink-0 px-5 py-4 border-t" style="border-color: #e5e7eb; background: #fff;">
        <div v-if="pendingAttachments.length" class="mb-3 flex flex-wrap gap-2">
          <div
            v-for="(file, idx) in pendingAttachments"
            :key="idx"
            class="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs"
            style="background: #f9fafb; border-color: #e5e7eb;"
          >
            <img
              v-if="file.type?.startsWith('image/')"
              :src="file.preview"
              class="w-6 h-6 rounded object-cover"
              alt=""
            />
            <svg v-else class="w-4 h-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            <span class="max-w-[120px] truncate font-medium text-gray-700">{{ file.name }}</span>
            <span class="text-gray-400">{{ formatFileSize(file.size) }}</span>
            <button @click="removeAttachment(idx)" class="text-gray-400 hover:text-red-500 ml-1 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="flex items-end gap-2">
          <input
            ref="fileInput"
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx,.txt,.xls,.xlsx,.csv"
            class="hidden"
            @change="handleFileSelect"
          />
          <button
            @click="fileInput?.click()"
            :disabled="isSending"
            class="w-9 h-9 shrink-0 flex items-center justify-center rounded-xl border transition-colors disabled:opacity-40"
            style="border-color: #e5e7eb; color: #6b7280; background: #f9fafb;"
            title="Attach file"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
            </svg>
          </button>

          <textarea
            v-model="reply"
            ref="textareaRef"
            rows="1"
            placeholder="Type your reply… (Enter to send)"
            class="flex-1 resize-none rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            style="border-color: #e5e7eb; min-height: 42px; max-height: 120px; line-height: 1.5; background: #f9fafb; color: #111827;"
            :disabled="isSending"
            @input="onInput"
            @keydown.enter.exact.prevent="sendReply"
            @keydown.enter.shift.exact="reply += '\n'"
          ></textarea>

          <button
            @click="sendReply"
            :disabled="(!reply.trim() && pendingAttachments.length === 0) || isSending"
            class="w-9 h-9 shrink-0 flex items-center justify-center rounded-xl text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style="background: #2563eb;"
          >
            <svg v-if="!isSending" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>
            </svg>
            <svg v-else class="animate-spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
          </button>
        </div>

        <p class="text-[10px] text-center mt-2" style="color: #9ca3af;">Enter to send · Shift+Enter for new line</p>
      </div>
    </template>
  </div>

  <!-- Unsend Confirmation Modal -->
  <Teleport to="body">
    <div 
      v-if="unsendModal.show" 
      class="fixed inset-0 z-[200] flex items-center justify-center p-4"
      @click.self="closeUnsendModal"
    >
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"></div>
      
      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-300">
        <div class="text-center">
          <div class="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-600">
              <path d="M3 6h18"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              <path d="M10 11v6"/>
              <path d="M14 11v6"/>
            </svg>
          </div>
          
          <h3 class="text-lg font-bold text-gray-900 mb-2">Unsend Message?</h3>
          <p class="text-sm text-gray-600 mb-6">
            This message will be removed for everyone in the conversation.
            <br>
            <span class="text-xs text-gray-400">This action cannot be undone.</span>
          </p>
          
          <div class="flex gap-3">
            <button
              @click="closeUnsendModal"
              class="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              @click="confirmUnsend"
              :disabled="isUnsendLoading"
              class="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
            >
              <svg v-if="isUnsendLoading" class="animate-spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              {{ isUnsendLoading ? 'Unsend...' : 'Yes, Unsend' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>

    <!-- Verify Payment Modal -->
  <Teleport to="body">
    <div
      v-if="showVerifyModal"
      class="fixed inset-0 z-[200] flex items-center justify-center p-4"
      @click.self="closeVerifyModal"
    >
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <h3 class="text-lg font-bold text-gray-900 mb-4">Verify Payment</h3>
        <p class="text-sm text-gray-500 mb-4">
          This will record the payment and confirm the linked order.
        </p>

        <div class="space-y-3">
          <div>
            <label class="block text-xs font-semibold text-gray-600 mb-1">Amount to Record (₱)</label>
            <input
              v-model.number="verifyAmount"
              type="number"
              class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p class="text-[10px] text-gray-400 mt-1">
              Customer declared: ₱{{ (selectedProofMsg?.paymentProofData?.amountPaid || 0).toLocaleString() }}
            </p>
          </div>

          <label class="flex items-start gap-2 cursor-pointer">
            <input v-model="verifyIsFullPayment" type="checkbox" class="mt-1" />
            <div class="text-sm">
              <p class="font-semibold text-gray-800">This is a full payment</p>
              <p class="text-xs text-gray-500">Check if customer paid the entire amount. Otherwise recorded as downpayment.</p>
            </div>
          </label>
        </div>

        <div class="flex gap-3 mt-6">
          <button
            @click="closeVerifyModal"
            :disabled="isVerifying"
            class="flex-1 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >Cancel</button>
          <button
            @click="confirmVerify"
            :disabled="isVerifying"
            class="flex-1 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            <svg v-if="isVerifying" class="animate-spin" xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            {{ isVerifying ? 'Verifying…' : 'Verify & Confirm' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- Reject Payment Modal -->
  <Teleport to="body">
    <div
      v-if="showRejectModal"
      class="fixed inset-0 z-[200] flex items-center justify-center p-4"
      @click.self="closeRejectModal"
    >
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <h3 class="text-lg font-bold text-gray-900 mb-4">Reject Payment Proof</h3>
        <p class="text-sm text-gray-500 mb-4">
          The customer will be notified and can resubmit.
        </p>

        <div>
          <label class="block text-xs font-semibold text-gray-600 mb-1">Reason</label>
          <textarea
            v-model="rejectReason"
            rows="3"
            placeholder="e.g., Amount doesn't match / Screenshot is unclear"
            class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
          ></textarea>
        </div>

        <div class="flex gap-3 mt-6">
          <button
            @click="closeRejectModal"
            :disabled="isRejecting"
            class="flex-1 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >Cancel</button>
          <button
            @click="confirmReject"
            :disabled="isRejecting"
            class="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            <svg v-if="isRejecting" class="animate-spin" xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            {{ isRejecting ? 'Rejecting…' : 'Reject' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch, nextTick, computed } from 'vue'
import { adminChatApi, adminOrderApi } from '@/api/api'
const props = defineProps({
  message:               { type: Object,   default: null },
  messages:              { type: Array,    default: () => [] },
  isTyping:              { type: Boolean,  default: false },
  isLoadingMessages:     { type: Boolean,  default: false },
  respondingQuoteId:     { type: String,   default: null },
  onSendReply:           { type: Function, required: true },
  onUnsend:              { type: Function, required: true },
  onTypingIndicator:     { type: Function, default: null },
  messagesContainerRefSetter: { type: Function, default: null },
})

const currentAdmin = localStorage.getItem('adminName')
const emit = defineEmits(['reply', 'status-change', 'quote-accept', 'quote-reject'])

// ── Refs ─────────────────────────────────────────────
const reply             = ref('')
const isSending         = ref(false)
const messagesContainer = ref(null)
const fileInput         = ref(null)
const textareaRef       = ref(null)
const pendingAttachments = ref([])
const replyToMessage    = ref(null)
let typingTimeout       = null

// Unsend modal state
const unsendModal = ref({
  show: false,
  message: null
})
const isUnsendLoading = ref(false)

// ── Payment verification state ──
const showVerifyModal = ref(false)
const showRejectModal = ref(false)
const selectedProofMsg = ref(null)
const verifyAmount = ref(0)
const verifyIsFullPayment = ref(false)
const rejectReason = ref('')
const isVerifying = ref(false)
const isRejecting = ref(false)

// Expose container ref to parent
watch(messagesContainer, (el) => {
  if (props.messagesContainerRefSetter && el) {
    props.messagesContainerRefSetter(el)
  }
})

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

// ── Reply feature ──
function setReplyTo(msg) {
  replyToMessage.value = msg
  if (textareaRef.value) {
    textareaRef.value.focus()
  }
}

function clearReply() {
  replyToMessage.value = null
}

// ── Unsend Modal Methods ─────────────────────────────
const openUnsendModal = (msg) => {
  unsendModal.value = {
    show: true,
    message: msg
  }
}

const closeUnsendModal = () => {
  unsendModal.value = {
    show: false,
    message: null
  }
}

const confirmUnsend = async () => {
  const msg = unsendModal.value.message
  if (!msg) return
  
  isUnsendLoading.value = true
  
  try {
    const messageId = msg.messageId || msg._id
    const ok = await props.onUnsend(messageId)
    
    if (ok) {
      showToast('success', 'Message unsent successfully')
      closeUnsendModal()
    } else {
      showToast('error', 'Failed to unsend message')
    }
  } catch (error) {
    console.error('Failed to unsend message:', error)
    showToast('error', 'Failed to unsend message')
  } finally {
    isUnsendLoading.value = false
  }
}

// ── Payment verify/reject ────────────────────────────
function openVerifyModal(proofMsg) {
  selectedProofMsg.value = proofMsg
  const declaredAmount = proofMsg.paymentProofData?.amountPaid || 0
  verifyAmount.value = declaredAmount

  // ✅ FIX #3 — Auto-detect full payment.
  // A payment request for a downpayment carries `amountDue = 50% of total`.
  // If the customer declared twice that, it's a full payment.
  // We use the payment-request message in the same conversation as a hint.
  const requestMsgId = proofMsg.paymentProofData?.paymentRequestMessageId
  let detectedFullPayment = false

  if (requestMsgId) {
    const requestMsg = props.messages.find(
      (m) => m.messageId === requestMsgId && m.contentType === 'payment-request',
    )
    const requestAmount = Number(requestMsg?.paymentRequestData?.amountDue) || 0
    // If declared >= 1.9× the downpayment ask, treat as full payment
    if (requestAmount > 0 && declaredAmount >= requestAmount * 1.9) {
      detectedFullPayment = true
    }
  }

  verifyIsFullPayment.value = detectedFullPayment
  showVerifyModal.value = true
}

function closeVerifyModal() {
  showVerifyModal.value = false
  selectedProofMsg.value = null
}

async function confirmVerify() {
  if (!selectedProofMsg.value) return
  isVerifying.value = true
  try {
    const res = await adminChatApi.verifyPaymentProof(selectedProofMsg.value.messageId, {
      isFullPayment: verifyIsFullPayment.value,
      adjustedAmount: Number(verifyAmount.value) || null,
    })
    if (res.success) {
      showToast('success', 'Payment verified — order confirmed')
      closeVerifyModal()
    } else {
      showToast('error', res.message || 'Failed to verify payment')
    }
  } catch (e) {
    console.error('confirmVerify error:', e)
    showToast('error', 'Failed to verify payment')
  } finally {
    isVerifying.value = false
  }
}

function openRejectModal(proofMsg) {
  selectedProofMsg.value = proofMsg
  rejectReason.value = ''
  showRejectModal.value = true
}

function closeRejectModal() {
  showRejectModal.value = false
  selectedProofMsg.value = null
}

async function confirmReject() {
  if (!selectedProofMsg.value) return
  isRejecting.value = true
  try {
    const res = await adminChatApi.rejectPaymentProof(selectedProofMsg.value.messageId, rejectReason.value)
    if (res.success) {
      showToast('success', 'Payment proof rejected')
      closeRejectModal()
    } else {
      showToast('error', res.message || 'Failed to reject proof')
    }
  } catch (e) {
    console.error('confirmReject error:', e)
    showToast('error', 'Failed to reject proof')
  } finally {
    isRejecting.value = false
  }
}

// ── Toast helper ──────────────────────────────────────
const showToast = (type, message) => {
  window.dispatchEvent(new CustomEvent('show-toast', { 
    detail: { type, message } 
  }))
}

// ── Check if user can unsend a message ─────────────────
const canUnsendMessage = (msg) => {
  if (msg.isDeleted) return false
  const isAdmin = (msg.senderType || msg.sender) === 'admin'
  if (!isAdmin) return false
  
  const msgTime = new Date(msg.createdAt || msg.timestamp).getTime()
  const now = Date.now()
  const ageInMinutes = (now - msgTime) / 60000
  
  return ageInMinutes <= 5
}

async function uploadFiles(files) {
  const formData = new FormData()
  files.forEach(file => {
    formData.append('files', file)
  })
  
  try {
    const token = localStorage.getItem('adminToken')
    const response = await fetch(`${API_URL}/api/v1/chat/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })
    const result = await response.json()
    if (result.success) {
      return result.files
    }
    return []
  } catch (error) {
    console.error('Upload failed:', error)
    return []
  }
}

// ── Scroll to bottom ─────────────────────────────────
const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

watch(
  () => props.messages.length,
  async () => { await scrollToBottom() },
  { immediate: true }
)

watch(
  () => props.message?.conversationId,
  () => {
    reply.value = ''
    isSending.value = false
    replyToMessage.value = null
    pendingAttachments.value.forEach((f) => f.preview && URL.revokeObjectURL(f.preview))
    pendingAttachments.value = []
  }
)

watch(reply, async () => {
  await nextTick()
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto'
    textareaRef.value.style.height = `${Math.min(textareaRef.value.scrollHeight, 120)}px`
  }
})

// ── Grouped messages ─────────────────────────
const groupedMessages = computed(() => {
  if (!props.messages.length) return []
  const groups = []
  let currentDate = ''

  props.messages.forEach((msg) => {
    const d = new Date(msg.createdAt || msg.timestamp)
    const label = formatDayLabel(d)
    if (label !== currentDate) {
      currentDate = label
      groups.push({ label, messages: [] })
    }
    groups[groups.length - 1].messages.push(msg)
  })

  return groups
})

// ── Helpers ───────────────────────────────────────────
const isAdminMessage = (msg) => (msg.senderType || msg.sender) === 'admin'

const formatTime = (ts) => {
  if (!ts) return ''
  return new Date(ts).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })
}

const formatDayLabel = (date) => {
  const now = new Date()
  const d = new Date(date)
  const diff = now - d

  if (diff < 86400000 && now.getDate() === d.getDate()) return 'Today'
  if (diff < 172800000) return 'Yesterday'
  return d.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: diff > 31536000000 ? 'numeric' : undefined })
}

const formatFileSize = (bytes) => {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)}KB`
  return `${(bytes / 1048576).toFixed(1)}MB`
}

const AVATAR_COLORS = [
  '#2563eb','#7c3aed','#db2777','#dc2626','#d97706',
  '#059669','#0891b2','#4f46e5','#c026d3','#65a30d',
]
const getAvatarColor = (name = '') => {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

function isImageFile(file) {
  if (file.type) {
    return file.type.startsWith('image/')
  }
  if (file.mimetype) {
    return file.mimetype.startsWith('image/')
  }
  if (file.name) {
    return /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(file.name)
  }
  if (file.contentType) {
    return file.contentType.startsWith('image/')
  }
  return false
}

function getFileUrl(file) {
  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
  
  if (typeof file === 'string') {
    if (file.startsWith('http')) return file
    if (file.startsWith('/')) return `${baseURL}${file}`
    if (file.startsWith('uploads/')) return `${baseURL}/${file}`
    return `${baseURL}/uploads/chat/${file}`
  }
  
  if (file.path) {
    let cleanPath = file.path.replace(/^\/+/, '')
    if (cleanPath.startsWith('http')) return cleanPath
    if (cleanPath.startsWith('uploads/')) return `${baseURL}/${cleanPath}`
    if (cleanPath.startsWith('/uploads/')) return `${baseURL}${cleanPath}`
    if (!cleanPath.includes('/')) return `${baseURL}/uploads/chat/${cleanPath}`
    return `${baseURL}/${cleanPath}`
  }
  
  if (file.url) {
    if (file.url.startsWith('blob:')) return file.url
    if (file.url.startsWith('/')) return `${baseURL}${file.url}`
    if (file.url.startsWith('http')) return file.url
    if (file.url.startsWith('uploads/')) return `${baseURL}/${file.url}`
    return `${baseURL}/${file.url}`
  }
  
  if (file.name) {
    return `${baseURL}/uploads/chat/${file.name}`
  }
  
  return ''
}

function handleImageError(e) {
  console.error('Image failed to load:', e.target.src)
  e.target.onerror = null
  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%23999" stroke-width="1"%3E%3Crect x="3" y="3" width="18" height="18" rx="2"%3E%3C/rect%3E%3Ccircle cx="8.5" cy="8.5" r="1.5"%3E%3C/circle%3E%3Cpath d="M21 15l-5-5-6 6-3-3-4 4"%3E%3C/path%3E%3C/svg%3E'
  e.target.classList.add('bg-gray-100', 'p-4')
}

const openImageViewer = (url) => {
  if (url && !url.startsWith('blob:')) {
    window.dispatchEvent(new CustomEvent('open-image-viewer', { detail: url }))
  }
}

// ── File handling ─────────────────────────────────────
const handleFileSelect = (e) => {
  const MAX = 10 * 1024 * 1024
  Array.from(e.target.files).forEach((file) => {
    if (file.size > MAX) {
      console.warn(`${file.name} exceeds 10MB`)
      return
    }
    pendingAttachments.value.push(
      Object.assign(file, { preview: URL.createObjectURL(file) })
    )
  })
  e.target.value = ''
}

const removeAttachment = (idx) => {
  const f = pendingAttachments.value[idx]
  if (f?.preview) URL.revokeObjectURL(f.preview)
  pendingAttachments.value.splice(idx, 1)
}

// ── Typing indicator ──────────────────────────────────
const onInput = () => {
  if (props.onTypingIndicator && props.message) {
    props.onTypingIndicator(props.message.conversationId, true)
    clearTimeout(typingTimeout)
    typingTimeout = setTimeout(() => {
      props.onTypingIndicator(props.message.conversationId, false)
    }, 1500)
  }
}

// ── Send message with reply support ──────────────────
async function sendReply() {
  const content = reply.value.trim()
  if ((pendingAttachments.value.length === 0 && !content) || isSending.value) return
  
  isSending.value = true
  
  try {
    if (props.onTypingIndicator && props.message) {
      props.onTypingIndicator(props.message.conversationId, false)
    }
    
    let attachments = []
    
    if (pendingAttachments.value.length > 0) {
      attachments = await uploadFiles(pendingAttachments.value)
      console.log('Uploaded attachments:', attachments)
    }
    
    const messageContent = content || (attachments.length > 0 ? '📎 Sent an attachment' : '')
    const replyToMessageId = replyToMessage.value?.messageId || null
    
    console.log('🔵 ADMIN SENDING REPLY - replyToMessage:', replyToMessage.value)
    console.log('🔵 ADMIN SENDING REPLY - replyToMessageId:', replyToMessageId)
    
    const success = await props.onSendReply(
      props.message.conversationId, 
      messageContent, 
      attachments,
      replyToMessageId
    )
    
    if (success) {
      emit('reply', { messageId: props.message.id, text: messageContent })
      reply.value = ''
      replyToMessage.value = null
      pendingAttachments.value = []
    }
  } catch (error) {
    console.error('Failed to send reply:', error)
  } finally {
    isSending.value = false
  }
}
</script>

<style scoped>
/* Bubbles */
.message-bubble {
  border-radius: 18px;
  padding: 10px 14px;
  word-break: break-word;
}
.bubble-admin {
  background: #2563eb;
  color: #fff;
  border-bottom-right-radius: 4px;
}
.bubble-customer {
  background: #fff;
  color: #111827;
  border: 1px solid #e5e7eb;
  border-bottom-left-radius: 4px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.06);
}

/* Typing dots */
.typing-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #9ca3af;
  animation: typingBounce 1.2s infinite ease-in-out;
}
@keyframes typingBounce {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-6px); }
}

/* Spin */
@keyframes spin {
  to { transform: rotate(360deg); }
}
.animate-spin { animation: spin 0.7s linear infinite; }

/* Modal animations */
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
</style>