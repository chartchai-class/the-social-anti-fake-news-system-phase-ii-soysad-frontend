import { defineStore } from 'pinia'
import { getNewsList, addNews } from '@/services/NewService'
import { type NewsHomepage, type Page, NewsFilter, type NewsDetail, type NewsSave } from '@/types'

interface NewsState {
  newsPage: Page<NewsHomepage> | null
  isLoading: boolean
  limit: number
  currentFilter: NewsFilter
  searchKeyword: string
}

export const useNewsStore = defineStore('news', {
  state: (): NewsState => ({
    newsPage: null,
    isLoading: false,
    limit: 12,
    currentFilter: NewsFilter.ALL,
    searchKeyword: '',
  }),

  getters: {
    allNews: (state) => state.newsPage?.content || [],
    loadingStatus: (state) => state.isLoading,
    totalPages: (state) => state.newsPage?.totalPages || 0,
    currentPage: (state) => state.newsPage?.number || 0,
    currentLimit: (state) => state.limit,
    getCurrentFilter: (state) => state.currentFilter,
    getSearchKeyword: (state) => state.searchKeyword,
  },

  actions: {
    fetchNews(page: number) {
      this.isLoading = true
      return getNewsList(page, this.limit, this.currentFilter, this.searchKeyword)
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
      this.fetchNews(0)
    },

    setFilter(filter: NewsFilter) {
      this.currentFilter = filter
      this.fetchNews(0)
    },
    setSearch(keyword: string) {
      this.searchKeyword = keyword
      this.fetchNews(0)
    },

    createNews(payload: NewsSave): Promise<NewsDetail> {
      return addNews(payload)
        .then((response) => {
          return response.data
        })
        .catch((error) => {
          console.error('Error in createNews action:', error)
          throw error
        })
    },
  },
})
