/* eslint camelcase: 0 */
import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@mui/styles'
import LinearProgress from '@mui/material/LinearProgress'
import Pagination from '@mui/material/Pagination'

import SearchBar from '../../components/SearchBar'
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
    { filters, chips, items, loading, missedBlocks, pagination },
    { handleOnSearch, handleOnPageChange },
  ] = useBlockProducerState()

  return (
    <>
      <div className={`${classes.searchWrapper} ${classes.cardShadow}`}>
        <SearchBar
          filters={filters}
          onChange={handleOnSearch}
          chips={chips}
          translationScope="producerSearchComponent"
        />
      </div>
      {loading ? (
        <LinearProgress />
      ) : (
        <div className={classes.container}>
          {!!items?.length ? (
            items.map((producer, index) => (
              <div className={classes.card} key={`producer-card-${index}`}>
                <InformationCard
                  type="entity"
                  producer={{ ...producer, missedBlocks }}
                  rank={producer.rank}
                />
              </div>
            ))
          ) : (
            <NoResults />
          )}
        </div>
      )}
      <PaginationWrapper
        classes={classes.pagination}
        totalPages={pagination.pages}
        page={pagination.page}
        onPageChange={handleOnPageChange}
        loading={loading}
      />
    </>
  )
}

Producers.propTypes = {}

export default memo(Producers)
