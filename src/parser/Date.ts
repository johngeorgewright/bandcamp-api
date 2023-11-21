import { z } from 'zod'

export const Date = z.string().regex(/\d{4}-\d{2}-\d{2}(?: \d{2}:\d{2}\d{2})?/)
