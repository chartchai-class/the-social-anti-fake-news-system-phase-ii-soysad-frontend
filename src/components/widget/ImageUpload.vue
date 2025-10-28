<script setup lang="ts">
import Uploader from 'vue-media-upload'
import { ref, computed } from 'vue'

const props = defineProps<{
  modelValue: string | string[]
  max?: number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: string | string[]): void
}>()

const uploadUrl = ref(import.meta.env.VITE_BACKEND_URL + '/uploadFile')

/* eslint-disable */
const onChanged = (media: any[]) => {
  if (Array.isArray(props.modelValue)) {
    const newUrls = media.map((item) => item.name)
    emit('update:modelValue', newUrls)
  } else {
    const newUrl = media.length > 0 ? media[0].name : ''
    emit('update:modelValue', newUrl)
  }
}
/* eslint-enable */

const initialMedia = computed(() => {
  const defaultImage = 'https://i.pinimg.com/236x/55/9b/b4/559bb468d3aaa734c6302dd286d27d69.jpg'

  if (Array.isArray(props.modelValue)) {
    if (props.modelValue.length > 0) {
      return props.modelValue.map((url) => ({ name: url, source: url }))
    }
  } else if (typeof props.modelValue === 'string') {
    if (props.modelValue && props.modelValue !== defaultImage) {
      return [{ name: props.modelValue, source: props.modelValue }]
    }
  }
  return []
})
</script>

<template>
  <Uploader :server="uploadUrl" :media="initialMedia" @change="onChanged" :max="props.max ?? 1" />
</template>
