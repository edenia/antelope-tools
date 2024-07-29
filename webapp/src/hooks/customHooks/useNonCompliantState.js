import { useState, useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'

import { PRODUCERS_QUERY, SETTING_QUERY } from '../../gql'

import { eosConfig } from 'config'

const useNonCompliantState = () => {
  const [loadProducers, { loading = true, data: { producers } = {} }] =
    useLazyQuery(PRODUCERS_QUERY)
  const [loadSettings, { data: { setting } = {} }] = useLazyQuery(SETTING_QUERY)
  const [items, setItems] = useState([])
  const [stats, setStats] = useState()
  const isFIO = eosConfig.networkName.replace('-testnet','') === 'fio'
  const minimumRewards = isFIO ? 1 : 100

  useEffect(() => {
    loadSettings({})
    loadProducers({
      variables: {
        where: { total_rewards: { _gte: minimumRewards } },
        offset: 0,
        limit: 150,
      },
    })
  }, [loadSettings, loadProducers, minimumRewards])

  useEffect(() => {
    if (!producers) return

    const { nonCompliantBPs, totalDailyRewards, nonCompliantRewards } =
      producers.reduce(
        (stats, producer) => {
          if (!Object.keys(producer.bp_json).length) {
            stats.nonCompliantBPs.push({
              ...producer,
              healthCheck: {
                updated_at: producer.updated_at,
                bp_json_url: producer.bp_json_url,
                ...producer.health_status.find(
                  (status) => status.name === 'website',
                ),
              },
            })
            stats.nonCompliantRewards += producer.total_rewards
          }

          stats.totalDailyRewards += producer.total_rewards

          return stats
        },
        { nonCompliantBPs: [], totalDailyRewards: 0, nonCompliantRewards: 0 },
      )

    const percentageRewards = (nonCompliantRewards / totalDailyRewards) * 100

    setStats({
      percentageRewards,
      dailyRewards: nonCompliantRewards,
      yearlyRewards: nonCompliantRewards * 365,
      tokenPrice: setting?.token_price,
      quantity: nonCompliantBPs.length,
    })
    setItems(nonCompliantBPs)
  }, [producers, setting])

  return [
    {
      items,
      stats,
      loading,
    },
  ]
}

export default useNonCompliantState
