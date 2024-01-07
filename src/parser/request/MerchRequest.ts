import { z } from 'zod'
import { DateParser } from '../Date.js'

export const MerchRequestParser = z.strictObject({
  band_id: z
    .number()
    .describe(
      'Bandcamp ID of your label or the (usually) label on whose behalf you are querying (get this ID from my_bands in the Account API)',
    ),
  member_band_id: z
    .number()
    .optional()
    .describe(
      '(optional) Bandcamp ID of the band on which you wish to filter results (get this ID from my_bands in the Account API)',
    ),
  start_time: DateParser.describe(
    'earliest date the items you are interested in would have been added to Bandcamp',
  ),
  end_time: DateParser.optional().describe(
    '(optional) latest date items you are in interested in would have been added to Bandcamp; defaults to the time of the call',
  ),
  package_ids: z
    .number()
    .array()
    .optional()
    .describe(
      '(optional) an array of package IDs that you wish to filter your results on',
    ),
})

export type MerchRequest = z.input<typeof MerchRequestParser>
