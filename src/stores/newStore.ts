import { defineStore } from 'pinia'
import { getNewsList } from '@/services/NewService'
import type { NewsHomepage, Page } from '@/types'

interface NewsState {
  newsPage: Page<NewsHomepage> | null
  isLoading: boolean
}

export const useNewsStore = defineStore('news', {
  state: (): NewsState => ({
    newsPage: null,
    isLoading: false,
  }),

  getters: {
    allNews: (state) => state.newsPage?.content || [],
    loadingStatus: (state) => state.isLoading,
  },

  actions: {
    fetchNews() {
      this.isLoading = true
      return getNewsList()
        .then((response) => {
          this.newsPage = response.data
        })
        .catch((error) => {
          console.error('Error fetching news:', error)
        })
        .finally(() => {
          this.isLoading = false
        })
    },
  },
})
