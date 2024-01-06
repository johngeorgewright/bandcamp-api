import { z } from 'zod'
import { BandParser } from '../Band.js'
import { ErrorResponseParser } from './ErrorResponse.js'

export const BandsResponseParser = z
  .object({
    bands: BandParser.array(),
  })
  .or(ErrorResponseParser)

export type BandsResponse = z.output<typeof BandsResponseParser>
