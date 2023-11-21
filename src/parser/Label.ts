import { z } from 'zod'
import { Band } from './Band.js'

export const Label = z.object({
  subdomain: z.string(),
  band_id: z.number(),
  name: z.string(),
  member_bands: Band.array(),
})

export type Label = z.output<typeof Label>
