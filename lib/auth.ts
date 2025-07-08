import { env } from './env.ts'
import { GoogleAuth } from 'google-auth-library'
import { ChatServiceClient } from 'google-apps/chat'

const SCOPES = env.SCOPES
const SERVICE_ACCOUNT = env.SERVICE_ACCOUNT

async function authorizeServiceAccount(): Promise<{ client: GoogleAuth, token: string }> {
  try {
    const client = new GoogleAuth({
      credentials: SERVICE_ACCOUNT,
      scopes: SCOPES,
    })

    const token = await client.getAccessToken()
    if (!token) {
      throw new Error('Failed to obtain access token.')
    }

    return { client, token }
  } catch (err) {
    console.error('Error authorizing service account:', err)
    console.error(
      "Please ensure your credentials env variable is a valid service account key.",
    )
    throw err
  }
}

function authorizeChatAccount() {
  try {
    console.log(SERVICE_ACCOUNT)
    const client = new ChatServiceClient({
      credentials: SERVICE_ACCOUNT,
      scopes: SCOPES,
    })

    return client
  } catch (err) {
    console.error('Error authorizing service account:', err)
    console.error(
      "Please ensure your credentials env variable is a valid service account key.",
    )
    throw err
  }
}

export const chatClient = authorizeChatAccount()

export default await authorizeServiceAccount()
