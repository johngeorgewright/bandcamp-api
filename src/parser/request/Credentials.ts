import { z } from 'zod'

export const CredentialsParser = z.object({
  client_id: z.number(),
  client_secret: z.string(),
})

export type Credentials = z.input<typeof CredentialsParser>
