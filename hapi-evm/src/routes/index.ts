import { Server } from '@hapi/hapi'

import * as serverRoute from './server.route'

const routes = (server: Server) => {
  serverRoute.routes(server)
}

export default routes
