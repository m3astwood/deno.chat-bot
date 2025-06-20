import { getSavedMembers, writeMembers } from '../lib/kv.ts'
import { api } from '../lib/service.ts'
import { SpaceMember } from '../types/Data.ts'

/*
 * The /who command
 *
 * if it has been run already since the last wednesday, do not run
 * rather show who was already chosen
 *
 * note > need a replace one/two of selected function if there needs
 * to be a modification. This could be random or intentional
 *
 * otherwise
 *
 * get all members of the space and select two at random (MVP)
 * - at least do not select the last two who were selected
 *
 * stretch goals
 * - have a list of all users that have been selected already
 * - weight the selection in their favour to not be chosen
**/
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

      console.log(response)

      if (response.memberships && Array.isArray(response.memberships)) {
        members.push(...response.memberships)
      }

      nextPageToken = { pageToken: response.nextPageToken }
      hasMorePages = !!nextPageToken.pageToken
    }

    // write new members to KV
    await writeMembers(members)

    // choose two members
    const savedMembers = await getSavedMembers()
    console.log(savedMembers)

    return members
  } catch (error) {
    console.error('Error in whoIs:', error)
    throw error
  }
}
