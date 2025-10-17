import { defineStore } from 'pinia'
import axios, { type AxiosInstance } from 'axios'
// import { log } from 'console'
import router from '@/router'
import { type UserAuth } from '@/types'

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null as string | null,
    user: (localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user') as string)
      : null) as UserAuth | null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.token,
    currentUser: (state) => state.user,
    isAdmin: (state) => state.user?.roles.includes('ADMIN') || false,
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
