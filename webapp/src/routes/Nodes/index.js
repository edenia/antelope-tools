/* eslint camelcase: 0 */
import React, { lazy, memo, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useLazyQuery, useSubscription } from '@apollo/client'
import { makeStyles } from '@mui/styles'
import { useLocation } from 'react-router-dom'
import queryString from 'query-string'

import { NODES_QUERY, BLOCK_TRANSACTIONS_HISTORY } from '../../gql'

import styles from './styles'

import { eosConfig } from '../../config'

const Grid = lazy(() => import('@mui/material/Grid'))
const LinearProgress = lazy(() => import('@mui/material/LinearProgress'))
const Pagination = lazy(() => import('@mui/material/Pagination'))
const SearchBar = lazy(() => import('../../components/SearchBar'))
const InformationCard = lazy(() => import('../../components/InformationCard'))
const useStyles = makeStyles(styles)

const NodesCards = ({ item }) => {
  const { data, loading } = useSubscription(BLOCK_TRANSACTIONS_HISTORY)
  const [missedBlocks, setMissedBlocks] = useState({})

  useEffect(() => {
    if (data?.stats?.length) {
      setMissedBlocks(data?.stats[0].missed_blocks)
    }
  }, [data, loading])

  if (!item.bp_json?.nodes) {
    return (
      <Grid item xs={12} sm={6} lg={12}>
        <InformationCard producer={item} type="node" />
      </Grid>
    )
  }

  return (
    <>
      {(item.bp_json?.nodes || []).map((node, index) => (
        <Grid item xs={12} sm={6} lg={12} key={`${node.name}_${index}`}>
          <InformationCard
            producer={{ ...item, node, missedBlocks }}
            type="node"
          />
        </Grid>
      ))}
    </>
  )
}

NodesCards.propTypes = {
  item: PropTypes.object
}

const Nodes = () => {
  const [loadProducers, { loading = true, data: { producers, info } = {} }] =
    useLazyQuery(NODES_QUERY)
  const location = useLocation()
  const [filters, setFilters] = useState({ name: 'all', owner: '' })
  const [pagination, setPagination] = useState({ page: 1, pages: 1, limit: 28 })
  const [items, setItems] = useState([])
  const classes = useStyles()

  const chips =
    eosConfig.networkName === 'lacchain'
      ? [
          { name: 'all' },
          { name: 'validator' },
          { name: 'boot' },
          { name: 'writer' },
          { name: 'observer' }
        ]
      : [
          { name: 'all' },
          { name: 'producer' },
          { name: 'full' },
          { name: 'query' },
          { name: 'seed' }
        ]

  const handleOnSearch = (newFilters) => {
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
    if (!info) return

    setPagination((prev) => ({
      ...prev,
      pages: Math.ceil(info.producers?.count / pagination.limit)
    }))
  }, [info, pagination.limit])

  useEffect(() => {
    const params = queryString.parse(location.search)

    if (!params.owner) return

    setPagination((prev) => ({
      ...prev,
      page: 1,
      where: { owner: { _like: `%${params.owner}%` } }
    }))

    setFilters((prev) => ({ ...prev, owner: params.owner }))
  }, [location.search])

  useEffect(() => {
    if (!producers?.length) return

    let items = producers || []

    if (filters.name !== 'all') {
      items = items.map((producer) => {
        const nodes = (producer.bp_json?.nodes || []).filter(
          (node) => node.node_type === filters.name
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
    <Grid>
      <SearchBar
        filters={filters}
        onChange={handleOnSearch}
        chips={chips}
        translationScope="nodeSearchComponent"
      />
      {loading && <LinearProgress />}
      <Grid container spacing={2}>
        {items.map((producer) => (
          <NodesCards item={producer} key={`producer_${producer.owner}`} />
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
    </Grid>
  )
}

Nodes.propTypes = {}

export default memo(Nodes)
