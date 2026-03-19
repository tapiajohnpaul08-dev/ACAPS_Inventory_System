<template>
  <div class="flex h-screen overflow-hidden">
    <NavigationSidebar />
    <main class="flex-1 overflow-auto">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import NavigationSidebar from '@/components/NavigationSidebar.vue'
</script>