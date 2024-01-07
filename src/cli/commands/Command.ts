import { Command, Option } from 'clipanion'
import ora, { Ora } from 'ora'
import * as t from 'typanion'
import { formatError } from '../formatError.js'

const dev = process.env.NODE_ENV === 'development'

export abstract class BandcampCommand extends Command {
  #spinner?: Ora

  readonly api_hostname = Option.String(
    '-a,--api_hostname',
    'https://bandcamp.com',
    { description: 'API Hostname' },
  )

  readonly access_path = Option.String(
    '-p,--access_path',
    `${process.env.HOME}/.bandcamp/access.json`,
    { description: 'Path where to save access information.' },
  )

  override async catch(error: unknown) {
    this.#spinner?.stop()
    if (dev) {
      console.error(error)
      return
    }
    this.context.stderr.write(formatError(error) + '\n')
  }

  startSpinner(label: string) {
    const spinner = (this.#spinner = ora(label).start())
    return spinner
  }

  static BandIdOption(): number
  static BandIdOption(required: true): number
  static BandIdOption(required: false): number | undefined
  static BandIdOption(required = true) {
    return Option.String('-b,--band_id', {
      description:
        'Bandcamp ID of your label or the (usually) label on whose behalf you are querying.',
      required,
      validator: t.isNumber(),
    })
  }

  static MemberBandIdOption() {
    return Option.String('-m,--member_band_id', {
      description:
        'Bandcamp ID of the band on which you wish to filter results.',
      validator: t.isNumber(),
    })
  }
}
