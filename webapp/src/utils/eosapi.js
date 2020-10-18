import EosApi from 'eosjs-api'

import { eosConfig } from '../config'

const eosApi = EosApi({
  httpEndpoint: eosConfig.endpoint,
  verbose: false,
  fetchConfiguration: {}
})

export default eosApi
