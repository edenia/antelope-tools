import { useState, useEffect } from 'react'
import { useLazyQuery, useSubscription } from '@apollo/client'

import {
  PRODUCER_INFO_QUERY,
  NODES_BY_PRODUCER_SUBSCRIPTION,
  EOSRATE_STATS_QUERY,
} from '../../gql'
import { generalConfig } from '../../config'
import { formatData } from '../../utils/formatData'
import isValidAccountName from 'utils/validate-account-name'
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
  const [loadStats, { data: { eosrate_stats: eosRate } = {} }] =
    useLazyQuery(EOSRATE_STATS_QUERY)
  const { data: nodesSubscription } = useSubscription(
    NODES_BY_PRODUCER_SUBSCRIPTION,
    {
      variables: { where: { producer: defaultVariables.where } },
    },
  )

  const isValidName = isValidAccountName(name)

  const getProducerData = bpData => {
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
    if (isValidName) {
      if (generalConfig.eosRateLink){
        loadStats({
          variables: { bp: name },
        })
      }

      if (previousData) {
        setProducer(getProducerData(previousData))
        setProducerKey(previousData?.producer_key)
      } else {
        loadProducers({ variables: defaultVariables })
      }
    } else {
      setProducer({})
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (!eosRate) return

    setProducer(prev => ({ ...prev, eosRate }))
  }, [eosRate])

  useEffect(() => {
    if (!nodesSubscription?.nodes || !producerKey) return

    setProducer(prev => ({
      ...prev,
      nodes: sortNodes(nodesSubscription?.nodes, producerKey),
    }))
  }, [nodesSubscription, producerKey])

  useEffect(() => {
    if (Array.isArray(producers) && !producers.length) {
      setProducer({})
    }

    if (!producers || !producers.length) return

    if (!producers.at(0)?.bp_json) return

    const bp = getProducerData(producers?.at(0))

    setProducerKey(bp.producer_key)
    setProducer(prev => ({ ...prev, ...bp }))
  }, [producers])

  useEffect(() => {
    if (!producer || !Object?.keys(producer).length) return

    setLdJson(
      JSON.stringify({
        '@context': 'http://schema.org',
        '@type': 'Organization',
        name: producer?.media?.name,
        url: producer?.media?.website,
        contactPoint: {
          '@type': 'ContactPoint',
          email: producer?.media?.email,
          contactType: 'customer service',
        },
        logo: producer?.media?.logo,
      }),
    )
  }, [producer])

  return [{ loading, producer, ldJson }, {}]
}

export default useProducerProfileState
