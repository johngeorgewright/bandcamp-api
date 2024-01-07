import { z } from 'zod'

export const AccessParser = z.object({
  access_token: z.string(),
  expires_in: z.number(),
  ok: z.literal(true),
  refresh_token: z.string(),
  token_type: z.string(),
})

export type Access = z.output<typeof AccessParser>
