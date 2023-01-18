import { useState, useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'

import { PRODUCERS_QUERY, SETTING_QUERY } from '../../gql'

const useNonCompliantState = () => {
  const [loadProducers, { loading = true, data: { producers } = {} }] =
    useLazyQuery(PRODUCERS_QUERY)
  const [loadSettings, { data: { setting } = {} }] = useLazyQuery(SETTING_QUERY)
  const [items, setItems] = useState([])
  const [stats, setStats] = useState()

  useEffect(() => {
    loadSettings({})
    loadProducers({
      variables: {
        where: { total_rewards: { _gte: 100 } },
        offset: 0,
        limit: 150,
      },
    })
  }, [loadSettings, loadProducers])

  useEffect(() => {
    if (!producers) return

    const { nonCompliantBPs, totalDailyRewards, nonCompliantRewards } =
      producers.reduce(
        (stats, producer) => {
          if (!Object.keys(producer.bp_json).length) {
            stats.nonCompliantBPs.push(producer)
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
