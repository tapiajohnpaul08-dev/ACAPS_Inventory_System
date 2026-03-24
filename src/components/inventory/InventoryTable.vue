<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <table class="w-full">
      <thead class="bg-gray-50 border-b border-gray-100">
        <tr>
          <th v-for="col in columns" :key="col"
            class="px-5 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
            {{ col }}
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-50">
        <tr
          v-for="item in items"
          :key="item.id"
          class="cursor-pointer transition-all"
          :class="item.status === 'Low Stock'
            ? 'bg-red-50 hover:bg-red-100'
            : 'hover:bg-blue-50/50'"
          @click="$emit('select', item)"
        >
          <td class="px-5 py-4">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                  class="text-blue-600" style="width:16px;height:16px">
                  <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/>
                  <path d="M12 22V12"/>
                  <polyline points="3.29 7 12 12 20.71 7"/>
                  <path d="m7.5 4.27 9 5.15"/>
                </svg>
              </div>
              <div>
                <p class="text-sm font-semibold text-gray-900">{{ item.name }}</p>
                <p class="text-xs text-gray-400">{{ item.supplier }}</p>
              </div>
            </div>
          </td>
          <td class="px-5 py-4">
            <span class="px-2.5 py-1 bg-gray-100 rounded-full text-xs font-semibold text-gray-700">
              {{ item.size }}
            </span>
          </td>
          <td class="px-5 py-4">
            <p class="text-sm font-bold" :class="item.status === 'Low Stock' ? 'text-red-600' : 'text-gray-900'">
              {{ item.stock.toLocaleString() }}
            </p>
            <p class="text-xs text-gray-400">units</p>
          </td>
          <td class="px-5 py-4">
            <span class="flex items-center gap-1.5 text-xs font-semibold"
              :class="item.status === 'Low Stock' ? 'text-red-600' : 'text-green-600'">
              <svg v-if="item.status === 'In Stock'" xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px">
                <path d="M21.801 10A10 10 0 1 1 17 3.335"/>
                <path d="m9 11 3 3L22 4"/>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round" style="width:14px;height:14px">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/>
                <path d="M12 9v4"/><path d="M12 17h.01"/>
              </svg>
              {{ item.status }}
            </span>
          </td>
          <td class="px-5 py-4">
            <p class="text-sm text-gray-700 font-medium">{{ item.orders }}</p>
          </td>
          <td class="px-5 py-4">
            <p class="text-sm font-bold text-gray-900">{{ item.revenue }}</p>
          </td>
          <td class="px-5 py-4">
            <button
              class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600
                     hover:bg-blue-100 hover:text-blue-800 rounded-lg transition-colors"
              @click.stop="$emit('edit', item)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                style="width:13px;height:13px">
                <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>
              </svg>
              Edit
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    required: true,
  },
})

defineEmits(['edit', 'select'])

const columns = ['Product', 'Size', 'Stock', 'Status', 'Orders', 'Revenue', 'Actions']
</script>