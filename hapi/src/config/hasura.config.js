module.exports = {
  url: process.env.HASURA_URL || 'http://localhost:8080/v1/graphql',
  adminSecret: process.env.HASURA_ADMIN_SECRET || 'secret'
}
