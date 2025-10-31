<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getUsers } from '@/services/AdminService'
import type { User } from '@/types'
import UserCard from '@/components/admin/UserCard.vue'
// @ts-expect-error - SvgIcon library lacks TypeScript definitions
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiChevronLeft, mdiChevronRight } from '@mdi/js'

const users = ref<User[]>([])
const isLoading = ref(true)
const totalPages = ref(0)
const currentPage = ref(0)
const pageSize = ref(10)

const fetchUsers = () => {
  isLoading.value = true
  return getUsers(currentPage.value, pageSize.value)
    .then((response) => {
      users.value = response.data.content
      totalPages.value = response.data.totalPages
    })
    .catch((error) => {
      console.error('Failed to fetch users:', error)
    })
    .finally(() => {
      isLoading.value = false
    })
}

const handleUserUpdate = () => {
  fetchUsers()
}

onMounted(fetchUsers)

const changePage = (newPage: number) => {
  if (newPage < 0 || newPage >= totalPages.value) return
  currentPage.value = newPage
  fetchUsers()
}
</script>

<template>
  <div>
    <h2 class="text-2xl font-semibold text-white mb-4">Manage Users</h2>

    <div v-if="isLoading" class="text-gray-400">Loading users...</div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <UserCard v-for="user in users" :key="user.id" :user="user" @userUpdated="handleUserUpdate" />
    </div>

    <div class="flex justify-center items-center gap-4 mt-8" v-if="!isLoading && totalPages > 1">
      <button
        @click="changePage(currentPage - 1)"
        :disabled="currentPage === 0"
        class="px-4 py-2 rounded-lg bg-zinc-700 text-white disabled:opacity-50"
      >
        <SvgIcon type="mdi" :path="mdiChevronLeft" :size="20" />
      </button>
      <span class="text-white"> Page {{ currentPage + 1 }} of {{ totalPages }} </span>
      <button
        @click="changePage(currentPage + 1)"
        :disabled="currentPage >= totalPages - 1"
        class="px-4 py-2 rounded-lg bg-zinc-700 text-white disabled:opacity-50"
      >
        <SvgIcon type="mdi" :path="mdiChevronRight" :size="20" />
      </button>
    </div>
  </div>
</template>
