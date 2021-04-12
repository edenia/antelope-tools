/* eslint camelcase: 0 */
import React, { lazy, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useQuery, useLazyQuery } from '@apollo/react-hooks'
import { useTranslation } from 'react-i18next'
import moment from 'moment'

import { formatWithThousandSeparator } from '../utils'
import { NODES_QUERY, BLOCK_TRANSACTIONS_HISTORY } from '../gql'

const Card = lazy(() => import('@material-ui/core/Card'))
const CardContent = lazy(() => import('@material-ui/core/CardContent'))
const Grid = lazy(() => import('@material-ui/core/Grid'))
const Typography = lazy(() => import('@material-ui/core/Typography'))
const LinearProgress = lazy(() => import('@material-ui/core/LinearProgress'))
const ProducersChart = lazy(() => import('../components/ProducersChart'))
const TransactionsChart = lazy(() => import('../components/TransactionsChart'))

const Home = () => {
  const dispatch = useDispatch()
  const { data: { loading, producers } = {} } = useQuery(NODES_QUERY)
  const [
    loadLastHourBlockTransactions,
    lastHourBlockTransactions
  ] = useLazyQuery(BLOCK_TRANSACTIONS_HISTORY)
  const [loadLastDayBlockTransactions, lastDayBlockTransactions] = useLazyQuery(
    BLOCK_TRANSACTIONS_HISTORY
  )
  const [
    loadLastWeekBlockTransactions,
    lastWeekBlockTransactions
  ] = useLazyQuery(BLOCK_TRANSACTIONS_HISTORY)

  const info = useSelector((state) => state.eos.info)
  const tps = useSelector((state) => state.eos.tps)
  const tpb = useSelector((state) => state.eos.tpb)
  const scheduleInfo = useSelector((state) => state.eos.schedule)
  const [schedule, setSchedule] = useState({ producers: [] })
  const { t } = useTranslation('homeRoute')

  useEffect(() => {
    dispatch.eos.startTrackingInfo({ interval: 0.5 })
    dispatch.eos.startTrackingProducerSchedule({ interval: 60 })
  }, [dispatch])

  useEffect(() => {
    const newProducers = scheduleInfo.producers.map((item) => {
      const data =
        (producers || []).find((producer) => {
          let result = producer.owner === item.producer_name

          if (!result) {
            result = producer.bp_json?.nodes.find(
              (node) => node.node_name === item.producer_name
            )
          }

          return result
        }) || {}

      return {
        logo: data?.bp_json?.org?.branding?.logo_256,
        url: data?.url,
        owner: item.producer_name || data.owner,
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

  useEffect(() => {
    loadLastHourBlockTransactions({
      variables: {
        start: moment().subtract(1, 'hour'),
        end: moment()
      }
    })
    loadLastDayBlockTransactions({
      variables: {
        start: moment().subtract(1, 'day'),
        end: moment()
      }
    })
    loadLastWeekBlockTransactions({
      variables: {
        start: moment().subtract(1, 'week'),
        end: moment()
      }
    })
  }, [
    loadLastHourBlockTransactions,
    loadLastDayBlockTransactions,
    loadLastWeekBlockTransactions
  ])

  return (
    <Grid item xs={12}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography component="p" variant="h6">
                {t('currentProducer')}
              </Typography>
              <Typography component="p" variant="h6">
                {info.head_block_producer}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography component="p" variant="h6">
                {t('headBlock')}
              </Typography>
              <Typography component="p" variant="h6">
                {formatWithThousandSeparator(info.head_block_num)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography component="p" variant="h6">
                {t('lastBlock')}
              </Typography>
              <Typography component="p" variant="h6">
                {formatWithThousandSeparator(info.last_irreversible_block_num)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography component="p" variant="h6">
                {t('transactionsHistory')}
              </Typography>
              <dl>
                <dt>
                  <Typography component="p" variant="subtitle1">
                    {t('lastHour')}:
                  </Typography>
                </dt>
                <dd>
                  <Typography component="p" variant="subtitle2">
                    {formatWithThousandSeparator(
                      lastHourBlockTransactions?.data?.block?.aggregate?.sum
                        ?.transactions_length || 0
                    )}
                  </Typography>
                </dd>
                <dt>
                  <Typography component="p" variant="subtitle1">
                    {t('lastDay')}:
                  </Typography>
                </dt>
                <dd>
                  <Typography component="p" variant="subtitle2">
                    {formatWithThousandSeparator(
                      lastDayBlockTransactions?.data?.block?.aggregate?.sum
                        ?.transactions_length || 0
                    )}
                  </Typography>
                </dd>
                <dt>
                  <Typography component="p" variant="subtitle1">
                    {t('lastWeek')}:
                  </Typography>
                </dt>
                <dd>
                  <Typography component="p" variant="subtitle2">
                    {formatWithThousandSeparator(
                      lastWeekBlockTransactions?.data?.block?.aggregate?.sum
                        ?.transactions_length || 0
                    )}
                  </Typography>
                </dd>
              </dl>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      {loading && <LinearProgress />}
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography component="p" variant="h6">
                {t('bpSchedule')}
              </Typography>
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
                  <Typography component="p" variant="h6">
                    {t('transPerSecond')}
                  </Typography>
                  <TransactionsChart data={tps} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography component="p" variant="h6">
                    {t('transPerBlock')}
                  </Typography>
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

Home.propTypes = {}

export default Home
