<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="close">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="close" />
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] overflow-hidden flex flex-col">
          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white flex items-center justify-between flex-shrink-0">
            <div>
              <h2 class="text-lg font-bold text-gray-900 flex items-center gap-2">
                <ShoppingCart class="w-5 h-5 text-blue-600" />
                Create Walk-in Order
              </h2>
              <p class="text-xs text-gray-500 mt-0.5">Create an order on behalf of a walk-in customer</p>
            </div>
            <button @click="close" class="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- Body -->
          <div class="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            <!-- Customer Info -->
            <section class="border border-gray-200 rounded-xl p-4">
              <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Customer Information</p>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label class="block text-xs font-semibold text-gray-600 mb-1">Customer Name <span class="text-red-500">*</span></label>
                  <input v-model="form.customerName" type="text" required class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Juan Dela Cruz" />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-gray-600 mb-1">Email</label>
                  <input v-model="form.customerEmail" type="email" class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="customer@email.com" />
                  <p class="text-[10px] text-gray-400 mt-0.5">Needed to auto-link their chat</p>
                </div>
                <div>
                  <label class="block text-xs font-semibold text-gray-600 mb-1">Phone</label>
                  <input v-model="form.customerPhone" type="tel" class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="0917 123 4567" />
                </div>
              </div>
            </section>

            <!-- Order Type -->
            <section class="border border-gray-200 rounded-xl p-4">
              <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Order Type</p>
              <div class="grid grid-cols-2 gap-3">
                <button type="button" @click="form.orderType = 'company'"
                  class="py-3 rounded-xl border-2 transition-all text-left px-4"
                  :class="form.orderType === 'company' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'">
                  <p class="font-bold text-sm" :class="form.orderType === 'company' ? 'text-green-700' : 'text-gray-700'">Company Product</p>
                  <p class="text-xs text-gray-500 mt-0.5">Cups, lids, containers from our catalog</p>
                </button>
                <button type="button" @click="form.orderType = 'own-cups'"
                  class="py-3 rounded-xl border-2 transition-all text-left px-4"
                  :class="form.orderType === 'own-cups' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'">
                  <p class="font-bold text-sm" :class="form.orderType === 'own-cups' ? 'text-blue-700' : 'text-gray-700'">Own-Cups</p>
                  <p class="text-xs text-gray-500 mt-0.5">Customer brings their own items</p>
                </button>
              </div>
            </section>

            <!-- ═══════════ COMPANY PRODUCT ═══════════ -->
            <section v-if="form.orderType === 'company'" class="border border-gray-200 rounded-xl p-4 space-y-4">
              <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Company Product</p>

              <!-- Product picker -->
              <div v-if="!form.productId" class="space-y-3">
                <input v-model="productSearch" type="text" placeholder="Search products…" class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <div v-if="isLoadingProducts" class="text-center py-6 text-sm text-gray-500">Loading products…</div>
                <div v-else class="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                  <button v-for="p in filteredProducts" :key="p.id" type="button" @click="selectProduct(p)"
                    class="flex items-center gap-2 p-2 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all text-left">
                    <img :src="p.image" class="w-10 h-10 rounded object-cover bg-gray-100 flex-shrink-0" @error="e => e.target.style.visibility='hidden'" />
                    <div class="min-w-0">
                      <p class="text-xs font-semibold text-gray-900 truncate">{{ p.name }}</p>
                      <p class="text-[10px] text-gray-500">{{ p.category }}</p>
                    </div>
                  </button>
                </div>
                <p v-if="!isLoadingProducts && filteredProducts.length === 0" class="text-center py-6 text-sm text-gray-400">No products found</p>
              </div>

              <!-- Selected product -->
              <div v-else class="space-y-4">
                <div class="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                  <img :src="selectedProduct?.image" class="w-12 h-12 rounded-lg object-cover bg-white" />
                  <div class="flex-1">
                    <p class="font-bold text-sm">{{ selectedProduct?.name }}</p>
                    <p class="text-xs text-gray-500">{{ selectedProduct?.category }} · Min order {{ selectedProduct?.minOrder || 1 }} pcs</p>
                  </div>
                  <button type="button" @click="clearProduct" class="text-xs font-semibold text-blue-700 hover:text-blue-800">Change</button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Size <span class="text-red-500">*</span></label>
                    <select v-model="form.size" class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                      <option value="">Select…</option>
                      <option v-for="s in selectedProduct?.sizes || []" :key="s.name" :value="s.name" :disabled="(s.stock || 0) === 0">
                        {{ s.name }} — ₱{{ (s.price || 0).toFixed(2) }} ({{ s.stock || 0 }} in stock)
                      </option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Quantity <span class="text-red-500">*</span></label>
                    <input v-model.number="form.quantity" type="number" :min="minOrderForSelected" class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" :class="{ 'border-red-300': quantityBelowMin }" />
                    <p v-if="quantityBelowMin" class="text-[10px] text-red-500 mt-0.5">Minimum {{ minOrderForSelected }} pcs</p>
                    <p v-else-if="sizeStockExceeded" class="text-[10px] text-red-500 mt-0.5">Only {{ selectedSize?.stock || 0 }} in stock</p>
                    <p v-else-if="minOrderForSelected > 1" class="text-[10px] text-gray-400 mt-0.5">Min order: {{ minOrderForSelected }} pcs</p>
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Unit Price (₱)</label>
                    <input v-model.number="form.unitPrice" type="number" min="0" step="0.01" class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <p class="text-[10px] text-gray-400 mt-0.5">Auto from bulk tier</p>
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Subtotal</label>
                    <div class="px-3 py-2 text-sm font-bold text-gray-900 bg-gray-50 rounded-lg border border-gray-200">₱{{ productSubtotal.toFixed(2) }}</div>
                  </div>
                </div>

                <!-- Design section -->
                <div class="border-t border-gray-100 pt-4">
                  <label class="flex items-center gap-2 cursor-pointer mb-3">
                    <input v-model="form.hasDesign" type="checkbox" class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span class="text-sm font-semibold text-gray-800">Include design &amp; printing service</span>
                  </label>

                  <div v-if="form.hasDesign" class="space-y-3 pl-6 border-l-2 border-blue-100">
                    <!-- Design image -->
                    <div>
                      <label class="block text-xs font-semibold text-gray-600 mb-1">Design Image</label>
                      <div v-if="form.designImage" class="relative inline-block mb-2">
                        <img :src="form.designImage" class="h-24 rounded-xl border border-gray-200 object-cover" />
                        <button type="button" @click="clearDesignImage" class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                          <X class="w-3 h-3" />
                        </button>
                      </div>
                      <label v-else class="flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg py-3 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all">
                        <Image class="w-4 h-4 text-gray-400" />
                        <span class="text-xs font-medium text-gray-600">{{ uploadingDesign ? 'Uploading…' : 'Upload design image' }}</span>
                        <input type="file" accept="image/*" class="hidden" @change="handleDesignImageUpload" :disabled="uploadingDesign" />
                      </label>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1">Print Size</label>
                        <input v-model="form.printSize" type="text" placeholder="e.g., 3x3 inches" class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1">Print Placement</label>
                        <input v-model="form.printPlacement" type="text" placeholder="e.g., Front center, wrap-around" class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                    </div>

                    <div>

              <!-- Design fee — editable whenever a design is involved -->
              <div v-if="designFeeApplies">
                <label class="block text-xs font-semibold text-gray-600 mb-1">Design &amp; Printing Fee (₱)</label>
                <input v-model.number="form.designFee" type="number" min="0" step="0.01" class="w-full md:w-48 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <p class="text-[10px] text-gray-400 mt-0.5">Adjust based on design complexity. Default is ₱500.</p>
              </div>
                    </div>

                    <div>
                      <label class="block text-xs font-semibold text-gray-600 mb-1">Design Notes</label>
                      <textarea v-model="form.designNotes" rows="2" placeholder="Colors, fonts, special instructions…" class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- ═══════════ OWN-CUPS ═══════════ -->
            <section v-if="form.orderType === 'own-cups'" class="border border-gray-200 rounded-xl p-4 space-y-3">
              <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Customer's Own Item</p>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div class="md:col-span-2">
                  <label class="block text-xs font-semibold text-gray-600 mb-1">Item Name <span class="text-red-500">*</span></label>
                  <input v-model="form.ownItemName" type="text" placeholder="e.g., Personalized tumbler 500ml" class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-gray-600 mb-1">Quantity <span class="text-red-500">*</span></label>
                  <input v-model.number="form.ownItemQuantity" type="number" min="1" class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-semibold text-gray-600 mb-1">Print Size</label>
                  <input v-model="form.printSize" type="text" placeholder="e.g., 3x3 inches" class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-gray-600 mb-1">Print Placement</label>
                  <input v-model="form.printPlacement" type="text" placeholder="e.g., Front center" class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-600 mb-1">Item Photos <span class="text-red-500">*</span></label>
                <p class="text-[10px] text-gray-500 mb-2">At least one photo of the customer's item is required.</p>
                <div v-if="form.itemPhotos.length > 0" class="grid grid-cols-4 gap-2 mb-2">
                  <div v-for="(url, i) in form.itemPhotos" :key="i" class="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                    <img :src="url" class="w-full h-full object-cover" />
                    <button type="button" @click="removePhoto(i)" class="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                  </div>
                </div>
                <label class="flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg py-3 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all">
                  <Upload class="w-4 h-4 text-gray-400" />
                  <span class="text-xs font-medium text-gray-600">{{ uploadingPhoto ? 'Uploading…' : 'Add photos' }}</span>
                  <input type="file" accept="image/*" multiple class="hidden" @change="handlePhotoUpload" :disabled="uploadingPhoto" />
                </label>
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-600 mb-1">Design Notes</label>
                <textarea v-model="form.designNotes" rows="2" placeholder="e.g., Logo center, text below" class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"></textarea>
              </div>
            </section>

            <!-- ═══════════ DELIVERY + PAYMENT ═══════════ -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

              <!-- DELIVERY (address now lives right under the radio buttons) -->
              <section class="border border-gray-200 rounded-xl p-4 space-y-3">
                <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Delivery</p>

                <div class="grid grid-cols-2 gap-2">
                  <button type="button" @click="form.receivingMode = 'Pick-up'"
                    class="py-2 rounded-lg text-sm font-semibold border-2 transition-all"
                    :class="form.receivingMode === 'Pick-up' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600'">
                    Pick-up
                  </button>
                  <button type="button" @click="form.receivingMode = 'Delivery'"
                    class="py-2 rounded-lg text-sm font-semibold border-2 transition-all"
                    :class="form.receivingMode === 'Delivery' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600'">
                    Delivery
                  </button>
                </div>

                <div v-if="form.receivingMode === 'Delivery'" class="space-y-3">
                  <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Delivery Address <span class="text-red-500">*</span></label>
                    <input v-model="form.address" type="text" required placeholder="Street, Barangay, City" class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Shipping Fee (₱)</label>
                    <input v-model.number="form.shippingFee" type="number" min="0" step="0.01" class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>

                <div>
                  <label class="block text-xs font-semibold text-gray-600 mb-1">Expected Delivery Date</label>
                  <input v-model="form.expectedDelivery" type="date" :min="minDateForPicker" class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                  <p class="text-[10px] text-gray-400 mt-0.5">Leave blank to use the default ({{ form.receivingMode === 'Pick-up' ? '5' : '6' }} business days)</p>
                </div>
              </section>

              <!-- PAYMENT -->
              <section class="border border-gray-200 rounded-xl p-4 space-y-3">
                <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Payment</p>

                <div class="grid grid-cols-3 gap-2">
                  <button v-for="opt in ['Unpaid', 'Partial', 'Paid']" :key="opt" type="button" @click="selectPaymentStatus(opt)"
                    class="py-2 rounded-lg text-xs font-semibold border-2 transition-all"
                    :class="form.paymentStatus === opt ? paymentBtnActive(opt) : 'border-gray-200 text-gray-600'">
                    {{ opt }}
                  </button>
                </div>

                <div v-if="form.paymentStatus === 'Partial'">
                  <label class="block text-xs font-semibold text-gray-600 mb-1">Amount Paid (₱) <span class="text-red-500">*</span></label>
                  <input v-model.number="form.amountPaid" type="number" min="0" step="0.01" class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <p class="text-[10px] text-gray-400 mt-0.5">Total is ₱{{ grandTotal.toFixed(2) }} · Suggested 50% = ₱{{ (grandTotal / 2).toFixed(2) }}</p>
                </div>
              </section>
            </div>

            <!-- ═══════════ FEES + SUMMARY ═══════════ -->
            <section class="border border-gray-200 rounded-xl p-4 space-y-3">

              <div class="pt-2 border-t border-gray-100 space-y-1.5">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500">Product subtotal</span>
                  <span class="font-semibold">₱{{ productSubtotal.toFixed(2) }}</span>
                </div>
                <div v-if="appliedDesignFee > 0" class="flex justify-between text-sm">
                  <span class="text-gray-500">Design &amp; printing</span>
                  <span class="font-semibold">₱{{ appliedDesignFee.toFixed(2) }}</span>
                </div>
                <div v-if="appliedShippingFee > 0" class="flex justify-between text-sm">
                  <span class="text-gray-500">Shipping</span>
                  <span class="font-semibold">₱{{ appliedShippingFee.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between pt-2 border-t border-gray-200">
                  <span class="font-bold text-gray-900">Total</span>
                  <span class="font-black text-blue-600 text-lg">₱{{ grandTotal.toFixed(2) }}</span>
                </div>
              </div>
            </section>

            <!-- Notes -->
            <section class="border border-gray-200 rounded-xl p-4">
              <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Order Notes</label>
              <textarea v-model="form.notes" rows="2" placeholder="Any additional notes…" class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"></textarea>
            </section>

            <div v-if="errorMessage" class="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 flex items-start gap-2">
              <AlertCircle class="w-4 h-4 flex-shrink-0 mt-0.5" />
              {{ errorMessage }}
            </div>
          </div>

          <!-- Footer -->
          <div class="px-6 py-4 border-t border-gray-100 flex gap-3 flex-shrink-0">
            <button type="button" @click="close" :disabled="isSubmitting" class="flex-1 py-2.5 border-2 border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 disabled:opacity-50">
              Cancel
            </button>
            <button type="button" @click="submit" :disabled="isSubmitting || !isValid"
              class="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
              {{ isSubmitting ? 'Creating…' : 'Create Order' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { X, ShoppingCart, Upload, AlertCircle, Loader2, Image } from 'lucide-vue-next'
import { adminProductApi, adminOrderApi, designApi } from '@/api/api'

const props = defineProps({ show: { type: Boolean, default: false } })
const emit = defineEmits(['close', 'created'])

const DEFAULT_DESIGN_FEE = 500

const form = ref({
  customerName: '', customerEmail: '', customerPhone: '',
  orderType: 'company',
  // Company product
  productId: '', size: '', quantity: 1, unitPrice: 0, hasDesign: false,
  designImage: '', printSize: '', printPlacement: '', designNotes: '',
  designFee: DEFAULT_DESIGN_FEE,
  // Own-cups
  ownItemName: '', ownItemQuantity: 1,
  itemPhotos: [], itemPhotoPublicIds: [],
  // Delivery
  receivingMode: 'Pick-up', address: '', shippingFee: 0,
  expectedDelivery: '',
  // Payment
  paymentStatus: 'Unpaid', amountPaid: 0,
  notes: '',
})

const products = ref([])
const isLoadingProducts = ref(false)
const productSearch = ref('')
const uploadingPhoto = ref(false)
const uploadingDesign = ref(false)
const isSubmitting = ref(false)
const errorMessage = ref('')

// ── Selected product + size ────────────────────────────────────────
const selectedProduct = computed(() =>
  products.value.find(p => p.id === form.value.productId) || null
)
const selectedSize = computed(() =>
  selectedProduct.value?.sizes?.find(s => s.name === form.value.size) || null
)

const minOrderForSelected = computed(() => {
  const m = Number(selectedProduct.value?.minOrder) || 1
  return m
})

const quantityBelowMin = computed(() => {
  if (form.value.orderType !== 'company' || !selectedProduct.value) return false
  const q = Number(form.value.quantity) || 0
  return q > 0 && q < minOrderForSelected.value
})

const sizeStockExceeded = computed(() =>
  !!selectedSize.value && form.value.quantity > (selectedSize.value.stock || 0)
)

// ── Products list filter ───────────────────────────────────────────
const filteredProducts = computed(() => {
  const q = productSearch.value.trim().toLowerCase()
  if (!q) return products.value
  return products.value.filter(p =>
    p.name?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q)
  )
})

// ── Auto-fill unit price + min quantity when size/qty changes ─────
watch([() => form.value.size, () => form.value.quantity], () => {
  if (form.value.orderType !== 'company' || !selectedSize.value) return
  const s = selectedSize.value
  const qty = Number(form.value.quantity) || 0
  let price = s.price || 0
  if (qty >= 5000 && s.bulkPrices?.[5000]) price = s.bulkPrices[5000] / 5000
  else if (qty >= 2000 && s.bulkPrices?.[2000]) price = s.bulkPrices[2000] / 2000
  else if (qty >= 1000 && s.bulkPrices?.[1000]) price = s.bulkPrices[1000] / 1000
  else if (qty >= 500 && s.bulkPrices?.[500]) price = s.bulkPrices[500] / 500
  form.value.unitPrice = Number(price.toFixed(2))
})

// When a size is picked, if the current quantity is below minOrder,
// snap it up to minOrder so the field is never invalid by default.
watch(() => form.value.size, (name) => {
  if (form.value.orderType !== 'company') return
  if (!name) return
  const m = minOrderForSelected.value
  if (!form.value.quantity || form.value.quantity < m) {
    form.value.quantity = m
  }
})

watch(() => form.value.receivingMode, (m) => {
  if (m === 'Pick-up') form.value.shippingFee = 0
})

// ── Computed money ─────────────────────────────────────────────────
const productSubtotal = computed(() => {
  if (form.value.orderType === 'own-cups') return 0
  return Number(((Number(form.value.unitPrice) || 0) * (Number(form.value.quantity) || 0)).toFixed(2))
})

const designFeeApplies = computed(() => {
  if (form.value.orderType === 'own-cups') return true
  return !!form.value.hasDesign
})

const appliedDesignFee = computed(() => {
  if (!designFeeApplies.value) return 0
  const fee = Number(form.value.designFee)
  return Number.isFinite(fee) && fee >= 0 ? fee : DEFAULT_DESIGN_FEE
})

const appliedShippingFee = computed(() =>
  form.value.receivingMode === 'Pick-up' ? 0 : (Number(form.value.shippingFee) || 0)
)

const grandTotal = computed(() =>
  Number((productSubtotal.value + appliedDesignFee.value + appliedShippingFee.value).toFixed(2))
)

// ── Partial payment default = 50% of total ────────────────────────
function selectPaymentStatus(opt) {
  form.value.paymentStatus = opt
  if (opt === 'Partial') {
    // Suggest 50% of the total
    form.value.amountPaid = Number((grandTotal.value * 0.5).toFixed(2))
  } else if (opt === 'Paid') {
    form.value.amountPaid = grandTotal.value
  } else {
    form.value.amountPaid = 0
  }
}

// Keep the suggested partial amount in sync with the total until
// the admin manually edits the field.
let adminEditedPartial = false
watch(() => form.value.amountPaid, (v, oldV) => {
  // If the user changes it away from the last auto-suggestion, lock it
  if (form.value.paymentStatus === 'Partial') {
    const expected = Number((grandTotal.value * 0.5).toFixed(2))
    if (v !== expected && oldV === expected) adminEditedPartial = true
  }
})

watch(grandTotal, (t) => {
  if (form.value.paymentStatus === 'Partial' && !adminEditedPartial) {
    form.value.amountPaid = Number((t * 0.5).toFixed(2))
  }
})

// ── Validation ─────────────────────────────────────────────────────
const isValid = computed(() => {
  if (!form.value.customerName.trim()) return false
  if (form.value.receivingMode === 'Delivery' && !form.value.address.trim()) return false

  if (form.value.orderType === 'company') {
    if (!form.value.productId || !form.value.size) return false
    if ((Number(form.value.quantity) || 0) < minOrderForSelected.value) return false
    if (sizeStockExceeded.value) return false
    if (form.value.hasDesign) {
      if (!form.value.designImage) return false
    }
  } else {
    if (!form.value.ownItemName.trim()) return false
    if ((Number(form.value.ownItemQuantity) || 0) < 1) return false
    if (form.value.itemPhotos.length === 0) return false
  }

  if (form.value.paymentStatus === 'Partial') {
    const amt = Number(form.value.amountPaid) || 0
    if (amt <= 0 || amt >= grandTotal.value) return false
  }

  return true
})

const minDateForPicker = computed(() => {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
})

// ── Helpers ────────────────────────────────────────────────────────
function paymentBtnActive(opt) {
  if (opt === 'Paid') return 'border-green-500 bg-green-50 text-green-700'
  if (opt === 'Partial') return 'border-orange-400 bg-orange-50 text-orange-700'
  return 'border-red-400 bg-red-50 text-red-600'
}

function selectProduct(p) {
  form.value.productId = p.id
  form.value.size = ''
  form.value.quantity = Number(p.minOrder) || 1
  form.value.unitPrice = 0
  form.value.hasDesign = false
  form.value.designImage = ''
  form.value.printSize = ''
  form.value.printPlacement = ''
  form.value.designNotes = ''
  form.value.designFee = DEFAULT_DESIGN_FEE
}

function clearProduct() {
  selectProduct({ id: '', minOrder: 1 })
  form.value.productId = ''
}

function clearDesignImage() {
  form.value.designImage = ''
}

// ── Uploads ────────────────────────────────────────────────────────
async function handleDesignImageUpload(e) {
  const file = e.target.files?.[0]
  if (!file) return
  uploadingDesign.value = true
  errorMessage.value = ''
  try {
    const result = await designApi.uploadDesign([file])
    if (result.success && Array.isArray(result.files) && result.files.length > 0) {
      form.value.designImage = result.files[0].url || result.files[0].path
    } else {
      errorMessage.value = result.message || 'Design upload failed'
    }
  } catch (err) {
    errorMessage.value = 'Design upload failed'
  } finally {
    uploadingDesign.value = false
    e.target.value = ''
  }
}

async function handlePhotoUpload(e) {
  const files = Array.from(e.target.files || [])
  if (!files.length) return
  uploadingPhoto.value = true
  errorMessage.value = ''
  try {
const result = await designApi.uploadDesign(files)
    if (result.success && Array.isArray(result.files)) {
      for (const f of result.files) {
        form.value.itemPhotos.push(f.url || f.path)
        if (f.public_id) form.value.itemPhotoPublicIds.push(f.public_id)
      }
    } else {
      errorMessage.value = result.message || 'Photo upload failed'
    }
  } catch (err) {
    errorMessage.value = 'Photo upload failed'
  } finally {
    uploadingPhoto.value = false
    e.target.value = ''
  }
}

function removePhoto(i) {
  form.value.itemPhotos.splice(i, 1)
  form.value.itemPhotoPublicIds.splice(i, 1)
}

// ── Reset ──────────────────────────────────────────────────────────
function resetForm() {
  form.value = {
    customerName: '', customerEmail: '', customerPhone: '',
    orderType: 'company',
    productId: '', size: '', quantity: 1, unitPrice: 0, hasDesign: false,
    designImage: '', printSize: '', printPlacement: '', designNotes: '',
    designFee: DEFAULT_DESIGN_FEE,
    ownItemName: '', ownItemQuantity: 1,
    itemPhotos: [], itemPhotoPublicIds: [],
    receivingMode: 'Pick-up', address: '', shippingFee: 0,
    expectedDelivery: '',
    paymentStatus: 'Unpaid', amountPaid: 0,
    notes: '',
  }
  productSearch.value = ''
  errorMessage.value = ''
  isSubmitting.value = false
  adminEditedPartial = false
}

watch(() => props.show, async (open) => {
  if (open) {
    resetForm()
    await loadProducts()
  }
})

async function loadProducts() {
  isLoadingProducts.value = true
  try {
    const res = await adminProductApi.getAllProducts()
    if (res.success) products.value = res.data || []
  } catch (e) {
    console.error('loadProducts error:', e)
  } finally {
    isLoadingProducts.value = false
  }
}

// ── Payload ────────────────────────────────────────────────────────
function buildPayload() {
  const isOwn = form.value.orderType === 'own-cups'

  const items = isOwn
    ? [{
        productId: null,
        name: form.value.ownItemName.trim(),
        category: 'Customer Provided',
        size: 'Custom',
        quantity: Number(form.value.ownItemQuantity),
        designSource: 'upload',
        designImage: '',
        printSize: form.value.printSize,
        printPlacement: form.value.printPlacement,
        designNotes: form.value.designNotes,
        files: [],
        itemPhotos: form.value.itemPhotos,
        itemPhotoPublicIds: form.value.itemPhotoPublicIds,
        estimatedTotal: 0,
      }]
    : [{
        productId: form.value.productId,
        name: selectedProduct.value?.name || '',
        category: selectedProduct.value?.category || '',
        size: form.value.size,
        quantity: Number(form.value.quantity),
        unitPrice: Number(form.value.unitPrice),   // explicit admin override
        designSource: form.value.hasDesign ? 'upload' : 'no-design',
        designImage: form.value.hasDesign ? form.value.designImage : '',
        printSize: form.value.hasDesign ? form.value.printSize : '',
        printPlacement: form.value.hasDesign ? form.value.printPlacement : '',
        designNotes: form.value.hasDesign
          ? form.value.designNotes
          : 'No design - plain product, as is.',
        files: [],
        estimatedTotal: productSubtotal.value,
      }]

  return {
    customerName: form.value.customerName.trim(),
    customerEmail: form.value.customerEmail.trim().toLowerCase() || null,
    customerPhone: form.value.customerPhone.trim(),
    address: form.value.address.trim(),
    postalCode: '',
    isProvided: isOwn,
    items,
    receivingMode: form.value.receivingMode,
    shippingFee: appliedShippingFee.value,
    expectedDelivery: form.value.expectedDelivery || null,
    designFee: appliedDesignFee.value,
    notes: form.value.notes.trim(),
    paymentMethod: 'cod',
    initialPaymentStatus: form.value.paymentStatus,
    initialAmountPaid:
      form.value.paymentStatus === 'Partial' ? Number(form.value.amountPaid) : 0,
  }
}

async function submit() {
  if (!isValid.value || isSubmitting.value) return
  isSubmitting.value = true
  errorMessage.value = ''
  try {
    const res = await adminOrderApi.createWalkInOrder(buildPayload())
    if (res.success) {
      emit('created', res.data)
      emit('close')
    } else {
      errorMessage.value = res.message || 'Failed to create order'
    }
  } catch (err) {
    errorMessage.value = err.response?.data?.message || err.message || 'Failed to create order'
  } finally {
    isSubmitting.value = false
  }
}

function close() {
  if (isSubmitting.value) return
  emit('close')
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
@keyframes spin { to { transform: rotate(360deg); } }
.animate-spin { animation: spin 0.7s linear infinite; }
</style>