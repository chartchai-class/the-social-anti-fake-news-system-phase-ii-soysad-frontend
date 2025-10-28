<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import CommentItem from './CommentItem.vue'
import { useNewsDetailStore } from '@/stores/newsDetailStore';
import type { Comments } from '@/types'
import { useAuthStore } from '@/stores/auth';


const PER_PAGE_OPTIONS = [5, 10, 15] as const

const props = defineProps<{         
  pageSize?: number
  embedded?: boolean
}>()

const auth = useAuthStore();

const store = useNewsDetailStore()
const list =  computed(() => store.comments)

const selectedSize = ref(props.pageSize ?? 5)
const page = ref(1)
const mode = ref<'active' | 'deleted'>('active')

function changeMode(select: 'active' | 'deleted'){
  mode.value = select
  page.value = 1
}

const filtered = computed<Comments[]>(() => {
  const arr = list.value ?? []
  return mode.value === 'deleted'
    ? arr.filter(c => c.deleted)
    : arr.filter(c => !c.deleted)
})

const total = computed(() => filtered.value.length)

const pageCount = computed(() =>
  Math.max(1, Math.ceil(total.value / selectedSize.value))
)

const showsComments = computed(() => {
  const start = (page.value - 1) * selectedSize.value
  return filtered.value.slice(start, start + selectedSize.value)
})

function onManageComment(id: number) {
  
  const action =
    mode.value === 'deleted'
      ? store.restoreComment(id)
      : store.removeComment(id)
                                                      
  action.then(() => {
      
        const start = (page.value - 1) * selectedSize.value
        const totalAfter =
        mode.value === 'deleted'
          ? store.counts.deleted.total
          : store.counts.active.total  
        if (page.value > 1 && start >= totalAfter) page.value = page.value - 1
      
    })
    .catch((e) => console.error(e))
}

function goTo(p: number) {
  if (p < 1 || p > pageCount.value) return
  page.value = p
}
function prev() { goTo(page.value - 1) }
function next() { goTo(page.value + 1) }


const pageItems = computed(() => {
  const n = pageCount.value
  const cur = page.value
  const out: (number | '…')[] = []
  for (let i = 1; i <= n; i++) {
    if (i === 1 || i === n || Math.abs(i - cur) <= 1) out.push(i)
    else if (out[out.length - 1] !== '…') out.push('…')
  }
  return out
})

watch(selectedSize, () => { page.value = 1 })
watch(mode, () => { page.value = 1 })
watch(() => store.counts.active.total, () => { page.value = 1 })    
watch(() => store.counts.deleted.total, () => { page.value = 1 })

</script>

<template>
  <section :class="props.embedded ? 'px-8 lg:px-12 py-8' : 'mt-10'">
    
    <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-3">
        <h2 class="text-xl md:text-2xl font-semibold text-zinc-100">
          Comments
          <span class="text-zinc-400 font-normal">({{ total }})</span>
        </h2>
      </div>

      <label class="text-sm flex justify-between items-center gap-3 text-zinc-400">
          <div class="flex items-center gap-2 " v-if="auth.isAdmin">
            <div class="inline-flex rounded-lg border border-zinc-700 bg-zinc-900/60 p-0.5">
              <button
                class="px-3 py-1.5 h-[29px] text-sm rounded-md transition 300 leading-none"
                :class="mode === 'active' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'"
                @click="changeMode('active')"
              >Active</button>
              <button 
                class="px-3 py-1.5 h-[29px] text-sm rounded-md transition 300  leading-none"
                :class="mode === 'deleted' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'"
                @click="changeMode('deleted')"
              >Deleted</button>
            </div>
          </div>
        <div class="flex items-center gap-2">
        <span>Per page</span>

        <select
          v-model.number="selectedSize"
          class="rounded-lg border border-zinc-700 bg-zinc-900/60 text-zinc-100 px-2.5 py-1.5 h-[35px] text-sm outline-none hover:bg-zinc-800/70 "
        >
          <option v-for="number in PER_PAGE_OPTIONS" :key="number" :value="number">{{ number }}</option>
        </select>
        </div>
      </label>
    </div>

    
    <div v-if="total === 0" class="text-zinc-500">
      No comments yet.
    </div>

    <ol v-else class="space-y-4">
      <CommentItem v-for="c in showsComments" :key="c.id" :comment="c" @manage-comment="onManageComment(c.id)" :mode="mode"/>
    </ol>

    
    <nav
      v-if="total > 0"
      class="mt-6 flex items-center justify-center gap-2 text-zinc-100 select-none"
    >
      <button
        class="rounded-lg px-3 py-1.5 text-sm border border-zinc-700 bg-zinc-800/60 hover:bg-zinc-700 disabled:opacity-40 transition"
        :disabled="page <= 1"
        @click="prev"
      >
        Prev
      </button>

      <ul class="flex items-center gap-1">
        <li v-for="(it, idx) in pageItems" :key="`p-${idx}`">
          <button
            v-if="typeof it === 'number'"
            class="min-w-9 rounded-lg px-3 py-1.5 text-sm border border-zinc-700 hover:bg-zinc-700"
            :class="it === page ? 'bg-emerald-600 text-white border-emerald-500' : 'text-zinc-200'"
            @click="goTo(it)"
          >
            {{ it }}
          </button>
          <span v-else class="px-2 text-zinc-500">…</span>
        </li>
      </ul>

      <button
        class="rounded-lg px-3 py-1.5 text-sm border border-zinc-700 bg-zinc-800/60 hover:bg-zinc-700 disabled:opacity-40 transition"
        :disabled="page >= pageCount"
        @click="next"
      >
        Next
      </button>
    </nav>
  </section>
</template>



