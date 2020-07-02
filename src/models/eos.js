import EosApi from 'eosjs-api'
import axios from 'axios'

import { parseVotesToEOS } from '../utils'
import { eosConfig } from '../config'

const eos = EosApi({
  httpEndpoint: eosConfig.endpoint,
  verbose: false,
  fetchConfiguration: {}
})
let infoInterval

const getInflation = async () => {
  const systemData = await eos.getCurrencyStats({
    symbol: 'EOS',
    code: 'eosio.token'
  })

  if (!systemData.EOS || !systemData.EOS.supply) {
    return 0
  }

  const totalSupply = parseInt(systemData.EOS.supply.split(' ')[0])

  return totalSupply / 100 / 365
}

const getBpJSON = async (producer) => {
  try {
    const { data: bpJson } = await axios.get(
      producer.owner === 'okcapitalbp1'
        ? `${producer.url}/bp.json`
        : `https://cors-anywhere.herokuapp.com/${producer.url}/bp.json`,
      {
        timeout: 5000
      }
    )

    return bpJson
  } catch (error) {}
}

export default {
  state: {
    producers: { rows: [] },
    info: {},
    tps: [],
    tpb: [],
    waiting: null
  },
  reducers: {
    updateInfo(state, info) {
      return {
        ...state,
        info
      }
    },
    updateProducers(state, producers) {
      return {
        ...state,
        producers
      }
    },
    updateProducer(state, { owner, bpJSON }) {
      const rows = state.producers.rows
      const index = rows.findIndex((info) => info.owner === owner)
      const newProducer = { ...rows[index], bpJSON }
      rows[index] = newProducer

      return {
        ...state,
        producers: {
          ...state.producers,
          rows
        }
      }
    },
    updateTps(state, item) {
      let tpb = state.tpb

      if (state.tpb.length >= 10) {
        tpb = state.tpb.splice(1, state.tpb.length)
      }

      tpb = [
        ...tpb,
        {
          blocks: [item.block],
          transactions: item.transactions
        }
      ]

      if (!state.waiting) {
        return {
          ...state,
          tpb,
          waiting: item
        }
      }

      let tps = state.tps

      if (state.tps.length >= 10) {
        tps = state.tps.splice(1, state.tps.length)
      }

      tps = [
        ...tps,
        {
          blocks: [state.waiting.block, item.block],
          transactions: state.waiting.transactions + item.transactions
        }
      ]

      return {
        ...state,
        tps,
        tpb,
        waiting: null
      }
    },
    updateRate(state, rate) {
      return {
        ...state,
        rate
      }
    }
  },
  effects: (dispatch) => ({
    async startTrackingInfo({ interval = 1000 } = {}) {
      if (infoInterval) {
        return
      }

      const handle = async () => {
        const info = await eos.getInfo({})
        dispatch.eos.updateInfo(info)
        dispatch.eos.updateTransactionsPerSecond(info.head_block_num)
      }

      await handle()
      infoInterval = setInterval(handle, interval)
    },
    async getProducers() {
      const {
        total_producer_vote_weight: voteWeight,
        rows,
        ...args
      } = await eos.getProducers({ limit: 100, json: true })
      const inflation = await getInflation()
      const blockReward = 0.25 // reward for each block produced
      const voteReward = 0.75 // reward according to producer total_votes
      const minimumPercenToGetVoteReward = 100 / (inflation * voteReward) // calculate the minimum percen to get vote reward

      let distributedVoteRewardPercent = 0
      let undistributedVoteRewardPercent = 0

      rows.forEach((producer) => {
        const producerVotePercent = producer.total_votes / voteWeight
        if (producerVotePercent > minimumPercenToGetVoteReward) {
          distributedVoteRewardPercent += producerVotePercent
        } else {
          undistributedVoteRewardPercent += producerVotePercent
        }
      })

      let producers = rows
        .sort((a, b) => {
          if (parseInt(a.total_votes) > parseInt(b.total_votes)) {
            return -1
          }

          if (parseInt(a.total_votes) < parseInt(b.total_votes)) {
            return 1
          }

          return 0
        })
        .map((producer, i) => ({ ...producer, isBlockProducer: i < 21 }))
        .map((producer) => {
          const producerVotePercent = producer.total_votes / voteWeight
          let expectedVoteReward = 0
          let expectedBlockReward = 0

          if (producerVotePercent > minimumPercenToGetVoteReward) {
            const producerDistributionPercent =
              producerVotePercent / distributedVoteRewardPercent // calculates the percentage that the producer represents of the distributed vote reward percent

            const producerUndistributedRewardPercent =
              producerDistributionPercent * undistributedVoteRewardPercent //  calculate the percentage that corresponds to the producer of the undistributed vote reward percent

            expectedVoteReward =
              inflation *
              voteReward *
              (producerUndistributedRewardPercent + producerVotePercent)
          }

          if (producer.isBlockProducer) {
            expectedBlockReward = inflation * blockReward * (1 / 21)
          }

          return {
            ...producer,
            total_votes: parseInt(producer.total_votes),
            total_votes_percent: producerVotePercent,
            total_votes_eos: parseVotesToEOS(producer.total_votes),
            vote_reward: expectedVoteReward,
            block_reward: expectedBlockReward,
            total_reward: expectedVoteReward + expectedBlockReward
          }
        })

      producers = await Promise.all(
        producers.map(async (producer) => {
          const bpJSON = await getBpJSON(producer)

          if (!bpJSON || typeof bpJSON !== 'object') {
            return producer
          }

          return {
            ...producer,
            bp_json: {
              ...bpJSON,
              org: {
                ...bpJSON.org,
                location: {
                  ...bpJSON.org.location,
                  country: /china/gi.test(
                    typeof bpJSON.org.location === 'string'
                      ? bpJSON.org.location
                      : bpJSON.org.location.country
                  )
                    ? 'CN'
                    : bpJSON.org.location.country
                }
              }
            }
          }
        })
      )

      dispatch.eos.updateProducers({
        ...args,
        rows: producers
      })
    },
    async getProducerInfo(producer) {
      try {
        const { data } = await axios.get(
          `https://cors-anywhere.herokuapp.com/${producer.url}/bp.json`
        )

        if (!data) {
          return
        }

        dispatch.eos.updateProducer({
          owner: producer.owner,
          bpJSON: data
        })
      } catch (error) {
        console.error(error)
      }
    },
    async updateTransactionsPerSecond(block) {
      try {
        const data = await eos.getBlock(block)
        dispatch.eos.updateTps({
          block,
          transactions: data.transactions.length
        })
      } catch (error) {}
    },
    async getRate() {
      try {
        const { data } = await axios.get(eosConfig.exchangeRateApi)

        if (!data || !data.success) {
          return
        }

        dispatch.eos.updateRate(data.rates.EOS)
      } catch (error) {
        console.error(error)
        dispatch.eos.updateRate(eosConfig.exchangeRate)
      }
    }
  })
}
