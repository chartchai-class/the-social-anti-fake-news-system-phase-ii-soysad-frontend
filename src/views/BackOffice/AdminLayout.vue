<script setup lang="ts">
import { onMounted } from 'vue'
import router from '@/router'

onMounted(() => {
  router.push({ name: 'admin-users' })
})
</script>

<template>
  <div
    class="container mx-auto px-4 py-4 sm:py-8 bg-zinc-800/50 backdrop-blur-sm rounded-3xl border border-zinc-700 mt-10 shadow-xl/50"
  >
    <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 sm:mb-9 ml-2 sm:ml-5">
      Admin Backoffice
    </h1>

    <div class="flex flex-col sm:flex-row mb-6 border-b border-zinc-700 pb-4 gap-3 sm:gap-5">
      <RouterLink
        :to="{ name: 'admin-users' }"
        class="bg-zinc-700/50 px-4 sm:px-5 py-2 sm:py-3 rounded-full text-center text-sm sm:text-base"
      >
        Manage Users Role
      </RouterLink>
      <RouterLink
        :to="{ name: 'admin-posts' }"
        class="bg-zinc-700/50 px-4 sm:px-5 py-2 sm:py-3 rounded-full text-center text-sm sm:text-base"
      >
        Manage Deleted News
      </RouterLink>
      <RouterLink
        :to="{ name: 'admin-comments' }"
        class="bg-zinc-700/50 px-4 sm:px-5 py-2 sm:py-3 rounded-full text-center text-sm sm:text-base"
      >
        Manage Deleted Comments
      </RouterLink>
    </div>

    <main class="bg-zinc-800/50 p-4 sm:p-6 rounded-3xl">
      <RouterView />
    </main>
  </div>
</template>
