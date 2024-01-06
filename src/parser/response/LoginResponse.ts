import { z } from 'zod'
import { AccessParser } from './Access.js'
import { ErrorResponseParser } from './ErrorResponse.js'

export const LoginResponse = AccessParser.or(ErrorResponseParser)

export type LoginResponse = z.output<typeof LoginResponse>
