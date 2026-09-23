<template>
  <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
    <div
      v-for="stat in computedStats"
      :key="stat.label"
      class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-1"
    >
      <div class="flex items-center justify-between mb-1">
        <p class="text-xs text-gray-400 font-semibold uppercase tracking-wide leading-tight">{{ stat.label }}</p>
        <div class="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" :class="stat.iconBg">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" :class="stat.iconColor" v-html="stat.icon"></svg>
        </div>
      </div>
      <p class="text-2xl font-black" :class="stat.color">{{ stat.value }}</p>
      <p v-if="stat.sub" class="text-xs" :class="stat.subColor || 'text-gray-400'">{{ stat.sub }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  orders: { type: Array, required: true },
})

const computedStats = computed(() => {
  const orders = props.orders
  const total = orders.length

  const pending    = orders.filter(o => o.status === 'Pending').length
  const confirmed  = orders.filter(o => o.status === 'Confirmed').length
  const scheduled  = orders.filter(o => o.status === 'Scheduled').length
  const inProd     = orders.filter(o => o.status === 'In Production').length
  const outForDel  = orders.filter(o => o.status === 'Out for Delivery' || o.status === 'Ready to Pick-up').length
  const completed  = orders.filter(o => o.status === 'Completed').length
  const delayed    = orders.filter(o => o.isCurrentlyDelayed).length

  // Unpaid + Partial — actual money still owed
  const unpaidOrders = orders.filter(
    o => (o.paymentStatus === 'Unpaid' || o.paymentStatus === 'Partial')
      && o.status !== 'Cancelled',
  )
  const unpaidCount = unpaidOrders.length
  const owedAmount = unpaidOrders.reduce((sum, o) => {
    const total = Number(o.rawAmount) || 0
    const paid = Array.isArray(o.partialPayments)
      ? o.partialPayments.reduce((s, p) => s + (Number(p.amount) || 0), 0)
      : 0
    return sum + Math.max(0, total - paid)
  }, 0)

  // In Progress = Confirmed + Scheduled + In Production
  const inProgress = confirmed + scheduled + inProd

  return [
    {
      label: 'Pending',
      value: pending.toLocaleString(),
      color: 'text-yellow-600',
      iconBg: 'bg-yellow-50',
      iconColor: 'text-yellow-500',
      icon: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
      sub: delayed > 0
        ? `⚠️ ${delayed} delayed`
        : (pending > 0 ? 'Needs action' : 'All clear'),
      subColor: delayed > 0 ? 'text-amber-600 font-semibold' : 'text-gray-400',
    },
    {
      label: 'In Progress',
      value: inProgress.toLocaleString(),
      color: 'text-blue-600',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-500',
      icon: '<path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><polyline points="3.29 7 12 12 20.71 7"/>',
      sub: `${confirmed} confirmed · ${scheduled} scheduled`,
    },
    {
      label: 'Out for Delivery',
      value: outForDel.toLocaleString(),
      color: 'text-cyan-600',
      iconBg: 'bg-cyan-50',
      iconColor: 'text-cyan-500',
      icon: '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>',
      sub: outForDel > 0 ? 'In motion right now' : 'None active',
    },
    {
      label: 'Completed',
      value: completed.toLocaleString(),
      color: 'text-green-600',
      iconBg: 'bg-green-50',
      iconColor: 'text-green-500',
      icon: '<path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/>',
      sub: total > 0 ? `${Math.round((completed / total) * 100)}% of total` : '—',
    },
    {
      label: 'Unpaid',
      value: unpaidCount.toLocaleString(),
      color: unpaidCount > 0 ? 'text-orange-600' : 'text-gray-400',
      iconBg: 'bg-orange-50',
      iconColor: 'text-orange-400',
      icon: '<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>',
      sub: unpaidCount > 0
        ? `₱${owedAmount.toLocaleString()} owed`
        : 'All paid',
    },
  ]
})
</script>