/* eslint camelcase: 0 */
import React, { memo, useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/react-hooks'
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

const Producers = () => {
  const classes = useStyles()
  const [loadProducers, { loading = true, data: { producers, info } = {} }] =
    useLazyQuery(PRODUCERS_QUERY)
  const location = useLocation()
  const [pagination, setPagination] = useState({ page: 1, limit: 28 })
  const [totalPages, setTotalPages] = useState(1)
  const [current, setCurrent] = useState(null)
  const [anchorEl, setAnchorEl] = useState(null)
  const [filters, setFilters] = useState({})

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

  // console.log({ producers })

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
        <ProducerSearch onSearch={handleOnSearch} filters={filters} />
      </Box>
      {loading && <LinearProgress />}
      <Grid container spacing={2}>
        {(producers || []).map((producer, index) => (
          <Grid item xs={12} sm={6} lg={12} key={`producer-card-${index}`}>
            <InformationCard
              type="entity"
              producer={producer}
              rank={
                pagination.where
                  ? null
                  : (pagination.page - 1) * pagination.limit + index + 1
              }
              onNodeClick={handlePopoverOpen}
            />
          </Grid>
        ))}
      </Grid>
      {!loading && totalPages > 1 && (
        <Pagination
          className={classes.pagination}
          count={totalPages}
          page={pagination.page}
          onChange={handleOnPageChange}
          variant="outlined"
          shape="rounded"
        />
      )}
    </Box>
  )
}

Producers.propTypes = {}

export default memo(Producers)
