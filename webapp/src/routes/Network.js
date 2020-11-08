/* eslint camelcase: 0 */
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useQuery } from '@apollo/react-hooks'
import { makeStyles } from '@material-ui/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import { useTranslation } from 'react-i18next'

import PageTitle from '../components/PageTitle'
import MultiLineChart from '../components/MultiLineChart'
import { PRODUCERS_QUERY } from '../gql'

const useStyles = makeStyles((theme) => ({
  content: {
    flex: 1
  },
  avatar: {
    width: '3em',
    height: '3em',
    borderRadius: '100%',
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.primary.contrastText,
    fontSize: 16,
    padding: theme.spacing(1)
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
  const info = useSelector((state) => state.eos.info)
  const { t } = useTranslation('dashboardNetwork')
  const { data: { producer: producers = [] } = { producers: [] } } = useQuery(
    PRODUCERS_QUERY
  )

  useEffect(() => {
    dispatch.eos.startTrackingInfo({ interval: 0.5 })
  }, [dispatch])

  useEffect(() => {
    return () => {
      dispatch.eos.stopTrackingInfo()
    }
  }, [dispatch])

  return (
    <Grid item xs={12}>
      <PageTitle title={t('htmlTitle')} />
      <Typography variant="h3">{t('title')}</Typography>
      <Grid container justify="flex-start" spacing={1}>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardHeader
              title={t('chainLimits')}
              avatar={<span className={classes.avatar}>CL</span>}
            />
            <CardContent className={classes.content}>
              <dl className={classes.dl}>
                <dt className={classes.dt}>{t('chainId')}</dt>
                <dd className={classes.dd}>{info.chain_id}</dd>

                <dt className={classes.dt}>{t('cpuLimitPerBlock')}:</dt>
                <dd className={classes.dd}>
                  {(info.block_cpu_limit / 1000000).toFixed(2)}s
                </dd>

                <dt className={classes.dt}>{t('netLimitPerBlock')}:</dt>
                <dd className={classes.dd}>
                  {(info.block_net_limit / 1024).toFixed(0)}kb
                </dd>
              </dl>
            </CardContent>
            <CardActions disableSpacing />
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={5}>
          <Card className={classes.root}>
            <CardHeader
              title={t('cpuBenchmarks')}
              avatar={<span className={classes.avatar}>CPU</span>}
            />
            <CardContent className={classes.content}>
              <MultiLineChart
                producers={producers}
                dataKey="cpus"
                valueKey="usage"
              />
            </CardContent>
            <CardActions disableSpacing />
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={5}>
          <Card className={classes.root}>
            <CardHeader
              title={t('missedBlocks')}
              avatar={<span className={classes.avatar}>MB</span>}
            />
            <CardContent className={classes.content}>
              <MultiLineChart
                producers={producers}
                dataKey="missed_blocks"
                valueKey="value"
              />
            </CardContent>
            <CardActions disableSpacing />
          </Card>
        </Grid>
      </Grid>
    </Grid>
  )
}

Network.propTypes = {}

export default Network
