import { z } from 'zod'

export const SuccessResponse = z.object({ success: z.literal(true) })
