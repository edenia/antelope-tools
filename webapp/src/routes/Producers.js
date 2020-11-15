/* eslint camelcase: 0 */
import React, { memo, useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/react-hooks'
import { makeStyles } from '@material-ui/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import LinearProgress from '@material-ui/core/LinearProgress'
import Box from '@material-ui/core/Box'
import Pagination from '@material-ui/lab/Pagination'
import { useTranslation } from 'react-i18next'

import { PRODUCERS_QUERY } from '../gql'
import ProducerSearch from '../components/ProducerSearch'
import ProducerCard from '../components/ProducerCard'
import PageTitle from '../components/PageTitle'
import Tooltip from '../components/Tooltip'
import NodeCard from '../components/NodeCard'

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
  const [
    loadProducers,
    { loading = true, data: { producers, info } = {} }
  ] = useLazyQuery(PRODUCERS_QUERY)
  const { t } = useTranslation('dashboardProducer')
  const [pagination, setPagination] = useState({ page: 1, limit: 21 })
  const [totalPages, setTotalPages] = useState(1)
  const [current, setCurrent] = useState(null)
  const [anchorEl, setAnchorEl] = useState(null)

  useEffect(() => {
    loadProducers({
      variables: {
        where: pagination.where,
        offset: (pagination.page - 1) * pagination.limit,
        limit: pagination.limit
      }
    })
    // eslint-disable-next-line
  }, [pagination])

  useEffect(() => {
    if (!info) {
      return
    }

    setTotalPages(Math.ceil(info.producers?.count / pagination.limit))
  }, [info, pagination.limit])

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

  return (
    <Box>
      <PageTitle title={t('htmlTitle')} />
      <Typography variant="h3">{t('title')}</Typography>
      <Tooltip
        anchorEl={anchorEl}
        open={anchorEl !== null}
        onClose={handlePopoverClose}
      >
        <NodeCard node={current?.node} producer={current?.producer} />
      </Tooltip>
      <Box className={classes.searchWrapper}>
        <ProducerSearch onSearch={handleOnSearch} />
      </Box>
      {loading && <LinearProgress />}
      <Grid container spacing={2}>
        {(producers || []).map((producer, index) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            key={`producer-card-${index}`}
          >
            <ProducerCard
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
