import { useEffect, useState } from 'react'
import EosApi from 'eosjs-api'
import axios from 'axios'
import { useTranslation } from 'react-i18next'

import { eosConfig, ualConfig } from '../../config'
import { useSharedState } from '../../context/state.context'

const eosApi = EosApi({
  httpEndpoint: eosConfig.endpoint,
  verbose: false,
  fetchConfiguration: {},
})

const getBPJsonUrl = async (producer = {}) => {
  let producerUrl = producer.url || ''

  if (!producerUrl.startsWith('http')) {
    producerUrl = `http://${producerUrl}`
  }

  if (producer.owner === 'eosauthority') {
    producerUrl =
      'https://ipfs.edenia.cloud/ipfs/QmVDRzUbnJLLM27nBw4FPWveaZ4ukHXAMZRzkbRiTZGdnH'

    return producerUrl
  }

  const chainsUrl = `${producerUrl}/chains.json`.replace(
    /(?<=:\/\/.*)((\/\/))/,
    '/',
  )
  let chainUrl = '/bp.json'

  try {
    const {
      data: { chains },
    } = await axios.get(chainsUrl)
    chainUrl = chains[ualConfig.network.chainId] || chainUrl
  } catch (error) {}

  return `${producerUrl}/${chainUrl}`.replace(/(?<=:\/\/.*)((\/\/))/, '/')
}

const getBpJSONOffChain = async (producer) => {
  try {
    const bpUrl = await getBPJsonUrl(producer)

    if (bpUrl === 'http:///bp.json') return undefined
    const { data: bpJson } = await axios.get(bpUrl, {
      timeout: 5000,
    })

    return bpJson
  } catch (error) {
    console.log(error)
  }
}

const getBpJSONChain = async (producer) => {
  try {
    const { rows: producerjsonRow } = await eosApi.getTableRows({
      json: true,
      code: eosConfig.bpJsonOnChainContract,
      scope: eosConfig.bpJsonOnChainScope,
      table: eosConfig.bpJsonOnChainTable,
      reverse: false,
      lower_bound: producer,
      upper_bound: producer,
      limit: 1,
    })

    if (producerjsonRow) return JSON.parse(producerjsonRow[0].json)
  } catch (error) {
    console.log(error)
  }
}

const useBPJsonState = () => {
  const initData = {
    account_name: '',
    org: {
      candidate_name: '',
      website: '',
      code_of_conduct: '',
      ownership_disclosure: '',
      email: '',
      github_user: [],
      chain_resources: '',
      other_resources: [],
      branding: {
        logo_256: '',
        logo_1024: '',
        logo_svg: '',
      },
      location: {
        name: '',
        country: '',
        latitude: 0,
        longitude: 0,
      },
      social: {
        keybase: '',
        telegram: '',
        twitter: '',
        github: '',
        youtube: '',
        facebook: '',
        hive: '',
        reddit: '',
        wechat: '',
        medium: '',
        discord: '',
      },
    },
    nodes: [],
  }

  const [{ ual }] = useSharedState()
  const { t } = useTranslation('bpJsonRoute')
  const [producer, setProducer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [inconsistencyMessage, setInconsistencyMessage] = useState(null)

  const handleOnSubmit = async (payload) => {
    if (!ual.activeUser || !payload) return

    setLoading(true)
    try {
      await ual.activeUser.signTransaction(
        {
          actions: [
            {
              account: eosConfig.bpJsonOnChainContract,
              name: 'set',
              authorization: [
                {
                  actor: ual.activeUser.accountName,
                  permission: 'active',
                },
              ],
              data: {
                owner: ual.activeUser.accountName,
                json: payload.bpJson,
              },
            },
          ],
        },
        {
          broadcast: true,
        },
      )
    } catch (error) {
      setError(
        error?.cause?.message || error?.message || 'Unknown error on submit.',
      )
      setTimeout(() => {
        setError(null)
      }, 5000)
    }
    setLoading(false)
  }

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      const { rows } = await eosApi.getProducers({
        json: true,
        limit: 1,
        lower_bound: ual.activeUser.accountName,
        upper_bound: ual.activeUser.accountName,
      })
      const producer = rows.find(
        (item) => item.owner === ual.activeUser.accountName,
      )

      if (producer) {
        const bpJsonOffChain = await getBpJSONOffChain(producer)
        const bpJsonChain = await getBpJSONChain(producer.owner)

        setProducer({ ...producer, bpJson: bpJsonOffChain || bpJsonChain })

        if (
          bpJsonOffChain &&
          bpJsonChain &&
          JSON.stringify(bpJsonOffChain) !== JSON.stringify(bpJsonChain)
        )
          setInconsistencyMessage(t('bpjsonInconsistency'))
      }

      setLoading(false)
    }

    if (ual.activeUser) {
      init()
    } else {
      setTimeout(() => {
        setLoading(false)
      }, 5000)
    }
  }, [ual.activeUser, t])

  return [
    { loading, inconsistencyMessage, initData, producer, error, ual },
    { t, handleOnSubmit },
  ]
}

export default useBPJsonState
