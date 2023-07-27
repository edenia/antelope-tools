import { useState, useEffect } from 'react'
import { useSubscription } from '@apollo/client'

import { PRODUCERS_QUERY, NODES_SUBSCRIPTION } from '../../gql'
import { eosConfig } from '../../config'

import useSearchState from './useSearchState'

const useNodeState = () => {
  const [
    { filters, pagination, variables },
    { handleOnSearch, handleOnPageChange, setPagination },
  ] = useSearchState({
    query: PRODUCERS_QUERY,
  })
  const { data, loading } = useSubscription(NODES_SUBSCRIPTION, { variables })
  const [items, setItems] = useState([])

  const chips = [
    { name: 'all' },
    ...eosConfig.nodeTypes,
    {
      name: 'hyperion-v2',
    },
    {
      name: 'history-v1',
    },
  ]

  const getOrderNode = (node) => {
    return (
      (node.type?.includes('full') ? 0.5 : 0) +
      (node.endpoints?.length || 0) +
      Boolean(node?.node_info[0]?.version?.length) +
      (node.node_info[0]?.features?.list?.length || 0)
    )
  }

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
    if (!data) return

    const { producers } = data
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

      producer.nodes.sort((a, b) => {
        return getOrderNode(a) - getOrderNode(b)
      })

      let nodes = []
      let producerNode

      for (const node in producer.nodes) {
        const current = producer.nodes[node]

        if (current?.type[0] === 'producer') {
          if (!producerNode) {
            const features = { keys: { producer_key: producer.producer_key } }

            producerNode = {
              ...current,
              locations: [],
              node_info: [{ features }],
            }
          }

          producerNode.locations.push(current.location)
        } else {
          nodes = JSON.parse(JSON.stringify(producer.nodes.slice(node)))
          nodes.reverse()

          if (producerNode) nodes.push(producerNode)

          break
        }
      }

      return nodes.length
        ? {
            ...producer,
            bp_json: { ...producer.bp_json, nodes },
          }
        : []
    })

    setItems(list)
  }, [filters.name, data])

  return [
    { filters, chips, loading, items, pagination },
    { handleOnSearch, handleOnPageChange },
  ]
}

export default useNodeState
