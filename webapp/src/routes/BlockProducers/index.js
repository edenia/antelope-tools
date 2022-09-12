/* eslint camelcase: 0 */
import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@mui/styles'
import Grid from '@mui/material/Grid'
import LinearProgress from '@mui/material/LinearProgress'
import Pagination from '@mui/material/Pagination'

import SearchBar from '../../components/SearchBar'
import Tooltip from '../../components/Tooltip'
import NodeCard from '../../components/NodeCard'
import InformationCard from '../../components/InformationCard'
import useBlockProducerState from '../../hooks/customHooks/useBlockProducerState'
import NoResults from '../../components/NoResults'

import styles from './styles'

const useStyles = makeStyles(styles)

const PaginationWrapper = ({
  classes,
  totalPages,
  page,
  onPageChange,
  loading,
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
}

const Producers = () => {
  const classes = useStyles()
  const [
    {
      anchorEl,
      current,
      filters,
      chips,
      items,
      loading,
      totalPages,
      missedBlocks,
      pagination,
    },
    {
      handlePopoverClose,
      handleOnSearch,
      handlePopoverOpen,
      handleOnPageChange,
    },
  ] = useBlockProducerState()

  return (
    <div>
      <Tooltip
        anchorEl={anchorEl}
        open={anchorEl !== null}
        onClose={handlePopoverClose}
      >
        <NodeCard node={current?.node} producer={current?.producer} />
      </Tooltip>
      <Grid className={classes.searchWrapper}>
        <SearchBar
          filters={filters}
          onChange={handleOnSearch}
          chips={chips}
          translationScope="producerSearchComponent"
        />
      </Grid>
      {loading ? (
        <LinearProgress />
      ) : (
        <Grid container spacing={2}>
          {!!items?.length ? (
            items.map((producer, index) => (
              <Grid item xs={12} sm={6} lg={12} key={`producer-card-${index}`}>
                <InformationCard
                  type="entity"
                  producer={{ ...producer, missedBlocks }}
                  rank={producer.rank}
                  onNodeClick={handlePopoverOpen}
                />
              </Grid>
            ))
          ) : (
            <NoResults />
          )}
        </Grid>
      )}
      <PaginationWrapper
        classes={classes.pagination}
        totalPages={totalPages}
        page={pagination.page}
        onPageChange={handleOnPageChange}
        loading={loading}
      />
    </div>
  )
}

Producers.propTypes = {}

export default memo(Producers)
