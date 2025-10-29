<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navbar from './components/widget/NavBar.vue'
import AppFooter from './components/widget/AppFooter.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Navbar />

    <main class="flex-1 mb-4">
      <RouterView />
    </main>

    <AppFooter />
  </div>
</template>
