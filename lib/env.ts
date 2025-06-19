import "jsr:@std/dotenv/load";
import z from 'zod'

const envObject = Deno.env.toObject()

const Env = z.object({
  CREDENTIALS_FILE: z.string(),
  SCOPES: z.string()
    .transform((value) => value.split(','))
    .pipe(z.string().trim().url().array()),
})

export const env = Env.parse(envObject)
