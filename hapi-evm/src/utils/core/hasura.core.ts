import { GraphQLClient } from 'graphql-request'

import { hasuraConfig } from '../../config'

import { sleep } from '../time.util'

import axiosUtil from './axios.core'

export const hasuraAssembled = async () => {
  let hasuraReady = false

  while (!hasuraReady) {
    try {
      await axiosUtil.get(hasuraConfig.url.replace('/v1/graphql', '/healthz'))
      hasuraReady = true
    } catch (error) {
      hasuraReady = false
      console.log(
        'waiting for hasura...',
        hasuraConfig.url.replace('/v1/graphql', '/healthz')
      )
      await sleep(5)
    }
  }
}

const instance = new GraphQLClient(hasuraConfig.url, {
  headers: {
    'x-hasura-admin-secret': hasuraConfig.adminSecret
  }
})

export default instance
