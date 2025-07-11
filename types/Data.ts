import { UserType } from './Events.ts'

export interface SavedMember {
  name: string
  displayName: string
  breakfasts: number
}

export interface SpaceMember {
  name: string
  state: string
  member: {
    name: string
    displayName: string
    type: UserType
    domainId: string
  }
  createTime: string
  role: string
}
