export interface UserAuth {
  id: number
  name: string
  surname: string
  username: string
  email: string
  profileImageUrl: string
  roles: string[]
}

// newlistview
export enum NewsStatus {
  FAKE = 'FAKE',
  NOT_FAKE = 'NOT_FAKE',
  UNVERIFIED = 'UNVERIFIED',
}

export enum NewsFilter {
  ALL = 'ALL',
  FAKE = 'FAKE',
  NOT_FAKE = 'NOT_FAKE',
}

export interface NewsHomepage {
  id: number
  slug: string
  topic: string
  shortDetail: string
  mainImageUrl: string
  reporter: string
  publishedAt: string
  status: NewsStatus
  fakeCount: number
  notFakeCount: number
}

export interface NewsDetail {
  id: number
  slug: string
  topic: string
  shortDetail: string
  fullDetail: string
  mainImageUrl: string
  publishedAt: string | null
  reporter: Reporter
  galleryImages: string[]
  comments: Comments[]
  status: NewsStatus
  fakeCount: number
  notFakeCount: number
}

export interface Comments {
  id: number
  author: UserAuth
  body: string
  createdAt: string
  updatedAt: string
  voteType: VoteType
  attachments: string[]
  deleted: boolean
  version: number
}

export enum VoteType {
  FAKE = 'FAKE',
  NOT_FAKE = 'NOT_FAKE'
  
}

export interface Reporter {
  id: number
  name: string
  surname: string
  username: string
  email: string
  profileImageUrl: string
  role: 'ADMIN' | 'MEMBER' | 'READER'
  enabled: boolean
}

export interface Page<T> {
  content: T[]
  totalPages: number
  totalElements: number
  size: number
  number: number
}

// create news
export interface NewsSave {
  topic: string
  shortDetail: string
  fullDetail: string
  mainImageUrl: string
}

export interface CommentsSave {
  body: string,
  voteType: VoteType,
  attachments: string[],
  userId : number
}
