import axios from 'axios'
import { z } from 'zod'
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
      // accessPath: access_path,
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
  // #accessPath: string
  #apiHostmane: string

  constructor({
    access,
    // accessPath,
    apiHostname,
  }: {
    access: Access
    // accessPath: string
    apiHostname: string
  }) {
    this.#access = access
    // this.#accessPath = accessPath
    this.#apiHostmane = apiHostname
  }

  // async getMerch(query: {
  //   band_id: number
  //   member_band_id?: number
  //   start_time: string
  //   end_time?: string
  //   package_ids?: number[]
  // }) {
  //   return (await this.#api('/merchorders/1/get_merch_details', Merch query)).items
  // }

  async getMyBands() {
    return (await this.#api('/account/1/my_bands', BandsResponseParser)).bands
  }

  async getMerchOrders(query: MerchOrdersRequest) {
    return (
      await this.#api('/merchorders/3/get_orders', OrdersResponseParser, query)
    ).items
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
      throw new Error(responseData.error_description)
    return parser.parse(responseData)
  }
}
