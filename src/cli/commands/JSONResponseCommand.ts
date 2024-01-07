import { z } from 'zod'
import { BandcampCommand } from './Command.js'
import { BaseContext, Command, CommandClass, Option } from 'clipanion'
import * as t from 'typanion'
import { getParserType } from '../../lib/zodReflect.js'
import { StringOptionNoBoolean } from 'clipanion/lib/advanced/options/String.js'

export function createJSONResponseCommand<
  RequestParser extends z.ZodObject<z.ZodRawShape>,
  Parser extends z.ZodObject<z.ZodRawShape>,
  Options extends Record<string, unknown>,
>(
  requestParser: RequestParser,
  parser: Parser,
  paths: string[][],
  description: string,
  options: Options,
  execute: (
    command: BandcampCommand & z.input<RequestParser> & Options,
  ) => Promise<void>,
): CommandClass<BaseContext> {
  return class extends BandcampCommand {
    static override paths: string[][] = paths

    static override usage = Command.Usage({
      description: description,
      details: /* md */ `
## Response Values
${Object.entries(parser.shape).reduce(
  (out, [key, parser]) =>
    out +
    `

${key}
: ${parser.description}
`,
  '',
)}
`,
    })

    constructor() {
      super()
      this.#addParserOptions(requestParser.shape)

      for (const [key, value] of Object.entries(options)) {
        ;(this as any)[key] = value
      }
    }

    #addParserOptions(shape: z.ZodRawShape) {
      for (const [key, parser] of Object.entries(shape)) {
        const descriptor = `--${key}`
        const reflection = getParserType(parser)
        const opts: StringOptionNoBoolean<string> = {
          description: parser.description,
          required: !parser.isOptional(),
        }

        ;(this as any)[key] =
          reflection.type === 'object'
            ? this.#addParserOptions(reflection.shape)
            : reflection.type === 'string'
              ? Option.String(descriptor, opts)
              : reflection.type === 'enum'
                ? Option.String(descriptor, {
                    ...opts,
                    validator: t.isEnum(reflection.options),
                  })
                : reflection.type === 'boolean'
                  ? Option.Boolean(descriptor, opts)
                  : reflection.type === 'number'
                    ? Option.String(descriptor, {
                        ...opts,
                        validator: t.isNumber(),
                      })
                    : undefined
      }
    }

    override execute(): Promise<void> {
      return execute(
        this as unknown as BandcampCommand & z.input<RequestParser> & Options,
      )
    }
  }
}
