import apiClient from './AxiosClient'
import { type Page, type User, type Role, type NewsHomepage } from '@/types'

export function deleteNews(id: number) {
  return apiClient.delete(`/news/delete/${id}`)
}

export function getUsers(page: number, size: number) {
  return apiClient.get<Page<User>>('/users', {
    params: {
      page: page,
      size: size,
    },
  })
}

export function updateUserRole(id: number, role: Role) {
  const payload = { role: role }
  return apiClient.patch<User>(`/users/${id}/role`, payload)
}

export function getDeletedNews(page: number, size: number) {
  return apiClient.get<Page<NewsHomepage>>('/news/deleted', {
    params: {
      page: page,
      size: size,
    },
  })
}
export function restoreNews(id: number) {
  return apiClient.put(`/news/restore/${id}`)
}

export function hardDeleteNews(id: number) {
  return apiClient.delete(`/news/deleteFromDatabase/${id}`)
}
