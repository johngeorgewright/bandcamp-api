import { z } from 'zod'
import { ErrorResponseParser } from './ErrorResponse.js'
import { SuccessResponseParser } from './SuccessResponse.js'

export const UpdateSKUResponseParser =
  SuccessResponseParser.or(ErrorResponseParser)

export type UpdateSKUResponse = z.output<typeof UpdateSKUResponseParser>
