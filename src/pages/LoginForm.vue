<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-800 to-indigo-700">
    <div class="relative w-full max-w-md">

      <!-- Card -->
      <div class="bg-white rounded-3xl shadow-2xl overflow-hidden">

        <!-- Header -->
        <div class="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 pt-10 pb-8 text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-4 shadow-lg">
            <span class="text-white text-3xl font-black">A</span>
          </div>
          <h1 class="text-white text-2xl font-black tracking-tight">ACAPSHOP</h1>
          <p class="text-blue-100 text-sm mt-1">Inventory Management System</p>
        </div>

        <!-- Body -->
        <div class="px-8 py-8">
          <h2 class="text-gray-900 text-lg font-semibold mb-6">Sign in to your account</h2>

          <form class="space-y-5" @submit.prevent="handleSubmit">

            <!-- Department -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <div class="grid grid-cols-2 gap-3">

                <!-- Sales -->
                <button
                  type="button"
                  class="relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-sm font-medium"
                  :class="department === 'sales'
                    ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'"
                  @click="department = 'sales'"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" class="w-5 h-5">
                    <path d="M10 2v2"/><path d="M14 2v2"/>
                    <path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1"/>
                    <path d="M6 2v2"/>
                  </svg>
                  <span>Sales Dept.</span>
                  <div v-if="department === 'sales'" class="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full"></div>
                </button>

                <!-- Production -->
                <button
                  type="button"
                  class="relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-sm font-medium"
                  :class="department === 'production'
                    ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'"
                  @click="department = 'production'"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" class="w-5 h-5">
                    <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/>
                    <path d="M12 22V12"/>
                    <polyline points="3.29 7 12 12 20.71 7"/>
                    <path d="m7.5 4.27 9 5.15"/>
                  </svg>
                  <span>Production Dept.</span>
                  <div v-if="department === 'production'" class="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full"></div>
                </button>

              </div>
            </div>

            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                v-model="email"
                type="email"
                required
                placeholder="you@acapshop.com"
                class="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-xl text-sm transition-all
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white"
              />
            </div>

            <!-- Password -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div class="relative">
                <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  placeholder="Enter your password"
                  class="w-full px-4 py-3 pr-12 border border-gray-200 bg-gray-50 rounded-xl text-sm transition-all
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white"
                />
                <button
                  type="button"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  @click="showPassword = !showPassword"
                >
                  <!-- Eye -->
                  <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
                    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  <!-- Eye-off -->
                  <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Submit -->
<button
  type="submit"
  :disabled="isLoading"
  class="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 active:bg-blue-800
         transition-all flex items-center justify-center gap-2 disabled:opacity-70
         shadow-md shadow-blue-200 font-medium"
>
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
    stroke-linejoin="round" class="w-4 h-4">
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
    <polyline points="10 17 15 12 10 7"/>
    <line x1="15" x2="3" y1="12" y2="12"/>
  </svg>
  {{ isLoading ? 'Signing in…' : 'Sign In' }}
</button>

          </form>

          <!-- Demo Credentials -->
          <div class="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Demo Credentials
            </p>
            <div class="space-y-2">

              <button
                type="button"
                class="w-full text-left px-3 py-2 rounded-lg hover:bg-white hover:shadow-sm transition-all
                       text-xs border border-transparent hover:border-gray-200"
                @click="fillDemo('sales')"
              >
                <span class="text-blue-600 font-medium">Sales Dept. →</span>
                <span class="text-gray-500 ml-2">sales@acapshop.com / sales123</span>
              </button>

              <button
                type="button"
                class="w-full text-left px-3 py-2 rounded-lg hover:bg-white hover:shadow-sm transition-all
                       text-xs border border-transparent hover:border-gray-200"
                @click="fillDemo('production')"
              >
                <span class="text-indigo-600 font-medium">Production Dept. →</span>
                <span class="text-gray-500 ml-2">prod@acapshop.com / prod123</span>
              </button>

            </div>
          </div>

        </div>
      </div>
    </div>

    <p class="text-center text-blue-200 text-xs mt-6">
      © 2026 ACAPSHOP — For authorized personnel only
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const department = ref('sales')
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)

const demoCredentials = {
  sales: { email: 'sales@acapshop.com', password: 'sales123', role: 'production' },
  production: { email: 'prod@acapshop.com', password: 'prod123', role: 'sales' },
}

function fillDemo(dept) {
  department.value = dept
  email.value = demoCredentials[dept].email
  password.value = demoCredentials[dept].password
}

async function handleSubmit() {
  isLoading.value = true
  // Replace with your actual auth logic
  await new Promise((r) => setTimeout(r, 1200))
  console.log({ department: department.value, email: email.value, password: password.value })
  isLoading.value = false
  router.push('/dashboard') // ← redirect here
}
</script>