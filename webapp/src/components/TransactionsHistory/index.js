/* eslint camelcase: 0 */
import React, { memo, useEffect, useState } from 'react'
import { makeStyles } from '@mui/styles'
import PropTypes from 'prop-types'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'
import LaunchIcon from '@mui/icons-material/Launch'
import { useSubscription } from '@apollo/client'

import eosApi from '../../utils/eosapi'
import { BLOCK_TRANSACTIONS_HISTORY } from '../../gql'
import { useSharedState } from '../../context/state.context'
import { formatWithThousandSeparator, getBlockNumUrl } from '../../utils'
import { generalConfig } from '../../config'
import SimpleDataCard from '../SimpleDataCard'

import styles from './styles'

const useStyles = makeStyles(styles)

const BodyGraphValue = ({ loading, value, classes, href }) => {
  if (loading) return <LinearProgress />

  return (
    <Typography component="p" variant="h6">
      {value}
      {href && (
        <a href={href} target="_blank" rel="noopener noreferrer">
          <LaunchIcon className={classes.svgLink} color="primary" />
        </a>
      )}
    </Typography>
  )
}

BodyGraphValue.propTypes = {
  loading: PropTypes.bool,
  value: PropTypes.any,
  classes: PropTypes.object,
  href: PropTypes.string,
}

BodyGraphValue.defaultProps = {
  value: 0,
  loading: false,
  classes: {},
}

const TransactionsHistory = ({ t, nodesChildren }) => {
  const classes = useStyles()
  const [{ info, tps }] = useSharedState()
  const { data, loading } = useSubscription(BLOCK_TRANSACTIONS_HISTORY)
  const [
    blockWithHighestTransactionsCount,
    setBlockWithHighestTransactionsCount,
  ] = useState({})
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
    if (!data?.stats?.[0]?.tps_all_time_high?.blocks?.length) {
      return
    }

    const blockWithHighestTransactionsCount =
      data.stats[0].tps_all_time_high.blocks.sort((first, second) =>
        first.transactions_count > second.transactions_count ? -1 : 1,
      )[0]
    setBlockWithHighestTransactionsCount(blockWithHighestTransactionsCount)
  }, [data])

  if (!generalConfig.historyEnabled)
    return (
      <>
        {nodesChildren && nodesChildren}
        <SimpleDataCard>
          <Typography>{`${t('uniqueLocations')}`}</Typography>
          <BodyGraphValue
            value={data?.stats?.[0]?.unique_locations?.count || 0}
            loading={loading}
          />
        </SimpleDataCard>
      </>
    )

  return (
    <div className={classes.wrapper}>
      <SimpleDataCard>
        <Typography>{t('tpsAllTimeHigh')}</Typography>
        <BodyGraphValue
          value={data?.stats[0]?.tps_all_time_high?.transactions_count}
          loading={loading}
          classes={classes}
          href={getBlockNumUrl(blockWithHighestTransactionsCount.block_num)}
        />
      </SimpleDataCard>
      <SimpleDataCard>
        <Typography>{t('networkUtilizationAllTimeHigh')}</Typography>
        <BodyGraphValue
          value={`${formatWithThousandSeparator(
            blockWithHighestTransactionsCount.cpu_usage_percent * 100 || 0,
            2,
          )}%`}
          classes={classes}
          href={getBlockNumUrl(blockWithHighestTransactionsCount.block_num)}
          loading={loading}
        />
      </SimpleDataCard>
      <SimpleDataCard>
        <Typography>{`${t('transactions')} ${t('lastHour')}`}</Typography>
        <BodyGraphValue
          value={formatWithThousandSeparator(
            data?.stats?.[0]?.transactions_in_last_hour || 0,
          )}
          loading={loading}
        />
      </SimpleDataCard>
      <SimpleDataCard>
        <Typography>{`${t('transactions')} ${t('lastDay')}`}</Typography>
        <BodyGraphValue
          value={formatWithThousandSeparator(
            data?.stats?.[0]?.transactions_in_last_day || 0,
          )}
          loading={loading}
        />
      </SimpleDataCard>
      <SimpleDataCard>
        <Typography>{`${t('transactions')} ${t('dailyAverage')}`}</Typography>
        <BodyGraphValue
          value={formatWithThousandSeparator(
            data?.stats?.[0]?.average_daily_transactions_in_last_week || 0,
            0,
          )}
          loading={loading}
        />
      </SimpleDataCard>
      <SimpleDataCard>
        <Typography>{`${t('transactions')} ${t('lastWeek')}`}</Typography>
        <BodyGraphValue
          value={formatWithThousandSeparator(
            data?.stats?.[0]?.transactions_in_last_week || 0,
          )}
          loading={loading}
        />
      </SimpleDataCard>
      {globalConfig && (
        <SimpleDataCard>
          <Typography>{t('cpuUsage')}</Typography>
          <Typography component="p" variant="h6" className={classes.lowercase}>
            {`${formatWithThousandSeparator(
              (tps[0]?.cpu / globalConfig.maxBlockCPU) * 100 || 0,
              2,
            )} %`}
          </Typography>
        </SimpleDataCard>
      )}
      {globalConfig && (
        <SimpleDataCard>
          <Typography>{t('netUsage')}</Typography>
          <Typography component="p" variant="h6" className={classes.lowercase}>
            {`${formatWithThousandSeparator(
              (tps[0]?.net / globalConfig.maxBlockNET) * 100 || 0,
              2,
            )} %`}
          </Typography>
        </SimpleDataCard>
      )}
      {nodesChildren && (
        <>
          {nodesChildren}
          <SimpleDataCard>
            <Typography>{`${t('uniqueLocations')}`}</Typography>
            <BodyGraphValue
              value={data?.stats?.[0]?.unique_locations?.count || 0}
              loading={loading}
            />
          </SimpleDataCard>
        </>
      )}
      <SimpleDataCard>
        <Typography>{t('cpuLimitPerBlock')}</Typography>
        <Typography component="p" variant="h6" className={classes.lowercase}>
          {`${(info.block_cpu_limit * 0.001).toFixed(0)} ms`}
        </Typography>
      </SimpleDataCard>
      <SimpleDataCard>
        <Typography>{t('netLimitPerBlock')}</Typography>
        <Typography component="p" variant="h6">
          {`${formatWithThousandSeparator(info.block_net_limit / 1024, 0)} KB`}
        </Typography>
      </SimpleDataCard>
      <SimpleDataCard>
        <Typography>{t('chainCpuLimit')}</Typography>
        <Typography component="p" variant="h6" className={classes.lowercase}>
          {`${(info.virtual_block_cpu_limit * 0.001).toFixed(0)} ms`}
        </Typography>
      </SimpleDataCard>
      <SimpleDataCard>
        <Typography>{t('chainNetLimit')}</Typography>
        <Typography component="p" variant="h6">
          {`${formatWithThousandSeparator(
            info.virtual_block_net_limit / 1024,
            0,
          )} KB`}
        </Typography>
      </SimpleDataCard>
    </div>
  )
}

TransactionsHistory.propTypes = {
  t: PropTypes.func,
  nodesChildren: PropTypes.node,
}

TransactionsHistory.defaultProps = {
  t: (text) => text,
}

export default memo(TransactionsHistory)
