const { AbstractActionHandler } = require('demux')

// const missedBlockService = require('../missed-blocks.service')

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
    } catch (error) {
      console.error(error)
    }
  }

  async loadIndexState() {
    try {
      return state
    } catch (error) {
      console.error(error)
    }
  }
}

module.exports = ActionHandler
