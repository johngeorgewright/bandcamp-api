import { z } from 'zod'

export const SuccessResponseParser = z.object({ success: z.literal(true) })
