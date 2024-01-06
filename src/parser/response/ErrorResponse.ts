import { z } from 'zod'
import { zodGuard } from 'zod-guard'

export const ErrorResponseParser = z.object({
  error: z.literal(true),
  error_message: z.string(),
})

export type ErrorResponse = z.output<typeof ErrorResponseParser>

export const isErrorResponse = zodGuard(ErrorResponseParser)
