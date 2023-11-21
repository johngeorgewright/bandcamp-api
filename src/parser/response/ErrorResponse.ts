import { z } from 'zod'

export const ErrorResponse = z.object({
  error: z.literal(true),
  error_description: z.string(),
})

export type ErrorResponse = z.output<typeof ErrorResponse>
