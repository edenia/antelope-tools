import { useState, useEffect } from 'react'
import { useSubscription } from '@apollo/client'

import { EVM_STATS_SUBSCRIPTION } from '../../gql'
import eosApi from '../../utils/eosapi'

const useEVMState = () => {
  const [EVMStats, setEVMStats] = useState()
  const { data, loading } = useSubscription(EVM_STATS_SUBSCRIPTION)

  const getWalletsCreated = async () => {
    try {
      const { rows } = await eosApi.getTableRows({
        code: 'eosio.evm',
        scope: 'eosio.evm',
        table: 'account',
        reverse: true,
        limit: 1,
        json: true,
        lower_bound: null,
      })

      return rows[0]?.index + 1
    } catch (error) {}
  }

  useEffect(() => {
    if (!data) return

    const getStats = async () => {
      const amount = await getWalletsCreated()
      const stats = { wallets_created_count: amount }

      setEVMStats({ ...stats, ...data.evm_stats[0] })
    }

    getStats()
  }, [data, loading])

  return [{ EVMStats, loading }]
}

export default useEVMState
