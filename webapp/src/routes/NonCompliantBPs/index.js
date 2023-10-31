/* eslint camelcase: 0 */
import React, { memo } from 'react'
import Card from '@mui/material/Card'
import LinearProgress from '@mui/material/LinearProgress'

import useNonCompliantState from '../../hooks/customHooks/useNonCompliantState'
import NoResults from '../../components/NoResults'
import UndiscoverableBPsTable from '../../components/ProducersTable/UndiscoverableBPsTable'

import RewardsStats from './RewardsStats'

const NonCompliantBPs = () => {
  const [{ items, stats, loading }] = useNonCompliantState()

  return (
    <>
      {loading ? (
        <LinearProgress />
      ) : (
        <>
          {!!items?.length && stats ? (
            <>
              <RewardsStats stats={stats} />
              <Card>
                 <UndiscoverableBPsTable producers={items} tokenPrice={stats.tokenPrice}/>
              </Card>
            </>
          ) : (
            <NoResults translationScope={'undiscoverableBPsRoute'}/>
          )}
        </>
      )}
    </>
  )
}

NonCompliantBPs.propTypes = {}

export default memo(NonCompliantBPs)
