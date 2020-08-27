module.exports = {
  url: process.env.HAPI_HASURA_URL || 'http://localhost:8080/v1/graphql',
  adminSecret: process.env.HAPI_HASURA_ADMIN_SECRET || 'secret'
}
