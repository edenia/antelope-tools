/* eslint camelcase: 0 */
import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { makeStyles } from '@mui/styles'
import LinearProgress from '@mui/material/LinearProgress'
import Pagination from '@mui/material/Pagination'
import PaginationItem from '@mui/material/PaginationItem'

import { eosConfig } from '../../config'
import SearchBar from '../../components/SearchBar'
import useBlockProducerState from '../../hooks/customHooks/useBlockProducerState'
import NoResults from '../../components/NoResults'
import ProducersUpdateLog from '../../components/ProducersUpdateLog'
import ProducersTable from '../../components/ProducersTable'

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
      renderItem={item =>
        item.page !== page && item.page > 0 && item.page <= totalPages ? (
          <Link to={`/${eosConfig.producersRoute}?page=${item.page}`}>
            <PaginationItem {...item} />
          </Link>
        ) : (
          <PaginationItem {...item} />
        )
      }
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
        <>
          <div className={`${classes.container} ${classes.cardShadow}`}>
            <ProducersTable producers={items} />
          </div>
          <PaginationWrapper
            classes={classes.pagination}
            totalPages={pagination.pages}
            page={pagination.page}
            onPageChange={handleOnPageChange}
            loading={loading}
          />
        </>
      ) : (
        <NoResults />
      )}
      
    </>
  )
}

Producers.propTypes = {}

export default memo(Producers)
