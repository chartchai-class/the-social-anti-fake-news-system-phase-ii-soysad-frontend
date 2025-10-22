<script setup lang="ts">
/* eslint-disable */
import { onMounted, ref, watch } from 'vue'
import { useNewsStore } from '@/stores/newStore'
import { storeToRefs } from 'pinia'
import NewsCard from '@/components/NewsCard.vue'
// @ts-ignore
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiChevronLeft, mdiChevronRight } from '@mdi/js'

const newsStore = useNewsStore()
const { allNews, loadingStatus, totalPages, currentPage, currentLimit } = storeToRefs(newsStore)
const { fetchNews, setPage, setLimit } = newsStore

const selectedLimit = ref(currentLimit.value)
watch(selectedLimit, (newLimit) => {
  setLimit(Number(newLimit))
})

onMounted(() => {
  fetchNews(0)
})
</script>

<template>
  <main class="container mx-auto p-4">
    <h1 class="text-3xl font-bold text-center my-6 mb-10">Social Anti-Fake News</h1>

    <div class="flex justify-end mb-4">
      <label for="limit-select" class="mr-2 self-center text-sm text-white"> Show: </label>
      <select v-model="selectedLimit" class="border border-gray-300 rounded px-3 py-1 text-sm">
        <option value="6">6</option>
        <option value="12">12</option>
        <option value="18">18</option>
        <option value="24">24</option>
      </select>
    </div>

    <div v-if="loadingStatus" class="text-center">
      <p>Loading news...</p>
    </div>
    <div v-else class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      <NewsCard v-for="newsItem in allNews" :key="newsItem.id" :news="newsItem" />
    </div>

    <div class="flex justify-center items-center gap-4 mt-8">
      <button
        @click="setPage(currentPage - 1)"
        :disabled="currentPage === 0"
        class="px-4 py-2 rounded bg-gray-200/10 text-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <SvgIcon type="mdi" :path="mdiChevronLeft" :size="20" />
      </button>

      <span class="text-white"> Page {{ currentPage + 1 }} of {{ totalPages }} </span>

      <button
        @click="setPage(currentPage + 1)"
        :disabled="currentPage >= totalPages - 1"
        class="px-4 py-2 rounded bg-gray-200/10 text-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <SvgIcon type="mdi" :path="mdiChevronRight" :size="20" />
      </button>
    </div>
  </main>
</template>
