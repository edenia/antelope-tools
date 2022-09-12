/* eslint camelcase: 0 */
import React, { lazy, memo, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useSubscription } from '@apollo/client'
import { makeStyles } from '@mui/styles'

import { BLOCK_TRANSACTIONS_HISTORY } from '../../gql'

import styles from './styles'
import useNodeState from '../../hooks/customHooks/useNodeState'

const Grid = lazy(() => import('@mui/material/Grid'))
const LinearProgress = lazy(() => import('@mui/material/LinearProgress'))
const Pagination = lazy(() => import('@mui/material/Pagination'))
const SearchBar = lazy(() => import('../../components/SearchBar'))
const InformationCard = lazy(() => import('../../components/InformationCard'))
const NoResults = lazy(() => import('../../components/NoResults')) 

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
  item: PropTypes.object,
}

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
          <Grid container spacing={2}>
            {!!items?.length ? (
              items.map((producer) => (
                <NodesCards
                  item={producer}
                  key={`producer_${producer.owner}`}
                />
              ))
            ) : (
              <NoResults />
            )}
          </Grid>
          {pagination.pages > 1 && (
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
