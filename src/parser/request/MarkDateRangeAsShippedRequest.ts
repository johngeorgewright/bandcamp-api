import { z } from 'zod'
import { DateParser } from '../Date.js'

export const MarkDateRangeAsShippedRequestParser = z.strictObject({
  band_id: z.coerce
    .number()
    .describe("identifies the label you're calling on behalf of"),
  member_band_id: z.coerce
    .number()
    .optional()
    .describe('(optional) identifies the band or artist to filter on'),
  start_time: DateParser.optional().describe(
    '(optional) earliest date in range of orders',
  ),
  end_time: DateParser.describe(
    ' most recent date in range of orders (must be in past)',
  ),
  origin_id: z.coerce
    .number()
    .optional()
    .describe(
      '(optional) Bandcamp ID of a specific origin which the items you want to update were shipped from',
    ),
  email_notifications: z
    .boolean()
    .optional()
    .describe(
      '(optional) true to send notifications, false to suppress, leave out (or send null) to honor selling band preferences',
    ),
})

export type MarkDateRangeAsShippedRequest = z.input<
  typeof MarkDateRangeAsShippedRequestParser
>
