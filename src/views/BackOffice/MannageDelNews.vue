<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getDeletedNews } from '@/services/AdminService'
import type { NewsHomepage } from '@/types'
import DeletedNewsCard from '@/components/admin/DeletedNewsCard.vue'
// @ts-expect-error - SvgIcon library lacks TypeScript definitions
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiChevronLeft, mdiChevronRight } from '@mdi/js'

const deletedNews = ref<NewsHomepage[]>([])
const isLoading = ref(true)
const totalPages = ref(0)
const currentPage = ref(0)
const pageSize = ref(5)

const fetchDeletedNews = () => {
  isLoading.value = true
  getDeletedNews(currentPage.value, pageSize.value)
    .then((response) => {
      deletedNews.value = response.data.content
      totalPages.value = response.data.totalPages
    })
    .catch((error) => {
      console.error('Failed to fetch deleted news:', error)
    })
    .finally(() => {
      isLoading.value = false
    })
}

onMounted(fetchDeletedNews)

const changePage = (newPage: number) => {
  if (newPage < 0 || newPage >= totalPages.value) return
  currentPage.value = newPage
  fetchDeletedNews()
}
</script>

<template>
  <div>
    <h2 class="text-2xl font-semibold text-white mb-4">Manage Deleted Posts</h2>

    <div v-if="isLoading" class="text-gray-400">Loading deleted news...</div>
    <div v-else-if="deletedNews.length === 0" class="text-gray-400">No deleted news found.</div>

    <div v-else class="grid grid-cols-1 gap-4">
      <DeletedNewsCard
        v-for="newsItem in deletedNews"
        :key="newsItem.id"
        :news="newsItem"
        @actionComplete="fetchDeletedNews"
      />
    </div>

    <div class="flex justify-center items-center gap-4 mt-8" v-if="!isLoading && totalPages > 1">
      <button
        @click="changePage(currentPage - 1)"
        :disabled="currentPage === 0"
        class="px-4 py-2 rounded-lg bg-zinc-700 text-white disabled:opacity-50"
      >
        <SvgIcon type="mdi" :path="mdiChevronLeft" :size="20" />
      </button>
      <span class="text-white"> Page {{ currentPage + 1 }} of {{ totalPages }} </span>
      <button
        @click="changePage(currentPage + 1)"
        :disabled="currentPage >= totalPages - 1"
        class="px-4 py-2 rounded-lg bg-zinc-700 text-white disabled:opacity-50"
      >
        <SvgIcon type="mdi" :path="mdiChevronRight" :size="20" />
      </button>
    </div>
  </div>
</template>
