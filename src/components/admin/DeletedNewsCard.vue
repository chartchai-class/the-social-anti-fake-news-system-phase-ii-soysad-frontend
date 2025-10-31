<script setup lang="ts">
import { ref } from 'vue'
import type { NewsHomepage } from '@/types'
import { restoreNews, hardDeleteNews } from '@/services/AdminService'
// @ts-expect-error - SvgIcon library lacks TypeScript definitions
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiRestore, mdiTrashCanOutline } from '@mdi/js'

const props = defineProps<{
  news: NewsHomepage
}>()

const emit = defineEmits(['actionComplete'])

const isLoading = ref(false)

const handleRestore = () => {
  if (!confirm(`You want to restore "${props.news.topic}" Right?`)) return

  isLoading.value = true
  restoreNews(props.news.id)
    .then(() => {
      emit('actionComplete')
    })
    .catch((error) => {
      console.error('Failed to restore news:', error)
      alert('Failed to restore news.')
      isLoading.value = false
    })
}

const handleHardDelete = () => {
  if (
    !confirm(`WARNING !!!!!!!!!! You are delete the news "${props.news.topic}" from the database.`)
  )
    return

  isLoading.value = true
  hardDeleteNews(props.news.id)
    .then(() => {
      emit('actionComplete')
    })
    .catch((error) => {
      console.error('Failed to hard delete news:', error)
      alert('Failed to permanently delete news.')
      isLoading.value = false
    })
}

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) {
    return 'N/A'
  }
  const date = new Date(dateString)
  return date.toLocaleDateString()
}
</script>

<template>
  <div class="p-4 rounded-lg shadow-lg flex flex-col sm:flex-row items-center gap-4">
    <img
      :src="
        news.mainImageUrl ||
        'https://i.pinimg.com/736x/b9/c4/7e/b9c47ef70bff06613d397abfce02c6e7.jpg'
      "
      class="w-full sm:w-32 h-32 object-cover rounded-md border-2 border-zinc-600"
    />

    <div class="flex-grow text-center sm:text-left">
      <h3 class="text-lg font-semibold text-white">
        {{ news.topic }} <span class="py-1 px-2 bg-zinc-800 rounded">{{ news.status }}</span>
      </h3>
      <p class="text-sm text-gray-400">By: {{ news.reporter }}</p>
      <p class="text-xs text-gray-500">Published: {{ formatDate(news.publishedAt) }}</p>
    </div>

    <div class="flex flex-row sm:flex-col gap-2 w-full sm:w-auto">
      <button
        @click="handleRestore"
        class="flex-1 flex justify-center items-center gap-2 px-3 py-2 rounded-md bg-zinc-600/20 border border-green-700 text-white hover:bg-green-700 disabled:opacity-50"
      >
        <SvgIcon type="mdi" :path="mdiRestore" :size="18" />
        <span>Restore</span>
      </button>
      <button
        @click="handleHardDelete"
        class="flex-1 flex justify-center items-center gap-2 px-3 py-2 rounded-md bg-zinc-600/20 border border-red-700 text-white hover:bg-red-800 disabled:opacity-50"
      >
        <SvgIcon type="mdi" :path="mdiTrashCanOutline" :size="18" />
        <span>Delete</span>
      </button>
    </div>
  </div>
</template>
