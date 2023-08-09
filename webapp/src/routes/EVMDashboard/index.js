import React from 'react'
import { useTheme } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@mui/styles'

import { formatWithThousandSeparator } from '../../utils'
import { eosConfig, evmConfig } from '../../config'
import SimpleDataCard from '../../components/SimpleDataCard'
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
      loading,
      selected,
      isPaused,
      isLive
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
          value={formatWithThousandSeparator(EVMStats?.transactions_count) || 0}
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
              options: ['Live (30s)', ...options],
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

                const pointName = point?.name ? `${point.name}<br />` : ''
                const resourcesDetail = point?.gas
                  ? `<br/>${t('gasUsed')}:<b> ${formatWithThousandSeparator(
                      point?.gas,
                      3,
                    )} %</b>`
                  : ''

                return (
                  pointName +
                  `${series?.name}: <b>${point?.y}</b>` +
                  resourcesDetail
                )
              },
            }}
          />
        </div>
        <div className={classes.column}>
          <TransactionsChartContainer
            ariaLabel= "TLOS chart select"
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
              shared: true
            }}
          />
        </div>
      </div>
      <div className={`${classes.container} ${classes.cardsContainer}`}>
        <SimpleDataCard
          title={t('ATH')}
          value={EVMStats?.ath_transaction_sum || 0}
          loading={loading}
        />
        <SimpleDataCard
          title={t('avgTX')}
          value={
            formatWithThousandSeparator(EVMStats?.daily_transaction_count) || 0
          }
          loading={loading}
        />
        <SimpleDataCard
          title={t('totalIncoming').replace('(TOKEN)', eosConfig.tokenSymbol)}
          value={
            formatWithThousandSeparator(EVMStats?.incoming_tlos_count) || 0
          }
          loading={loading}
        />
        <SimpleDataCard
          title={t('totalOutgoing').replace('(TOKEN)', eosConfig.tokenSymbol)}
          value={
            formatWithThousandSeparator(EVMStats?.outgoing_tlos_count) || 0
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
