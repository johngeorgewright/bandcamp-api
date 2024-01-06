import { z } from 'zod'

export const ShippingOriginParser = z.object({
  origin_id: z
    .number()
    .describe(
      'the Bandcamp ID of the shipping origin (use this in calls to other endpoints)',
    ),
  band_id: z
    .number()
    .describe(
      'the Bandcamp ID of the artist or label this shipping origin is associated with',
    ),
  country_name: z
    .string()
    .describe(
      'the name of the country that this shipping origin is located in',
    ),
  state_name: z
    .string()
    .nullable()
    .describe(
      'the name of the state that this shipping origin is located in, if available',
    ),
  state_code: z
    .string()
    .nullable()
    .describe(
      'the two-character code for the state that this shipping origin is located in, if available',
    ),
})

export type ShippingOrigin = z.input<typeof ShippingOriginParser>
