import { split } from 'apollo-link'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'

import { graphqlConfig } from './config'

const httpLink = createHttpLink({
  uri: graphqlConfig.url
})

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token')

  if (!token) {
    return {
      headers
    }
  }

  return {
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`
    }
  }
})

const wsLink = new WebSocketLink({
  uri: graphqlConfig.url.replace(/^http?/, 'ws').replace(/^https?/, 'wss'),
  options: {
    lazy: true,
    reconnect: true,
    connectionParams: async () => {
      const token = localStorage.getItem('token')

      if (!token) {
        return {
          headers: {}
        }
      }

      return {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    }
  }
})

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query)

    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  authLink.concat(httpLink)
)

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
})
