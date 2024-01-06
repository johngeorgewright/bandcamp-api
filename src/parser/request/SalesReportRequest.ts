import { z } from 'zod'
import { DateParser } from '../Date.js'

export const SalesReportRequestParser = z.strictObject({
  band_id: z
    .number()
    .describe(
      'the unique id of the band or label you are calling as or on behalf of',
    ),
  member_band_id: z
    .number()
    .optional()
    .describe(
      "the unique id of a band you wish to filter your results on, if you're calling as or on behalf of a label (you don't need this if you are calling on behalf of a band, just use that band's id in the band_id field)",
    ),
  start_time: DateParser.describe(
    'the earliest UTC sale time an item could have and still be included in the results, ie start_time <= sale_item',
  ),
  end_time: DateParser.optional().describe(
    'the earliest UTC sale time (after start_time) an item could have and be excluded in the results, ie sale_item < end_time (default is the time of the call)',
  ),
  format: z
    .enum(['csv', 'json'])
    .optional()
    .default('json')
    .describe(
      "the format you wish to receive results in - either 'csv' or 'json' (default is 'json')}",
    ),
})

export type SalesReportRequest = z.input<typeof SalesReportRequestParser>
