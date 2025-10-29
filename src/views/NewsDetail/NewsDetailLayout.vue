<script setup lang="ts">
import { watch, onMounted, computed } from 'vue'
import { useRoute, useRouter, RouterView } from 'vue-router'
//@ts-expect-error - SvgIcon library lacks TypeScript definitions
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiNewspaperVariantOutline, mdiCommentOutline, mdiArrowLeft, mdiCancel } from '@mdi/js'
import { useNewsDetailStore } from '@/stores/newsDetailStore'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

const router = useRouter()
const store = useNewsDetailStore()
const route = useRoute()
const canGoVote = computed(() => store.canGoVote && !store.loading)
const authStore = useAuthStore()
const { isLoggedIn } = storeToRefs(authStore)

function load() {
  const id = Number(route.params.id)
  if (!Number.isNaN(id)) {
    store.loadNewsByID(id).catch(() => {})
  }
}

const voteState = computed<'login' | 'loading' | 'can' | 'already'>(() => {
  if (!isLoggedIn.value) return 'login'
  if (store.loading) return 'loading'
  return store.canGoVote ? 'can' : 'already'
})

onMounted(load)
watch(() => route.params.id, load)

function isActive(name: string) {
  const active =
    route.name === name || (name === 'detail' && (route.name === 'news' || route.name === 'detail'))
  return active
    ? 'bg-white text-zinc-100 font-semibold'
    : 'text-white hover:text-zinc-900 hover:bg-zinc-400/70'
}

function goBack() {
  router.push({ name: 'home' })
}
</script>
<template>
  <div class="mx-auto max-w-5xl px-4 py-6">
    <nav class="sticky top-20 z-10">
      <div class="max-w-5xl mx-auto">
        <ul class="flex items-center justify-center gap-3 px-2 pb-2">
          <li>
            <button
              @click="goBack"
              class="inline-flex h-9 w-9 items-center justify-center rounded-full border bg-zinc-800/50 border-zinc-500/60 backdrop-blur-sm text-zinc-200 hover:bg-zinc-800 hover:text-white"
            >
              <SvgIcon type="mdi" :path="mdiArrowLeft" size="18" />
            </button>
          </li>

          <li>
            <RouterLink
              :to="{ name: 'detail' }"
              class="inline-flex items-center gap-2 rounded-full bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 px-4 py-2 text-sm transition-colors"
              :class="isActive('detail')"
            >
              <SvgIcon type="mdi" :path="mdiNewspaperVariantOutline" size="18" />
              <span>News</span>
            </RouterLink>
          </li>

          <li>
            <RouterLink
              v-if="voteState === 'can'"
              :to="{ name: 'vote' }"
              class="inline-flex items-center gap-2 rounded-full bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 px-4 py-2 text-sm transition-colors"
              :class="isActive('vote')"
              title="Comment & Vote"
            >
              <SvgIcon type="mdi" :path="mdiCommentOutline" size="18" />
              <span>Comment &amp; Vote</span>
            </RouterLink>

            <button
              v-else-if="voteState === 'login'"
              @click="router.push({ name: 'login' })"
              class="inline-flex items-center gap-2 backdrop-blur-sm rounded-full px-4 py-2 text-sm border bg-zinc-800/50 border-zinc-700 text-zinc-100 hover:bg-zinc-700"
              title="Please login to comment and vote."
            >
              <SvgIcon type="mdi" :path="mdiCommentOutline" size="18" />
              <span>Login to Vote</span>
            </button>

            <button
              v-else
              disabled
              class="inline-flex items-center gap-2 backdrop-blur-sm rounded-full px-4 py-2 text-sm cursor-not-allowed border bg-zinc-800/50 border-zinc-700 text-zinc-100"
              title="You already voted."
            >
              <SvgIcon type="mdi" :path="mdiCancel" size="18" />
              <span>You already voted</span>
            </button>
          </li>
        </ul>
      </div>
    </nav>

    <RouterView :key="route.fullPath" />
  </div>
</template>
