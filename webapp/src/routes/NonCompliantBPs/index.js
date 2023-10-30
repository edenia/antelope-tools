/* eslint camelcase: 0 */
import React, { memo } from 'react'
import { makeStyles } from '@mui/styles'
import Card from '@mui/material/Card'
import LinearProgress from '@mui/material/LinearProgress'

import useNonCompliantState from '../../hooks/customHooks/useNonCompliantState'
import NoResults from '../../components/NoResults'
import UndiscoverableBPsTable from '../../components/ProducersTable/UndiscoverableBPsTable'

import styles from './styles'
import RewardsStats from './RewardsStats'

const useStyles = makeStyles(styles)

const NonCompliantBPs = () => {
  const classes = useStyles()
  const [{ items, stats, loading }] = useNonCompliantState()

  return (
    <>
      {loading ? (
        <LinearProgress />
      ) : (
        <>
          {!!items?.length && stats ? (
            <>
              <div className={classes.statsContainer}>
                <RewardsStats stats={stats} />
              </div>
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
