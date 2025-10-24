<script setup lang="ts">
import { ref, watch } from 'vue'
import type { User } from '@/types'
import { Role } from '@/types'
import { updateUserRole } from '@/services/AdminService'
import { useAuthStore } from '@/stores/auth'

const props = defineProps<{
  user: User
}>()

const emit = defineEmits(['userUpdated'])

const authStore = useAuthStore()
const isLoading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const selectedRole = ref<Role>(props.user.role)

watch(selectedRole, (newRole, oldRole) => {
  if (newRole === oldRole) return

  // if (props.user.id === authStore.currentUser?.id && newRole !== Role.ADMIN) {
  //   alert(' Remove your own ADMIN role.')
  //   selectedRole.value = oldRole
  //   return
  // }
  isLoading.value = true

  updateUserRole(props.user.id, newRole)
    .then(() => {
      successMessage.value = 'Role updated!'
      emit('userUpdated')
    })
    .catch((error) => {
      console.error('Failed to update role:', error)
      errorMessage.value = 'Update failed.'
      selectedRole.value = oldRole
    })
    .finally(() => {
      isLoading.value = false
    })
})
</script>

<template>
  <div class="bg-zinc-800 p-4 rounded-lg shadow-lg flex items-center gap-4">
    <img
      :src="
        user.profileImageUrl ||
        'https://i.pinimg.com/736x/b9/c4/7e/b9c47ef70bff06613d397abfce02c6e7.jpg'
      "
      class="w-16 h-16 rounded-full object-cover border-2 border-zinc-600"
    />

    <div class="flex-grow">
      <h3 class="text-lg font-semibold text-white">{{ user.name }} {{ user.surname }}</h3>
      <p class="text-sm text-gray-400">{{ user.email }} | username: @{{ user.username }}</p>
    </div>

    <div>
      <label class="text-xs text-gray-400 block mb-1">Role</label>
      <select
        v-model="selectedRole"
        :disabled="
          isLoading || (props.user.id === authStore.currentUser?.id && user.role === 'ADMIN')
        "
        class="bg-zinc-700 text-white p-2 rounded-md border border-zinc-600 focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <option v-for="roleValue in Role" :key="roleValue" :value="roleValue">
          {{ roleValue }}
        </option>
      </select>
    </div>
  </div>
</template>
