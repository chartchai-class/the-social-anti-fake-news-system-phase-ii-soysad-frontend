export interface UserAuth {
  id: number
  name: string
  surname: string
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

export interface NewsDetail {
  id: number
  slug: string
  topic: string
  shortDetail: string
  fullDetail: string
  mainImageUrl: string
  reporter: UserAuth
  publishedAt: string
  status: NewsStatus
  fakeCount: number
  notFakeCount: number
  comments: Comment[]
}
