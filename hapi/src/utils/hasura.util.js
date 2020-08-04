const { GraphQLClient } = require('graphql-request')
const { hasuraConfig } = require('../config')

module.exports = new GraphQLClient(hasuraConfig.url, {
  headers: {
    'x-hasura-admin-secret': hasuraConfig.adminSecret
  }
})
