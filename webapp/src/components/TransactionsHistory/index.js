/* eslint camelcase: 0 */
import React, { memo } from 'react'
import { makeStyles } from '@mui/styles'
import PropTypes from 'prop-types'
import { useSubscription } from '@apollo/client'

import { BLOCK_TRANSACTIONS_HISTORY } from '../../gql'
import { useSharedState } from '../../context/state.context'
import { formatWithThousandSeparator, getBlockNumUrl } from '../../utils'
import { generalConfig } from '../../config'
import SimpleDataCard from '../SimpleDataCard'
import BodyGraphValue from '../SimpleDataCard/BodyGraphValue'

import styles from './styles'

const useStyles = makeStyles(styles)

const TransactionsHistory = ({ t, nodesChildren }) => {
  const classes = useStyles()
  const [{ info, tps }] = useSharedState()
  const { data, loading } = useSubscription(BLOCK_TRANSACTIONS_HISTORY)

  return (
    <div className={classes.wrapper}>
      {generalConfig.historyEnabled && (
        <>
          <SimpleDataCard
            title={t('tpsAllTimeHigh')}
            helperText={t('tooltip.tpsAllTimeHigh')}
            value={data?.stats[0]?.tps_all_time_high?.transactions_count}
            loading={loading}
          >
            <BodyGraphValue
              links={data?.stats?.[0]?.tps_all_time_high?.blocks.map((block) =>
                getBlockNumUrl(block),
              )}
            />
          </SimpleDataCard>
          <SimpleDataCard
            title={t('cpuUtilizationAllTimeHigh')}
            helperText={t('tooltip.cpuUtilizationAllTimeHigh')}
            value={`${data?.stats[0]?.tps_all_time_high?.cpu_usage || 0} %`}
            loading={loading}
          >
            <BodyGraphValue
              links={data?.stats?.[0]?.tps_all_time_high?.blocks.map((block) =>
                getBlockNumUrl(block),
              )}
            />
          </SimpleDataCard>
          <SimpleDataCard
            title={t('networkUtilizationAllTimeHigh')}
            helperText={t('tooltip.networkUtilizationAllTimeHigh')}
            value={`${data?.stats[0]?.tps_all_time_high?.net_usage || 0} %`}
            loading={loading}
          >
            <BodyGraphValue
              links={data?.stats?.[0]?.tps_all_time_high?.blocks.map((block) =>
                getBlockNumUrl(block),
              )}
            />
          </SimpleDataCard>
          <SimpleDataCard
            title={`${t('transactions')} ${t('lastHour')}`}
            value={formatWithThousandSeparator(
              data?.stats?.[0]?.transactions_in_last_hour || 0,
            )}
            loading={loading}
          />
          <SimpleDataCard
            title={`${t('transactions')} ${t('lastDay')}`}
            value={formatWithThousandSeparator(
              data?.stats?.[0]?.transactions_in_last_day || 0,
            )}
            loading={loading}
          />
          <SimpleDataCard
            title={`${t('transactions')} ${t('dailyAverage')}`}
            value={formatWithThousandSeparator(
              data?.stats?.[0]?.average_daily_transactions_in_last_week || 0,
              0,
            )}
            loading={loading}
          />
          <SimpleDataCard
            title={`${t('transactions')} ${t('lastWeek')}`}
            value={formatWithThousandSeparator(
              data?.stats?.[0]?.transactions_in_last_week || 0,
            )}
            loading={loading}
          />
          <SimpleDataCard
            title={`${t('cpuUsage')} ${t('lastHour')}`}
            value={`${data?.stats?.[0]?.average_cpu_usage_in_hour || 0} %`}
            loading={loading}
          />
          <SimpleDataCard
            title={`${t('cpuUsage')} ${t('lastDay')}`}
            value={`${data?.stats?.[0]?.average_cpu_usage_in_last_day || 0} %`}
            loading={loading}
          />
          <SimpleDataCard
            title={`${t('cpuUsage')} ${t('lastWeek')}`}
            value={`${data?.stats?.[0]?.average_cpu_usage_in_week || 0} %`}
            loading={loading}
          />
          <SimpleDataCard
            title={`${t('netUsage')} ${t('lastHour')}`}
            value={`${data?.stats?.[0]?.average_net_usage_in_hour || 0} %`}
            loading={loading}
          />
          <SimpleDataCard
            title={`${t('netUsage')} ${t('lastDay')}`}
            value={`${data?.stats?.[0]?.average_net_usage_in_last_day || 0} %`}
            loading={loading}
          />
          <SimpleDataCard
            title={`${t('netUsage')} ${t('lastWeek')}`}
            value={`${data?.stats?.[0]?.average_net_usage_in_week || 0} %`}
            loading={loading}
          />
        </>
      )}
      {nodesChildren && (
        <>
          {nodesChildren}
          <SimpleDataCard
            title={`${t('uniqueLocations')}`}
            helperText={`${t('tooltip.uniqueLocations')}`}
            value={data?.stats?.[0]?.unique_locations?.count || 0}
            loading={loading}
          />
        </>
      )}
      <SimpleDataCard
        lowercase
        title={t('cpuUsage')}
        helperText={t('tooltip.cpuUsage')}
        value={`${formatWithThousandSeparator(tps[0]?.cpu || 0, 2)} %`}
      />
      <SimpleDataCard
        lowercase
        title={t('netUsage')}
        helperText={t('tooltip.netUsage')}
        value={`${formatWithThousandSeparator(tps[0]?.net || 0, 3)} %`}
      />
      <SimpleDataCard
        lowercase
        title={t('cpuLimitPerBlock')}
        value={`${(info.block_cpu_limit * 0.001).toFixed(0)} ms`}
      />
      <SimpleDataCard
        title={t('netLimitPerBlock')}
        value={`${formatWithThousandSeparator(
          info.block_net_limit / 1024,
          0,
        )} KB`}
      />
      <SimpleDataCard
        lowercase
        title={t('chainCpuLimit')}
        value={`${(info.virtual_block_cpu_limit * 0.001).toFixed(0)} ms`}
      />
      <SimpleDataCard
        title={t('chainNetLimit')}
        value={`${formatWithThousandSeparator(
          info.virtual_block_net_limit / 1024,
          0,
        )} KB`}
      />
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
