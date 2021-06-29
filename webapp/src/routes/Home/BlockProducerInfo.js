/* eslint camelcase: 0 */
import React, { lazy, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useQuery } from '@apollo/react-hooks'
import PropTypes from 'prop-types'

import { formatWithThousandSeparator } from '../../utils'
import { NODES_QUERY, PRODUCERS_SUMMARY_QUERY } from '../../gql'
import { eosConfig } from '../../config'

const Card = lazy(() => import('@material-ui/core/Card'))
const CardContent = lazy(() => import('@material-ui/core/CardContent'))
const Grid = lazy(() => import('@material-ui/core/Grid'))
const Typography = lazy(() => import('@material-ui/core/Typography'))
const LinearProgress = lazy(() => import('@material-ui/core/LinearProgress'))
const ProducersChart = lazy(() => import('../../components/ProducersChart'))
const TransactionsHistory = lazy(() =>
  import('../../components/TransactionsHistory')
)
const TransactionInfo = lazy(() => import('./TransactionInfo'))
const NodesSummary = lazy(() => import('../../components/NodesSummary'))
const ProducersSummary = lazy(() => import('../../components/ProducersSummary'))

const BlockProducerInfo = ({ t, classes }) => {
  const { data: { loading, producers } = {} } = useQuery(NODES_QUERY)
  const { data: producersSummary, loading: producersLoading } = useQuery(
    PRODUCERS_SUMMARY_QUERY
  )

  const scheduleInfo = useSelector((state) => state.eos.schedule)
  const info = useSelector((state) => state.eos.info)
  const [total, setTotal] = useState(0)
  const [schedule, setSchedule] = useState({ producers: [] })

  useEffect(() => {
    const newProducers = scheduleInfo.producers.map((item) => {
      const data =
        (producers || []).find((producer) => {
          let result = producer.owner === item.producer_name

          if (!result) {
            result = producer.bp_json?.nodes.find(
              (node) => node.name === item.producer_name
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
    if (!producersSummary?.producers_summary?.length) return

    let total = 0

    for (
      let index = 0;
      index < producersSummary?.producers_summary?.length;
      index++
    ) {
      const producer = producersSummary?.producers_summary[index]
      total += producer.entities_count

      if (eosConfig.networkName !== 'lacchain') {
        continue
      }
    }

    setTotal(total)
  }, [producersSummary])

  return (
    <Grid container spacing={4}>
      <Grid container item xs={12} spacing={4}>
        <Grid item xs={12} sm={4} lg={3}>
          <Card>
            <CardContent className={classes.cards}>
              <Typography>{t('currentProducer')}</Typography>
              <Typography
                component="p"
                variant="h6"
                className={classes.lowercase}
              >
                {info.head_block_producer}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4} lg={3}>
          <Card>
            <CardContent className={classes.cards}>
              <Typography>{t('scheduleVersion')}</Typography>
              <Typography component="p" variant="h6">
                {schedule?.version}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4} lg={3}>
          <Card>
            <CardContent className={classes.cards}>
              <Typography>{t('headBlock')}</Typography>
              <Typography component="p" variant="h6">
                {formatWithThousandSeparator(info.head_block_num)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4} lg={3}>
          <Card>
            <CardContent className={classes.cards}>
              <Typography>{t('lastBlock')}</Typography>
              <Typography component="p" variant="h6">
                {formatWithThousandSeparator(info.last_irreversible_block_num)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid container item xs={12} className={classes.graphicBox} spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography component="p" variant="h6">
                {t('bpSchedule')}
              </Typography>
              <ProducersChart info={info} producers={schedule.producers} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <TransactionInfo t={t} classes={classes} />
        </Grid>
      </Grid>
      {loading && <LinearProgress />}
      <Grid container item xs={12} spacing={4}>
        <TransactionsHistory
          t={t}
          classes={classes}
          nodesChildren={
            <>
              <ProducersSummary
                t={t}
                classes={classes}
                data={producersSummary}
                loading={producersLoading}
                total={total}
              />
              <NodesSummary t={t} classes={classes} />
            </>
          }
        />

        <Grid item xs={12} sm={4} lg={3}>
          <Card>
            <CardContent className={classes.cards}>
              <Typography>{t('cpuLimitPerBlock')}</Typography>
              <Typography
                component="p"
                variant="h6"
                className={classes.lowercase}
              >
                {`${(info.block_cpu_limit * 0.001).toFixed(0)} ms`}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4} lg={3}>
          <Card>
            <CardContent className={classes.cards}>
              <Typography>{t('netLimitPerBlock')}</Typography>
              <Typography component="p" variant="h6">
                {`${formatWithThousandSeparator(
                  info.block_net_limit / 1024,
                  0
                )} KB`}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4} lg={3}>
          <Card>
            <CardContent className={classes.cards}>
              <Typography>{t('chainCpuLimit')}</Typography>
              <Typography
                component="p"
                variant="h6"
                className={classes.lowercase}
              >
                {`${(info.virtual_block_cpu_limit * 0.001).toFixed(0)} ms`}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4} lg={3}>
          <Card>
            <CardContent className={classes.cards}>
              <Typography>{t('chainNetLimit')}</Typography>
              <Typography component="p" variant="h6">
                {`${formatWithThousandSeparator(
                  info.virtual_block_net_limit / 1024,
                  0
                )} KB`}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4} lg={3}>
          <Card>
            <CardContent className={classes.cards}>
              <Typography>{t('timeToFinality')}</Typography>
              <Typography component="p" variant="h6">
                {`${(total / 3 + 1) * 6} s`}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  )
}

BlockProducerInfo.propTypes = {
  t: PropTypes.any,
  classes: PropTypes.object
}

BlockProducerInfo.defaultProps = {
  classes: {}
}

export default BlockProducerInfo
