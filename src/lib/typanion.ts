import * as t from 'typanion'
import { z } from 'zod'
import { getParserType } from './zodReflect.js'

type Validator<T extends z.ZodType> = t.StrictTest<unknown, z.infer<T>> &
  t.Trait<z.infer<T>>

export function fromZod<T extends z.ZodType>(parser: T): Validator<T> {
  const validator: Validator<T> = (
    value: unknown,
    test?: t.ValidationState,
  ): value is z.infer<T> => {
    const result = parser.safeParse(value)
    if (!result.success)
      test?.errors?.push(...result.error.errors.map((error) => error.message))
    return result.success
  }

  validator.__trait = getParserType(parser).type

  return validator
}
