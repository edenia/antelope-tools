import { Server } from '@hapi/hapi'

// import * as exampleRoutes from './example.route'

const baseRoute = '/v1'

// tables
// evm-params
// - max blocks
// - last block synced
// - sync blocks interval
// - update stats interval (in case of a table that stores the metricts of the last certain blocks)

// evm-blocks
// - block number
// - block hash

// evm-transactions
// - block number
// - transaction hash

// evm-global
// - last block number
// - ATH

// Average gas usage: Show to average gas usage in the last 100 blocks.
// Average transactions per second (block and eosio.token -> ERC20).
// Daily transactions.
// ATH.

export default (server: Server) => {
  // exampleRoutes.routes(server, baseRoute)
}
