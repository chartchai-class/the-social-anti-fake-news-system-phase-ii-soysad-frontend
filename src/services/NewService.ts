import apiClient from './AxiosClient'
import { type NewsHomepage, type Page, NewsFilter } from '@/types'

export function getNewsList(page: number, size: number, status: NewsFilter) {
  const params = {
    page: page,
    size: size,
  }

  if (status === NewsFilter.ALL) {
    return apiClient.get<Page<NewsHomepage>>('/news', { params })
  } else {
    return apiClient.get<Page<NewsHomepage>>(`/news/status/${status}`, {
      params,
    })
  }
}
