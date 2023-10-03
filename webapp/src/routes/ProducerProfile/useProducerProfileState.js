import { useState, useEffect } from 'react'
import { useLazyQuery, useSubscription } from '@apollo/client'

import {
  PRODUCER_INFO_QUERY,
  NODES_BY_PRODUCER_SUBSCRIPTION,
  EOSRATE_STATS_QUERY,
} from '../../gql'
import isValidAccountName from 'utils/validate-account-name'
import { formatData } from '../../utils/formatData'
import sortNodes from 'utils/sort-nodes'

const useProducerProfileState = (name, previousData) => {
  const defaultVariables = {
    where: {
      _and: [{ owner: { _eq: name } }, { bp_json: { _is_null: false } }],
    },
  }
  const [producer, setProducer] = useState()
  const [producerKey, setProducerKey] = useState()
  const [ldJson, setLdJson] = useState()
  const [loadProducers, { loading, data: { producers } = {} }] =
    useLazyQuery(PRODUCER_INFO_QUERY)
  const { data } = useSubscription(NODES_BY_PRODUCER_SUBSCRIPTION, {
    variables: { where: { producer: defaultVariables.where } },
  })
  const [loadStats, { data: { eosrate_stats: stats } = {} }] =
    useLazyQuery(EOSRATE_STATS_QUERY)
  
  const isValidName = isValidAccountName(name)

  useEffect(() => {
    loadStats({})
  }, [loadStats])

  useEffect(()=>{
    if(!stats?.length) return

    const eosRate = stats.find(x=>x.bp === name)

    setProducer(prev => ({...prev, eosRate}))
  },[stats])

  useEffect(() => {
    if (!data?.nodes || !producerKey) return

    setProducer((prev) => ({
      ...prev,
      nodes: sortNodes(data?.nodes, producerKey),
    }))
  }, [data, producerKey])

  const getProducerData = (bpData) => {
    return bpData
      ? {
          ...bpData,
          ...formatData({
            data: bpData?.bp_json?.org || {},
            rank: bpData.rank,
            dataType: bpData.bp_json?.type,
            totalRewards: bpData.total_rewards,
            url: bpData.url,
          }),
          ...(bpData?.nodes && {
            nodes: sortNodes(bpData?.nodes, bpData?.producer_key),
          }),
        }
      : bpData
  }

  useEffect(() => {
    if (previousData) {
      setProducer(getProducerData(previousData))
      setProducerKey(previousData?.producer_key)

      return
    }
    if (isValidName) {
      loadProducers({ variables: defaultVariables })
    } else {
      setProducer({})
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (Array.isArray(producers) && !producers.length) {
      setProducer({})
    }

    if (!producers || !producers.length) return

    if (!producers.at(0)?.bp_json) return

    const bp = getProducerData(producers?.at(0))

    setProducerKey(bp.producer_key)

    setLdJson(
      JSON.stringify({
        '@context': 'http://schema.org',
        '@type': 'Organization',
        name: bp?.media?.name,
        url: bp?.media?.website,
        contactPoint: {
          '@type': 'ContactPoint',
          email: bp?.media?.email,
          contactType: 'customer service',
        },
        logo: bp?.media?.logo,
      }),
    )

    setProducer((prev) => ({ ...prev, ...bp }))
  }, [producers])

  return [{ loading, producer, ldJson }, {}]
}

export default useProducerProfileState
