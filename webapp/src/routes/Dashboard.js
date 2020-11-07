/* eslint camelcase: 0 */
import React, { lazy, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useQuery } from '@apollo/react-hooks'
import { useTranslation } from 'react-i18next'

import { formatWithThousandSeparator } from '../utils'
import { PRODUCERS_QUERY } from '../gql'

const Card = lazy(() => import('@material-ui/core/Card'))
const CardContent = lazy(() => import('@material-ui/core/CardContent'))
const Grid = lazy(() => import('@material-ui/core/Grid'))
const Typography = lazy(() => import('@material-ui/core/Typography'))
const LinearProgress = lazy(() => import('@material-ui/core/LinearProgress'))
const ProducersChart = lazy(() => import('../components/ProducersChart'))
const TransactionsChart = lazy(() => import('../components/TransactionsChart'))
const PageTitle = lazy(() => import('../components/PageTitle'))

const Dashboard = () => {
  const dispatch = useDispatch()
  const {
    data: { loading, producer: producers = [] } = { producers: [] }
  } = useQuery(PRODUCERS_QUERY)
  const info = useSelector((state) => state.eos.info)
  const tps = useSelector((state) => state.eos.tps)
  const tpb = useSelector((state) => state.eos.tpb)
  const scheduleInfo = useSelector((state) => state.eos.schedule)
  const [schedule, setSchedule] = useState({ producers: [] })
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
        logo: data?.bp_json?.org?.branding?.logo_256,
        url: data?.url,
        owner: data.owner || item.producer_name,
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
              <Typography variant="h6">{info.head_block_producer}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">{t('headBlock')}</Typography>
              <Typography variant="h6">
                {formatWithThousandSeparator(info.head_block_num)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">{t('lastBlock')}</Typography>
              <Typography variant="h6">
                {formatWithThousandSeparator(info.last_irreversible_block_num)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      {loading && <LinearProgress />}
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6">{t('bpSchedule')}</Typography>
              <Typography variant="caption">
                Ver. {schedule?.version}
              </Typography>
              <ProducersChart info={info} producers={schedule.producers} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{t('transPerSecond')}</Typography>
                  <TransactionsChart data={tps} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{t('transPerBlock')}</Typography>
                  <TransactionsChart data={tpb} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

Dashboard.propTypes = {}

export default Dashboard
