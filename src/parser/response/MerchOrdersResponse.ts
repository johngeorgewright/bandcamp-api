import { SuccessResponseParser } from './SuccessResponse.js'
import { MerchOrderParser } from '../MerchOrder.js'
import { ErrorResponseParser } from './ErrorResponse.js'
import { z } from 'zod'

export const OrdersResponseParser = SuccessResponseParser.extend({
  items: MerchOrderParser.array().describe(
    'array of purchased items that meet the the query criteria, listed by purchased item (not by payment or order). So if, for example, a buyer purchases a t-shirt and an album in the same checkout experience, the t-shirt and the album will each contribute a separate item to the array returned here.',
  ),
}).or(ErrorResponseParser)

export type OrdersResponse = z.output<typeof OrdersResponseParser>
