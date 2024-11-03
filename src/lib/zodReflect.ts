import { z } from 'zod'

export function getParserType(parser: z.ZodTypeAny): Reflect {
  return parser instanceof z.ZodOptional
    ? getParserType(parser.unwrap())
    : parser instanceof z.ZodArray
      ? { type: 'array', item: getParserType(parser.element) }
      : parser instanceof z.ZodObject
        ? { type: 'object', shape: parser.shape }
        : parser instanceof z.ZodString
          ? { type: 'string' }
          : parser instanceof z.ZodNativeEnum
            ? { type: 'enum', options: Object.values(parser.enum) }
            : parser instanceof z.ZodEnum
              ? { type: 'enum', options: parser.options }
              : parser instanceof z.ZodNumber
                ? { type: 'number' }
                : parser instanceof z.ZodBoolean
                  ? { type: 'boolean' }
                  : { type: 'unknown' }
}

type Reflect = ReflectBasic | ReflectEnum | ReflectObject | ReflectArray

interface ReflectEnum {
  type: 'enum'
  options: string[]
}

interface ReflectObject {
  type: 'object'
  shape: z.ZodRawShape
}

interface ReflectArray {
  type: 'array'
  item: Reflect
}

interface ReflectBasic {
  type: 'string' | 'number' | 'boolean' | 'unknown'
}
