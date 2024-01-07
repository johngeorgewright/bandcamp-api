import { z } from 'zod'
import { SuccessResponseParser } from './SuccessResponse.js'
import { ErrorResponseParser } from './ErrorResponse.js'

export const MarkDateRangeAsShippedResponseParser =
  SuccessResponseParser.extend({
    items: z
      .object({
        sale_item_id: z
          .number()
          .describe('the Bandcamp ID of the sale item marked'),
        title: z.string().describe('name of the item sold'),
        buyer_name: z.string().describe("purchaser's name"),
      })
      .array(),
  }).or(ErrorResponseParser)

export type MarkDateRangeAsShippedResponse = z.output<
  typeof MarkDateRangeAsShippedResponseParser
>
