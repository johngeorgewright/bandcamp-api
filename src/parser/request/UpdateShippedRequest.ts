import { z } from 'zod'
import { Date } from '../Date.js'

export const UpdateShippedRequest = z.strictObject({
  items: z
    .strictObject({
      id: z
        .number()
        .describe('unique Bandcamp ID of the payment or sale item to update'),
      id_type: z
        .enum(['p', 's'])
        .optional()
        .describe('p')
        .describe(
          "'p' when id parameter refers to a payment, 's' for sale item",
        ),
      shipped: z
        .any()
        .optional()
        .default(false)
        .describe(
          '(optional), true to mark as shipped, false to mark as unshipped, missing or null defaults to true',
        ),
      notification: z
        .boolean()
        .optional()
        .nullable()
        .describe(
          "(optional) true to send notification, false don't, null or missing to honor seller (band or label) default setting",
        ),
      notification_message: z
        .string()
        .optional()
        .describe(
          '(optional) custom message to send with shipping notificaton to buyer',
        ),
      ship_date: Date.optional().describe(
        '(optional) date of shipment; defaults to current date',
      ),
      carrier: z
        .string()
        .optional()
        .describe(
          '(optional) name of the shipping carrier (displayed to buyer)',
        ),
      tracking_code: z
        .string()
        .optional()
        .describe('(optional) tracking code or number (displayed to buyer)'),
    })
    .array(),
})

export type UpdateShippedRequest = z.input<typeof UpdateShippedRequest>
