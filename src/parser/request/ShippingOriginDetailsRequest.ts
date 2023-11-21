import { z } from 'zod'

export const ShippingOriginDetailsRequest = z.strictObject({
  band_id: z
    .number()
    .optional()
    .describe(
      'Bandcamp ID of your label or the (usually) label on whose behalf you are querying (get this ID from my_bands in the Account API)',
    ),
  origin_id: z
    .number()
    .optional()
    .describe(
      'Bandcamp ID of a specific shipping origin you want to retrieve details for',
    ),
})

export type ShippingOriginDetailsRequest = z.input<
  typeof ShippingOriginDetailsRequest
>
