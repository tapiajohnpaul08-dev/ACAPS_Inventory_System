<template>
  <div class="min-h-screen bg-gray-50 p-6 lg:p-8 font-[system-ui]">

    <!-- ── Header ──────────────────────────────────────────────────────── -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-black text-gray-900 tracking-tight">Analytics</h1>
        <p class="text-sm text-gray-400 mt-0.5">
          Last updated {{ lastUpdated ? formatTime(lastUpdated) : '—' }}
        </p>
      </div>
      <div class="flex items-center gap-2">
        <!-- Export Dropdown -->
        <div class="relative">
          <button
            @click="toggleExportDropdown"
            class="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 shadow-sm transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          
          <div v-if="showExportDropdown" class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-20">
            <button
              @click="exportToExcel"
              class="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 flex items-center gap-3 transition-colors"
            >
              <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
              </svg>
              Export to Excel
            </button>
            <button
              @click="exportToPDF"
              class="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 flex items-center gap-3 transition-colors border-t border-gray-100"
            >
              <svg class="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4v4l4-4h8c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
              </svg>
              Export to PDF
            </button>
          </div>
        </div>
        
        <button
          @click="loadAll(true)"
          :disabled="loading"
          class="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 shadow-sm transition-all"
        >
          <svg :class="{ 'animate-spin': loading }" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>
          Refresh
        </button>
      </div>
    </div>

    <!-- ── Filter Section ───────────────────────────────────────────────────── -->
    <div class="space-y-4 mb-6">
      
      <!-- Quick Presets Row -->
      <div class="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
        <div class="flex flex-wrap items-center gap-2">
          <span class="text-xs font-semibold text-gray-500 mr-1">Quick filters:</span>
          <button
            v-for="p in presets"
            :key="p.key"
            @click="applyPreset(p)"
            class="px-3 py-1.5 text-xs font-medium rounded-lg transition-all"
            :class="activePreset === p.key
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
          >{{ p.label }}</button>
        </div>
      </div>

      <!-- Advanced Filters Row -->
      <div class="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
        <div class="flex flex-wrap items-center gap-4">
          <!-- Month Selector -->
          <div class="flex items-center gap-2">
            <div class="relative">
              <select
                v-model="selectedMonth"
                @change="applyMonthYearFilter"
                class="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer appearance-none pr-8 min-w-[140px]"
              >
                <option value="">All Months</option>
                <option v-for="month in months" :key="month.value" :value="month.value">
                  {{ month.label }}
                </option>
              </select>
              <svg class="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <!-- Year Selector -->
          <div class="flex items-center gap-2">
            <div class="relative">
              <select
                v-model="selectedYear"
                @change="applyMonthYearFilter"
                class="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer appearance-none pr-8 min-w-[120px]"
              >
                <option value="">All Years</option>
                <option v-for="year in availableYears" :key="year" :value="year">
                  {{ year }}
                </option>
              </select>
              <svg class="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <!-- Divider -->
          <div class="w-px h-6 bg-gray-200"></div>

          <!-- Custom Date Range -->
          <div class="flex items-center gap-2">
            <div class="relative">
              <input
                v-model="customFrom"
                type="date"
                class="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <span class="text-xs text-gray-400">→</span>
            <div class="relative">
              <input
                v-model="customTo"
                type="date"
                class="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              @click="applyCustomRange"
              class="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >Apply Range</button>
          </div>

          <!-- Clear All Filters Button -->
          <button
            v-if="hasActiveFilters"
            @click="clearAllFilters"
            class="px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors ml-auto"
          >
            Clear All Filters
          </button>
        </div>

        <!-- Active Filter Badges -->
        <div v-if="filterLabel" class="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
          <span class="text-xs text-gray-500">Active filter:</span>
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
            {{ filterLabel }}
          </span>
        </div>
      </div>
    </div>

    <!-- ── Skeleton / Loading ────────────────────────────────────────────── -->
    <template v-if="loading && !lastUpdated">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div v-for="i in 4" :key="i" class="bg-white rounded-2xl p-5 h-28 animate-pulse border border-gray-100">
          <div class="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
          <div class="h-7 bg-gray-200 rounded w-3/4 mb-3"></div>
          <div class="h-2 bg-gray-100 rounded w-1/3"></div>
        </div>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div v-for="i in 2" :key="i" class="bg-white rounded-2xl h-64 animate-pulse border border-gray-100"></div>
      </div>
    </template>

    <template v-else>
      <!-- ── Stat Cards ─────────────────────────────────────────────────── -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div
          v-for="card in statCards"
          :key="card.label"
          class="group bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default"
        >
          <div class="flex items-center justify-between mb-3">
            <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">{{ card.label }}</p>
            <div class="w-9 h-9 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform" :class="card.iconBg">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" :class="card.iconColor" v-html="card.iconPath"></svg>
            </div>
          </div>
          <p class="text-2xl font-black text-gray-900 mb-2">{{ card.value }}</p>
          <div class="flex items-center gap-1.5">
            <template v-if="card.change !== null && card.change !== undefined">
              <span class="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-xs font-bold"
                :class="card.change >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'">
                {{ card.change >= 0 ? '↑' : '↓' }} {{ Math.abs(card.change) }}%
              </span>
              <span class="text-xs text-gray-400">vs prev period</span>
            </template>
            <span v-else class="text-xs text-gray-400">{{ card.sub }}</span>
          </div>
        </div>
      </div>

      <!-- ── Row 1: Top Products + Order Status ─────────────────────────── -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <TopProductsChart :products="topProducts" />
        <OrderStatusPieChart :segments="orderStatusData" />
      </div>

      <!-- ── Row 2: Revenue by Category + Top Customers (side by side) ──── -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <RevenueByCategoryChart :categories="revenueCategories" />
        <TopCustomersTable :customers="topCustomers" />
      </div>

      <!-- ── Row 3: Monthly Trend (full width) ─────────────────────────── -->
      <div class="mb-6">
        <MonthlyRevenueTrendChart :months="monthlyData" :forecast="forecastData" />
      </div>
    </template>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { analyticsApi } from '@/api/api'
import ExportUtils from '@/utils/exportUtils'
import TopProductsChart from '@/components/analytics/TopProductsChart.vue'
import OrderStatusPieChart from '@/components/analytics/OrderStatusPieChart.vue'
import RevenueByCategoryChart from '@/components/analytics/RevenueByCategoryChart.vue'
import MonthlyRevenueTrendChart from '@/components/analytics/MonthlyRevenueTrendChart.vue'
import TopCustomersTable from '@/components/analytics/TopCustomersTable.vue'

// ── State ──────────────────────────────────────────────────────────────────
const loading = ref(false)
const lastUpdated = ref(null)
const dateFrom = ref(null)
const dateTo = ref(null)
const activePreset = ref('this-month')
const customFrom = ref('')
const customTo = ref('')
const filterLabel = ref('')
const showExportDropdown = ref(false)

const selectedMonth = ref('')
const selectedYear = ref('')

const statsData = ref(null)
const topProducts = ref([])
const orderStatusData = ref([])
const revenueCategories = ref([])
const monthlyData = ref([])
const forecastData = ref([])
const topCustomers = ref([])

// ── Dropdown Options ───────────────────────────────────────────────────────
const months = [
  { value: '1', label: 'January' },
  { value: '2', label: 'February' },
  { value: '3', label: 'March' },
  { value: '4', label: 'April' },
  { value: '5', label: 'May' },
  { value: '6', label: 'June' },
  { value: '7', label: 'July' },
  { value: '8', label: 'August' },
  { value: '9', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' }
]

const availableYears = computed(() => {
  const currentYear = new Date().getFullYear()
  const years = []
  for (let i = currentYear - 5; i <= currentYear; i++) {
    years.push(i)
  }
  return years.reverse()
})

const hasActiveFilters = computed(() => {
  return activePreset.value !== '' || selectedMonth.value !== '' || selectedYear.value !== '' || customFrom.value !== '' || customTo.value !== ''
})

// ── Presets ────────────────────────────────────────────────────────────────
const presets = [
  { key: 'today', label: 'Today' },
  { key: 'this-week', label: 'This Week' },
  { key: 'this-month', label: 'This Month' },
  { key: 'last-30', label: 'Last 30 Days' },
  { key: 'this-quarter', label: 'This Quarter' },
  { key: 'this-year', label: 'This Year' },
  { key: 'all-time', label: 'All Time' },
]

function applyPreset(preset) {
  selectedMonth.value = ''
  selectedYear.value = ''
  customFrom.value = ''
  customTo.value = ''
  
  activePreset.value = preset.key
  const now = new Date()
  const fmt = d => d.toISOString().slice(0, 10)
  let from, to = fmt(now)

  if (preset.key === 'today') {
    from = fmt(now)
    to = fmt(now)
    filterLabel.value = `Today (${now.toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })})`
  } else if (preset.key === 'this-week') {
    const day = now.getDay() || 7
    const monday = new Date(now); monday.setDate(now.getDate() - day + 1)
    from = fmt(monday)
    filterLabel.value = `Week of ${monday.toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })}`
  } else if (preset.key === 'this-month') {
    from = fmt(new Date(now.getFullYear(), now.getMonth(), 1))
    filterLabel.value = now.toLocaleDateString('en-PH', { month: 'long', year: 'numeric' })
  } else if (preset.key === 'last-30') {
    const d = new Date(now); d.setDate(d.getDate() - 30)
    from = fmt(d)
    filterLabel.value = 'Last 30 days'
  } else if (preset.key === 'this-quarter') {
    const q = Math.floor(now.getMonth() / 3)
    from = fmt(new Date(now.getFullYear(), q * 3, 1))
    filterLabel.value = `Q${q + 1} ${now.getFullYear()}`
  } else if (preset.key === 'this-year') {
    from = fmt(new Date(now.getFullYear(), 0, 1))
    filterLabel.value = `Year ${now.getFullYear()}`
  } else {
    from = null; to = null
    filterLabel.value = 'All time'
  }

  dateFrom.value = from
  dateTo.value = to
  loadAll()
}

function applyMonthYearFilter() {
  activePreset.value = ''
  customFrom.value = ''
  customTo.value = ''
  
  const now = new Date()
  let year = selectedYear.value ? parseInt(selectedYear.value) : now.getFullYear()
  let month = selectedMonth.value ? parseInt(selectedMonth.value) - 1 : null
  
  if (month !== null && selectedYear.value) {
    const start = new Date(year, month, 1)
    const end = new Date(year, month + 1, 0)
    dateFrom.value = start.toISOString().slice(0, 10)
    dateTo.value = end.toISOString().slice(0, 10)
    
    const monthName = months.find(m => m.value === String(month + 1))?.label || ''
    filterLabel.value = `${monthName} ${year}`
  } else if (month !== null) {
    const start = new Date(year, month, 1)
    const end = new Date(year, month + 1, 0)
    dateFrom.value = start.toISOString().slice(0, 10)
    dateTo.value = end.toISOString().slice(0, 10)
    
    const monthName = months.find(m => m.value === String(month + 1))?.label || ''
    filterLabel.value = `${monthName} ${year}`
  } else if (selectedYear.value) {
    const start = new Date(year, 0, 1)
    const end = new Date(year, 11, 31)
    dateFrom.value = start.toISOString().slice(0, 10)
    dateTo.value = end.toISOString().slice(0, 10)
    filterLabel.value = `Year ${year}`
  } else {
    dateFrom.value = null
    dateTo.value = null
    filterLabel.value = 'All time'
  }
  
  loadAll()
}

function applyCustomRange() {
  if (!customFrom.value || !customTo.value) return
  selectedMonth.value = ''
  selectedYear.value = ''
  activePreset.value = ''
  dateFrom.value = customFrom.value
  dateTo.value = customTo.value
  filterLabel.value = `${customFrom.value} → ${customTo.value}`
  loadAll()
}

function clearAllFilters() {
  selectedMonth.value = ''
  selectedYear.value = ''
  customFrom.value = ''
  customTo.value = ''
  applyPreset(presets[2])
}

function toggleExportDropdown() {
  showExportDropdown.value = !showExportDropdown.value
  setTimeout(() => {
    const close = () => showExportDropdown.value = false
    document.addEventListener('click', close, { once: true })
  }, 100)
}

// ── Export Functions using Universal Export Utils ──────────────────────────
function prepareExportData() {
  const stats = statsData.value
  if (!stats) return null

  const totalOrders = orderStatusData.value.reduce((sum, s) => sum + s.value, 0)
  
  // Prepare order status with percentages
  const orderStatusWithPct = orderStatusData.value.map(s => ({
    Status: s.label,
    Orders: s.value,
    Percentage: Math.round((s.value / totalOrders) * 100)
  }))

  return {
    summary: {
      totalRevenue: stats.revenue.total,
      averageOrder: stats.revenue.averageOrder,
      totalOrders: stats.orders.total,
      pendingOrders: stats.orders.pending,
      completedOrders: stats.orders.completed,
      cancelledOrders: stats.orders.cancelled,
      totalProducts: stats.products.total,
      lowStockProducts: stats.products.lowStock,
      totalCustomers: stats.customers.total,
      filterPeriod: filterLabel.value,
      exportDate: new Date().toLocaleString()
    },
    topProducts: topProducts.value.map((p, i) => ({
      Rank: i + 1,
      'Product Name': p.name,
      'Units Sold': p.orders,
      Revenue: p.revenue
    })),
    orderStatus: orderStatusWithPct,
    revenueByCategory: revenueCategories.value.map(c => ({
      Category: c.name,
      Revenue: c.revenue,
      Orders: c.orders
    })),
    topCustomers: topCustomers.value.map((c, i) => ({
      Rank: i + 1,
      Customer: c.name || 'Guest',
      Email: c._id,
      Orders: c.totalOrders,
      'Total Spent': c.totalSpent
    })),
    monthlyTrend: monthlyData.value.map(m => ({
      Month: m.month,
      Year: m.year,
      Revenue: m.revenue,
      Orders: m.orders
    }))
  }
}

async function exportToExcel() {
  const data = prepareExportData()
  if (!data) {
    alert('No data available to export')
    return
  }

  const result = await ExportUtils.exportToExcel({
    filename: 'Analytics_Report',
    title: 'ANALYTICS REPORT',
    subtitle: data.summary.filterPeriod,
    sheets: [
      {
        name: 'Metrics Overview',
        headers: ['Metric', 'Value'],
        data: [
          ['Total Revenue', `₱${data.summary.totalRevenue.toLocaleString()}`],
          ['Average Order Value', `₱${Math.round(data.summary.averageOrder).toLocaleString()}`],
          ['Total Orders', data.summary.totalOrders],
          ['Pending Orders', data.summary.pendingOrders],
          ['Completed Orders', data.summary.completedOrders],
          ['Cancelled Orders', data.summary.cancelledOrders],
          ['Total Products', data.summary.totalProducts],
          ['Low Stock Products', data.summary.lowStockProducts],
          ['Total Customers', data.summary.totalCustomers]
        ],
        columnWidths: [25, 20]
      },
      {
        name: 'Top Products',
        headers: ['Rank', 'Product Name', 'Units Sold', 'Revenue'],
        data: data.topProducts,
        columnWidths: [8, 40, 15, 20]
      },
      {
        name: 'Order Status',
        headers: ['Status', 'Orders', 'Percentage'],
        data: data.orderStatus,
        columnWidths: [20, 15, 15]
      },
      {
        name: 'Revenue by Category',
        headers: ['Category', 'Revenue', 'Orders'],
        data: data.revenueByCategory,
        columnWidths: [25, 20, 15]
      },
      {
        name: 'Top Customers',
        headers: ['Rank', 'Customer', 'Email', 'Orders', 'Total Spent'],
        data: data.topCustomers,
        columnWidths: [8, 30, 35, 12, 20]
      },
      {
        name: 'Monthly Trend',
        headers: ['Month', 'Year', 'Revenue', 'Orders'],
        data: data.monthlyTrend,
        columnWidths: [12, 8, 20, 12]
      }
    ]
  })

  if (result.success) {
    console.log('Export successful:', result.filename)
  } else {
    alert('Export failed: ' + result.error)
  }
  showExportDropdown.value = false
}

async function exportToPDF() {
  const data = prepareExportData()
  if (!data) {
    alert('No data available to export')
    return
  }

  const result = await ExportUtils.exportToPDF({
    filename: 'Analytics_Report',
    title: 'Analytics Report',
    subtitle: data.summary.filterPeriod,
    orientation: 'landscape',
    sections: [
      {
        title: 'Metrics Overview',
        headers: ['Metric', 'Value'],
        data: [
          ['Total Revenue', `₱${data.summary.totalRevenue.toLocaleString()}`],
          ['Average Order Value', `₱${Math.round(data.summary.averageOrder).toLocaleString()}`],
          ['Total Orders', data.summary.totalOrders],
          ['Pending Orders', data.summary.pendingOrders],
          ['Completed Orders', data.summary.completedOrders],
          ['Cancelled Orders', data.summary.cancelledOrders],
          ['Total Products', data.summary.totalProducts],
          ['Low Stock Products', data.summary.lowStockProducts],
          ['Total Customers', data.summary.totalCustomers]
        ]
      },
      {
        title: 'Top Selling Products',
        headers: ['Rank', 'Product Name', 'Units Sold', 'Revenue'],
        data: data.topProducts,
        columnStyles: { 0: { cellWidth: 15 }, 1: { cellWidth: 80 }, 2: { cellWidth: 25 }, 3: { cellWidth: 35 } }
      },
      {
        title: 'Order Status Distribution',
        headers: ['Status', 'Orders', 'Percentage'],
        data: data.orderStatus
      },
      {
        title: 'Revenue by Category',
        headers: ['Category', 'Revenue', 'Orders'],
        data: data.revenueByCategory
      },
      {
        title: 'Top Customers',
        headers: ['Rank', 'Customer', 'Email', 'Orders', 'Total Spent'],
        data: data.topCustomers,
        columnStyles: { 0: { cellWidth: 12 }, 1: { cellWidth: 35 }, 2: { cellWidth: 45 }, 3: { cellWidth: 20 }, 4: { cellWidth: 30 } }
      }
    ]
  })

  if (result.success) {
    console.log('Export successful:', result.filename)
  } else {
    alert('Export failed: ' + result.error)
  }
  showExportDropdown.value = false
}

// ── Stat cards computed ────────────────────────────────────────────────────
const statCards = computed(() => {
  const d = statsData.value
  if (!d) return []
  return [
    {
      label: 'Revenue',
      value: `₱${(d.revenue.total || 0).toLocaleString()}`,
      change: d.revenue.change,
      sub: `avg ₱${Math.round(d.revenue.averageOrder || 0).toLocaleString()}/order`,
      iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600',
      iconPath: '<line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>'
    },
    {
      label: 'Orders',
      value: (d.orders.total || 0).toLocaleString(),
      change: d.orders.change,
      sub: `${d.orders.pending || 0} pending`,
      iconBg: 'bg-blue-50', iconColor: 'text-blue-600',
      iconPath: '<path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><polyline points="3.29 7 12 12 20.71 7"/>'
    },
    {
      label: 'Products',
      value: (d.products.total || 0).toLocaleString(),
      change: null,
      sub: `${d.products.lowStock || 0} low stock`,
      iconBg: 'bg-orange-50', iconColor: 'text-orange-600',
      iconPath: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/>'
    },
    {
      label: 'Customers',
      value: (d.customers.total || 0).toLocaleString(),
      change: d.customers.change,
      sub: 'unique customers',
      iconBg: 'bg-purple-50', iconColor: 'text-purple-600',
      iconPath: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>'
    },
  ]
})

// ── Load ───────────────────────────────────────────────────────────────────
async function loadAll(isRefresh = false) {
  loading.value = true
  const from = dateFrom.value
  const to = dateTo.value

  try {
    const [statsRes, topRes, statusRes, catRes, monthlyRes, forecastRes, customersRes] = await Promise.all([
      analyticsApi.getStats(from, to),
      analyticsApi.getTopProducts(5, from, to),
      analyticsApi.getOrderStatusDistribution(from, to),
      analyticsApi.getRevenueByCategory(from, to),
      analyticsApi.getMonthlyRevenue(12),
      analyticsApi.getRevenueForecast(),
      analyticsApi.getTopCustomers(8),
    ])

    if (statsRes.success) statsData.value = statsRes.data
    if (topRes.success) topProducts.value = topRes.data.map(p => ({ name: p._id, orders: p.totalQuantity, revenue: p.totalRevenue }))
    if (statusRes.success) orderStatusData.value = statusRes.data
    if (catRes.success) revenueCategories.value = catRes.data
    if (monthlyRes.success) monthlyData.value = monthlyRes.data
    if (forecastRes.success) forecastData.value = forecastRes.data
    if (customersRes.success) topCustomers.value = customersRes.data

    lastUpdated.value = new Date()
  } catch (e) {
    console.error('Analytics load error:', e)
  } finally {
    loading.value = false
  }
}

function formatTime(d) {
  return d.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })
}

onMounted(() => applyPreset(presets[2]))
</script>