import { z } from 'zod'
import { ErrorResponseParser } from './ErrorResponse.js'
import { SuccessResponseParser } from './SuccessResponse.js'

export const UpdateQuantitiesResponseParser =
  SuccessResponseParser.or(ErrorResponseParser)

export type UpdateQuantitiesResponse = z.output<
  typeof UpdateQuantitiesResponseParser
>
