import { z } from 'zod'
import { SaleReportParser } from '../SaleReport.js'

export const SalesReportResponseParser = z.record(SaleReportParser).or(
  z.object({
    csv: z.string(),
  }),
)

export type SalesReportResponse = z.output<typeof SalesReportResponseParser>
