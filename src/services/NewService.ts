import apiClient from './AxiosClient'
import { type NewsHomepage, type Page, NewsFilter } from '@/types'

export function getNewsList(page: number, size: number, status: NewsFilter, keyword: string) {
  /* eslint-disable */
  const params: any = {
    page: page,
    size: size,
  }

  if (keyword.trim() !== '') {
    params.keyword = keyword
    return apiClient.get<Page<NewsHomepage>>('/news/search', { params })
  }

  if (status === NewsFilter.ALL) {
    return apiClient.get<Page<NewsHomepage>>('/news', { params })
  } else {
    return apiClient.get<Page<NewsHomepage>>(`/news/status/${status}`, {
      params,
    })
  }
}
