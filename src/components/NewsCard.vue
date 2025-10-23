<script setup lang="ts">
import type { NewsHomepage } from '@/types'
import { computed } from 'vue'

const props = defineProps<{
  news: NewsHomepage
}>()

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) {
    return 'N/A'
  }
  const date = new Date(dateString)
  return date.toLocaleDateString()
}
const toNewsDetail = computed(() => ({ name: 'news-detail', params: { id: props.news.id } }))
</script>

<template>
  <RouterLink
    :to="toNewsDetail"
    class="relative block bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm rounded-3xl shadow-md overflow-hidden hover:ring-1 hover:ring-zinc-600/40 transition"
  >
    <div
      class="bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm rounded-3xl shadow-xl/40 overflow-hidden"
    >
      <img :src="news.mainImageUrl" class="w-full h-65 object-cover" v-if="news.mainImageUrl" />

      <div
        v-if="news.status === 'FAKE'"
        class="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold text-white bg-amber-600"
      >
        FAKE
      </div>
      <div
        v-else-if="news.status === 'NOT_FAKE'"
        class="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold text-white bg-emerald-500"
      >
        NON-FAKE
      </div>
      <div
        v-else-if="news.status === 'UNVERIFIED'"
        class="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold text-white bg-gray-500"
      >
        UNVERIFIED
      </div>

      <div class="p-4">
        <h3 class="font-bold text-lg mb-2">{{ news.topic }}</h3>
        <p class="text-gray-500 text-sm mb-4">{{ news.shortDetail }}</p>

        <div class="flex justify-between items-center text-xs text-gray-500">
          <span>By: {{ news.reporter }}</span>

          <span>{{ formatDate(news.publishedAt) }}</span>
        </div>

        <!-- <span
        class="mt-2 inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded"
      >
        {{ news.status }} (F: {{ news.fakeCount }} NF: {{ news.notFakeCount }})
      </span> -->
      </div>
    </div>
  </RouterLink>
</template>
