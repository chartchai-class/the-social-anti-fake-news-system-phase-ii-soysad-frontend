import { defineStore } from 'pinia'
// import { log } from 'console'
import router from '@/router'
import { type UserAuth } from '@/types'
import apiClient from '@/services/AxiosClient'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('access_token') as string | null,
    user: (localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user') as string)
      : null) as UserAuth | null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    currentUser: (state) => state.user,
    isAdmin: (state) => state.user?.roles.includes('ADMIN') || false,
    isMember: (state) => state.user?.roles.includes('MEMBER') || false,
  },

  actions: {
    login(usename: string, password: string) {
      return apiClient
        .post('/api/v1/auth/authenticate', {
          username: usename,
          password: password,
        })
        .then((response) => {
          this.token = response.data.access_token
          this.user = response.data.user
          localStorage.setItem('access_token', this.token as string)
          localStorage.setItem('user', JSON.stringify(this.user))
          router.push({ name: 'home' })
          return response
        })
    },
    /* eslint-disable-next-line */
    register(userInfo: any) {
      return apiClient.post('/api/v1/auth/register', userInfo).then((response) => {
        this.token = response.data.access_token
        this.user = response.data.user

        localStorage.setItem('access_token', this.token as string)
        localStorage.setItem('user', JSON.stringify(this.user))

        return response
      })
    },
    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
      router.push({ name: 'login' })
    },
  },
})
