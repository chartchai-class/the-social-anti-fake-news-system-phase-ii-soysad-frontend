<script setup lang="ts">
import { ref } from 'vue'
import * as yup from 'yup'
import { useForm, useField } from 'vee-validate'
import { useNewsStore } from '@/stores/newStore'
import router from '@/router'
import ImageUpload from '@/components/widget/ImageUpload.vue'
import InputText from '@/components/widget/InputText.vue'

const newsStore = useNewsStore()
const isSubmitting = ref(false)
const imageUrl = ref<string>('')

const schema = yup.object({
  topic: yup.string().required('Topic is required').max(150, 'Topic too long'),
  shortDetail: yup.string().required('Short Detail is required').max(300, 'Short Detail too long'),
  fullDetail: yup.string().required('Full Detail is required'),
})
const { handleSubmit, errors } = useForm({ validationSchema: schema })
const { value: topic } = useField<string>('topic')
const { value: shortDetail } = useField<string>('shortDetail')
const { value: fullDetail } = useField<string>('fullDetail')

const onSubmit = handleSubmit((values) => {
  isSubmitting.value = true

  const payload = {
    topic: values.topic,
    shortDetail: values.shortDetail,
    fullDetail: values.fullDetail,
    mainImageUrl: imageUrl.value || '',
  }

  newsStore
    .createNews(payload)
    .then((createdNews) => {
      router.push({ name: 'news-detail', params: { slug: createdNews.id } })
    })
    .catch((error) => {
      console.error('Failed to create news:', error)
      alert('Could not create news. Please try again.')
    })
    .finally(() => {
      isSubmitting.value = false
    })
})
</script>

<template>
  <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
    <div
      class="mx-auto w-full max-w-2xl p-8 sm:p-12 bg-zinc-900/60 backdrop-blur-sm border border-zinc-700 rounded-2xl shadow-xl"
    >
      <h2 class="text-center text-2xl font-bold text-white mb-8">Create New News Article</h2>

      <form @submit.prevent="onSubmit" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Topic</label>
          <InputText v-model="topic" placeholder="News Topic" type="text" :error="errors.topic" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Short Detail</label>
          <textarea
            v-model="shortDetail"
            placeholder="Brief summary of the news..."
            rows="3"
            class="w-full p-3 rounded-md backdrop-blur-sm bg-zinc-200/20 text-white placeholder-white/40 border-0 focus:ring-2 focus:ring-white/50"
            :class="{ 'ring-2 ring-red-500': errors.shortDetail }"
          ></textarea>
          <span v-if="errors.shortDetail" class="text-red-400 text-xs">{{
            errors.shortDetail
          }}</span>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Full Detail</label>
          <textarea
            v-model="fullDetail"
            placeholder="Write the full news article here..."
            rows="6"
            class="w-full p-3 rounded-md backdrop-blur-sm bg-zinc-200/20 text-white placeholder-white/40 border-0 focus:ring-2 focus:ring-white/50"
            :class="{ 'ring-2 ring-red-500': errors.fullDetail }"
          ></textarea>
          <span v-if="errors.fullDetail" class="text-red-400 text-xs">{{ errors.fullDetail }}</span>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Main Image (Optional)</label>
          <div class="flex flex-col items-center gap-4">
            <img
              v-if="imageUrl"
              :src="imageUrl"
              class="w-full max-w-sm h-48 object-cover rounded-lg border border-zinc-700"
            />
            <ImageUpload v-model="imageUrl" />
          </div>
        </div>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold disabled:opacity-50"
        >
          {{ isSubmitting ? 'Submitting...' : 'Create News' }}
        </button>
      </form>
    </div>
  </div>
</template>
