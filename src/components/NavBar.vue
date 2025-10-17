<script setup lang="ts">
/* eslint-disable */
import { RouterLink } from 'vue-router'
// @ts-ignore
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiLogin, mdiAccountPlus, mdiLogout } from '@mdi/js'
import router from '@/router'
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'

const authStore = useAuthStore()
const isLoggedIn = computed(() => authStore.isLoggedIn)
const currentUser = computed(() => authStore.currentUser)

function logout() {
  authStore.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <header
    class="backdrop-blur-md bg-white/70 dark:bg-slate-900/70 shadow-sm border-b border-gray-200/20 sticky top-0 z-50"
  >
    <nav class="container mx-auto flex justify-between items-center px-6 py-4">
      <RouterLink
        :to="{ name: 'home' }"
        class="text-2xl font-semibold text-gray-900 dark:text-white hover:text-green-500 transition-colors"
      >
        SoySad !
      </RouterLink>

      <ul v-if="isLoggedIn && currentUser" class="flex items-center space-x-4">
        <li class="nav-item px-2 text-gray-900 dark:text-white">Hi, {{ currentUser.name }}</li>
        <li class="nav-item px-2">
          <a @click="logout" class="nav-link cursor-pointer">
            <div class="flex items-center text-red-500 hover:text-red-700">
              <SvgIcon type="mdi" :path="mdiLogout" />
              <span class="ml-3">Logout</span>
            </div>
          </a>
        </li>
      </ul>

      <ul v-else class="flex navbar-nav ml-auto">
        <li class="nav-item px-2">
          <router-link to="/register" class="nav-link">
            <div class="flex items-center">
              <SvgIcon type="mdi" :path="mdiAccountPlus" />
              <span class="ml-3">Sign Up</span>
            </div>
          </router-link>
        </li>

        <li class="nav-item px-2">
          <router-link to="/login" class="nav-link">
            <div class="flex items-center">
              <SvgIcon type="mdi" :path="mdiLogin" />
              <span class="ml-3">Login</span>
            </div>
          </router-link>
        </li>
      </ul>
    </nav>
  </header>
</template>
