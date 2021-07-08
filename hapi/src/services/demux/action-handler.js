const { AbstractActionHandler } = require('demux')

const demuxStateService = require('../demux-state.service')

// @todo handle demux state with a database
let state = {
  blockNumber: 0,
  blockHash: '',
  handlerVersionName: 'v1'
}

class ActionHandler extends AbstractActionHandler {
  setup() {}

  async handleWithState(handle) {
    try {
      await handle(state)
    } catch (err) {
      console.error(err)
    }
  }

  async updateIndexState(prevState, block) {
    try {
      const { blockInfo } = block
      state = {
        ...prevState,
        blockNumber: blockInfo.blockNumber,
        blockHash: blockInfo.blockHash
      }

      await demuxStateService.saveOrUpdate(prevState.handlerVersionName, state)
    } catch (error) {
      console.error(error)
    }
  }

  async loadIndexState() {
    try {
      state =
        (await demuxStateService.getByVersion(state.handlerVersionName)) ||
        state

      return state
    } catch (error) {
      console.error(error)
    }
  }
}

module.exports = ActionHandler
