import { Command, Option } from 'clipanion'
import * as t from 'typanion'
import { BandcampCommand } from './Command.js'
import { Bandcamp } from '../../Bandcamp.js'

export class BandcampLoginCommand extends BandcampCommand {
  static override paths: string[][] = [['login']]

  static override usage = Command.Usage({
    description:
      'Login to bandcamp. You will need to do once before using the rest of the API. Either provide a `--credentials_path` or the `--client_id` and `--client_secret` separately.',
  })

  readonly client_id = Option.String(
    '-i,--client_id',
    process.env.BANDCAMP_CLIENT_ID || '',
    {
      description:
        'Your client ID provided by bandcamp. Can also be set as an evironment variable "BANDCAMP_CLIENT_ID".',
      validator: t.isNumber(),
    },
  )

  readonly client_secret = Option.String(
    '-s,--client_secret',
    process.env.BANDCAMP_CLIENT_SECRET || '',
    {
      description:
        'Your client secret provided by bandcamp. Can also be set as an evironment variable "BANDCAMP_CLIENT_SECRET".',
    },
  )

  readonly credentials_path = Option.String('-c,--credentials-path', {
    description: 'Path to a JSON file containing your client ID and secrent.',
  })

  override async execute() {
    const spinner = this.startSpinner('Logging in')
    await Bandcamp.login(this)
    spinner.stop()
    this.context.stdout.write('Success\n')
  }
}
