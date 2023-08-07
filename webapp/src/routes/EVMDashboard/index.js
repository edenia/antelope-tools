import React from 'react'
import { useTheme } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@mui/styles'

import SimpleDataCard from '../../components/SimpleDataCard'
import { eosConfig, evmConfig } from 'config'

import styles from './styles'
import useEVMState from './useEVMstate'
import ChartHistory from './ChartHistory'

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
    },
    { handleSelect },
  ] = useEVMState(theme, t)

  return (
    <>
      <div className={`${classes.container} ${classes.chartsContainer}`}>
        <div className={classes.column}>
          <ChartHistory
            ariaLabel="Transactions chart select"
            title={t('transactions')}
            yAxisText={t('transactions')}
            data={transactionsHistoryData}
            options={options}
            value={selected['txs']}
            onSelect={(option) => handleSelect('txs', option)}
          />
        </div>
        <div className={classes.column}>
          <ChartHistory
            ariaLabel="TLOS chart select"
            yAxisText={eosConfig.tokenSymbol}
            title={`${eosConfig.tokenSymbol} ${t('incoming')} / ${t(
              'outgoing',
            )}`}
            shared
            data={tokenHistoryData}
            options={options}
            value={selected['token']}
            onSelect={(option) => handleSelect('token', option)}
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
          value={EVMStats?.daily_transaction_count || 0}
          loading={loading}
        />
        <SimpleDataCard
          title={t('totalIncoming').replace('(TOKEN)', eosConfig.tokenSymbol)}
          value={EVMStats?.incoming_tlos_count || 0}
          loading={loading}
        />
        <SimpleDataCard
          title={t('totalOutgoing').replace('(TOKEN)', eosConfig.tokenSymbol)}
          value={EVMStats?.outgoing_tlos_count || 0}
          loading={loading}
        />
        <SimpleDataCard
          lowercase
          title={t('avgBlockTime')}
          value={evmConfig.avgBlockTime || 'N/A'}
          loading={loading}
        />
        <SimpleDataCard
          title={t('totalWallets')}
          value={EVMStats?.wallets_created_count || 'N/A'}
          loading={loading}
        />
        <SimpleDataCard
          title={t('gasPrice')}
          value={evmConfig.gasPrice || 'N/A'}
          loading={loading}
        />
        <SimpleDataCard
          title={t('avgGasUsage')}
          value={EVMStats?.avg_gas_used || 0}
          loading={loading}
        />
      </div>
    </>
  )
}

export default EVMDashboard
