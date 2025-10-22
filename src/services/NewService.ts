import apiClient from './AxiosClient'
import type { NewsHomepage, Page } from '@/types'

export function getNewsList(page: number, size: number) {
  return apiClient.get<Page<NewsHomepage>>('/news', {
    params: {
      page: page,
      size: size,
    },
  })
}
