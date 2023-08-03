import React from 'react'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'

import SimpleDataCard from '../../components/SimpleDataCard'
import { eosConfig, evmConfig } from 'config'

import styles from './styles'
import useEVMState from './useEVMstate'

const useStyles = makeStyles(styles)

const EVMDashboard = () => {
  const classes = useStyles()
  const { t } = useTranslation('evmDashboardRoute')

  const [{ EVMStats, loading }] = useEVMState()

  return (
    <>
      <div className={classes.container}>
        <SimpleDataCard
          lowercase
          title={t('avgBlockTime')}
          value={evmConfig.avgBlockTime || 'N/A'}
          loading={loading}
        />
        <SimpleDataCard
          title={t('ATH')}
          value={EVMStats?.ath_transaction_sum || 0}
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
          title={t('avgTX')}
          value={EVMStats?.daily_transaction_count || 0}
          loading={loading}
        />
        <SimpleDataCard
          title={t('avgGasUsage')}
          value={EVMStats?.avg_gas_used || 0}
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
      </div>
    </>
  )
}

export default EVMDashboard
