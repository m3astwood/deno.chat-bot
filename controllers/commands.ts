import { env } from '../lib/env.ts'
import { ChatServiceClient } from 'google-apps/chat'

export async function whoIs(spaceName: string) {
  try {
    console.log('Initializing ChatServiceClient...');
    // 1. Instantiate ChatServiceClient with service account credentials and scopes
    const chatClient = new ChatServiceClient({
      credentials: {
        client_email: env.SERVICE_ACCOUNT.client_email,
        private_key: env.SERVICE_ACCOUNT.private_key,
      },
      // Ensure your SCOPES include necessary permissions, e.g., 'https://www.googleapis.com/auth/chat.memberships.readonly'
      scopes: env.SCOPES,
    });

    console.log('Getting memberships for space:', spaceName);
    const members: any[] = []; // Use a more specific type if you have it, like ChatMembership[]

    // 2. Call listMembershipsAsync and iterate over the asynchronous generator
    // The library handles pagination and internal token management.
    const pageResult = chatClient.listMembershipsAsync({
      parent: spaceName, // The space name in the format "spaces/SPACE_ID"
      // You can add other options like pageSize, filter, etc., here if needed
      // pageSize: 100 // Example: request up to 100 results per page
    });

    for await (const response of pageResult) {
      console.log('Received page of memberships:', response);
      if (response.memberships && Array.isArray(response.memberships)) {
        members.push(...response.memberships);
      }
    }

    console.log('Finished getting all members.');
    return members;
  } catch (error) {
    console.error('Error in whoIs:', error);
    throw error; // Re-throw to allow caller to handle
  }
}
