<script setup lang="ts">
import type { NewsHomepage } from '@/types'
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useNewsStore } from '@/stores/newStore'
import { storeToRefs } from 'pinia'
import { deleteNews } from '@/services/NewService'

// @ts-expect-error - SvgIcon library lacks TypeScript definitions
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiTrashCan } from '@mdi/js'

const props = defineProps<{
  news: NewsHomepage
}>()

const authStore = useAuthStore()
const { isAdmin } = storeToRefs(authStore)
const newsStore = useNewsStore()

const handleDelete = (event: MouseEvent) => {
  event.preventDefault()
  event.stopPropagation()
  if (confirm(`Are you want to delete "${props.news.topic}"?`)) {
    deleteNews(props.news.id)
      .then(() => {
        return newsStore.fetchNews(newsStore.currentPage)
      })
      .catch((error) => {
        console.error('Failed to delete news:', error)
        alert('You do not have permission to delete this news.')
      })
  }
}

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
  <RouterLink :to="toNewsDetail">
    <div
      class="bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm rounded-3xl shadow-xl/50 overflow-hidden hover:border-gray-500 h-full"
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

      <button
        v-if="isAdmin"
        @click.prevent.stop="handleDelete"
        class="absolute top-4 left-4 p-2 rounded-full bg-red-700/80 text-white hover:bg-red-700 transition-colors z-10"
        title="Delete this news"
      >
        <SvgIcon type="mdi" :path="mdiTrashCan" :size="18" />
      </button>

      <div class="p-6">
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
