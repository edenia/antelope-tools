import Hapi from '@hapi/hapi'
import { Server } from '@hapi/hapi'

import routes from './routes'
import { serverConfig } from './config'

const init = async () => {
  const server: Server = Hapi.server({
    port: serverConfig.port,
    host: serverConfig.host,
    routes: {
      cors: { origin: ['*'] }
    },
    debug: { request: ['handler'] }
  })

  routes(server)

  await server.start()

  console.log(`🚀 Server ready at ${server.info.uri}`)
  server.table().forEach(route => console.log(`${route.method}\t${route.path}`))
}

process.on('uncaughtException', (err, origin) => {
  console.log('Uncaught Exception:', err, 'Exception origin:', origin)
})

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection:', promise, 'reason:', reason)
})

init()
