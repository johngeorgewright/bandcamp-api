import { createJSONResponseCommand } from './JSONResponseCommand.js'
import { ShippingOriginDetailsRequestParser } from '../../parser/request/ShippingOriginDetailsRequest.js'
import { Bandcamp } from '../../Bandcamp.js'
import { ShippingOriginParser } from '../../parser/ShippingOrigin.js'
import Table from 'cli-table3'

export const BandcampShippingOriginsCommand = createJSONResponseCommand(
  ShippingOriginDetailsRequestParser,
  ShippingOriginParser,
  [['merch', 'shipping']],
  'Lists the shipping origins for artists and labels linked to your account on Bandcamp.',
  {},
  async (command) => {
    const spinner = command.startSpinner('Fetching shipping origins')
    const bandcamp = await Bandcamp.create(command)
    const data = await bandcamp.getShippingOriginDetails(command)
    const table = new Table({ head: Object.keys(ShippingOriginParser.shape) })
    for (const item of data) table.push(Object.values(item))
    spinner.stop()
    command.context.stdout.write(table.toString() + '\n')
  },
)
