<script setup lang="ts">
import { onMounted } from 'vue'
import { useNewsStore } from '@/stores/newStore'
import { storeToRefs } from 'pinia'
import NewsCard from '@/components/NewsCard.vue'

const newsStore = useNewsStore()
const { allNews, loadingStatus } = storeToRefs(newsStore)

onMounted(() => {
  newsStore.fetchNews()
})
</script>

<template>
  <main class="container mx-auto p-4">
    <h1 class="text-3xl font-bold text-center my-6 mb-10">Social Anti-Fake News</h1>

    <div v-if="loadingStatus" class="text-center">
      <p>Loading news...</p>
    </div>

    <div v-else class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      <NewsCard v-for="newsItem in allNews" :key="newsItem.id" :news="newsItem" />
    </div>
  </main>
</template>
