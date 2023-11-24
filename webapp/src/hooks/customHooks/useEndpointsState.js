import { useState, useEffect, useCallback, useRef } from 'react'
import { useSubscription, useLazyQuery } from '@apollo/client'

import {
  ENDPOINTS_SUBSCRIPTION,
  ENDPOINTS_QUERY,
  PRODUCERS_COUNT_QUERY,
} from '../../gql'

import useSearchState from './useSearchState'

const useEndpointsState = () => {
  const defaultVariables = {
    limit: 20,
    offset: 0,
    endpointFilter: undefined,
    where: {
      owner: { _like: '%%' },
      nodes: { endpoints: { value: { _gt: '' } } },
    },
  }

  const [items, setItems] = useState()
  const [textLists, setTextLists] = useState()

  const handleSubscriptionData = data => {
    if (!data) return

    const { newItems, workingEndpoints } = data.producers.reduce(
      (state, producer) => {
        const endpoints = { api: [], ssl: [], p2p: [] }
        const inserted = []

        const bpName =
          producer.bp_json?.org?.candidate_name ||
          producer?.bp_json?.org?.organization_name ||
          producer?.owner

        producer.endpoints.forEach(({ type, ...endpoint }) => {
          if (!inserted.includes(endpoint.value)) {
            inserted.push(endpoint.value)
            endpoints[type].push(endpoint)

            if (endpoint?.response?.isWorking) {
              state.workingEndpoints[type].push({
                value: endpoint.value,
                name: bpName,
              })
            }
          }
        })

        state.newItems.push({
          id: producer.id,
          name: bpName,
          endpoints,
        })

        return state
      },
      { newItems: [], workingEndpoints: { api: [], ssl: [], p2p: [] } },
    )

    setItems(newItems)

    setTextLists(
      Object.keys(workingEndpoints).reduce((state, type) => {
        let previous = ''
        let endpointsList = ''

        workingEndpoints[type].forEach(({ value, name }, index) => {
          endpointsList += !index
            ? `# List of available ${type.toUpperCase()} endpoints \n`
            : ''

          endpointsList += previous !== name ? `# ${name} \n` : ''
          endpointsList += `${
            type === 'p2p' ? 'p2p-peer-address = ' : ''
          } ${value} \n`
          endpointsList += '\n'

          previous = name
        })

        return { ...state, [type]: endpointsList }
      }, {}),
    )
  }

  const isQueryExecuted = useRef(false)
  const [loadProducers, { data: { info } = {} }] = useLazyQuery(PRODUCERS_COUNT_QUERY)
  const [
    { filters, pagination, variables },
    { handleOnSearch, handleOnPageChange, setPagination },
  ] = useSearchState({
    loadProducers,
    info,
    defaultVariables,
  })
  const { loading } = useSubscription(ENDPOINTS_SUBSCRIPTION, {
    variables,
    onSubscriptionData: ({ subscriptionData }) => {
      handleSubscriptionData(subscriptionData.data)
    },
  })

  const [loadEndpoints] = useLazyQuery(ENDPOINTS_QUERY, {
    onCompleted: (data) => {
      handleSubscriptionData(data)
    },
  })

  useEffect(() => {
    if (!variables || isQueryExecuted.current) return

    loadEndpoints({ variables })
    isQueryExecuted.current = true
  }, [variables, loadEndpoints])

  const handleFilter = useCallback(value => {
      const filter = value
        ? { response: { _contains: { isWorking: true } } }
        : { value: { _gt: '' } }

      setPagination(prev => ({
        ...prev,
        page: 1,
        where: { ...prev.where, nodes: { endpoints: filter } },
        endpointFilter: value ? filter : undefined,
      }))
    }, [setPagination])

  return [
    {
      loading: loading && !items?.length,
      pagination,
      producers: items,
      textLists,
      filters,
    },
    { handleFilter, handleOnPageChange, handleOnSearch, setPagination },
  ]
}

export default useEndpointsState
