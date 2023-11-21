import { z } from 'zod'

export const Band = z.object({
  subdomain: z.string(),
  band_id: z.number(),
  name: z.string(),
})

export type Band = z.output<typeof Band>
