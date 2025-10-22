<script setup lang="ts">
import type { NewsHomepage } from '@/types'

defineProps<{
  news: NewsHomepage
}>()

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) {
    return 'N/A'
  }
  const date = new Date(dateString)
  return date.toLocaleDateString()
}
</script>

<template>
  <div
    class="bg-zinc-900 rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
  >
    <img
      :src="news.mainImageUrl"
      alt="News Image"
      class="w-full h-60 object-cover"
      v-if="news.mainImageUrl"
    />

    <div class="p-4">
      <h3 class="font-bold text-lg mb-2">{{ news.topic }}</h3>
      <p class="text-gray-400 text-sm mb-4">{{ news.shortDetail }}</p>

      <div class="flex justify-between items-center text-xs text-gray-500">
        <span>By: {{ news.reporter }}</span>

        <span>{{ formatDate(news.publishedAt) }}</span>
      </div>

      <span
        class_="mt-2 inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded"
      >
        {{ news.status }} (F: {{ news.fakeCount }}, NF: {{ news.notFakeCount }})
      </span>
    </div>
  </div>
</template>
