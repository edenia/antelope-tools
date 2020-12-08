/* eslint camelcase: 0 */
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useQuery } from '@apollo/react-hooks'
import { makeStyles } from '@material-ui/styles'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import { useTranslation } from 'react-i18next'

import MultiLineChart from '../components/MultiLineChart'
import { NETWORK_STATS } from '../gql'
import { generalConfig } from '../config'

const useStyles = makeStyles(() => ({
  content: {
    flex: 1
  },
  dl: {
    marginTop: -16,
    marginBottom: -16
  },
  dt: {
    fontWeight: 'bold'
  },
  dd: {
    wordBreak: 'break-word'
  }
}))

const Network = () => {
  const dispatch = useDispatch()
  const classes = useStyles()
  const { t } = useTranslation('networkInfoRoute')
  const { data: stats } = useQuery(NETWORK_STATS)

  useEffect(() => {
    dispatch.eos.startTrackingInfo({ interval: 0 })
  }, [dispatch])

  useEffect(() => {
    return () => {
      dispatch.eos.stopTrackingInfo()
    }
  }, [dispatch])

  return (
    <Grid container justify="flex-start" spacing={4}>
      {generalConfig.useCpuBenchmark && (
        <Grid item xs={12}>
          <Card className={classes.root}>
            <CardHeader title={t('cpuBenchmarks')} />
            <CardContent className={classes.content}>
              <MultiLineChart
                data={stats?.cpu || []}
                valueKey="usage"
                tooltipFormatter={(value) => `${value}us`}
              />
            </CardContent>
            <CardActions disableSpacing />
          </Card>
        </Grid>
      )}
      <Grid item xs={12}>
        <Card className={classes.root}>
          <CardHeader title={t('missedBlocks')} />
          <CardContent className={classes.content}>
            <MultiLineChart
              data={stats?.missed_block || []}
              valueKey="value"
              tooltipFormatter={(value) => `${value} ${t('missedBlocks')}`}
            />
          </CardContent>
          <CardActions disableSpacing />
        </Card>
      </Grid>
    </Grid>
  )
}

Network.propTypes = {}

export default Network
