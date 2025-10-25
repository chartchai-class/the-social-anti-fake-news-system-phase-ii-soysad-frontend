import { getNewsDetail } from '@/services/NewService'
import { addNewComment as apiAddComment, removeComment as apiRemoveComment , restoreComment as apiRestoreComment, restoreComment  } from '@/services/CommentService' 
import type { Comments, CommentsSave, NewsDetail,VoteType } from '@/types'
import { defineStore } from 'pinia'
import { useAuthStore } from './auth'

interface Vote{
    total: number
    fake: number
    nonFake: number
}

export interface NewsDetailState {
  news: NewsDetail | null
  comments: Comments[]
  loading: boolean
  error: string | null
  counts: {
    active: Vote
    deleted: Vote
  }
}

function isFake(v?: VoteType) {
  return v === 'FAKE'
}

export const useNewsDetailStore = defineStore('newsDetail',{
    state: (): NewsDetailState => ({
        news: null,
        comments: [],
        loading: false,
        error: null,
        counts: {
        active: { total: 0, fake: 0, nonFake: 0 },
        deleted: { total: 0, fake: 0, nonFake: 0 }
        }
    }),

    getters: {
        activeComments: (s): Comments[] => s.comments.filter(c => !c.deleted),
        deletedComments: (s): Comments[] => s.comments.filter(c => c.deleted)
    },

    actions: {
    recalcCounts(): void {
      const act = this.comments.filter(c => !c.deleted)
      const del = this.comments.filter(c => c.deleted)

      this.counts.active = {
        total: act.length,
        fake: act.filter(c => isFake(c.voteType)).length,
        nonFake: act.filter(c => !isFake(c.voteType)).length
      }
      this.counts.deleted = {
        total: del.length,
        fake: del.filter(c => isFake(c.voteType)).length,
        nonFake: del.filter(c => !isFake(c.voteType)).length
      }
    },
    loadNewsByID(id:number): Promise<void> {
        this.loading = true;
        this.error = null;
        const auth = useAuthStore()

        return getNewsDetail(id)
            .then((response: NewsDetail)=>{

              const comments = [...(response.comments ?? [])]

      const currentUser = auth.currentUser?.id
      if (currentUser) {
          comments.sort((a, b) => {
              const aMine = a.author?.id === currentUser
              const bMine = b.author?.id === currentUser
              if (aMine && !bMine) return -1
              if (!aMine && bMine) return 1

              const timeA = new Date(a.createdAt).getTime()
              const timeB = new Date(b.createdAt).getTime()
              return timeB - timeA
            })
      } else {
          comments.sort((a, b) => {
            const timeA = new Date(a.createdAt).getTime()
            const timeB = new Date(b.createdAt).getTime()
            return timeB - timeA
          })
        }

          this.news = response
          this.comments = comments
          this.recalcCounts()
            })
            .catch((e: any) => {
            this.error = e?.message ?? 'load failed'
            return Promise.reject(e)
            })
            .finally(() => {
            this.loading = false
            })
    },

    addComment(payload: CommentsSave): Promise<void> {
      if (!this.news?.id) return Promise.reject(new Error('no news id'))
     
      return apiAddComment(payload, this.news.id)
        .then(() => this.loadNewsByID(this.news!.id))  
        .catch((e) => {
            this.error = e?.message ?? 'add comment failed'
            return Promise.reject(e)
        })
    },

    removeComment(commentId: number): Promise<void> {
    if (!this.news?.id) return Promise.reject(new Error('no news id'))

    return apiRemoveComment(commentId, this.news.id)
            .then(() => this.loadNewsByID(this.news!.id))  
            .catch((e) => {
                this.error = e?.message ?? 'remove comment failed'
                return Promise.reject(e)
        })
    },

    restoreComment(commentId: number): Promise<void> {
        if (!this.news?.id) return Promise.reject(new Error('no news id'))

        return apiRestoreComment(commentId, this.news.id)
            .then(() => this.loadNewsByID(this.news!.id))  
            .catch((e) => {
                this.error = e?.message ?? 'remove comment failed'
                return Promise.reject(e)
        })
 
    }
    }
}) 