// src/services/NewService.ts
import apiClient from './AxiosClient'
import type { NewsHomepage, Page } from '@/types'

export function getNewsList() {
  return apiClient.get<Page<NewsHomepage>>('/news')
}
