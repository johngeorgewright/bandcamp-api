import { z } from 'zod'
import { Credentials } from '../Credentials.js'
import { ErrorResponse } from './ErrorResponse.js'

export const LoginResponse = Credentials.or(ErrorResponse)

export type LoginResponse = z.output<typeof LoginResponse>
