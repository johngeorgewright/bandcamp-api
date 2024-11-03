import { Command } from 'clipanion'
import Table from 'cli-table3'
import { Bandcamp } from '../../Bandcamp.js'
import { BandcampCommand } from './Command.js'
import { Band } from '../../parser/Band.js'

export class BandcampBandsCommand extends BandcampCommand {
  static override paths: string[][] = [['bands']]

  static override usage = Command.Usage({
    description:
      'List of the bands you have access to (either through artist accounts, label accounts, or partnerships).',
  })

  override async execute() {
    const spinner = this.startSpinner('Getting bands')
    const bandcamp = await Bandcamp.create(this)
    const myBands = await bandcamp.getMyBands()

    spinner.stop()

    if (!myBands.length) {
      this.context.stdout.write('You have no bands.\n')
    } else {
      const table = BandTable.create(myBands)
      this.context.stdout.write(table.toString() + '\n')
    }
  }
}

class BandTable {
  protected table = new Table({
    head: ['id', 'name', 'subdomain'],
  })

  add(band: Band) {
    this.table.push([band.band_id, band.name, band.subdomain])
  }

  toString() {
    return this.table.toString()
  }

  static create(bands: Band[]) {
    const table = bands.some((band) => !!band.member_bands)
      ? new MemberBandTable()
      : new BandTable()

    for (const band of bands) table.add(band)

    return table
  }
}

class MemberBandTable extends BandTable {
  constructor() {
    super()
    this.table.options.head.unshift('')
  }

  override add(band: Band) {
    const memberBands = band.member_bands || []

    this.table.push(['│ ', band.band_id, band.name, band.subdomain])

    for (let i = 0; i < memberBands.length; i++) {
      const memberBand = memberBands[i]
      this.table.push([
        i === memberBands.length - 1 ? '└─' : '├─',
        memberBand.band_id,
        memberBand.name,
        memberBand.subdomain,
      ])
    }
  }
}
