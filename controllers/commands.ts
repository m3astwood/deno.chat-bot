import { env } from '../lib/env.ts'
import { ChatServiceClient } from 'google-apps/chat'

export async function whoIs() {
  try {
    const chatClient = new ChatServiceClient({
      credentials: {
        client_email: env.SERVICE_ACCOUNT.client_email,
        private_key: env.SERVICE_ACCOUNT.private_key
      },
      scopes: env.SCOPES,
    })

    const res = chatClient.listMembershipsAsync()
    const members = []

    for await (const response of res) {
      console.log(response)
      members.push(response)
    }

    return members
  } catch (error) {
    console.error(error)
  }
}
