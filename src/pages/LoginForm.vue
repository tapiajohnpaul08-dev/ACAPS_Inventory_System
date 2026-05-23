<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-800 to-indigo-700">
    <div class="relative w-full max-w-md">
      <div class="bg-white rounded-3xl shadow-2xl overflow-hidden">
        
        <!-- Header -->
        <div class="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 pt-10 pb-8 text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-4 shadow-lg">
            <span class="text-white text-3xl font-black">A</span>
          </div>
          <h1 class="text-white text-2xl font-black tracking-tight">ACAPSHOP</h1>
          <p class="text-blue-100 text-sm mt-1">Admin Portal</p>
        </div>

        <!-- Body -->
        <div class="px-8 py-8">
          <h2 class="text-gray-900 text-lg font-semibold mb-6">Sign in to your account</h2>

          <form class="space-y-5" @submit.prevent="handleLogin">
            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                v-model="email"
                type="email"
                required
                placeholder="admin@acapshop.com"
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
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm font-medium"
                  @click="showPassword = !showPassword"
                >
                  {{ showPassword ? 'Hide' : 'Show' }}
                </button>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              {{ errorMessage }}
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-all
                     flex items-center justify-center gap-2 disabled:opacity-70 font-medium shadow-md hover:shadow-lg"
            >
              <span v-if="isLoading" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              {{ isLoading ? 'Signing in...' : 'Sign In' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { adminAuthApi } from '@/api/api';

const router = useRouter();
const email = ref('');
const password = ref('');
const showPassword = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');

async function handleLogin() {
  if (!email.value || !password.value) {
    errorMessage.value = 'Please enter email and password';
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';

  try {
    const response = await adminAuthApi.login(email.value, password.value);
    
    if (response.success && response.data) {
      const admin = response.data.admin;
      const token = response.data.token;
      
      console.log('Login successful with role:', admin.role);
      
      // Store admin data
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminUser', JSON.stringify(admin));
      localStorage.setItem('adminName', `${admin.firstName || ''} ${admin.lastName || ''}`.trim() || admin.email);
      localStorage.setItem('adminEmail', admin.email);
      localStorage.setItem('adminRole', admin.role);
      
      // Redirect to dashboard
      router.push('/dashboard');
    } else {
      // Show error message, stay on login page
      errorMessage.value = response.message || 'Invalid email or password';
      // Don't redirect - just show error
    }
  } catch (error) {
    console.error('Login error:', error);
    errorMessage.value = error.response?.data?.message || 'Login failed. Please try again.';
    // Don't redirect - just show error
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
@keyframes spin { to { transform: rotate(360deg); } }
.animate-spin { animation: spin 1s linear infinite; }
</style>