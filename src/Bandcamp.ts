import axios from 'axios'
import { ZodError, z } from 'zod'
import { loadJSON, saveJSON } from './fs.js'
import { Access, AccessParser } from './parser/response/Access.js'
import { Credentials, CredentialsParser } from './parser/request/Credentials.js'
import { BandsResponseParser } from './parser/response/BandsResponse.js'
import {
  ErrorResponse,
  isErrorResponse,
} from './parser/response/ErrorResponse.js'
import { OrdersResponseParser } from './parser/response/MerchOrdersResponse.js'
import { MerchOrdersRequest } from './parser/request/MerchOrdersRequest.js'
import { MerchResponseParser } from './parser/response/MerchResponse.js'
import { MerchRequest } from './parser/request/MerchRequest.js'
import { ShippingOriginDetailsRequest } from './parser/request/ShippingOriginDetailsRequest.js'
import { ShippingOriginDetailsResponseParser } from './parser/response/ShippingOriginDetailsResponse.js'
import { UpdateShippedRequest } from './parser/request/UpdateShippedRequest.js'
import { UpdateShippedResponseParser } from './parser/response/UpdateShippedResponse.js'
import { MarkDateRangeAsShippedRequest } from './parser/request/MarkDateRangeAsShippedRequest.js'
import { MarkDateRangeAsShippedResponseParser } from './parser/response/MarkDateRangeAsShippedResponse.js'
import { UpdateQuantitiesRequest } from './parser/request/UpdateQuantitiesRequest.js'
import { UpdateQuantitiesResponseParser } from './parser/response/UpdateQuantitiesResponse.js'
import { UpdateSKURequest } from './parser/request/UpdateSKURequest.js'
import { UpdateSKUResponseParser } from './parser/response/UpdateSKUResponse.js'
import { SalesReportRequest } from './parser/request/SalesReportRequest.js'
import { SalesReportResponseParser } from './parser/response/SalesReportResponse.js'

interface BaseOptions {
  access_path?: string
  api_hostname?: string
}

export interface LoginOptionsWithCredentials extends BaseOptions, Credentials {}

export interface LoginOptionsWithCredentialsPath extends BaseOptions {
  credentials_path?: string
}

export type LoginOptions =
  | LoginOptionsWithCredentials
  | LoginOptionsWithCredentialsPath

export const defaultAccessPath = `${process.env.HOME}/.bandcamp/access.json`
export const defaultAPIHostname = 'https://bandcamp.com'

export class Bandcamp {
  static async login({
    access_path = `${process.env.HOME}/.bandcamp/access.json`,
    api_hostname = 'https://bandcamp.com',
    ...options
  }: LoginOptions) {
    const params = new URLSearchParams()
    let access = await this.#loadAccess(access_path)

    let client_id: number
    let client_secret: string

    api_hostname = api_hostname.replace(/\/$/, '')

    if ('credentials_path' in options && options.credentials_path) {
      ;({ client_id, client_secret } = await this.#loadCredentials(
        options.credentials_path,
      ))
    } else {
      ;({ client_id, client_secret } = options as Credentials)
    }

    params.set('client_id', client_id.toString())
    params.set('client_secret', client_secret)
    params.set(
      'grant_type',
      access?.refresh_token ? 'refresh_token' : 'client_credentials',
    )

    if (access?.refresh_token) params.set('refresh_token', access.refresh_token)

    const response = await axios.post(`${api_hostname}/oauth_token`, params)
    access = this.#parseResponseData(
      `${api_hostname}/oauth_token`,
      AccessParser,
      response.data,
    )
    await this.#saveAccess(access_path, access)

    return new Bandcamp({
      access,
      apiHostname: api_hostname,
    })
  }

  static async create({
    access_path = defaultAccessPath,
    api_hostname = defaultAPIHostname,
  }: BaseOptions) {
    return new Bandcamp({
      access: AccessParser.parse(await this.#loadAccess(access_path)),
      apiHostname: api_hostname,
    })
  }

  static async #loadAccess(accessPath: string) {
    try {
      return AccessParser.parse(await loadJSON(accessPath))
    } catch (error) {
      return
    }
  }

  static async #loadCredentials(credentialsPath: string) {
    return CredentialsParser.parse(await loadJSON(credentialsPath))
  }

  static async #saveAccess(accessPath: string, access: Access) {
    await saveJSON(accessPath, access)
  }

  #access: Access
  #apiHostmane: string

  constructor({
    access,
    apiHostname,
  }: {
    access: Access
    apiHostname: string
  }) {
    this.#access = access
    this.#apiHostmane = apiHostname
  }

  async getMerch(query: MerchRequest) {
    return (
      await this.#api(
        '/merchorders/1/get_merch_details',
        MerchResponseParser,
        query,
      )
    ).items
  }

  async getMyBands() {
    return (await this.#api('/account/1/my_bands', BandsResponseParser)).bands
  }

  async getMerchOrders(query: MerchOrdersRequest) {
    return (
      await this.#api('/merchorders/3/get_orders', OrdersResponseParser, query)
    ).items
  }

  async getShippingOriginDetails(query: ShippingOriginDetailsRequest) {
    return (
      await this.#api(
        '/merchorders/1/get_shipping_origin_details',
        ShippingOriginDetailsResponseParser,
        query,
      )
    ).shipping_origins
  }

  getSalesReport(query: SalesReportRequest) {
    return this.#api('/sales/2/sales_report', SalesReportResponseParser, query)
  }

  updateShipped(query: UpdateShippedRequest) {
    return this.#api(
      '/merchorders/2/update_shipped',
      UpdateShippedResponseParser,
      query,
    )
  }

  async markDateRangeAShipped(query: MarkDateRangeAsShippedRequest) {
    return (
      await this.#api(
        '/merchorders/1/mark_date_range_as_shipped',
        MarkDateRangeAsShippedResponseParser,
        query,
      )
    ).items
  }

  updateQuantities(query: UpdateQuantitiesRequest) {
    return this.#api(
      '/merchorders/1/update_quantities',
      UpdateQuantitiesResponseParser,
      query,
    )
  }

  updateSKU(query: UpdateSKURequest) {
    return this.#api(
      '/api/merchorders/1/update_sku',
      UpdateSKUResponseParser,
      query,
    )
  }

  async #api<Parser extends z.ZodType>(
    path: `/${string}`,
    parser: Parser,
    data: any = {},
  ): Promise<Exclude<z.output<Parser>, ErrorResponse>> {
    const { data: responseData } = await axios.post(
      `${this.#apiHostmane}/api${path}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${this.#access.access_token}`,
        },
      },
    )

    if (isErrorResponse(responseData))
      throw new Error(responseData.error_message)

    return Bandcamp.#parseResponseData(path, parser, responseData)
  }

  static #parseResponseData<Parser extends z.ZodType>(
    path: string,
    parser: Parser,
    responseData: unknown,
  ): z.output<Parser> {
    try {
      return parser.parse(responseData)
    } catch (error) {
      if (error instanceof ZodError)
        throw new ParsingResponseError(path, responseData, error)
      else throw error
    }
  }
}

export class ParsingResponseError extends Error {
  constructor(
    path: string,
    public readonly responseData: unknown,
    public readonly parsingError: ZodError,
  ) {
    super(`There was an error paring the response from ${path}.`)
  }
}
