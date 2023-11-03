/* eslint camelcase: 0 */
import React, { memo } from 'react'
import Card from '@mui/material/Card'
import LinearProgress from '@mui/material/LinearProgress'

import useNonCompliantState from '../../hooks/customHooks/useNonCompliantState'
import NoResults from '../../components/NoResults'
import ProducersTable from '../../components/ProducersTable'
import NonCompliantRow from '../../components/NonCompliantRow'

import RewardsStats from './RewardsStats'

const NonCompliantBPs = () => {
  const [{ items, stats, loading }] = useNonCompliantState()
  const columnsNames = [
    'rank',
    'producerName',
    'website',
    'bpJson',
    'votes',
    'lastClaimTime',
    'dailyRewards',
    'yearlyRewards',
  ]

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
                <ProducersTable
                  columnsNames={columnsNames}
                  producers={items}
                  RowComponent={NonCompliantRow}
                  RowProps={{ tokenPrice: stats.tokenPrice || NaN }}
                />
              </Card>
            </>
          ) : (
            <NoResults translationScope={'undiscoverableBPsRoute'} />
          )}
        </>
      )}
    </>
  )
}

NonCompliantBPs.propTypes = {}

export default memo(NonCompliantBPs)
