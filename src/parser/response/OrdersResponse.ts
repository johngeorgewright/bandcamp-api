import { SuccessResponse } from './SuccessResponse.js'
import { Order } from '../Order.js'
import { ErrorResponse } from './ErrorResponse.js'
import { z } from 'zod'

export const OrdersResponse = SuccessResponse.extend({
  orders: Order.array().describe(
    'array of purchased items that meet the the query criteria, listed by purchased item (not by payment or order). So if, for example, a buyer purchases a t-shirt and an album in the same checkout experience, the t-shirt and the album will each contribute a separate item to the array returned here.',
  ),
}).or(ErrorResponse)

export type OrdersResponse = z.output<typeof OrdersResponse>
