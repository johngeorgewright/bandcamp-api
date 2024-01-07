import { runExit } from 'clipanion'
import { BandcampLoginCommand } from './commands/LoginCommand.js'
import { BandcampBandsCommand } from './commands/BandsCommand.js'
import { BandcampOrdersCommand } from './commands/OrdersCommand.js'
import { BandcampShipCommand } from './commands/ShipCommand.js'
import { BandcampMerchCommand } from './commands/MerchCommand.js'
import { BandcampShippingOriginsCommand } from './commands/ShippingOriginsCommand.js'

runExit(
  {
    binaryLabel: 'Bandcamp CLI',
    binaryName: 'bandcamp',
    binaryVersion: (
      await import('../../package.json', { assert: { type: 'json' } })
    ).default.version,
  },
  [
    BandcampLoginCommand,
    BandcampBandsCommand,
    BandcampMerchCommand,
    BandcampOrdersCommand,
    BandcampShippingOriginsCommand,
    BandcampShipCommand,
  ],
)
