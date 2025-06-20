import { env } from './env.ts'
import { join } from 'path'
import { GoogleAuth } from 'google-auto-library'

// If modifying these scopes, ensure your service account has the necessary permissions.
// The service account should be granted appropriate roles in Google Cloud IAM,
// e.g., 'Google Chat API Editor' or a custom role.
const SCOPES = env.SCOPES
const SERVICE_ACCOUNT = env.SERVICE_ACCOUNT

/**
 * Authorizes using a service account and returns a GoogleAuth client.
 * This client can then be used to get access tokens for API calls.
 *
 * @return {Promise<GoogleAuth>} An authorized GoogleAuth client.
 */
export async function authorizeServiceAccount(): Promise<GoogleAuth> {
  try {
    const credentials = SERVICE_ACCOUNT

    // Initialize GoogleAuth with service account credentials and scopes.
    const auth = new GoogleAuth({
      credentials: {
        client_email: credentials.client_email,
        private_key: credentials.private_key,
      },
      scopes: SCOPES,
    })

    console.log('Service account authorized successfully.')
    return auth
  } catch (err) {
    console.error('Error authorizing service account:', err)
    console.error(
      "Please ensure your 'credentials.json' file is a valid service account key and located in the project root.",
    )
    throw err
  }
}
