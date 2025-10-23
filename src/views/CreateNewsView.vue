<script setup lang="ts">
import { ref, computed } from 'vue'
import * as yup from 'yup'
import { useForm, useField } from 'vee-validate'
import { useNewsStore } from '@/stores/newStore'
import router from '@/router'
import ImageUpload from '@/components/ImageUpload.vue'
import InputText from '@/components/InputText.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const newsStore = useNewsStore()
const isSubmitting = ref(false)
const imageUrl = ref<string>('')
const currentUser = computed(() => authStore.currentUser)

const schema = yup.object({
  topic: yup.string().required('Topic is required').max(150, 'Topic is too long'),
  shortDetail: yup
    .string()
    .required('Short detail is required')
    .max(300, 'Short detail is too long'),
  fullDetail: yup.string().required('Full detail is required'),
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
    reporter: {
      id: currentUser.value?.id || 0,
    },
  }

  newsStore
    .createNews(payload)
    .then((createdNews) => {
      if (createdNews?.slug) {
        router.push({ name: 'news-detail', params: { slug: createdNews.slug } })
      } else {
        router.push({ name: 'home' })
      }
    })
    .catch((error) => {
      alert('Failed to create news: ' + error.message)
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
      <h2 class="text-center text-2xl font-bold text-white mb-8">Create New News</h2>

      <form @submit.prevent="onSubmit" class="space-y-8">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">News Topic</label>
          <InputText v-model="topic" placeholder="News topic" type="text" :error="errors.topic" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Short Description</label>
          <InputText
            v-model="shortDetail"
            placeholder="Brief summary..."
            type="textarea"
            :error="errors.shortDetail"
            rows="3"
            class="h-20"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Full Details</label>
          <InputText
            v-model="fullDetail"
            placeholder="Full news content..."
            type="textarea"
            :error="errors.fullDetail"
            rows="6"
            class="h-60"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Main Image (Optional)</label>
          <div class="flex flex-col items-center gap-4">
            <img
              v-if="imageUrl"
              :src="imageUrl"
              alt="Main image preview"
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
          {{ isSubmitting ? 'Creating...' : 'Create News' }}
        </button>
      </form>
    </div>
  </div>
</template>
