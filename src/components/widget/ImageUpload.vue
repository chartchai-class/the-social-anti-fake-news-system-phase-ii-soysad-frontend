<script setup lang="ts">
import { ref } from 'vue'
const uploadUrl = `${import.meta.env.VITE_BACKEND_URL}/uploadFile`

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
  (e: 'update:uploading', v: boolean): void
}>()


const isUploading = ref(false)

const uploadImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const formData = new FormData()
    formData.append('image', file)

    fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }
        return response.text()
      })
      .then((imageUrl) => {
        const cleanedUrl = imageUrl.trim().replace(/\s+/g, '')
        if (cleanedUrl.startsWith('http')) {
          resolve(cleanedUrl)
        } else {
          reject(new Error('Invalid URL returned'))
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) return

  isUploading.value = true
  emit('update:uploading', true)

  const reader = new FileReader()
  reader.onload = (e) => {
    const tempPreviewUrl = e.target?.result as string

    emit('update:modelValue', tempPreviewUrl)
  }
  reader.readAsDataURL(file)

  uploadImage(file)
    .then((finalUrl) => {
      emit('update:modelValue', finalUrl)
      input.value = ''
    })
    .catch((error) => {
      console.error('Upload failed:', error)
    })
    .finally(() => {
      isUploading.value = false
      emit('update:uploading', false)
    })
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
  </div>
</template>
