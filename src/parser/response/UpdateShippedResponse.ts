import { z } from 'zod'
import { Date } from '../Date.js'
import { SuccessResponse } from './SuccessResponse.js'
import { ErrorResponse } from './ErrorResponse.js'

export const UpdateShippedResponse = SuccessResponse.extend({
  id: z.number(),
  id_type: z.enum(['p', 's']),
  shipped: z.boolean(),
  notification_message: z.string().optional(),
  ship_date: Date.optional(),
  carrier: z.string().optional(),
  tracking_code: z.string().optional(),
}).or(ErrorResponse)

export type UpdateShippedResponse = z.output<typeof UpdateShippedResponse>
