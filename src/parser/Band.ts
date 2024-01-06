import { z } from 'zod'

const _BandParser = z.object({
  subdomain: z.string(),
  band_id: z.number(),
  name: z.string(),
})

export const BandParser = _BandParser.extend({
  member_bands: _BandParser.array().optional(),
})

export type Band = z.output<typeof BandParser>
