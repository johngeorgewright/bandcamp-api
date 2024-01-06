import { z } from 'zod'
import { DateParser } from '../Date.js'
import { SuccessResponseParser } from './SuccessResponse.js'
import { ErrorResponseParser } from './ErrorResponse.js'

export const UpdateShippedResponseParser = SuccessResponseParser.extend({
  id: z.number(),
  id_type: z.enum(['p', 's']),
  shipped: z.boolean(),
  notification_message: z.string().optional(),
  ship_date: DateParser.optional(),
  carrier: z.string().optional(),
  tracking_code: z.string().optional(),
}).or(ErrorResponseParser)

export type UpdateShippedResponse = z.output<typeof UpdateShippedResponseParser>
