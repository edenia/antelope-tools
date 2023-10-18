/* eslint camelcase: 0 */
import React, { lazy } from 'react'
import { makeStyles } from '@mui/styles'
import Card from '@mui/material/Card'
import LinearProgress from '@mui/material/LinearProgress'

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
      <Card className={classes.searchWrapper}>
        <SearchBar 
          filters={filters}
          onChange={handleOnFiltersChange}
          chips={chips}
          translationScope="producerSearchComponent"
        />
      </Card>
      {loading && <LinearProgress />}
      {!loading && <GeoMap data={nodes || []} />}
    </>
  )
}

Nodes.propTypes = {}

export default Nodes
