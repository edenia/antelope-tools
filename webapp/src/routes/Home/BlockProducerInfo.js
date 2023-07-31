/* eslint camelcase: 0 */
import React, { lazy, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import PropTypes from 'prop-types'

import { formatWithThousandSeparator } from '../../utils'
import { PRODUCERS_QUERY, PRODUCERS_SUMMARY_QUERY } from '../../gql'
import { useSharedState } from '../../context/state.context'
import { eosConfig } from '../../config'

const Card = lazy(() => import('@mui/material/Card'))
const CardContent = lazy(() => import('@mui/material/CardContent'))
const Typography = lazy(() => import('@mui/material/Typography'))
const LinearProgress = lazy(() => import('@mui/material/LinearProgress'))
const ProducersChart = lazy(() => import('../../components/ProducersChart'))
const TransactionsHistory = lazy(() =>
  import('../../components/TransactionsHistory'),
)
const TransactionInfo = lazy(() => import('./TransactionInfo'))
const NodesSummary = lazy(() => import('../../components/NodesSummary'))
const ProducersSummary = lazy(() => import('../../components/ProducersSummary'))
const SimpleDataCard = lazy(() => import('../../components/SimpleDataCard'))

const BlockProducerInfo = ({ t, classes }) => {
  const { data: { loading, producers } = {} } = useQuery(PRODUCERS_QUERY)
  const { data: producersSummary, loading: producersLoading } = useQuery(
    PRODUCERS_SUMMARY_QUERY,
  )
  const [{ schedule: scheduleInfo, info }] = useSharedState()
  const [total, setTotal] = useState(0)
  const [schedule, setSchedule] = useState({ producers: [] })

  useEffect(() => {
    const newProducers = scheduleInfo.producers.map((item) => {
      const data =
        (producers || []).find((producer) => {
          let result = producer.owner === item.producer_name

          if (!result) {
            result = (producer.bp_json?.nodes || []).find(
              (node) => node.name === item.producer_name,
            )
          }

          return result
        }) || {}

      return {
        logo: data?.bp_json?.org?.branding?.logo_256,
        url: data?.url,
        owner: item.producer_name || data.owner,
        rewards: data.total_rewards || 0,
        total_votes_percent: data.total_votes_percent * 100 || 0,
        value: 20,
      }
    })
    setSchedule({
      ...scheduleInfo,
      producers: newProducers,
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
    <>
      <div className={classes.divMargin}>
        <SimpleDataCard
          header
          lowercase
          title={t('currentProducer')}
          value={info.head_block_producer}
        />
        <SimpleDataCard
          header
          title={t('scheduleVersion')}
          value={schedule?.version}
        />
        <SimpleDataCard
          header
          title={t('headBlock')}
          value={formatWithThousandSeparator(info.head_block_num)}
        />
        <SimpleDataCard
          header
          title={t('lastBlock')}
          value={formatWithThousandSeparator(info.last_irreversible_block_num)}
        />
      </div>
      <div className={classes.graphicBox}>
        <div className={classes.divTrans}>
          <Card className={classes.cardShadow}>
            <CardContent>
              <Typography component="p" variant="h6">
                {t('bpSchedule')}
              </Typography>
              <ProducersChart info={info} producers={schedule.producers} />
            </CardContent>
          </Card>
        </div>
        <div className={classes.divTrans}>
          <TransactionInfo t={t} />
        </div>
      </div>
      {loading && <LinearProgress />}
      <>
        <TransactionsHistory
          t={t}
          classes={classes}
          nodesChildren={
            <>
              <ProducersSummary
                t={t}
                data={producersSummary}
                loading={producersLoading}
                total={total}
              />
              <NodesSummary t={t} />
              <SimpleDataCard
                lowercase
                title={t('timeToFinality')}
                value={
                  schedule.producers
                    ? `${
                        (Math.ceil((schedule.producers.length / 3) * 2) + 1) * 6
                      } s`
                    : '0 s'
                }
              />
            </>
          }
        />
      </>
    </>
  )
}

BlockProducerInfo.propTypes = {
  t: PropTypes.any,
  classes: PropTypes.object,
}

BlockProducerInfo.defaultProps = {
  classes: {},
}

export default BlockProducerInfo
