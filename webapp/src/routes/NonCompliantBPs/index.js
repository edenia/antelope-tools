/* eslint camelcase: 0 */
import React, { memo } from 'react'
import { makeStyles } from '@mui/styles'
import Card from '@mui/material/Card'
import LinearProgress from '@mui/material/LinearProgress'

import useNonCompliantState from '../../hooks/customHooks/useNonCompliantState'
import NoResults from '../../components/NoResults'
import NonCompliantCard from '../../components/NonCompliantCard'

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
              <div className={classes.bpsContainer}>
                {items.map((producer, index) => (
                  <Card
                    className={classes.card}
                    key={`producer-card-${index}`}
                  >
                    <NonCompliantCard producer={producer} stats={stats} />
                  </Card>
                ))}
              </div>
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
