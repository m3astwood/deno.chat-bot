import { env } from '../lib/env.ts'
import Client from '../lib/auth.ts'
import { ChatServiceClient } from 'google-apps/chat'

export async function whoIs() {
  try {
    const chatClient = new ChatServiceClient({
      // FIX : unknown type
      // @ts-ignore: unknown type
      authClient: Client,
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
