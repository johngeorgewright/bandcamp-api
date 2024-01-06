import { z } from 'zod'

export const Credentials = z.object({
  expires_in: z.number(),
  access_token: z.string(),
  refresh_token: z.string(),
  ok: z.literal(true),
  token_type: z.string(),
})

export type Credentials = z.output<typeof Credentials>
