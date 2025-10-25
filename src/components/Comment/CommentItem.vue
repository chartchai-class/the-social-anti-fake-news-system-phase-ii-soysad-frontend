<script setup lang="ts">
import { computed } from 'vue'
import type { Comments } from '@/types'
import { useAuthStore } from '@/stores/auth';
// @ts-expect-error - SvgIcon library lacks TypeScript definitions
import SvgIcon from '@jamescoyle/vue-icon'
import {mdiDeleteOutline} from '@mdi/js'

const props = defineProps<{ comment: Comments }>()
const emit = defineEmits<{ 'delete-comment': [id: number] }>()
const authStore = useAuthStore()

const formattedTime = computed(() => {
  const d = new Date(props.comment.createdAt)
  return isNaN(d.getTime()) ? '' : d.toLocaleString()
})
const images = computed(() => props.comment.attachments || [])
const hasImages = computed(() => images.value.length > 0)

</script>


<template>
  <li>
    <article
      class="w-full flex gap-4 items-start rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 md:p-6 shadow-sm hover:ring-1 hover:ring-zinc-700 transition"
    >
      <div class="shrink-0 size-11 rounded-full ring-1 ring-inset ring-zinc-700 overflow-hidden bg-zinc-800" >
      
        <img 
          v-if="props.comment.author.profileImageUrl"
          :src="props.comment.author.profileImageUrl"
          alt="User Profile"
          class="w-full h-full object-cover"
          @error="($event.target as HTMLImageElement).style.display='none'"
        /> 
        
        <div v-else class="grid place-items-center w-full h-full text-zinc-300 font-semibold">
        </div>

      </div>

      <div class="flex-1 min-w-0">
        <div class="flex items-start gap-3">
          <div class="min-w-0">
            <div class="text-[15px] md:text-base font-semibold 
             text-zinc-100">
              {{ props.comment.author.name }} {{ props.comment.author.surname }} 
            </div>
            <div v-if="formattedTime" class="text-[11px] text-zinc-400 mt-0.5">
              {{ formattedTime }}
            </div>
          </div>

          <span
            class="ml-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] md:text-xs font-semibold ring-1 select-none"
            :class="comment.voteType === 'NOT_FAKE' 
            ? 'bg-emerald-900/40 text-emerald-300 ring-emerald-600/50' 
            : 'bg-amber-900/40 text-amber-300 ring-amber-600/50' "
          >
            <span
              class="inline-block size-1.5 rounded-full"
              :class="comment.voteType === 'NOT_FAKE' ? 'bg-emerald-400' : 'bg-amber-400'"
            />
            {{ comment.voteType === 'NOT_FAKE' ? 'Real' : 'Fake' }}
          </span>
          
          <span v-if="authStore.isAdmin">
            <button
              @click="emit('delete-comment', props.comment.id)"
              class="ml-2 inline-flex items-center justify-center rounded-full border border-zinc-700 text-zinc-400 hover:text-red-400 hover:border-red-400 transition-colors p-1.5"
              title="Delete"
            >
              <SvgIcon type="mdi" :path="mdiDeleteOutline" size="14" />
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
              alt=""
            />
          </div>
        </div>
      </div>
    </article>
  </li>
</template>

