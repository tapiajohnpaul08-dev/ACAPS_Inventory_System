<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 p-5">
    <div class="flex flex-col md:flex-row gap-4">

      <!-- Search -->
      <div class="flex-1 relative">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          style="width:17px;height:17px">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
        </svg>
        <input
          :value="search"
          type="text"
          placeholder="Search by order ID, customer name, email, or product..."
          class="w-full pl-10 pr-4 py-2.5 border border-gray-200 bg-gray-50 rounded-xl
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white
                 transition-all text-sm"
          @input="$emit('update:search', $event.target.value)"
        />
      </div>

      <!-- Status filter -->
      <div class="relative">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          style="width:15px;height:15px">
          <path d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z"/>
        </svg>
        <select
          :value="statusFilter"
          class="pl-10 pr-8 py-2.5 border border-gray-200 bg-gray-50 rounded-xl
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white
                 transition-all text-sm appearance-none font-medium min-w-[180px]"
          @change="$emit('update:statusFilter', $event.target.value)"
        >
          <option value="all">All Status ({{ counts.all }})</option>
          <option value="pending">Pending ({{ counts.pending }})</option>
          <option value="scheduled">Scheduled ({{ counts.scheduled }})</option>
          <option value="in-production">In Production ({{ counts.inProduction }})</option>
          <option value="to-ship">To Ship ({{ counts.toShip }})</option>
          <option value="completed">Completed ({{ counts.completed }})</option>
          <option value="cancelled">Cancelled ({{ counts.cancelled }})</option>
        </select>
      </div>

    </div>
  </div>
</template>

<script setup>
defineProps({
  search: { type: String, required: true },
  statusFilter: { type: String, required: true },
  counts: { type: Object, required: true },
})

defineEmits(['update:search', 'update:statusFilter'])
</script>