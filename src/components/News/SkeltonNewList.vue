<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    count?: number
  }>(),
  {
    count: 6,
  },
)
</script>

<template>
  <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
    <div
      v-for="i in props.count"
      :key="i"
      class="relative bg-zinc-900/30 border border-zinc-800 backdrop-blur-sm rounded-3xl shadow-md overflow-hidden animate-pulse"
    >
      <div class="w-full aspect-[16/9] bg-zinc-800"></div>
      <div class="absolute top-4 right-4 h-6 w-20 rounded-full bg-zinc-700/70"></div>
      <div class="p-4 space-y-3">
        <div class="h-5 w-3/4 rounded bg-zinc-700"></div>
        <div class="h-5 w-2/5 rounded bg-zinc-800"></div>
        <div class="mt-2 space-y-2">
          <div class="h-4 w-full rounded bg-zinc-800"></div>
          <div class="h-4 w-5/6 rounded bg-zinc-800"></div>
          <div class="h-4 w-2/3 rounded bg-zinc-800"></div>
        </div>
        <div class="mt-4 flex justify-between items-center">
          <div class="h-4 w-24 rounded bg-zinc-800"></div>
          <div class="h-4 w-20 rounded bg-zinc-800"></div>
        </div>
      </div>
    </div>
  </div>
</template>
