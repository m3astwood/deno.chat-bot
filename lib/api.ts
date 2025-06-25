import { ofetch } from 'ofetch'
import Client from '../lib/auth.ts'
import { SpaceMember } from '../types/Data.ts'

export const api = ofetch.create({
  baseURL: 'https://chat.googleapis.com/v1/',
  headers: {
    'Authorization': `Bearer ${Client.token}`
  },
})

export const getMembers = async (spaceName: string): Promise<SpaceMember[]> => {
  try {
    const members: SpaceMember[] = []

    let nextPageToken: { pageToken: string } | undefined = undefined
    let hasMorePages = true

    while (hasMorePages) {
      console.log(`Fetching memberships from: ${spaceName}`)
      const response: { memberships: SpaceMember[]; nextPageToken: string } = await api(`${spaceName}/members`, {
        query: nextPageToken,
      })

      if (response.memberships && Array.isArray(response.memberships)) {
        members.push(...response.memberships)
      }

      nextPageToken = { pageToken: response.nextPageToken }
      hasMorePages = !!nextPageToken.pageToken
    }

    return members
  } catch (error) {
    throw error
  }
}
