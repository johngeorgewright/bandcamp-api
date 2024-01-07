import _ from 'lodash'
import { Bandcamp, MerchOrderParser } from '../../index.js'
import { createJSONResponseCommand } from './JSONResponseCommand.js'
import { MerchOrdersRequestParser } from '../../parser/request/MerchOrdersRequest.js'
import YAML from 'yaml'

export const BandcampOrdersCommand = createJSONResponseCommand(
  MerchOrdersRequestParser,
  MerchOrderParser,
  [['merch', 'orders']],
  'Lists merchandise orders placed with a band or label.',
  {},
  async (command) => {
    const spinner = command.startSpinner('Fetching orders')
    const bandcamp = await Bandcamp.create(command)
    const orders = await bandcamp.getMerchOrders(command)
    spinner.stop()
    command.context.stdout.write(YAML.stringify(orders) + '\n')
  },
)
