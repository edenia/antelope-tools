/* eslint camelcase: 0 */
import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@mui/styles'
import LinearProgress from '@mui/material/LinearProgress'
import Pagination from '@mui/material/Pagination'

import SearchBar from '../../components/SearchBar'
import useBlockProducerState from '../../hooks/customHooks/useBlockProducerState'
import NoResults from '../../components/NoResults'
import ProducersUpdateLog from '../../components/ProducersUpdateLog'
import ProducersTable from '../../components/InformationCard/ProducersTable'

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
    { filters, chips, items, loading, pagination },
    { handleOnSearch, handleOnPageChange },
  ] = useBlockProducerState()

  return (
    <>
      <ProducersUpdateLog />
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
      ) : !!items?.length ? (
        <div className={`${classes.container} ${classes.cardShadow}`}>
          <ProducersTable producers={items} />
        </div>
      ) : (
        <NoResults />
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
