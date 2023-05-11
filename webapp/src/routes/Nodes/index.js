/* eslint camelcase: 0 */
import React, { lazy, memo } from 'react'
import { makeStyles } from '@mui/styles'

import useNodeState from '../../hooks/customHooks/useNodeState'

import styles from './styles'

const LinearProgress = lazy(() => import('@mui/material/LinearProgress'))
const Pagination = lazy(() => import('@mui/material/Pagination'))
const SearchBar = lazy(() => import('../../components/SearchBar'))
const InformationCard = lazy(() => import('../../components/InformationCard'))
const NoResults = lazy(() => import('../../components/NoResults'))
const ProducersUpdateLog = lazy(() =>
  import('../../components/ProducersUpdateLog'),
)

const useStyles = makeStyles(styles)

const Nodes = () => {
  const classes = useStyles()
  const [
    { filters, chips, loading, items, pagination },
    { handleOnSearch, handleOnPageChange },
  ] = useNodeState()

  return (
    <>
      <ProducersUpdateLog />
      <div className={`${classes.searchWrapper} ${classes.cardShadow}`}>
        <SearchBar
          filters={filters}
          onChange={handleOnSearch}
          chips={chips}
          translationScope="nodeSearchComponent"
        />
      </div>
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
    </>
  )
}

export default memo(Nodes)
