import { createJSONResponseCommand } from './JSONResponseCommand.js'
import { ShippingOriginDetailsRequestParser } from '../../parser/request/ShippingOriginDetailsRequest.js'
import { Bandcamp } from '../../Bandcamp.js'
import { ShippingOriginParser } from '../../parser/ShippingOrigin.js'

export const BandcampShippingOriginsCommand = createJSONResponseCommand(
  ShippingOriginDetailsRequestParser,
  ShippingOriginParser,
  [['shipping']],
  'Lists the shipping origins for artists and labels linked to your account on Bandcamp.',
  {},
  async (command) => {
    const spinner = command.startSpinner('Fetching shipping origins')
    const bandcamp = await Bandcamp.create(command)
    const data = await bandcamp.getShippingOriginDetails(command)
    spinner.stop()
    command.context.stdout.write(JSON.stringify(data, null, 2) + '\n')
  },
)
