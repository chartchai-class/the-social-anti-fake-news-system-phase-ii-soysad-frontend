<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getNewsDetail } from '@/services/NewService' 
import type { NewsDetail as NewsDetailDTO } from '@/types'
import CommentList from '@/components/Comment/CommentList.vue'

const route = useRoute()
const id = Number(route.params.id)

const NewsDetail = ref<NewsDetailDTO | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

function formatDateTime(isoOrNull: string | null | Date): string {
  if (!isoOrNull) return 'Unpublished'
  const d = new Date(isoOrNull as any)
  if (isNaN(d.getTime())) return 'Unpublished'
  return d.toLocaleString() 
}

onMounted(()=>{
  getNewsDetail(id)
  .then((data)=>{
    NewsDetail.value = data
  })
  .catch((err)=>{
    error.value = err.message || 'Failed to load news detail.'
  })
  .finally(()=>{
    loading.value = false
})

})

</script>

<template>

    <main class="mx-auto max-w-[1000px] px-5 sm:px-6 lg:px-10 py-6">

      <div v-if="loading" class="space-y-3">
      <div class="h-8 w-3/4 bg-zinc-800 rounded animate-pulse"></div>
      <div class="h-64 bg-zinc-800 rounded animate-pulse"></div>
      <div class="h-4 w-full bg-zinc-800 rounded animate-pulse"></div>
      <div class="h-4 w-5/6 bg-zinc-800 rounded animate-pulse"></div>
      </div>

      <div
      v-else-if="error"
      class="rounded-3xl border border-red-800 bg-red-900/30 text-red-200 p-4"
      >
      {{ error }}
      </div>

      <article v-else-if="NewsDetail" 
      class="relative bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm rounded-3xl shadow-md overflow-hidden text-zinc-100"
      >
      <div
        v-if="(NewsDetail as any).status === 'FAKE'"
        class="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold text-white bg-amber-600"
      >
        FAKE
      </div>
      <div
        v-else-if="(NewsDetail as any).status === 'NOT_FAKE'"
        class="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold text-white bg-emerald-500"
      >
        REAL
      </div>
      <div
        v-else
        class="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold text-white bg-gray-500"
      >
        UNVERIFIED
      </div>

        <section class="px-6 lg:px-8 pt-8 pb-6">
        <header>
          
          <h1 class="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-100">
            {{ NewsDetail.topic }}
          </h1>

          <div class="mt-3 flex flex-wrap items-center gap-3 text-sm text-zinc-400">
            <!-- reporter: backend อาจเป็น string หรือ object ใน DTO ของคุณ
                 ถ้าใน type ปัจจุบันเป็น string (reporter: string) แสดงตรง ๆ ก่อน -->
            <span class="font-medium text-zinc-200">
              Reporter:
                {{ NewsDetail.reporter.name }} {{ NewsDetail.reporter.surname }}
            </span>

            <span aria-hidden="true">•</span>

            <time :datetime="String(NewsDetail.publishedAt)">
              {{ formatDateTime(NewsDetail.publishedAt as any) }}
            </time>

            <!-- show status -->
            <span class="text-zinc-400">
            F: {{ NewsDetail.fakeCount }} · NF: {{ NewsDetail.notFakeCount }}
            </span>

          </div>
        </header>
        <figure v-if="NewsDetail.mainImageUrl" class="mt-6">
          <div class="rounded-lg border border-zinc-200 overflow-hidden">
            <img
              :src="NewsDetail.mainImageUrl"
              alt="cover"
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

    
        </section>
        
          <CommentList
            v-if="NewsDetail"
            :comments="NewsDetail.comments"
            :page-size="5"
            :embedded="true"
          />
        
      </article>
      
    </main>


</template>