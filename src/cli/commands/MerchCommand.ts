import { createJSONResponseCommand } from './JSONResponseCommand.js'
import { MerchRequestParser } from '../../parser/request/MerchRequest.js'
import { MerchParser } from '../../parser/Merch.js'
import { Bandcamp } from '../../Bandcamp.js'

export const BandcampMerchCommand = createJSONResponseCommand(
  MerchRequestParser,
  MerchParser,
  [['merch']],
  'Lists merchandise a label, band, or artist has available for purchase on Bandcamp',
  {},
  async (command) => {
    const spinner = command.startSpinner('Fetching merch')
    const bandcamp = await Bandcamp.create(command)
    const merch = await bandcamp.getMerch(command)
    spinner.stop()
    command.context.stdout.write(JSON.stringify(merch, null, 2) + '\n')
  },
)
