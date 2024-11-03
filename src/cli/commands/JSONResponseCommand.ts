import { z } from 'zod'
import { BandcampCommand } from './Command.js'
import { BaseContext, Command, CommandClass, Option } from 'clipanion'
import { getParserType } from '../../lib/zodReflect.js'
import { zodClipanionValidator } from 'zod-clipanion-validator'

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
${parser.description ? `: ${parser.description}` : ''}
`,
  '',
)}
`,
    })

    constructor() {
      super()
      this.#addParserOptions(requestParser.shape)
      Object.assign(this, options)
    }

    #addParserOptions(shape: z.ZodRawShape) {
      for (const [key, parser] of Object.entries(shape)) {
        const descriptor = `--${key}`
        const reflection = getParserType(parser)

        const opts = {
          description: parser.description,
          required: !parser.isOptional(),
          validator: zodClipanionValidator(parser),
        }

        Object.defineProperty(this, key, {
          enumerable: true,
          value:
            reflection.type === 'boolean'
              ? Option.Boolean(descriptor, opts)
              : reflection.type === 'array'
                ? Option.Array(descriptor, opts)
                : Option.String(descriptor, opts),
          writable: true,
        })
      }
    }

    override execute(): Promise<void> {
      return execute(
        this as unknown as BandcampCommand & z.input<RequestParser> & Options,
      )
    }
  }
}
