import EosApi from 'eosjs-api'
import axios from 'axios'

const eos = EosApi({
  httpEndpoint: 'https://eos.greymass.com',
  verbose: false,
  fetchConfiguration: {}
})
let producersInterval
let infoInterval

export default {
  state: {
    producers: { rows: [] },
    info: {}
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
    }
  },
  effects: (dispatch) => ({
    async startTrackingInfo({ interval = 1000 } = {}) {
      if (infoInterval) {
        return
      }

      const handle = () => {
        eos.getInfo({}).then((result) => dispatch.eos.updateInfo(result))
      }

      handle()
      infoInterval = setInterval(handle, interval)
    },
    async startTrackingProducers({ interval = 1000 } = {}) {
      if (producersInterval) {
        return
      }

      const handle = () => {
        eos.getProducers({ limit: 50, json: true }).then((result) => {
          dispatch.eos.updateProducers(result)
          result.rows.forEach((producer) =>
            dispatch.eos.getProducerInfo(producer)
          )
        })
      }

      handle()
      producersInterval = setInterval(handle, interval)
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
    }
  })
}
