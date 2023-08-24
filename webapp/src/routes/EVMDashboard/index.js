import React from 'react'
import { useTheme } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@mui/styles'

import { formatWithThousandSeparator, getEVMBlockNumUrl } from '../../utils'
import { eosConfig, evmConfig } from '../../config'
import SimpleDataCard from '../../components/SimpleDataCard'
import BodyGraphValue from '../../components/SimpleDataCard/BodyGraphValue'
import TransactionsChartContainer from '../../components/TransactionsChartContainer'

import styles from './styles'
import useEVMState from './useEVMstate'

const useStyles = makeStyles(styles)

const EVMDashboard = () => {
  const classes = useStyles()
  const theme = useTheme()
  const { t } = useTranslation('evmDashboardRoute')

  const [
    {
      EVMStats,
      tokenHistoryData,
      transactionsHistoryData,
      options,
      liveOption,
      loading,
      selected,
      isPaused,
      isLive,
    },
    { handleSelect, handlePause },
  ] = useEVMState(theme, t)

  return (
    <>
      <div className={`${classes.container} ${classes.cardsContainer}`}>
        <SimpleDataCard
          title={t('lastBlock')}
          value={formatWithThousandSeparator(EVMStats?.last_block) || 0}
          loading={loading}
        />
        <SimpleDataCard
          title={t('totalTxs')}
          value={formatWithThousandSeparator(EVMStats?.total_transactions) || 0}
          loading={loading}
        />
      </div>
      <div className={`${classes.container} ${classes.chartsContainer}`}>
        <div className={classes.column}>
          <TransactionsChartContainer
            title={t('transactions')}
            ariaLabel="Transactions chart select"
            handlePause={handlePause}
            isPaused={isPaused}
            historyState={{
              options: [liveOption, ...options],
              value: selected['txs'],
              onSelect: option => handleSelect('txs', option),
              isLive: isLive,
              isHistoryEnabled: true,
            }}
            data={transactionsHistoryData}
            chartLabelFormat={{
              yAxisText: t('transactions'),
              blockTime: evmConfig.avgBlockTime,
              customFormatter: (element) => {
                const series = element?.series
                const point = element?.point

                let pointName = ''

                if (point?.name) {
                  pointName = !isLive
                    ? `${point.name}`
                    : `Block Height: ${formatWithThousandSeparator(point.name)}`
                }

                const resourcesDetail = point?.gas
                  ? `<br/>${t('gasUsed')}:<b> ${formatWithThousandSeparator(
                      point?.gas,
                      3,
                    )} %</b>`
                  : ''

                return (
                  pointName +
                  '<br />' +
                  `${series?.name}: <b>${point?.y}</b>` +
                  resourcesDetail
                )
              },
            }}
          />
        </div>
        <div className={classes.column}>
          <TransactionsChartContainer
            ariaLabel="TLOS chart select"
            title={`${eosConfig.tokenSymbol} ${t('incoming')} / ${t(
              'outgoing',
            )}`}
            historyState={{
              value: selected['token'],
              options: options,
              onSelect: option => handleSelect('token', option),
              isHistoryEnabled: true,
            }}
            data={tokenHistoryData}
            chartLabelFormat={{
              yAxisText: eosConfig.tokenSymbol,
              shared: true,
              customFormatter: (element) => {
                const points = element?.points
                const pointName = points[0]?.point?.name || ''

                return (
                  pointName +
                  points.reduce((tooltipText, point) => {
                    const series = point?.series

                    return (
                      tooltipText +
                      '<br>' +
                      `${series?.name}: <b>${formatWithThousandSeparator(
                        point?.y,
                      )}</b>`
                    )
                  }, '')
                )
              },
            }}
          />
        </div>
      </div>
      <div className={`${classes.container} ${classes.cardsContainer}`}>
        <SimpleDataCard
          title={t('ATH')}
          value={EVMStats?.tps_all_time_high?.transactions_count || 0}
          loading={loading}
        >
          <BodyGraphValue
            links={EVMStats?.tps_all_time_high?.blocks.map(block =>
              getEVMBlockNumUrl(block),
            )}
          />
        </SimpleDataCard>
        <SimpleDataCard
          title={`${t('transactions')} ${t('lastDay')}`}
          value={
            formatWithThousandSeparator(EVMStats?.daily_transaction_count) || 0
          }
          loading={loading}
        />
        <SimpleDataCard
          title={t('totalIncoming').replace('(TOKEN)', eosConfig.tokenSymbol)}
          value={
            formatWithThousandSeparator(EVMStats?.total_incoming_token) || 0
          }
          loading={loading}
        />
        <SimpleDataCard
          title={t('totalOutgoing').replace('(TOKEN)', eosConfig.tokenSymbol)}
          value={
            formatWithThousandSeparator(EVMStats?.total_outgoing_token) || 0
          }
          loading={loading}
        />
        <SimpleDataCard
          lowercase
          title={t('avgBlockTime')}
          value={evmConfig.avgBlockTime ? evmConfig.avgBlockTime + ' s' : 'N/A'}
          loading={loading}
        />
        <SimpleDataCard
          title={t('totalWallets')}
          value={
            formatWithThousandSeparator(EVMStats?.wallets_created_count) ||
            'N/A'
          }
          loading={loading}
        />
        <SimpleDataCard
          title={t('gasPrice')}
          value={
            EVMStats?.gas_price
              ? formatWithThousandSeparator(EVMStats?.gas_price, 1) + ' Gwei'
              : 'N/A'
          }
          loading={loading}
        />
        <SimpleDataCard
          title={t('avgGasUsage')}
          value={formatWithThousandSeparator(EVMStats?.avg_gas_used) || 0}
          loading={loading}
        />
      </div>
    </>
  )
}

export default EVMDashboard
