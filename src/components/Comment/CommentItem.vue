<script setup lang="ts">
import { computed } from 'vue'
import type { Comments } from '@/types'

const props = defineProps<{ comment: Comments }>()

const displayName = computed(() => {
  const a = props.comment.author
  return [a.name, a.surname].filter(Boolean).join(' ') || a.username || a.email
})
const initials = computed(() => {
  const parts = displayName.value.trim().split(/\s+/)
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase()
})
const formattedTime = computed(() => {
  const d = new Date(props.comment.createdAt)
  return isNaN(d.getTime()) ? '' : d.toLocaleString()
})
const voteLabel = computed(() =>
  props.comment.voteType === 'NOT_FAKE' ? 'Real' : 'Fake'
)
const votePillClass = computed(() =>
  props.comment.voteType === 'NOT_FAKE'
    ? 'bg-emerald-900/40 text-emerald-300 ring-emerald-600/50'
    : 'bg-amber-900/40 text-amber-300 ring-amber-600/50'
)
const images = computed(() => props.comment.attachments || [])
const hasImages = computed(() => images.value.length > 0)
</script>


<template>
  <li>
    <article
      class="w-full flex gap-4 items-start rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 md:p-6 shadow-sm hover:ring-1 hover:ring-zinc-700 transition"
    >
      <div
        class="shrink-0 grid place-items-center size-11 rounded-full bg-zinc-800 text-zinc-200 font-semibold ring-1 ring-inset ring-zinc-700"
      >
        {{ initials }}
      </div>

      <div class="flex-1 min-w-0">
        <div class="flex items-start gap-3">
          <div class="min-w-0">
            <div class="text-[15px] md:text-base font-semibold tracking-tight text-zinc-100">
              {{ displayName }}
            </div>
            <div v-if="formattedTime" class="text-[11px] text-zinc-400 mt-0.5">
              {{ formattedTime }}
            </div>
          </div>

          <span
            class="ml-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] md:text-xs font-semibold ring-1 select-none"
            :class="votePillClass"
          >
            <span
              class="inline-block size-1.5 rounded-full"
              :class="comment.voteType === 'NOT_FAKE' ? 'bg-emerald-400' : 'bg-amber-400'"
            />
            {{ voteLabel }}
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
              alt=""
            />
          </div>
        </div>
      </div>
    </article>
  </li>
</template>

