<script setup lang="ts">

import { watch, onMounted,computed } from 'vue'
import { useRoute, useRouter,RouterView } from 'vue-router'
//@ts-expect-error - SvgIcon library lacks TypeScript definitions
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiNewspaperVariantOutline, mdiCommentOutline, mdiArrowLeft } from '@mdi/js'
import { useNewsDetailStore } from '@/stores/newsDetailStore'

const router = useRouter();
const store = useNewsDetailStore()
const route = useRoute();
const canGoVote = computed(()=> store.canGoVote && !store.loading)

function load() {
  const id = Number(route.params.id)
  if (!Number.isNaN(id)) {
    store.loadNewsByID(id).catch(() => {})
  }
}

onMounted(load)
watch(() => route.params.id, load)


function isActive(name: string) {
  const active =
    route.name === name || (name === 'detail' && (route.name === 'news' || route.name === 'detail'))
  return active
    ? 'bg-white text-zinc-900 font-semibold'
    : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-400/70'
}


function goBack() {
  router.push({ name: 'home' })
}

</script>

<template>
    
<div class="mx-auto max-w-5xl px-4 py-6">
    
<nav class="mb-6">
  <div class="border-b border-zinc-600/50">
    <ul class="flex items-center gap-3 px-2 pb-2">
      <li>
        <button
          @click="goBack"
          class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-500/60 text-zinc-200 hover:bg-zinc-800 hover:text-white transition-colors"
        >
          <SvgIcon type="mdi" :path="mdiArrowLeft" size="18" />
        </button>
      </li>

      <li>
        <RouterLink
          :to="{ name: 'detail' }"
          class="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors"
          :class="isActive('detail')"
        >
          <SvgIcon type="mdi" :path="mdiNewspaperVariantOutline" size="18" />
          <span>News</span>
        </RouterLink>
      </li>

      <li>
        <RouterLink
        v-if="canGoVote"
          :to="{ name: 'vote' }"
          class="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors"
          :class="isActive('vote')"
        >
          <SvgIcon type="mdi" :path="mdiCommentOutline" size="18" />
          <span>Comment &amp; Vote</span>
        </RouterLink>

        <button
        v-else
        disabled
        class="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm opacity-50 cursor-not-allowed border border-zinc-500/30 text-zinc-400"
        title="You haven't logged in yet or you've already commented."
        >
          <SvgIcon type="mdi" :path="mdiCommentOutline" size="18" />
          <span>Comment &amp; Vote</span>
        </button>
      </li>
    </ul>
  </div>
</nav>


    <RouterView :key="route.fullPath" />
  </div>

</template>
