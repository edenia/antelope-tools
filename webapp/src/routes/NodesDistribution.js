/* eslint camelcase: 0 */
import React, { useEffect, useState, lazy } from 'react'
import { useLazyQuery } from '@apollo/client'
import LinearProgress from '@material-ui/core/LinearProgress'
import Box from '@material-ui/core/Box'

import { ALL_NODES_QUERY } from '../gql'

const NodeSearch = lazy(() => import('../components/NodeSearch'))
const GeoMap = lazy(() => import('../components/GeoMap'))

const Nodes = () => {
  const [loadProducers, { loading = true, data: { producers } = {} }] =
    useLazyQuery(ALL_NODES_QUERY)
  const [nodes, setNodes] = useState([])
  const [filters, setFilters] = useState({ nodeType: 'all' })
  const [allNodes, setAllNodes] = useState([])

  const handleOnFiltersChange = (newFilters) => {
    setFilters(newFilters)
  }

  useEffect(() => {
    loadProducers({
      variables: {
        where: {}
      }
    })
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (!producers?.length) {
      return
    }

    const items = []
    producers.forEach((producer) => {
      if (!producer?.bp_json?.nodes) {
        return
      }

      producer.bp_json.nodes.forEach((node) => {
        if (!node?.location?.latitude || !node?.location?.longitude) return

        items.push({
          node,
          producer,
          country: node?.location?.country || '',
          type: node.node_type,
          lat: parseFloat(node.location.latitude),
          lon: parseFloat(node.location.longitude),
          name: producer.owner
        })
      })
    })

    const sortedItems = items
      .sort((a, b) =>
        a.country > b.country ? 1 : b.country > a.country ? -1 : 0
      )
      .reduce(
        (prev, current) => {
          if (!prev.pibot) {
            return {
              ...prev,
              pibot: current,
              result: [...prev.result, current]
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
              result: [...prev.result, { ...current, lat: newLat }]
            }
          }

          return {
            increase: 0.1,
            pibot: current,
            result: [...prev.result, current]
          }
        },
        { pibot: {}, result: [], increase: 0.1 }
      )

    setAllNodes(sortedItems.result || [])
  }, [producers])

  useEffect(() => {
    let items = allNodes

    if (filters.nodeType !== 'all') {
      items = items.filter(
        (current) => current.node.node_type === filters.nodeType
      )
    }

    setNodes(items)
  }, [allNodes, filters])

  return (
    <Box>
      <NodeSearch
        producers={producers}
        filters={filters}
        onChange={handleOnFiltersChange}
      />
      {loading && <LinearProgress />}
      {!loading && <GeoMap data={nodes || []} />}
    </Box>
  )
}

Nodes.propTypes = {}

export default Nodes
