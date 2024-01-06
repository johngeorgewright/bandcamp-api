import { z } from 'zod'

export const UpdateQuantitiesRequestParser = z.strictObject({
  id: z
    .number()
    .describe(
      'package (merch item) or option (merch item-option) ID - (see get_merch_details)',
    ),
  id_type: z
    .enum(['p', 'o'])
    .describe(
      '"p" if id is for an item (or package), or "o" for an item-option',
    ),
  quantity_sold: z
    .number()
    .describe(
      'the number of items that Bandcamp has sold, as reported by get_merch_details',
    ),
  quantity_available: z
    .number()
    .describe('the new inventory level you want to set'),
  origin_id: z
    .number()
    .describe(
      '(optional, unless you have more than one shipping origin) the unique Bandcamp ID for this shipping origin',
    ),
})

export type UpdateQuantitiesRequest = z.input<
  typeof UpdateQuantitiesRequestParser
>
