/* eslint camelcase: 0 */
import React, { lazy } from 'react'
import LinearProgress from '@mui/material/LinearProgress'
import { makeStyles } from '@mui/styles'

import useNodeDistributionState from '../../hooks/customHooks/useNodeDistributionState'

import styles from './styles'

const SearchBar = lazy(() => import('../../components/SearchBar'))
const GeoMap = lazy(() => import('../../components/GeoMap'))
const useStyles = makeStyles(styles)

const Nodes = () => {
  const classes = useStyles()

  const [{ filters, chips, nodes, loading }, { handleOnFiltersChange }] = useNodeDistributionState()

  return (
    <>
    <div className={`${classes.searchWrapper} ${classes.cardShadow}`}>
      <SearchBar 
        filters={filters}
        onChange={handleOnFiltersChange}
        chips={chips}
        translationScope="producerSearchComponent"
      />
      </div>
      {loading && <LinearProgress />}
      {!loading && <GeoMap data={nodes || []} />}
    </>
  )
}

Nodes.propTypes = {}

export default Nodes
