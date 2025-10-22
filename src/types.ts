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
