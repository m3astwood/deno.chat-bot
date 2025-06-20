import { UserType } from './Events.ts'

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
