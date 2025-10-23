<script setup lang="ts">
/* eslint-disable */
import { onMounted, ref, watch } from 'vue'
import { useNewsStore } from '@/stores/newStore'
import { storeToRefs } from 'pinia'
import NewsCard from '@/components/NewsCard.vue'
// @ts-ignore
import SvgIcon from '@jamescoyle/vue-icon'
import {
  mdiChevronLeft,
  mdiChevronRight,
  mdiNewspaper,
  mdiAlertCircle,
  mdiCheckCircle,
  mdiMagnify,
} from '@mdi/js'
import { NewsFilter } from '@/types'

const newsStore = useNewsStore()
const { allNews, loadingStatus, totalPages, currentPage, currentLimit, getCurrentFilter } =
  storeToRefs(newsStore)

const { fetchNews, setPage, setLimit, setFilter, setSearch } = newsStore
const keyWord = ref('')
const searchTimer = ref<number | null>(null)

watch(keyWord, (newKeyword) => {
  if (searchTimer.value) {
    clearTimeout(searchTimer.value)
    // setFilter(NewsFilter.ALL)
  }
  searchTimer.value = window.setTimeout(() => {
    setSearch(newKeyword)
  }, 500)
})
watch(keyWord, () => {
  if (getCurrentFilter.value !== NewsFilter.ALL) {
    setFilter(NewsFilter.ALL)
  }
})

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
    <h1 class="text-3xl font-bold text-center mt-4 mb-4">Social Anti-Fake News</h1>
    <div class="my-6 max-w-lg mx-auto">
      <div class="relative">
        <input
          type="text"
          id="search-input"
          v-model="keyWord"
          placeholder="Search by topic, detail, or reporter..."
          class="w-full p-3 pl-12 rounded-full backdrop-blur-sm bg-zinc-200/20 text-white placeholder-white/40 border-0 focus:ring-2 focus:ring-white/50"
        />
      </div>
    </div>

    <div class="flex flex-row flex-wrap justify-between items-center gap-4 mb-6">
      <div class="flex gap-2 justify-center md:justify-start">
        <button
          @click="setFilter(NewsFilter.ALL)"
          :class="[
            'px-4 py-2 rounded-full font-medium backdrop-blur-sm flex items-center gap-1',
            getCurrentFilter === NewsFilter.ALL
              ? 'bg-white  text-black shadow-lg'
              : 'bg-gray-200/20 text-white hover:bg-gray-200/30',
          ]"
        >
          <SvgIcon type="mdi" :path="mdiNewspaper" :size="20" />
          All News
        </button>
        <button
          @click="setFilter(NewsFilter.FAKE)"
          :class="[
            'px-4 py-2 rounded-full font-medium  backdrop-blur-sm flex items-center gap-1',
            getCurrentFilter === NewsFilter.FAKE
              ? 'bg-amber-500/80 text-white shadow-lg'
              : 'bg-gray-200/20 text-white hover:bg-gray-200/30',
          ]"
        >
          <SvgIcon type="mdi" :path="mdiAlertCircle" :size="20" />
          Fake News
        </button>
        <button
          @click="setFilter(NewsFilter.NOT_FAKE)"
          :class="[
            'px-4 py-2 rounded-full font-medium  backdrop-blur-sm flex items-center gap-1',
            getCurrentFilter === NewsFilter.NOT_FAKE
              ? 'bg-emerald-500/80 text-white shadow-lg'
              : 'bg-gray-200/20 text-white hover:bg-gray-200/30',
          ]"
        >
          <SvgIcon type="mdi" :path="mdiCheckCircle" :size="20" />
          Not-Fake News
        </button>
      </div>

      <div class="flex items-center">
        <label for="limit-select" class="mr-2 text-sm text-white"> Per page : </label>
        <select v-model="selectedLimit" class="border border-gray-300 rounded px-4 py-2 text-sm">
          <option value="6">6</option>
          <option value="12">12</option>
          <option value="18">18</option>
          <option value="24">24</option>
        </select>
      </div>
    </div>

    <div v-if="loadingStatus">
      <p>Loading news...</p>
    </div>
    <div v-else class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      <NewsCard v-for="newsItem in allNews" :key="newsItem.id" :news="newsItem" />
    </div>

    <div class="flex justify-center items-center gap-4 mt-8">
      <button
        @click="setPage(currentPage - 1)"
        :disabled="currentPage === 0"
        class="px-8 py-3 rounded-full bg-zinc-200/30 text-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <SvgIcon type="mdi" :path="mdiChevronLeft" :size="20" />
      </button>

      <span class="text-white"> Page {{ currentPage + 1 }} of {{ totalPages }} </span>

      <button
        @click="setPage(currentPage + 1)"
        :disabled="currentPage >= totalPages - 1"
        class="px-8 py-3 rounded-full bg-zinc-200/30 text-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <SvgIcon type="mdi" :path="mdiChevronRight" :size="20" />
      </button>
    </div>
  </main>
</template>
