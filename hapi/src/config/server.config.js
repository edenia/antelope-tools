module.exports = {
  port: process.env.HAPI_SERVER_PORT || 9090,
  host: process.env.HAPI_SERVER_ADDRESS || '0.0.0.0'
}
