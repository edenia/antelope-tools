import { useState, useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'

import { countries } from 'utils/countries'
import { PRODUCERS_QUERY, SETTING_QUERY } from '../../gql'

const useRewardsDistributionState = () => {
  const [loadSettings, { data: { setting } = {} }] = useLazyQuery(SETTING_QUERY)
  const [loadProducers, { loading = true, data: { producers } = {} }] =
    useLazyQuery(PRODUCERS_QUERY)
  const [summary, setSummary] = useState()
  const [items, setItems] = useState([])

  useEffect(() => {
    loadSettings({})
    loadProducers({
      variables: {
        where: { total_rewards: { _gte: 100 } },
        offset: 0,
        limit: 2100,
      },
    })
  }, [loadSettings, loadProducers])

  useEffect(() => {
    if (!producers) return

    let stats = {
      'N/A': {
        code: 'N/A',
        name: 'N/A',
        quantity: 0,
        items: [],
        rewards: 0,
      },
    }
    let dailyRewards = 0
    const items = producers || []

    const handleInvalidCountry = (producer) => {
      stats['N/A'].items.push(producer)
      stats['N/A'].rewards += producer.total_rewards
      stats['N/A'].quantity += 1
    }

    const handleValidCountry = (producer) => {
      if (!stats[producer.bp_json.org.location.country]) {
        stats = {
          ...stats,
          [producer.bp_json.org.location.country]: {
            code: producer.bp_json.org.location.country,
            name: countries[producer.bp_json.org.location.country]?.name,
            flag: countries[producer.bp_json.org.location.country]?.flag,
            quantity: 1,
            coordinates: [
              producer.bp_json.org.location.longitude,
              producer.bp_json.org.location.latitude,
            ],
            items: [producer],
            rewards: producer.total_rewards,
          },
        }
      } else {
        stats[producer.bp_json.org.location.country].items.push(producer)
        stats[producer.bp_json.org.location.country].rewards +=
          producer.total_rewards
        stats[producer.bp_json.org.location.country].quantity += 1

        if (
          producer.bp_json.org.location.longitude &&
          producer.bp_json.org.location.latitude
        ) {
          stats[producer.bp_json.org.location.country].coordinates = [
            producer.bp_json.org.location.longitude,
            producer.bp_json.org.location.latitude,
          ]
        }
      }
    }

    items
      .filter((a) => a.total_rewards >= 100)
      .forEach((producer) => {
        dailyRewards += producer.total_rewards || 0

        if (!producer?.bp_json?.org?.location?.country) {
          handleInvalidCountry(producer)
          return
        }

        handleValidCountry(producer)
      })

    const nodes = Object.values(stats)
    const topCountryByRewards = nodes.reduce(
      (prev, current) => {
        return current.rewards > prev.rewards && current.code !== 'N/A'
          ? current
          : prev
      },
      { rewards: 0 },
    )

    setSummary({
      dailyRewards,
      topCountryByRewards,
      producersWithoutProperBpJson: stats['N/A'],
    })
    setItems(nodes)
  }, [producers])

  return [
    {
      loading,
      nodes: items,
      setting,
      summary,
    },
  ]
}

export default useRewardsDistributionState
