import { api } from '../lib/service.ts'
import { SpaceMember } from '../types/Data.ts'

export async function whoIs(spaceName: string) {
  try {
    console.log('Getting members for space:', spaceName)
    const members: SpaceMember[] = []

    let nextPageToken: { pageToken: string } | undefined = undefined
    let hasMorePages = true

    while (hasMorePages) {

      console.log(`Fetching memberships from: ${spaceName}`)

      const response: { memberships: SpaceMember[], nextPageToken: string } = await api(`${spaceName}/members`, {
        query: nextPageToken
      })

      if (response.memberships && Array.isArray(response.memberships)) {
        members.push(...response.memberships)
      }

      nextPageToken = { pageToken: response.nextPageToken }
      hasMorePages = !!nextPageToken.pageToken
    }

    console.log(members)

    return members
  } catch (error) {
    console.error('Error in whoIs:', error)
    throw error
  }
}
