import EosApi from 'eosjs-api'

import { eosConfig } from '../config'

const eos = EosApi({
  httpEndpoint: eosConfig.endpoint,
  verbose: false,
  fetchConfiguration: {}
})
let infoInterval
let scheduleInterval

export default {
  state: {
    schedule: {
      version: '',
      producers: []
    },
    info: {},
    tps: new Array(30).fill({ blocks: [], transactions: 0 }),
    tpb: new Array(60).fill({ blocks: [], transactions: 0 }),
    tpsWaitingBlock: null
  },
  reducers: {
    updateInfo(state, info) {
      return {
        ...state,
        info
      }
    },
    updateTransactionsStats(state, item) {
      let tpb = state.tpb

      if (state.tpb.length >= 60) {
        tpb.pop()
      }

      tpb = [
        {
          blocks: [item.block],
          transactions: item.transactions
        },
        ...tpb
      ]

      if (!state.tpsWaitingBlock) {
        return {
          ...state,
          tpb,
          tpsWaitingBlock: item
        }
      }

      let tps = state.tps

      if (state.tps.length >= 30) {
        tps.pop()
      }

      tps = [
        {
          blocks: [state.tpsWaitingBlock.block, item.block],
          transactions: state.tpsWaitingBlock.transactions + item.transactions
        },
        ...tps
      ]

      return {
        ...state,
        tps,
        tpb,
        tpsWaitingBlock: null
      }
    },
    updateSchedule(state, schedule) {
      return {
        ...state,
        schedule
      }
    }
  },
  effects: (dispatch) => ({
    async startTrackingInfo({ interval = 1 } = {}) {
      if (infoInterval) {
        return
      }

      const handle = async () => {
        try {
          const info = await eos.getInfo({})
          dispatch.eos.updateInfo(info)
          dispatch.eos.getBlock(info.head_block_num)
        } catch (error) {
          console.error(error)
        }
      }

      if (interval === 0) {
        await handle()
        return
      }

      await handle()
      infoInterval = setInterval(handle, interval * 1000)
    },
    async stopTrackingInfo() {
      if (!infoInterval) {
        return
      }

      clearInterval(infoInterval)
      infoInterval = null
    },
    async getBlock(block) {
      try {
        const data = await eos.getBlock(block)
        dispatch.eos.updateTransactionsStats({
          block,
          transactions: data.transactions.length
        })
      } catch (error) {
        console.log(error)
      }
    },
    async startTrackingProducerSchedule({ interval = 120 } = {}) {
      if (scheduleInterval) {
        return
      }

      const handle = async () => {
        try {
          const result = await eos.getProducerSchedule(true)
          dispatch.eos.updateSchedule(result.active)
        } catch (error) {
          console.error(error)
        }
      }

      await handle()
      scheduleInterval = setInterval(handle, interval * 1000)
    },
    async stopTrackingProducerSchedule() {
      if (!scheduleInterval) {
        return
      }

      clearInterval(scheduleInterval)
      scheduleInterval = null
    }
  })
}
