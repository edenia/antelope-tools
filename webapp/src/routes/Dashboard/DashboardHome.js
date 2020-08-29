/* eslint camelcase: 0 */
import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/styles'
import { useDispatch, useSelector } from 'react-redux'
import { useSubscription } from '@apollo/react-hooks'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Grid from '@material-ui/core/Grid'
import Skeleton from '@material-ui/lab/Skeleton'
import Typography from '@material-ui/core/Typography'
import LinearProgress from '@material-ui/core/LinearProgress'
import { useTranslation } from 'react-i18next'

import { formatWithThousandSeparator } from '../../utils'
import ProducersChart from '../../components/ProducersChart'
import TransactionsChart from '../../components/TransactionsChart'
import { PRODUCERS_SUBSCRIPTION } from '../../gql'
import PageTitle from '../../components/PageTitle'

const useStyles = makeStyles((theme) => ({
  country: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  owner: {
    display: 'flex',
    justifyContent: 'start',
    alignItems: 'center'
  },
  loader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logo: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    display: 'inline-block',
    width: '2em',
    height: '2em',
    borderRadius: '500rem',
    backgroundColor: theme.palette.primary.contrastText
  },
  chartWrapper: {
    minWidth: 280,
    width: '100%'
  },
  chartSkeletonWrapper: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  gridItem: {
    marginBottom: theme.spacing(2)
  },
  tableWrapper: {
    width: ' 100%',
    overflow: 'scroll'
  },
  currentProducerRow: {
    backgroundColor: theme.palette.secondary[900],
    color: theme.palette.primary.contrastText,
    '& td, & td a': {
      color: theme.palette.primary.contrastText
    }
  },
  row: {
    cursor: 'pointer'
  }
}))

const Producers = () => {
  const dispatch = useDispatch()
  const {
    data: { producer: producers = [] } = { producers: [] }
  } = useSubscription(PRODUCERS_SUBSCRIPTION)
  const info = useSelector((state) => state.eos.info)
  const tps = useSelector((state) => state.eos.tps)
  const tpb = useSelector((state) => state.eos.tpb)
  const scheduleInfo = useSelector((state) => state.eos.schedule)
  const [schedule, setSchedule] = useState({ producers: [] })
  const classes = useStyles()
  const { t } = useTranslation('dashboardHome')

  useEffect(() => {
    dispatch.eos.startTrackingInfo({ interval: 0.5 })
    dispatch.eos.startTrackingProducerSchedule({ interval: 60 })
    dispatch.eos.getRate()
  }, [dispatch])

  useEffect(() => {
    const newProducers = scheduleInfo.producers.map((item) => {
      const data =
        producers.find((producer) => producer.owner === item.producer_name) ||
        {}

      return {
        // eslint-disable-next-line camelcase
        logo: data?.bp_json?.org?.branding?.logo_256,
        url: data?.url,
        owner: data.owner,
        rewards: data.total_rewards,
        total_votes_percent: data.total_votes_percent * 100,
        value: 20
      }
    })
    setSchedule({
      ...scheduleInfo,
      producers: newProducers
    })
  }, [scheduleInfo, producers])

  useEffect(() => {
    return () => {
      dispatch.eos.stopTrackingInfo()
      dispatch.eos.stopTrackingProducerSchedule()
    }
  }, [dispatch])

  return (
    <Grid item xs={12}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <PageTitle title={t('htmlTitle')} />

              <Typography variant="h6">{t('currentProducer')}</Typography>
              <Typography variant="h3">{info.head_block_producer}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">{t('headBlock')}</Typography>
              <Typography variant="h3">
                {formatWithThousandSeparator(info.head_block_num)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">{t('lastBlock')}</Typography>
              <Typography variant="h3">
                {formatWithThousandSeparator(info.last_irreversible_block_num)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      {!producers.length && <LinearProgress />}
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6">{t('bpSchedule')}</Typography>
              <Typography variant="caption">
                {schedule.version ? `Ver. ${schedule.version}` : ''}
              </Typography>
              {!schedule.producers.length && (
                <div className={classes.chartSkeletonWrapper}>
                  <Skeleton
                    variant="circle"
                    width={280}
                    height={280}
                    animation="wave"
                  />
                </div>
              )}
              {schedule.producers.length > 0 && (
                <ProducersChart info={info} producers={schedule.producers} />
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{t('transPerSecond')}</Typography>
                  {!producers.length && (
                    <div className={classes.chartSkeletonWrapper}>
                      <Skeleton
                        variant="rect"
                        width={280}
                        height={100}
                        animation="wave"
                      />
                    </div>
                  )}
                  {producers.length > 0 && <TransactionsChart data={tps} />}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{t('transPerBlock')}</Typography>
                  {!producers.length && (
                    <div className={classes.chartSkeletonWrapper}>
                      <Skeleton
                        variant="rect"
                        width={280}
                        height={100}
                        animation="wave"
                      />
                    </div>
                  )}
                  {producers.length > 0 && <TransactionsChart data={tpb} />}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

Producers.propTypes = {}

export default Producers
