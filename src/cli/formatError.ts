import { AxiosError } from 'axios'

export function formatError(error: unknown) {
  return error instanceof AxiosError
    ? error.response?.status === 401
      ? 'Unauthorised. Please login first.'
      : `Unexpected response code "${error.response?.status}" from the bandcamp API.\n${error.message}`
    : error
}
