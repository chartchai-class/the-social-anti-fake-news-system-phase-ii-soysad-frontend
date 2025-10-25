<script setup lang="ts">
import { ref, computed , watch} from 'vue'
import { useRoute , useRouter } from 'vue-router'
import { addNewComment } from '@/services/CommentService'
import { VoteType } from '@/types' 
import ImageUpload from '@/components/ImageUpload.vue'
import InputText from '@/components/InputText.vue'
import { useAuthStore } from '@/stores/auth'
import * as yup from 'yup'
import { useForm, useField } from 'vee-validate'

const route = useRoute()
const router = useRouter()
const newsId = Number(route.params.id) 

const isSubmitting = ref(false)
const authStore = useAuthStore()
const currentUser = computed(() => authStore.currentUser)

const schema = yup.object({
    comment: yup.string().required('Comment is required').max(150,'Comment is too long'),
    voteType: yup.mixed<VoteType>().oneOf(Object.values(VoteType) as VoteType[]).required('Please select Real or Fake')
})

const { handleSubmit, errors,resetForm } = useForm({ validationSchema: schema })
const { value: comment } = useField<string>('comment')
const { value: voteType, setValue: setVote } = useField<VoteType | null>('voteType')

const imageList = ref<string[]>([])
const latestUpload = ref<string>('')

watch(latestUpload, (val) => {
  if (!val) return
  if (val.startsWith('data:')) return

  if (!imageList.value.includes(val)) {
    imageList.value.push(val)
  }
  latestUpload.value = ''
})


const onSubmit = handleSubmit((values) => {
    isSubmitting.value = true

    const comment = {
        body: values.comment,
        voteType: values.voteType,
        attachments: imageList.value.filter(u => !u.startsWith('data:')),
        userId : currentUser.value?.id!
        
    }    
    addNewComment(comment,newsId)
    resetForm()
    imageList.value = []
    router.push({ name: 'news', params: { id: newsId } })
    isSubmitting.value = false
})


</script>

<template>
  <main class="mx-auto max-w-[820px] px-5 sm:px-6 lg:px-10 py-6">
    <article class="bg-zinc-900/60 border border-zinc-800 rounded-3xl shadow-md text-zinc-100">

      <header class="px-6 md:px-8 pt-6 pb-4">
        <h1 class="text-2xl md:text-3xl font-extrabold tracking-tight">Cast your vote</h1>
        <p class="mt-1 text-zinc-400 text-sm">Share your reasoning and mark this news as Real or Fake.</p>
      </header>

      <section class="px-6 md:px-8 pb-6">
        <form @submit.prevent="onSubmit" class="space-y-6">
          
          <div>
            <label class="block text-sm font-medium text-zinc-300 mb-1">Your comment</label>
            <InputText
              v-model="comment"
              type="textarea"
              placeholder="Write down your comment here…"
              :error="errors.comment"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-zinc-300 mb-1">Vote</label>
            <div class="grid grid-cols-2 gap-2">
              <button
                type="button"
                class="rounded-lg px-4 py-2 border text-sm font-semibold transition"
                :class="voteType === 'NOT_FAKE'
                  ? 'bg-emerald-600 border-emerald-600 text-white'
                  : 'bg-zinc-900/60 border-zinc-700 text-zinc-200 hover:bg-zinc-800'"
                @click="setVote(voteType === 'NOT_FAKE' ? null : VoteType.NOT_FAKE)"
              >
                Real
              </button>
              <button
                type="button"
                class="rounded-lg px-4 py-2 border text-sm font-semibold transition"
                :class="voteType === 'FAKE'
                  ? 'bg-amber-600 border-amber-600 text-white'
                  : 'bg-zinc-900/60 border-zinc-700 text-zinc-200 hover:bg-zinc-800'"
                @click="setVote(voteType === 'FAKE' ? null : VoteType.FAKE)"
              >
                Fake
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-zinc-300 mb-2">Image (Optional)</label>

            <img
              v-if="imageList"
              v-for="img in imageList"
              :src="img"
              alt="Attachment preview"
              class="w-full max-w-sm h-48 object-cover rounded-lg border border-zinc-700 mb-3"
            />

            <ImageUpload v-model="latestUpload" />
          </div>

          <div class="pt-2 flex items-center justify-end gap-2">
            <router-link
              :to="{ name: 'news', params: { id: newsId } }"
              class="rounded-lg px-4 py-2 text-sm font-semibold border border-zinc-700 text-zinc-200 hover:bg-zinc-800"
            >
              Cancel
            </router-link>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="rounded-lg px-5 py-2 text-sm font-semibold border border-emerald-600 bg-emerald-600 text-white hover:opacity-95 disabled:opacity-40"
            >
              {{ isSubmitting ? 'Submitting…' : 'Submit vote' }}
            </button>
          </div>
        </form>
      </section>
    </article>
  </main>
</template>

