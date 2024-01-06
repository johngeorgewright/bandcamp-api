import { z } from 'zod'
import { SuccessResponseParser } from './SuccessResponse.js'
import { ShippingOriginParser } from '../ShippingOrigin.js'
import { ErrorResponseParser } from './ErrorResponse.js'

export const ShippingOriginDetailsResponseParser = SuccessResponseParser.extend(
  {
    shipping_origins: ShippingOriginParser.array().describe(
      'an array of shipping origins',
    ),
  },
).or(ErrorResponseParser)

export type ShippingOriginDetailsResponse = z.output<
  typeof ShippingOriginDetailsResponseParser
>
