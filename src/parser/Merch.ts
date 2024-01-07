import { z } from 'zod'

export const MerchParser = z.object({
  package_id: z
    .number()
    .describe(
      'the Bandcamp ID of the merch item (use this in calls to other endpoints)',
    ),
  album_title: z
    .string()
    .optional()
    .describe(
      "if this is music merch (cd, vinyl, cassette), the name of album it's associated with",
    ),
  title: z.string().describe('name of the item for sale'),
  image_url: z
    .string()
    .describe('URL of the image on Bandcamp associated with this item'),
  quantity_available: z
    .number()
    .nullable()
    .describe(
      'number of units available for sale (i.e. which Bandcamp thinks it can still sell) across all shipping origins; null means unlimited',
    ),
  quantity_sold: z
    .number()
    .describe(
      'number of units that have been sold on Bandcamp across all shipping origins',
    ),
  price: z.number().describe('price per item'),
  currency: z.string().describe('currency in which price is listed'),
  subdomain: z
    .string()
    .describe('the Bandcamp subdomain where the item can be found'),
  is_set_price: z
    .boolean()
    .nullable()
    .describe('can the user pay more than the asking price if they want?'),
  sku: z.string().describe('item sku'),
  options: z
    .object({
      option_id: z
        .number()
        .describe('(i.e., the unique Bandcamp ID for this option)'),
      quantity_sold: z.number(),
      quantity_available: z.number().nullable(),
      title: z.string(),
      sku: z.string(),
    })
    .array()
    .nullable()
    .describe(
      'options information in array form, one item for each option; null when there are no options.',
    ),
  origin_quantities: z
    .object({
      origin_id: z
        .number()
        .describe('i.e., the unique Bandcamp ID for this shipping origin'),
      quantity_available: z.number(),
      quantity_sold: z.number(),
      option_quantities: z
        .object({
          option_id: z
            .number()
            .describe('i.e., the unique Bandcamp ID for this option'),
          quantity_available: z.number().nullable(),
          quantity_sold: z.number(),
        })
        .array()
        .nullable()
        .describe('quantities at this shipping origin per option.'),
    })
    .array()
    .nullable()
    .describe('quantities per shipping origin.'),
})

export type Merch = z.input<typeof MerchParser>
