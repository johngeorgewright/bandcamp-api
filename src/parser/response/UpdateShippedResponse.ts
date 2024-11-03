import { z } from 'zod'
import { SuccessResponseParser } from './SuccessResponse.js'
import { ErrorResponseParser } from './ErrorResponse.js'

export const UpdateShippedResponseParser =
  SuccessResponseParser.or(ErrorResponseParser)

export type UpdateShippedResponse = z.output<typeof UpdateShippedResponseParser>
