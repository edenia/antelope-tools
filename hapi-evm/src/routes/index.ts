import { Server } from '@hapi/hapi'

import * as serverRoute from './server.route'
import * as transactionsRoute from './transactions.route'
import * as tokenHistoryRoute from './token-history.route'

const routes = (server: Server) => {
  serverRoute.routes(server)
  transactionsRoute.routes(server)
  tokenHistoryRoute.routes(server)
}

export default routes
