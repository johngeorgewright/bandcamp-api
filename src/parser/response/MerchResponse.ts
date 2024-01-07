import { z } from 'zod'
import { SuccessResponseParser } from './SuccessResponse.js'
import { MerchParser } from '../Merch.js'
import { ErrorResponseParser } from './ErrorResponse.js'

export const MerchResponseParser = SuccessResponseParser.extend({
  items: MerchParser.array(),
}).or(ErrorResponseParser)

export type MerchResponse = z.output<typeof MerchResponseParser>
