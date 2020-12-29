import React, { lazy, memo, useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/react-hooks'
import { makeStyles } from '@material-ui/styles'
import { useLocation } from 'react-router-dom'
import queryString from 'query-string'

import { NODES_QUERY } from '../gql'

const Box = lazy(() => import('@material-ui/core/Box'))
const Grid = lazy(() => import('@material-ui/core/Grid'))
const LinearProgress = lazy(() => import('@material-ui/core/LinearProgress'))
const Pagination = lazy(() => import('@material-ui/lab/Pagination'))
const NodeSearch = lazy(() => import('../components/NodeSearch'))
const NodeCard = lazy(() => import('../components/NodeCard'))

const useStyles = makeStyles((theme) => ({
  pagination: {
    padding: theme.spacing(3),
    display: 'flex',
    justifyContent: 'center'
  }
}))

const Nodes = () => {
  const [
    loadProducers,
    { loading = true, data: { producers, info } = {} }
  ] = useLazyQuery(NODES_QUERY)
  const location = useLocation()
  const [filters, setFilters] = useState({ nodeType: 'all' })
  const [pagination, setPagination] = useState({ page: 1, pages: 1, limit: 28 })
  const [items, setItems] = useState([])
  const classes = useStyles()

  const handleOnFiltersChange = (newFilters) => {
    if (!newFilters.owner && filters.owner) {
      setPagination((prev) => ({ ...prev, page: 1, where: null }))
    }

    if (newFilters.owner) {
      setPagination((prev) => ({
        ...prev,
        page: 1,
        where: { owner: { _like: `%${newFilters.owner}%` } }
      }))
    }

    setFilters(newFilters)
  }

  const handleOnPageChange = (_, page) => {
    setPagination((prev) => ({
      ...prev,
      page
    }))
  }

  useEffect(() => {
    loadProducers({
      variables: {
        where: pagination.where,
        offset: (pagination.page - 1) * pagination.limit,
        limit: pagination.limit
      }
    })
    // eslint-disable-next-line
  }, [pagination.where, pagination.page, pagination.limit])

  useEffect(() => {
    if (!info) {
      return
    }

    setPagination((prev) => ({
      ...prev,
      pages: Math.ceil(info.producers?.count / pagination.limit)
    }))
  }, [info, pagination.limit])

  useEffect(() => {
    const params = queryString.parse(location.search)

    if (!params.owner) {
      return
    }

    setPagination((prev) => ({
      ...prev,
      page: 1,
      where: { owner: { _like: `%${params.owner}%` } }
    }))

    setFilters((prev) => ({ ...prev, owner: params.owner }))
  }, [location.search])

  useEffect(() => {
    if (!producers?.length) {
      return
    }

    let items = producers || []
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

    setItems(items)
  }, [filters, producers])

  return (
    <Box>
      <NodeSearch filters={filters} onChange={handleOnFiltersChange} />
      {loading && <LinearProgress />}
      <Grid container spacing={2}>
        {items.map((producer) => (
          <>
            {(producer.bp_json?.nodes || []).map((node, index) => (
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
            ))}
            {!producer.bp_json?.nodes && (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                xl={3}
                key={`producer_${producer.owner}`}
              >
                <NodeCard producer={producer} />
              </Grid>
            )}
          </>
        ))}
      </Grid>
      {!loading && pagination.pages > 1 && (
        <Pagination
          className={classes.pagination}
          count={pagination.pages}
          page={pagination.page}
          onChange={handleOnPageChange}
          variant="outlined"
          shape="rounded"
        />
      )}
    </Box>
  )
}

Nodes.propTypes = {}

export default memo(Nodes)
