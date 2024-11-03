import { SaleReportParser } from '../../index.js'
import { Bandcamp } from '../../Bandcamp.js'
import { SalesReportRequestParser } from '../../parser/request/SalesReportRequest.js'
import { createJSONResponseCommand } from './JSONResponseCommand.js'
import YAML from 'yaml'

export const BandcampSalesReportCommand = createJSONResponseCommand(
  SalesReportRequestParser,
  SaleReportParser,
  [['sales', 'report']],
  'Your sales report delivered in either a CSV or JSON format',
  {},
  async (command) => {
    const spinner = command.startSpinner('Fetching sales report')
    const bandcamp = await Bandcamp.create(command)
    const report = await bandcamp.getSalesReport(command)
    spinner.stop()
    command.context.stdout.write(
      command.format === 'csv' ? report.csv : YAML.stringify(report),
    )
    command.context.stdout.write('\n')
  },
)
