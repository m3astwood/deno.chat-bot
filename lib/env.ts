import 'jsr:@std/dotenv/load'
import z from 'zod'

const envObject = Deno.env.toObject()

const Env = z.object({
  SERVICE_ACCOUNT: z.string()
    .transform((value) => JSON.parse(value))
    .pipe(z.object({
      type: z.string(),
      project_id: z.string(),
      private_key_id: z.string(),
      private_key: z.string().transform((value) => value.replace(/\\n/g, '\n')),
      client_email: z.string().email(),
      client_id: z.string(),
      auth_uri: z.string().url(),
      token_uri: z.string().url(),
      auth_provider_x509_cert_url: z.string().url(),
      client_x509_cert_url: z.string().url(),
      universe_domain: z.string(),
    })),
  SCOPES: z.string()
    .transform((value) => value.split(','))
    .pipe(z.string().trim().array()),
})

export const env = Env.parse(envObject)
