/* eslint camelcase: 0 */
import React, { memo, useEffect, useState } from 'react'
import { useLazyQuery, useSubscription } from '@apollo/client'
import PropTypes from 'prop-types'
import { makeStyles } from '@mui/styles'
import Grid from '@mui/material/Grid'
import LinearProgress from '@mui/material/LinearProgress'
import Box from '@mui/material/Box'
import Pagination from '@mui/material/Pagination'
import { useLocation } from 'react-router-dom'
import queryString from 'query-string'

import { PRODUCERS_QUERY, BLOCK_TRANSACTIONS_HISTORY } from '../../gql'
import ProducerSearch from '../../components/ProducerSearch'
import Tooltip from '../../components/Tooltip'
import NodeCard from '../../components/NodeCard'
import InformationCard from '../../components/InformationCard'
import { eosConfig } from '../../config'

import styles from './styles'

const useStyles = makeStyles(styles)
const CHIPS_FILTERS = [
  { offset: 0, where: null, limit: 28 },
  {
    where: { total_rewards: { _neq: 0 }, rank: { _lte: 21 } }
  },
  {
    where: { total_rewards: { _gte: 100 }, rank: { _gte: 22 } }
  },
  {
    where: { total_rewards: { _eq: 0 } }
  }
]

const PaginationWrapper = ({
  classes,
  totalPages,
  page,
  onPageChange,
  loading,
  chipFilter
}) => {
  if (loading || !totalPages) return <></>

  return (
    <Pagination
      className={classes}
      count={totalPages}
      page={page}
      onChange={onPageChange}
      variant="outlined"
      shape="rounded"
    />
  )
}

PaginationWrapper.propTypes = {
  classes: PropTypes.any,
  totalPages: PropTypes.number,
  page: PropTypes.number,
  onPageChange: PropTypes.func,
  loading: PropTypes.bool,
  chipFilter: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

const Producers = () => {
  const classes = useStyles()
  const [loadProducers, { loading = true, data: { producers, info } = {} }] =
    useLazyQuery(PRODUCERS_QUERY)
  const { data: dataHistory, loading: loadingHistory } = useSubscription(
    BLOCK_TRANSACTIONS_HISTORY
  )
  const location = useLocation()
  const [pagination, setPagination] = useState({ page: 1, limit: 28 })
  const [totalPages, setTotalPages] = useState(1)
  const [current, setCurrent] = useState(null)
  const [anchorEl, setAnchorEl] = useState(null)
  const [items, setItems] = useState([])
  const [filters, setFilters] = useState({})
  const [chipFilter, setChipFilter] = useState('all')
  const [missedBlocks, setMissedBlocks] = useState({})

  const handlePopoverOpen = (node) => (event) => {
    setCurrent(node)
    setAnchorEl(event.currentTarget)
  }

  const handlePopoverClose = () => {
    setAnchorEl(null)
  }

  const handleOnSearch = (filters) => {
    if (!filters.owner) {
      setPagination((prev) => ({ ...prev, page: 1, where: null }))

      return
    }

    setPagination((prev) => ({
      ...prev,
      page: 1,
      where: { owner: { _like: `%${filters.owner}%` } }
    }))
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
        offset: pagination.offset || (pagination.page - 1) * pagination.limit,
        limit: pagination.limit
      }
    })

    // eslint-disable-next-line
  }, [pagination.where, pagination.page, pagination.limit])

  useEffect(() => {
    if (!info) return

    setTotalPages(Math.ceil(info.producers?.count / pagination.limit))
  }, [info, pagination.limit])

  useEffect(() => {
    const params = queryString.parse(location.search)

    if (!params.name) return

    setPagination((prev) => ({
      ...prev,
      page: 1,
      where: { owner: { _like: `%${params.name}%` } }
    }))

    setFilters({
      owner: params.name
    })
  }, [location.search])

  useEffect(() => {
    if (eosConfig.networkName === 'lacchain') return

    setPagination((prev) => ({
      ...prev,
      page: 1,
      ...CHIPS_FILTERS[chipFilter === 'all' ? 0 : chipFilter]
    }))
  }, [chipFilter])

  useEffect(() => {
    if (!producers?.length) return

    let items = producers || []

    if (eosConfig.networkName === 'lacchain' && chipFilter !== 'all') {
      items = items.filter((producer) => producer.bp_json?.type === chipFilter)
    }

    setItems(items)
  }, [chipFilter, producers])

  useEffect(() => {
    if (dataHistory?.stats.length) {
      setMissedBlocks(dataHistory?.stats[0].missed_blocks)
    }
  }, [dataHistory, loadingHistory])

  return (
    <Box>
      <Tooltip
        anchorEl={anchorEl}
        open={anchorEl !== null}
        onClose={handlePopoverClose}
      >
        <NodeCard node={current?.node} producer={current?.producer} />
      </Tooltip>
      <Box className={classes.searchWrapper}>
        <ProducerSearch
          onSearch={handleOnSearch}
          filters={filters}
          onChange={setChipFilter}
          networkName={eosConfig.networkName}
        />
      </Box>
      {loading && <LinearProgress />}
      <Grid container spacing={2}>
        {(items || []).map((producer, index) => (
          <Grid item xs={12} sm={6} lg={12} key={`producer-card-${index}`}>
            <InformationCard
              type="entity"
              producer={{ ...producer, missedBlocks }}
              rank={producer.rank}
              onNodeClick={handlePopoverOpen}
            />
          </Grid>
        ))}
      </Grid>
      <PaginationWrapper
        classes={classes.pagination}
        totalPages={totalPages}
        page={pagination.page}
        onPageChange={handleOnPageChange}
        loading={loading}
        chipFilter={chipFilter}
      />
    </Box>
  )
}

Producers.propTypes = {}

export default memo(Producers)
