import { Server } from '@hapi/hapi'

export const routes = (server: Server) => {
  server.route({
    method: 'GET',
    path: '/healthz',
    handler: () => {
      return 'OK'
    }
  })
}
