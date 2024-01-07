import { z } from 'zod'

export function getParserType(
  parser: z.ZodTypeAny,
): ReflectBasic | ReflectEnum | ReflectObject {
  return parser instanceof z.ZodOptional
    ? getParserType(parser.unwrap())
    : parser instanceof z.ZodObject
      ? { type: 'object', shape: parser.shape }
      : parser instanceof z.ZodString
        ? { type: 'string' }
        : parser instanceof z.ZodEnum
          ? { type: 'enum', options: parser.options }
          : parser instanceof z.ZodNumber
            ? { type: 'number' }
            : parser instanceof z.ZodBoolean
              ? { type: 'boolean' }
              : { type: 'unknown' }
}

interface ReflectEnum {
  type: 'enum'
  options: string[]
}

interface ReflectObject {
  type: 'object'
  shape: z.ZodRawShape
}

interface ReflectBasic {
  type: 'string' | 'number' | 'boolean' | 'unknown'
}
