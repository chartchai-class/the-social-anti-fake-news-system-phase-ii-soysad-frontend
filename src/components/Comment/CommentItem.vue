<script setup lang="ts">
import { computed } from 'vue'
import type { Comments } from '@/types'
import { useAuthStore } from '@/stores/auth'
// @ts-expect-error - SvgIcon library lacks TypeScript definitions
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiDeleteOutline, mdiRestore } from '@mdi/js'

const props = defineProps<{
  comment: Comments
  mode: 'active' | 'deleted'
}>()
const emit = defineEmits<{ 'manage-comment': [id: number] }>()
const authStore = useAuthStore()

const isMine = computed(() => props.comment.author?.id === authStore.currentUser?.id)

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) {
    return 'N/A'
  }
  const date = new Date(dateString)
  return date.toLocaleDateString()
}
const formattedTime = computed(() => formatDate(props.comment.createdAt))
const images = computed(() => props.comment.attachments || [])
const hasImages = computed(() => images.value.length > 0)
</script>

<template>
  <li>
    <article
      class="w-full flex gap-4 items-start rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 md:p-6 shadow-sm hover:ring-1 hover:ring-zinc-700 transition"
    >
      <div
        class="shrink-0 size-11 rounded-full ring-1 ring-inset ring-zinc-700 overflow-hidden bg-zinc-800"
      >
        <img
          v-if="props.comment.author.profileImageUrl"
          :src="props.comment.author.profileImageUrl"
          class="w-full h-full object-cover"
        />

        <div v-else class="grid place-items-center w-full h-full text-zinc-300 font-semibold"></div>
      </div>

      <div class="flex-1 min-w-0">
        <div class="flex items-start gap-3">
          <div class="min-w-0">
            <div class="text-[15px] md:text-base font-semibold text-zinc-100">
              {{ props.comment.author.name }} {{ props.comment.author.surname }}
              <span
                v-if="isMine"
                class="ml-2 text-white text-xs font-medium bg-emerald-500 px-2 py-0.5 rounded-full"
                >You
              </span>
            </div>
            <div v-if="formattedTime" class="text-[11px] text-zinc-400 mt-0.5">
              {{ formattedTime }}
            </div>
          </div>

          <span
            class="ml-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] md:text-xs font-semibold select-none"
            :class="
              comment.voteType === 'NOT_FAKE'
                ? 'bg-emerald-500 text-white'
                : 'bg-amber-500 text-white'
            "
          >
            {{ comment.voteType === 'NOT_FAKE' ? 'Real' : 'Fake' }}
          </span>

          <span v-if="authStore.isAdmin">
            <button
              @click="emit('manage-comment', props.comment.id)"
              class="ml-2 inline-flex items-center justify-center rounded-full border bg-red-500 border-zinc-700 text-white hover:border-red-400 p-1.5"
            >
              <SvgIcon
                type="mdi"
                :path="props.mode === 'deleted' ? mdiRestore : mdiDeleteOutline"
                size="14"
              />
            </button>
          </span>
        </div>

        <p class="mt-3 text-[15px] leading-relaxed text-zinc-300 whitespace-pre-line">
          {{ comment.body }}
        </p>

        <div v-if="hasImages" class="mt-3 border-t border-zinc-800/70 pt-3">
          <div class="grid grid-cols-2 md:grid-cols-3 gap-2.5">
            <img
              v-for="(src, i) in images"
              :key="i"
              :src="src"
              class="w-full aspect-video object-cover rounded-xl border border-zinc-700 bg-zinc-800 hover:opacity-90 transition"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </article>
  </li>
</template>
