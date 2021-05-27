/* eslint camelcase: 0 */
import React, { memo, useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/react-hooks'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'
import Grid from '@material-ui/core/Grid'
import LinearProgress from '@material-ui/core/LinearProgress'
import Box from '@material-ui/core/Box'
import Pagination from '@material-ui/lab/Pagination'
import { useLocation } from 'react-router-dom'
import queryString from 'query-string'

import { PRODUCERS_QUERY } from '../gql'
import ProducerSearch from '../components/ProducerSearch'
import Tooltip from '../components/Tooltip'
import NodeCard from '../components/NodeCard'
import InformationCard from '../components/InformationCard'
import { eosConfig } from '../config'

const CHIPS_FILTERS = [
  { offset: 0, where: null, limit: 28, pibot: 1 },
  {
    offset: 0,
    where: { total_rewards: { _neq: 0 } },
    limit: 21,
    pibot: 1
  },
  {
    offset: 21,
    where: { total_rewards: { _gte: 100 } },
    pibot: 22
  },
  {
    pibot: 65,
    where: { total_rewards: { _eq: 0 } },
    limit: 28
  }
]

const useStyles = makeStyles((theme) => ({
  searchWrapper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3)
  },
  pagination: {
    padding: theme.spacing(3),
    display: 'flex',
    justifyContent: 'center'
  },
  formControl: {
    width: '100%'
  }
}))

const PaginationWrapper = ({
  classes,
  totalPages,
  page,
  onPageChange,
  loading,
  chipFilter
}) => {
  if (loading || !totalPages || chipFilter === 1 || chipFilter === 2)
    return <></>

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
  const location = useLocation()
  const [pagination, setPagination] = useState({ page: 1, limit: 28 })
  const [totalPages, setTotalPages] = useState(1)
  const [current, setCurrent] = useState(null)
  const [anchorEl, setAnchorEl] = useState(null)
  const [items, setItems] = useState([])
  const [filters, setFilters] = useState({})
  const [chipFilter, setChipFilter] = useState('all')

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
        {(items || []).map((producer, index) => {
          const pibot =
            CHIPS_FILTERS[chipFilter === 'all' ? 0 : chipFilter].pibot

          return (
            <Grid item xs={12} sm={6} lg={12} key={`producer-card-${index}`}>
              <InformationCard
                type="entity"
                producer={producer}
                rank={(pagination.page - 1) * pagination.limit + index + pibot}
                onNodeClick={handlePopoverOpen}
              />
            </Grid>
          )
        })}
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
