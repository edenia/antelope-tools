/* eslint camelcase: 0 */
import React, { memo } from 'react'
import { makeStyles } from '@mui/styles'
import PropTypes from 'prop-types'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'
import LaunchIcon from '@mui/icons-material/Launch'
import { useSubscription } from '@apollo/client'

import { BLOCK_TRANSACTIONS_HISTORY } from '../../gql'
import { useSharedState } from '../../context/state.context'
import { formatWithThousandSeparator, getBlockNumUrl } from '../../utils'
import { generalConfig } from '../../config'
import SimpleDataCard from '../SimpleDataCard'

import styles from './styles'

const useStyles = makeStyles(styles)

const BodyGraphValue = ({ loading, classes, links }) => {
  if (loading) return <LinearProgress />

  return (
    <>
      {links &&
        links.map((href, index) => (
          <a
            key={`link-body-graph-${index}`}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
          >
            <LaunchIcon className={classes.svgLink} color="primary" />
          </a>
        ))}
    </>
  )
}

BodyGraphValue.propTypes = {
  loading: PropTypes.bool,
  classes: PropTypes.object,
  href: PropTypes.string,
}

BodyGraphValue.defaultProps = {
  loading: false,
  classes: {},
}

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
            value={data?.stats[0]?.tps_all_time_high?.transactions_count}
            loading={loading}
          >
            <BodyGraphValue
              classes={classes}
              links={data?.stats?.[0]?.tps_all_time_high?.blocks.map((block) =>
                getBlockNumUrl(block),
              )}
            />
          </SimpleDataCard>
          <SimpleDataCard
            title={t('cpuUtilizationAllTimeHigh')}
            value={`${data?.stats[0]?.tps_all_time_high?.cpu_usage || 0} %`}
            loading={loading}
          >
            <BodyGraphValue
              classes={classes}
              links={data?.stats?.[0]?.tps_all_time_high?.blocks.map((block) =>
                getBlockNumUrl(block),
              )}
            />
          </SimpleDataCard>
          <SimpleDataCard
            title={t('networkUtilizationAllTimeHigh')}
            value={`${data?.stats[0]?.tps_all_time_high?.net_usage || 0} %`}
            loading={loading}
          >
            <BodyGraphValue
              classes={classes}
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
            title={`${t('cpuUtilization')} ${t('lastHour')}`}
            value={`${data?.stats?.[0]?.average_cpu_usage_in_hour || 0} %`}
            loading={loading}
          />
          <SimpleDataCard
            title={`${t('cpuUtilization')} ${t('lastDay')}`}
            value={`${data?.stats?.[0]?.average_cpu_usage_in_last_day || 0} %`}
            loading={loading}
          />
          <SimpleDataCard
            title={`${t('cpuUtilization')} ${t('lastWeek')}`}
            value={`${data?.stats?.[0]?.average_cpu_usage_in_week || 0} %`}
            loading={loading}
          />
          <SimpleDataCard
            title={`${t('netUtilization')} ${t('lastHour')}`}
            value={`${data?.stats?.[0]?.average_net_usage_in_hour || 0} %`}
            loading={loading}
          />
          <SimpleDataCard
            title={`${t('netUtilization')} ${t('lastDay')}`}
            value={`${data?.stats?.[0]?.average_net_usage_in_last_day || 0} %`}
            loading={loading}
          />
          <SimpleDataCard
            title={`${t('netUtilization')} ${t('lastWeek')}`}
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
            value={data?.stats?.[0]?.unique_locations?.count || 0}
            loading={loading}
          />
        </>
      )}
      <SimpleDataCard
        lowercase
        title={t('cpuUsage')}
        value={`${formatWithThousandSeparator(tps[0]?.cpu, 2)} %`}
      />
      <SimpleDataCard
        lowercase
        title={t('netUsage')}
        value={`${formatWithThousandSeparator(tps[0]?.net, 3)} %`}
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
