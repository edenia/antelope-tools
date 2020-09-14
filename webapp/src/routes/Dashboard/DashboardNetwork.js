/* eslint camelcase: 0 */
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import { useTranslation } from 'react-i18next'

import PageTitle from '../../components/PageTitle'

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    minWidth: 300,
    height: '100%',
    display: 'flex',
    flexFlow: 'column'
  },
  content: {
    flex: 1
  },
  avatar: {
    width: '3em',
    height: '3em',
    borderRadius: '100%',
    backgroundColor: theme.palette.secondary[100],
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
  }
}))

const Producers = () => {
  const dispatch = useDispatch()
  const classes = useStyles()
  const info = useSelector((state) => state.eos.info)
  const { t } = useTranslation('dashboardNetwork')

  useEffect(() => {
    dispatch.eos.startTrackingInfo({ interval: 0.5 })
  }, [dispatch])

  useEffect(() => {
    return () => {
      dispatch.eos.stopTrackingInfo()
      dispatch.eos.stopTrackingProducerSchedule()
    }
  }, [dispatch])

  return (
    <Grid item xs={12}>
      <PageTitle title={t('htmlTitle')} />
      <Typography variant="h3">{t('title')}</Typography>
      <Grid container justify="flex-start" spacing={1}>
        <Card className={classes.root}>
          <CardHeader
            title={t('chainLimits')}
            avatar={<span className={classes.avatar}>CL</span>}
          />
          <CardContent className={classes.content}>
            <dl className={classes.dl}>
              <dt className={classes.dt}>{t('cpuLimitPerBlock')}:</dt>
              <dd>{(info.block_cpu_limit / 1000000).toFixed(2)}s</dd>

              <dt className={classes.dt}>{t('netLimitPerBlock')}:</dt>
              <dd>{(info.block_net_limit / 1024).toFixed(0)}kb</dd>
            </dl>
          </CardContent>
          <CardActions disableSpacing />
        </Card>
      </Grid>
    </Grid>
  )
}

Producers.propTypes = {}

export default Producers
