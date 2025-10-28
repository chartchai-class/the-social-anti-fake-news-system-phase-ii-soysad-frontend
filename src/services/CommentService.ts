import type { CommentsSave } from '@/types'
import '@/services/AxiosInterceptorSetup'
import apiClient from './AxiosClient'

export function addNewComment(comment: CommentsSave, newsId: number) {
  return apiClient.post<CommentsSave>(`/comments/${newsId}`, comment)
}

export function removeComment(commentID: number, newsID: number) {
  console.log(commentID)
  console.log(newsID)
  return apiClient.delete(`/comments/delete/${commentID}/${newsID}`)
}

export function restoreComment(commentID: number, newsID: number) {
  console.log(commentID)
  console.log(newsID)
  return apiClient.put(`/comments/restore/${commentID}/${newsID}`)
}
