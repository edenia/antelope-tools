const Hapi = require('@hapi/hapi')
const Boom = require('@hapi/boom')
const Path = require('path')

const { serverConfig, i18nConfig } = require('./config')
const routes = require('./routes')
const { producerWorker } = require('./workers')

const init = async () => {
  const server = Hapi.server({
    port: serverConfig.port,
    host: serverConfig.host,
    routes: {
      cors: { origin: ['*'] },
      validate: {
        failAction: async (request, h, err) => {
          if (process.env.NODE_ENV === 'production') {
            throw Boom.badRequest('Invalid request payload input')
          } else {
            throw err
          }
        }
      },
      files: {
        relativeTo: Path.join(__dirname, 'files')
      }
    }
  })

  server.bind({
    i18n: i18nConfig
  })

  server.route(routes)

  await server.register([
    {
      plugin: require('hapi-pino'),
      options: {
        prettyPrint: true,
        logEvents: ['request-error']
      }
    }
  ])

  await server.start()

  console.log(`🚀 Server ready at ${server.info.uri}`)
  server.table().forEach(route => console.log(`${route.method}\t${route.path}`))
  producerWorker.start()
}

process.on('unhandledRejection', err => {
  console.log(err)
  process.exit(1)
})

init()
