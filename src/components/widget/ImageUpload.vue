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
  <Uploader
    :server="uploadUrl"
    :media="initialMedia"
    @change="onChanged"
    :max="props.max ?? 1"
    class="mu-container"
  />
</template>

<style scoped>
:deep(.mu-container) {
  background-color: #18181b !important;
  border: 1px solid #27272a !important;
}
:deep(.mu-elements-wraper) {
  padding: 1rem !important;
  display: flex !important;
  flex-wrap: wrap !important;
}
:deep(.mu-plusbox) {
  background-color: #27272a !important;
  border: 1px dashed #3f3f46 !important;
}
:deep(.mu-plusbox:hover) {
  background-color: #3f3f46 !important;
}
:deep(.mu-plusbox:hover > .mu-plus-icon) {
  color: #17171a !important;
}
:deep(.mu-plus-icon) {
  color: #71717a !important;
  font-size: 3rem !important;
  flex: 1;
}
:deep(.mu-image-container) {
  width: 140px !important;
  height: 90px !important;
}
:deep(.mu-images-preview) {
  border-radius: 5px !important;
  border: 1px solid #3f3f46 !important;
  object-fit: cover;
  object-position: center;
}
:deep(.mu-close-btn) {
  background: rgba(24, 24, 27, 0.7) !important;
  color: #252323 !important;
  border-radius: 50% !important;
  width: 20px !important;
  height: 20px !important;
  top: 5px;
  right: 5px;
}
:deep(.mu-close-btn:hover) {
  background: #dc2626 !important;
  color: #fff !important;
}
</style>
