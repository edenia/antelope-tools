/* eslint camelcase: 0 */
import React, { lazy } from 'react'
import LinearProgress from '@mui/material/LinearProgress'

import useNodeDistributionState from '../../hooks/customHooks/useNodeDistributionState'

const SearchBar = lazy(() => import('../../components/SearchBar'))
const GeoMap = lazy(() => import('../../components/GeoMap'))

const Nodes = () => {
  const [{ filters, chips, nodes, loading }, { handleOnFiltersChange }] = useNodeDistributionState()

  return (
    <div>
      <SearchBar
        filters={filters}
        onChange={handleOnFiltersChange}
        chips={chips}
        translationScope="nodeSearchComponent"
      />
      {loading && <LinearProgress />}
      {!loading && <GeoMap data={nodes || []} />}
    </div>
  )
}

Nodes.propTypes = {}

export default Nodes
