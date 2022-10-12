/* eslint camelcase: 0 */
import React, { lazy, memo, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useSubscription } from '@apollo/client'
import { makeStyles } from '@mui/styles'

import { BLOCK_TRANSACTIONS_HISTORY } from '../../gql'

import styles from './styles'
import useNodeState from '../../hooks/customHooks/useNodeState'

const LinearProgress = lazy(() => import('@mui/material/LinearProgress'))
const Pagination = lazy(() => import('@mui/material/Pagination'))
const SearchBar = lazy(() => import('../../components/SearchBar'))
const InformationCard = lazy(() => import('../../components/InformationCard'))
const NoResults = lazy(() => import('../../components/NoResults'))

const useStyles = makeStyles(styles)

const Nodes = () => {
  const classes = useStyles()
  const [
    { filters, chips, loading, items, pagination },
    { handleOnSearch, handleOnPageChange },
  ] = useNodeState()

  return (
    <div>
      <SearchBar
        filters={filters}
        onChange={handleOnSearch}
        chips={chips}
        translationScope="nodeSearchComponent"
      />
      {loading ? (
        <LinearProgress />
      ) : (
        <>
          <div className={classes.container}>
            {!!items?.length ? (
              items.map((producer, index) => (
                <InformationCard
                  key={`node-${producer.owner}-${index}`}
                  type="node"
                  producer={{ ...producer, missedBlocks: undefined }}
                  rank={producer.rank}
                />
              ))
            ) : (
              <NoResults />
            )}
          </div>
          {pagination.pages > 0 && (
            <Pagination
              className={classes.pagination}
              count={pagination.pages}
              page={pagination.page}
              onChange={handleOnPageChange}
              variant="outlined"
              shape="rounded"
            />
          )}
        </>
      )}
    </div>
  )
}

Nodes.propTypes = {}

export default memo(Nodes)
