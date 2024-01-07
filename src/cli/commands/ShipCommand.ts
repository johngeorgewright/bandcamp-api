import { Option } from 'clipanion'
import { setTimeout } from 'node:timers/promises'
import _ from 'lodash'
import * as t from 'typanion'
import z from 'zod'
import { createJSONResponseCommand } from './JSONResponseCommand.js'
import { UpdateShippedRequestParser } from '../../parser/request/UpdateShippedRequest.js'
import { loadJSON } from '../../fs.js'
import { Bandcamp } from '../../Bandcamp.js'

export const BandcampShipCommand = createJSONResponseCommand(
  UpdateShippedRequestParser.shape.items.element.omit({ id: true }),
  z.object({}),
  [['merch', 'ship']],
  'Updates shipped/unshipped status of merchandise orders',
  {
    commit: Option.Boolean('--commit', {
      description: 'Send information to bandcamp. Dry run without.',
    }),

    ids: Option.Array('--ids', [], {
      description: 'Unique Bandcamp ID of the payment or sale item to update',
      validator: t.isArray(t.isNumber()),
    }),

    ids_file: Option.String<string>('--ids_file', {
      description: 'Use the IDs from this file.',
    }),
  },
  async (command) => {
    let ids: number[] = command.ids

    if (command.ids_file) {
      ids = z
        .number()
        .array()
        .parse(await loadJSON(command.ids_file))
    }

    const options = _.pick(command, [
      'id_type',
      'ship_date',
      'shipped',
      'carrier',
    ])

    if (!command.commit) {
      command.context.stdout.write('Dry run\n')
      command.context.stdout.write('Setting ')
      command.context.stdout.write(JSON.stringify(options, null, 2) + '\n')
      command.context.stdout.write(`TO ${ids.length} ids\n`)
      command.context.stdout.write(JSON.stringify(ids, null, 2) + '\n')
      return
    }

    const spinner = command.startSpinner(
      `Shipping ${ids.length} IDs to bandcamp`,
    )

    await setTimeout(5_000)

    const bandcamp = await Bandcamp.create(command)

    await bandcamp.updateShipped({
      items: ids.map((id) => ({
        ...options,
        id,
      })),
    })

    spinner.stop()
    command.context.stdout.write('Success\n')
  },
)
