/* eslint camelcase: 0 */
import React, { lazy, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import PropTypes from 'prop-types'

import eosApi from '../../utils/eosapi'
import { formatWithThousandSeparator } from '../../utils'
import { PRODUCERS_QUERY, PRODUCERS_SUMMARY_QUERY } from '../../gql'
import { useSharedState } from '../../context/state.context'
import { eosConfig, generalConfig } from '../../config'

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

const BlockProducerInfo = ({ t, classes }) => {
  const { data: { loading, producers } = {} } = useQuery(PRODUCERS_QUERY)
  const { data: producersSummary, loading: producersLoading } = useQuery(
    PRODUCERS_SUMMARY_QUERY,
  )
  const [{ schedule: scheduleInfo, info, tps }] = useSharedState()
  const [total, setTotal] = useState(0)
  const [schedule, setSchedule] = useState({ producers: [] })
  const [globalConfig, setGlobalConfig] = useState()

  useEffect(() => {
    const getTable = async () => {
      try {
        const { rows } = await eosApi.getTableRows({
          code: 'eosio',
          scope: 'eosio',
          table: 'global',
          json: true,
          lower_bound: null,
        })

        setGlobalConfig({
          maxBlockCPU: rows[0]?.max_block_cpu_usage,
          maxBlockNET: rows[0]?.max_block_net_usage,
        })
      } catch (error) {}
    }

    getTable()
  }, [])

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
        <div className={classes.cardHeader}>
          <Card className={classes.cardShadow}>
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
        </div>
        <div className={classes.cardHeader}>
          <Card className={classes.cardShadow}>
            <CardContent className={classes.cards}>
              <Typography>{t('scheduleVersion')}</Typography>
              <Typography component="p" variant="h6">
                {schedule?.version}
              </Typography>
            </CardContent>
          </Card>
        </div>
        <div className={classes.cardHeader}>
          <Card className={classes.cardShadow}>
            <CardContent className={classes.cards}>
              <Typography>{t('headBlock')}</Typography>
              <Typography component="p" variant="h6">
                {formatWithThousandSeparator(info.head_block_num)}
              </Typography>
            </CardContent>
          </Card>
        </div>
        <div className={classes.cardHeader}>
          <Card className={classes.cardShadow}>
            <CardContent className={classes.cards}>
              <Typography>{t('lastBlock')}</Typography>
              <Typography component="p" variant="h6">
                {formatWithThousandSeparator(info.last_irreversible_block_num)}
              </Typography>
            </CardContent>
          </Card>
        </div>
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
          <TransactionInfo
            t={t}
            classes={classes}
            historyEnabled={generalConfig.historyEnabled}
          />
        </div>
      </div>
      {loading && <LinearProgress />}
      <div className={classes.wrapper}>
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
        {globalConfig && (
          <div className={classes.cardGrow}>
            <Card className={classes.cardShadow}>
              <CardContent className={classes.cards}>
                <Typography>{t('cpuUsage')}</Typography>
                <Typography
                  component="p"
                  variant="h6"
                  className={classes.lowercase}
                >
                  {`${formatWithThousandSeparator(
                    (tps[0]?.cpu / globalConfig.maxBlockCPU) * 100 || 0,
                    2,
                  )} %`}
                </Typography>
              </CardContent>
            </Card>
          </div>
        )}
        {globalConfig && (
          <div className={classes.cardGrow}>
            <Card className={classes.cardShadow}>
              <CardContent className={classes.cards}>
                <Typography>{t('netUsage')}</Typography>
                <Typography
                  component="p"
                  variant="h6"
                  className={classes.lowercase}
                >
                  {`${formatWithThousandSeparator(
                    (tps[0]?.net / globalConfig.maxBlockNET) * 100 || 0,
                    2,
                  )} %`}
                </Typography>
              </CardContent>
            </Card>
          </div>
        )}
        <div className={classes.cardGrow}>
          <Card className={classes.cardShadow}>
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
        </div>
        <div className={classes.cardGrow}>
          <Card className={classes.cardShadow}>
            <CardContent className={classes.cards}>
              <Typography>{t('netLimitPerBlock')}</Typography>
              <Typography component="p" variant="h6">
                {`${formatWithThousandSeparator(
                  info.block_net_limit / 1024,
                  0,
                )} KB`}
              </Typography>
            </CardContent>
          </Card>
        </div>
        <div className={classes.cardGrow}>
          <Card className={classes.cardShadow}>
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
        </div>
        <div className={classes.cardGrow}>
          <Card className={classes.cardShadow}>
            <CardContent className={classes.cards}>
              <Typography>{t('chainNetLimit')}</Typography>
              <Typography component="p" variant="h6">
                {`${formatWithThousandSeparator(
                  info.virtual_block_net_limit / 1024,
                  0,
                )} KB`}
              </Typography>
            </CardContent>
          </Card>
        </div>
        <div className={classes.cardGrow}>
          <Card className={classes.cardShadow}>
            <CardContent className={classes.cards}>
              <Typography>{t('timeToFinality')}</Typography>
              <Typography
                component="p"
                variant="h6"
                className={classes.lowercase}
              >
                {schedule.producers
                  ? `${
                      (Math.ceil((schedule.producers.length / 3) * 2) + 1) * 6
                    } s`
                  : '0 s'}
              </Typography>
            </CardContent>
          </Card>
        </div>
      </div>
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
