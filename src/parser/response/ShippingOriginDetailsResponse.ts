import { z } from 'zod'
import { SuccessResponse } from './SuccessResponse.js'
import { ShippingOrigin } from '../ShippingOrigin.js'
import { ErrorResponse } from './ErrorResponse.js'

export const ShippingOriginDetailsResponse = SuccessResponse.extend({
  shipping_origins: ShippingOrigin.array().describe(
    'an array of shipping origins',
  ),
}).or(ErrorResponse)

export type ShippingOriginDetailsResponse = z.output<
  typeof ShippingOriginDetailsResponse
>
