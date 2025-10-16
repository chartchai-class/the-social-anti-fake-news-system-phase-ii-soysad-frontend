<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <header
    class="backdrop-blur-md bg-white/70 dark:bg-slate-900/70 shadow-sm border-b border-gray-200/20 sticky top-0 z-50"
  >
    <nav class="container mx-auto flex justify-between items-center px-6 py-4">
      <RouterLink
        :to="{ name: 'home' }"
        class="text-2xl font-semibold text-gray-900 dark:text-white hover:text-green-500 transition-colors"
      >
        Anti-Fake News
      </RouterLink>

      <div class="flex space-x-8">
        <RouterLink
          :to="{ name: 'home' }"
          class="text-gray-600 dark:text-gray-300 hover:text-green-500 transition-colors font-medium"
        >
          Home
        </RouterLink>
        <RouterLink
          :to="{ name: 'login' }"
          class="text-gray-600 dark:text-gray-300 hover:text-green-500 transition-colors font-medium"
        >
          Login
        </RouterLink>
        <RouterLink
          :to="{ name: 'register' }"
          class="text-gray-600 dark:text-gray-300 hover:text-green-500 transition-colors font-medium"
        >
          Register
        </RouterLink>
      </div>
    </nav>
  </header>
</template>
