<template>
    <aside class="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
        <div class="p-6 border-b border-gray-100">
            <div class="flex items-center gap-3">
                <div class="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm"><span
                        class="text-white font-black text-sm">A</span></div>
                <div>
                    <h1 class="text-lg font-black text-gray-900 tracking-tight">ACAPSHOP</h1>
                    <p class="text-xs text-gray-400 -mt-0.5">Inventory System</p>
                </div>
            </div>
        </div>
        <nav class="flex-1 p-3 space-y-0.5"><a
                class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative group bg-blue-600 text-white shadow-sm shadow-blue-200"
                href="/" data-discover="true"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" class="lucide lucide-layout-dashboard w-4.5 h-4.5 flex-shrink-0"
                    style="width: 18px; height: 18px;">
                    <rect width="7" height="9" x="3" y="3" rx="1"></rect>
                    <rect width="7" height="5" x="14" y="3" rx="1"></rect>
                    <rect width="7" height="9" x="14" y="12" rx="1"></rect>
                    <rect width="7" height="5" x="3" y="16" rx="1"></rect>
                </svg><span class="text-sm font-medium">Dashboard</span></a><a
                class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative group text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                href="/inventory" data-discover="true"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" class="lucide lucide-package w-4.5 h-4.5 flex-shrink-0"
                    style="width: 18px; height: 18px;">
                    <path
                        d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z">
                    </path>
                    <path d="M12 22V12"></path>
                    <polyline points="3.29 7 12 12 20.71 7"></polyline>
                    <path d="m7.5 4.27 9 5.15"></path>
                </svg><span class="text-sm font-medium">Inventory</span><span
                    class="ml-auto text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center font-semibold bg-red-500 text-white">8</span></a><a
                class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative group text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                href="/orders" data-discover="true"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" class="lucide lucide-shopping-cart w-4.5 h-4.5 flex-shrink-0"
                    style="width: 18px; height: 18px;">
                    <circle cx="8" cy="21" r="1"></circle>
                    <circle cx="19" cy="21" r="1"></circle>
                    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
                </svg><span class="text-sm font-medium">Orders</span></a><a
                class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative group text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                href="/messages" data-discover="true"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" class="lucide lucide-message-square w-4.5 h-4.5 flex-shrink-0"
                    style="width: 18px; height: 18px;">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg><span class="text-sm font-medium">Messages</span><span
                    class="ml-auto text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center font-semibold bg-red-500 text-white">1</span></a><a
                class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative group text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                href="/analytics" data-discover="true"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" class="lucide lucide-chart-column w-4.5 h-4.5 flex-shrink-0"
                    style="width: 18px; height: 18px;">
                    <path d="M3 3v16a2 2 0 0 0 2 2h16"></path>
                    <path d="M18 17V9"></path>
                    <path d="M13 17V5"></path>
                    <path d="M8 17v-3"></path>
                </svg><span class="text-sm font-medium">Analytics</span></a></nav>
        <div class="mx-3 mb-3 p-3 bg-red-50 border border-red-200 rounded-xl">
            <div class="flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" class="lucide lucide-triangle-alert w-4 h-4 text-red-600 flex-shrink-0">
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"></path>
                    <path d="M12 9v4"></path>
                    <path d="M12 17h.01"></path>
                </svg>
                <div>
                    <p class="text-xs font-semibold text-red-800">Low Stock Alert</p>
                    <p class="text-xs text-red-600">8 items running low</p>
                </div>
            </div>
        </div>
        <div class="p-3 border-t border-gray-100">
            <div class="relative">
                <button
                    class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left">
                    <div
                        class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        S</div>
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-semibold text-gray-900 truncate">Sarah Dela Cruz</p>
                        <p class="text-xs text-gray-400 truncate">Sales Department</p>
                    </div>
                    <div
                        class="flex items-center gap-1.5 px-3 py-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full text-xs font-medium transition-colors border border-gray-200 hover:border-red-200"><svg
                            xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            class="lucide lucide-log-out w-3.5 h-3.5">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" x2="9" y1="12" y2="12"></line>
                        </svg></div>
                </button>
            </div>
        </div>
    </aside>
</template>