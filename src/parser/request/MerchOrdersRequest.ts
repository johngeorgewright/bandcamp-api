import { z } from 'zod'
import { DateParser } from '../Date.js'

export const MerchOrdersRequestParser = z.strictObject({
  band_id: z.coerce
    .number()
    .describe(
      'Bandcamp ID of your label or the (usually) label on whose behalf you are querying (get this ID from my_bands in the Account API)',
    ),
  member_band_id: z.coerce
    .number()
    .optional()
    .describe('(optional) Bandcamp ID of band to filter on; defaults to all'),
  start_time: DateParser.optional().describe(
    "(optional) earliest sale dates you're interested in",
  ),
  end_time: DateParser.optional().describe(
    "(optional) latest sale dates you're interested in",
  ),
  unshipped_only: z
    .boolean()
    .optional()
    .describe(
      '(optional) query for unshipped orders only - true or false, default is false',
    ),
  name: z
    .string()
    .optional()
    .describe('(optional) filter orders on this item name (or title)'),
  origin_id: z.coerce
    .number()
    .optional()
    .describe('(optional) filter orders on a particular shipping origin'),
  format: z
    .enum(['json', 'csv'])
    .optional()
    .describe("(optional) results format: 'csv' or 'json' (default is 'json')"),
})

export type MerchOrdersRequest = z.input<typeof MerchOrdersRequestParser>
