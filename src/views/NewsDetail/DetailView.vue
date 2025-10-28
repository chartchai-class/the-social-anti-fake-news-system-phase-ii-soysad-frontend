<script setup lang="ts">
import CommentList from '@/components/Comment/CommentList.vue'
import { computed } from 'vue'
import { useNewsDetailStore } from '@/stores/newsDetailStore'
//@ts-expect-error - SvgIcon library lacks TypeScript definitions
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiAlert, mdiCheckCircle } from '@mdi/js'

const store = useNewsDetailStore()
const NewsDetail = computed(() => store.news)

function formatDateTime(isoOrNull: string | null | Date): string {
  if (!isoOrNull) return 'Unpublished'

  // eslint-disable-next-line
  const d = new Date(isoOrNull as any)
  if (isNaN(d.getTime())) return 'Unpublished'
  return d.toLocaleString()
}
</script>

<template>
  <main class="mx-auto max-w-[1000px] px-5 sm:px-6 lg:px-10 py-6">
    <article
      v-if="NewsDetail"
      class="relative bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm rounded-3xl shadow-md overflow-hidden text-zinc-100"
    >
      <section class="px-6 lg:px-8 pt-8 pb-6">
        <header>
          <h1 class="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-100">
            <div class="flex items-center gap-3">
              <span class="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-100">
                {{ NewsDetail.topic }}
              </span>
              <span
                v-if="(NewsDetail as any).status === 'FAKE'"
                class="px-5 py-2 rounded-full text-lg font-bold text-white bg-amber-600"
              >
                FAKE
              </span>
              <span
                v-else-if="(NewsDetail as any).status === 'NOT_FAKE'"
                class="px-5 py-2 rounded-full text-lg font-bold text-white bg-emerald-500"
              >
                REAL
              </span>
              <span v-else class="px-5 py-2 rounded-full text-lg font-bold text-white bg-gray-500">
                UNVERIFIED
              </span>
            </div>
          </h1>

          <div class="mt-3 flex flex-wrap items-center gap-3 text-sm text-zinc-400">
            <span class="font-medium text-zinc-200">
              Reporter:
              {{ NewsDetail.reporter.name }} {{ NewsDetail.reporter.surname }}
            </span>

            <span aria-hidden="true">•</span>

            <time :datetime="String(NewsDetail.publishedAt)">
              {{ formatDateTime(NewsDetail.publishedAt as any) }}
            </time>
          </div>
        </header>
        <figure v-if="NewsDetail.mainImageUrl" class="mt-6">
          <div class="rounded-lg border border-zinc-200 overflow-hidden">
            <img
              :src="NewsDetail.mainImageUrl"
              class="w-full h-auto object-cover"
              @error="($event.target as HTMLImageElement).src = '/img/placeholder.jpg'"
            />
          </div>
        </figure>
      </section>

      <section class="px-6 lg:px-8 pb-8">
        <div class="x-auto max-w-4xl xl:max-w-5xl">
          <p class="text-lg md:text-xl text-zinc-100 font-semibold leading-relaxed">
            {{ NewsDetail.shortDetail }}
          </p>
          <div class="mx-auto max-w-4xl border-t border-zinc-700 my-6 opacity-100"></div>
          <div
            class="mt-6 text-base md:text-lg text-zinc-200 font-normal leading-relaxed whitespace-pre-line"
            v-text="NewsDetail.fullDetail"
          />
        </div>

        <div class="flex items-center justify-center gap-2 mt-10">
          <div
            class="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 border border-amber-600"
          >
            <SvgIcon type="mdi" :path="mdiAlert" size="18" />
            <span class="text-white font-semibold">Fake: {{ NewsDetail.fakeCount }}</span>
          </div>
          <div
            class="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 border border-emerald-500"
          >
            <SvgIcon type="mdi" :path="mdiCheckCircle" size="18" />
            <span class="text-white">Not Fake: {{ NewsDetail.notFakeCount }}</span>
          </div>
        </div>
      </section>

      <CommentList :page-size="5" :embedded="true" />
    </article>
    <div v-else class="text-zinc-400">No content.</div>
  </main>
</template>
