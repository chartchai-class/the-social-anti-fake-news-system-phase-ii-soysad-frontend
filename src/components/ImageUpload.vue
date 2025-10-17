<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  server: string
  publicBase?: string
  modelValue?: string
}>()

const emit = defineEmits<{ (e: 'update:modelValue', v: string): void }>()

const isUploading = ref(false)
const previewUrl = ref<string>('')

const handleFileSelect = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    previewUrl.value = e.target?.result as string
  }
  reader.readAsDataURL(file)

  isUploading.value = true

  try {
    const formData = new FormData()
    formData.append('image', file)

    const response = await fetch(props.server, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const imageUrl = await response.text()
    const cleanedUrl = imageUrl.trim().replace(/\s+/g, '')

    if (cleanedUrl.startsWith('http')) {
      emit('update:modelValue', cleanedUrl)
      previewUrl.value = ''
      input.value = ''
    }
  } catch (error) {
    console.error('Upload failed:', error)
  } finally {
    isUploading.value = false
  }
}
</script>

<template>
  <div class="w-full flex flex-col items-center gap-4">
    <input
      id="file-input"
      type="file"
      accept="image/*"
      @change="handleFileSelect"
      :disabled="isUploading"
      class="hidden"
    />

    <label
      for="file-input"
      class="flex items-center justify-center w-48 px-6 py-4 border-2 border-dashed border-indigo-500 rounded-lg cursor-pointer hover:bg-indigo-500/10 transition-colors"
      :class="{ 'opacity-50 cursor-not-allowed': isUploading }"
    >
      <div class="text-center">
        <div class="text-sm text-gray-300">
          {{ isUploading ? 'Uploading...' : 'Choose Image' }}
        </div>
      </div>
    </label>

    <div v-if="previewUrl" class="w-40 h-40 rounded-lg overflow-hidden border-2 border-indigo-500">
      <img :src="previewUrl" :alt="'preview'" class="w-full h-full object-cover" />
    </div>
  </div>
</template>
