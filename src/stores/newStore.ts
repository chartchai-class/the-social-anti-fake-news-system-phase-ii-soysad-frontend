import { defineStore } from 'pinia'
import { getNewsList } from '@/services/NewService'
import type { NewsHomepage, Page } from '@/types'

interface NewsState {
  newsPage: Page<NewsHomepage> | null
  isLoading: boolean
  limit: number
}

export const useNewsStore = defineStore('news', {
  state: (): NewsState => ({
    newsPage: null,
    isLoading: false,
    limit: 12,
  }),

  getters: {
    allNews: (state) => state.newsPage?.content || [],
    loadingStatus: (state) => state.isLoading,
    totalPages: (state) => state.newsPage?.totalPages || 0,
    currentPage: (state) => state.newsPage?.number || 0,
    currentLimit: (state) => state.limit,
  },

  actions: {
    fetchNews(page: number) {
      this.isLoading = true
      return getNewsList(page, this.limit)
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
    setPage(page: number) {
      if (page >= 0 && page < (this.newsPage?.totalPages || Infinity)) {
        this.fetchNews(page)
      }
    },

    setLimit(newLimit: number) {
      this.limit = newLimit
      this.fetchNews(0) //
    },
  },
})
