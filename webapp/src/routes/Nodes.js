import React, { lazy, useEffect, useState } from 'react'
import { useQuery } from '@apollo/react-hooks'

import { NODES_QUERY } from '../gql'

const Box = lazy(() => import('@material-ui/core/Box'))
const Grid = lazy(() => import('@material-ui/core/Grid'))
const LinearProgress = lazy(() => import('@material-ui/core/LinearProgress'))
const NodeSearch = lazy(() => import('../components/NodeSearch'))
const NodeCard = lazy(() => import('../components/NodeCard'))

const Nodes = () => {
  const { data: { loading, producer: producers } = {} } = useQuery(NODES_QUERY)
  const [filters, setFilters] = useState({ producer: 'all', nodeType: 'all' })
  const [filterProducers, setFilterProducers] = useState([])

  useEffect(() => {
    if (!producers?.length) {
      return
    }

    let items = producers

    if (filters.nodeType !== 'all') {
      items = items.map((producer) => {
        const nodes = (producer.bp_json?.nodes || []).filter(
          (node) => node.node_type === filters.nodeType
        )

        return {
          ...producer,
          bp_json: {
            ...producer.bp_json,
            nodes
          }
        }
      })
    }

    if (filters.producer !== 'all') {
      items = items.filter((node) => node.owner === filters.producer)
    }

    setFilterProducers(items)
  }, [filters, producers])

  return (
    <Box>
      <NodeSearch
        producers={producers}
        filters={filters}
        onChange={setFilters}
      />
      {loading && <LinearProgress />}
      <Grid container spacing={2}>
        {filterProducers.map((producer) =>
          producer.bp_json?.nodes.map((node, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              xl={3}
              key={`${node.node_name}_${index}`}
            >
              <NodeCard producer={producer} node={node} />
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  )
}

Nodes.propTypes = {}

export default Nodes
