import { z } from 'zod'

export const UpdateSKURequestParser = z.strictObject({
  items: z
    .strictObject({
      id: z
        .number()
        .describe('merch item (package) and option ID (see get_merch_details)'),
      id_type: z
        .enum(['p', 'o'])
        .describe(
          '"p" if id refers to a merch item (package), or "o" an item-option',
        ),
      sku: z
        .string()
        .describe('the new SKU for the merch item (package) or item-option'),
    })
    .array()
    .describe('array of items or item-options to update'),
})

export type UpdateSKURequest = z.input<typeof UpdateSKURequestParser>
