import { z } from 'zod'

export const Order = z.object({
  artist: z.string().describe("artist's or band's name"),
  buyer_email: z.string().describe("buyer's email"),
  buyer_name: z.string().describe("buyer's name"),
  buyer_note: z
    .string()
    .nullable()
    .describe(
      'note written by the purchaser, at the time of purchase, via the Bandcamp checkout UI',
    ),
  buyer_phone: z.string().nullable().describe("buyer's telephone"),
  currency: z.string().describe('currency of transcation'),
  discount_code: z.string().nullable().describe('discount code, if it exists'),
  item_name: z.string().describe('name of the merch item, on Bandcamp'),
  item_url: z.string().describe('URL to the item, on Bandcamp'),
  marketplace_tax: z.string().nullable(),
  option: z.string().nullable().describe('option name, if it exists'),
  order_date: z.string().describe('date order was placed'),
  order_total: z.number().describe('total charge'),
  payment_id: z
    .number()
    .describe(
      'Bandcamp ID for payment; multiple items share the same payment_id when more than one item is purchased in the same transaction',
    ),
  paypal_id: z
    .string()
    .nullable()
    .describe("PayPal's ID for the transaction, if it exists"),
  payment_state: z
    .enum(['pending', 'paid', 'refunded'])
    .describe('pending, paid, or refunded'),
  quantity: z.number().describe('number of this particular sale item'),
  sale_item_id: z.number().describe('Bandcamp ID for sale item'),
  ship_date: z
    .string()
    .nullable()
    .describe(
      "date on which item is marked as shipped, null when item hasn't yet shipped",
    ),
  ship_from_country_name: z
    .string()
    .nullable()
    .describe('merch store to ship from'),
  ship_notes: z
    .string()
    .nullable()
    .describe(
      'notes written by the purchaser, at the time of purchase, via the PayPal checkout UI',
    ),
  ship_to_city: z.string().nullable().describe('city name, for shipping'),
  ship_to_country_code: z
    .string()
    .nullable()
    .describe('ISO two letter country code, for shipping'),
  ship_to_country: z.string().nullable().describe('country name, for shipping'),
  ship_to_name: z.string().describe('name to ship order to'),
  ship_to_state: z
    .string()
    .nullable()
    .describe('state / region within country, if exists, for shipping'),
  ship_to_street_2: z
    .string()
    .nullable()
    .describe('second line of street name, if exists, for shipping'),
  ship_to_street: z.string().describe('street name, for shipping'),
  ship_to_zip: z.string().describe('postal code'),
  shipping: z.string().describe('shipping costs'),
  sku: z
    .string()
    .nullable()
    .describe(
      'SKU applied to merch item by band or label, if a SKU has been applied to the merch item. If the thing purchased comes in several options, the SKU here is that of option purchased.',
    ),
  sub_total: z.number().describe('total before taxes'),
  tax: z.number().describe('taxes applied to sale'),
})

export type Order = z.infer<typeof Order>
