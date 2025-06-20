import Client from '../lib/auth.ts'

export async function whoIs(spaceName: string) {
  try {
    console.log('Getting members for space:', spaceName)
    const members: any[] = [] // Use a more specific type if you have it, like ChatMembership[]

    let nextPageToken: string | undefined = undefined
    let hasMorePages = true

    while (hasMorePages) {
      // Construct the API URL for listing memberships
      // The spaceName should be in the format "spaces/SPACE_ID"
      let url = `https://chat.googleapis.com/v1/${spaceName}/members`
      if (nextPageToken) {
        url += `?pageToken=${nextPageToken}`
      }

      console.log(`Fetching memberships from: ${url}`)

      // 2. Make the HTTP request using fetch
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${Client.token}`, // Use the obtained access token
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorBody = await response.text()
        throw new Error(
          `HTTP error! Status: ${response.status}, Body: ${errorBody}`,
        )
      }

      const data = await response.json()

      if (data.memberships && Array.isArray(data.memberships)) {
        members.push(...data.memberships) // Add fetched members to the array
      }

      nextPageToken = data.nextPageToken // Get the token for the next page
      hasMorePages = !!nextPageToken // Continue if nextPageToken exists
    }

    return members
  } catch (error) {
    console.error('Error in whoIs:', error)
    throw error // Re-throw to allow caller to handle
  }
}
