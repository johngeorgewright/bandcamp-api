import axios, { AxiosError } from 'axios'
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

interface BaseLoginOptions {
  access_path?: string
  api_hostname?: string
}

interface LoginOptionsWithCredentials extends BaseLoginOptions, Credentials {}

interface LoginOptionsWithCredentialsPath extends BaseLoginOptions {
  credentials_path?: string
}

type LoginOptions =
  | LoginOptionsWithCredentials
  | LoginOptionsWithCredentialsPath

export class Bandcamp {
  static async login(loginOptions: LoginOptions) {
    let {
      access_path = `${process.env.HOME}/.bandcamp/access.json`,
      api_hostname = 'https://bandcamp.com',
      ...options
    } = loginOptions

    const params = new URLSearchParams()
    let access = await this.#loadAccess(access_path)

    let client_id: number
    let client_secret: string

    api_hostname = api_hostname.replace(/\/$/, '')

    if ('credentials_path' in options) {
      if (!options.credentials_path)
        throw new Error('"credentials_path" must be a path')
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
    access = AccessParser.parse(response.data)
    await this.#saveAccess(access_path, access)

    return new Bandcamp({
      access,
      apiHostname: api_hostname,
      loginOptions,
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
  #loginOptions: LoginOptions

  constructor({
    access,
    apiHostname,
    loginOptions,
  }: {
    access: Access
    apiHostname: string
    loginOptions: LoginOptions
  }) {
    this.#access = access
    this.#apiHostmane = apiHostname
    this.#loginOptions = loginOptions
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

  async #login() {
    const bandcamp = await Bandcamp.login(this.#loginOptions)
    this.#access = bandcamp.#access
  }

  async #api<Parser extends z.ZodType>(
    path: `/${string}`,
    parser: Parser,
    data: any = {},
    attemptLoginOnFail = true,
  ): Promise<Exclude<z.output<Parser>, ErrorResponse>> {
    let responseData: unknown

    try {
      ;({ data: responseData } = await axios.post(
        `${this.#apiHostmane}/api${path}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${this.#access.access_token}`,
          },
        },
      ))
    } catch (error) {
      if (
        error instanceof AxiosError &&
        error.response?.status === 401 &&
        attemptLoginOnFail
      ) {
        await this.#login()
        return this.#api(path, parser, data, false)
      }

      throw error
    }

    if (isErrorResponse(responseData))
      throw new Error(responseData.error_message)

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
