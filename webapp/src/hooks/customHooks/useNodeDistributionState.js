import { useState, useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { useLocation } from 'react-router-dom'
import queryString from 'query-string'

import { ALL_NODES_QUERY } from '../../gql'
import { eosConfig } from '../../config'

const useNodeDistributionState = () => {
  const [loadProducers, { loading = true, data: { producers } = {} }] =
    useLazyQuery(ALL_NODES_QUERY)
  const location = useLocation()
  const [nodes, setNodes] = useState([])
  const [filters, setFilters] = useState({ name: 'all', owner: '' })
  const [allNodes, setAllNodes] = useState([])

  const chips = [{ name: 'all' }, ...eosConfig.nodeTypes]

  const handleOnFiltersChange = (newFilters) => {
    setFilters(newFilters)
  }

  useEffect(() => {
    loadProducers({
      variables: {
        where: {
          bp_json: { _is_null: false },
        },
      },
    })
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    const params = queryString.parse(location.search)

    if (!params.owner) return

    setFilters(prev => ({ ...prev, owner: params.owner }))
  }, [location.search])

  useEffect(() => {
    if (!producers) return

    const items = []
    producers.forEach((producer) => {
      if (!producer?.bp_json?.nodes?.length) return

      producer.bp_json.nodes.forEach((node) => {
        if (!node?.location?.latitude || !node?.location?.longitude) return

        items.push({
          node,
          producer,
          country: node?.location?.country || '',
          type: node.node_type,
          lat: parseFloat(node.location.latitude),
          lon: parseFloat(node.location.longitude),
          name: producer.owner,
        })
      })
    })

    const sortedItems = items
      .sort((a, b) =>
        a.country > b.country ? 1 : b.country > a.country ? -1 : 0,
      )
      .reduce(
        (prev, current) => {
          if (!prev.pibot) {
            return {
              ...prev,
              pibot: current,
              result: [...prev.result, current],
            }
          }

          if (
            prev.pibot.lat === current.lat &&
            prev.pibot.lon === current.lon
          ) {
            const newLat = current.lat + prev.increase

            return {
              ...prev,
              increase: prev.increase + 0.1,
              result: [...prev.result, { ...current, lat: newLat }],
            }
          }

          return {
            increase: 0.1,
            pibot: current,
            result: [...prev.result, current],
          }
        },
        { pibot: {}, result: [], increase: 0.1 },
      )

    setAllNodes(sortedItems.result || [])
  }, [producers])

  useEffect(() => {
    let items = allNodes

    if (filters.owner !== '') {
      items = items.filter((current) => current?.name?.includes(filters.owner))
    }

    if (filters.name !== 'all') {
      items = items.filter((current) => current?.node?.node_type?.includes(filters.name))
    }

    setNodes(items)
  }, [allNodes, filters])

  return [{ filters, chips, nodes, loading }, { handleOnFiltersChange }]
}

export default useNodeDistributionState
