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

const NodesCards = ({ node, producer }) => {
  const classes = useStyles()
  const { data, loading } = useSubscription(BLOCK_TRANSACTIONS_HISTORY)
  const [missedBlocks, setMissedBlocks] = useState({})

  useEffect(() => {
    if (data?.stats?.length) {
      setMissedBlocks(data?.stats[0].missed_blocks)
    }
  }, [data, loading])

  return (
    <div className={classes.card} key={`${node.node_type}-${producer.owner}-${node.index}`}>
      <InformationCard
        producer={{ ...producer, node, missedBlocks }}
        type="node"
      />
    </div>
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
          <div className={classes.container}>
            {!!items?.length ? (
              items.map(({node,producer},index) => (
                <NodesCards
                  node={{index,...node}}
                  producer={producer}
                  key={`node-${producer.owner}-${index}`}
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
