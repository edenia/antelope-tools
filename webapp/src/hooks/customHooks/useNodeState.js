import { useState, useEffect, useRef } from 'react'
import { useSubscription, useLazyQuery } from '@apollo/client'

import {
  NODES_SUBSCRIPTION,
  NODES_QUERY,
  PRODUCERS_COUNT_QUERY,
} from '../../gql'
import { eosConfig } from '../../config'
import sortNodes from 'utils/sort-nodes'

import useSearchState from './useSearchState'

const useNodeState = () => {
  const defaultVariables = {
    limit: 28,
    offset: 0,
    endpointFilter: undefined,
    where: {
      owner: { _like: '%%' },
      nodes: { type: { _neq: [] } },
    },
  }
  const [loadProducers, { data: { info } = {} }] = useLazyQuery(
    PRODUCERS_COUNT_QUERY,
  )
  const isQueryExecuted = useRef(false)
  const [items, setItems] = useState([])
  const [
    { filters, pagination, variables },
    { handleOnSearch, handleOnPageChange, setPagination },
  ] = useSearchState({
    loadProducers,
    info,
    defaultVariables,
  })
  const { data, loading } = useSubscription(NODES_SUBSCRIPTION, { variables })
  const [loadNodes, { data: queryData }] = useLazyQuery(NODES_QUERY)

  useEffect(() => {
    if (!variables || isQueryExecuted.current) return

    loadNodes({ variables })
    isQueryExecuted.current = true
  }, [variables, loadNodes])

  const chips = [{ name: 'all' }, ...eosConfig.nodeChips]

  const isFeature = (filter) => {
    return (
      filter !== 'all' &&
      eosConfig.nodeTypes.findIndex((nodeType) => nodeType.name === filter) < 0
    )
  }

  useEffect(() => {
    let nodesFilter = { type: { _neq: [] } }

    if (filters.name !== 'all') {
      const filter = isFeature(filters.name) ? 'query' : filters.name

      nodesFilter = {
        _and: [nodesFilter, { type: { _contains: filter } }],
      }
    }

    setPagination((prev) => ({
      ...prev,
      limit: 28,
      ...(isFeature(filters.name) && { limit: null, pages: 1 }),
      where: {
        ...prev.where,
        nodes: nodesFilter,
      },
    }))
  }, [filters.name, setPagination])

  useEffect(() => {
    if (!data && !queryData) return

    const { producers } = data || queryData
    const isFilterByFeature = isFeature(filters.name)

    const list = producers.flatMap((producer) => {
      if (!producer?.nodes?.length) return []

      if (
        isFilterByFeature &&
        !producer.nodes.some((node) =>
          node.node_info[0]?.features?.list?.includes(filters.name),
        )
      )
        return []

      const nodes = sortNodes(producer.nodes, producer.producer_key)

      return nodes.length
        ? {
            ...producer,
            bp_json: { ...producer.bp_json, nodes },
          }
        : []
    })

    setItems(list)
  }, [filters.name, data, queryData])

  return [
    { filters, chips, loading, items, pagination },
    { handleOnSearch, handleOnPageChange },
  ]
}

export default useNodeState
