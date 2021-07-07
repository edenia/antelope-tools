const { BaseActionWatcher } = require('demux')
const { NodeosActionReader } = require('demux-eos')

const { eosConfig } = require('../../config')

const ActionHandler = require('./action-handler')
const handlerVersion = require('./handler-version')

const init = () => {
  const actionHandler = new ActionHandler([handlerVersion])
  const actionReader = new NodeosActionReader({
    onlyIrreversible: true,
    // @todo: get start from env variable.
    startAtBlock: 1,
    nodeosEndpoint: eosConfig.apiEndpoint
  })
  const watcher = new BaseActionWatcher(actionReader, actionHandler, 250)

  watcher.watch()
}

module.exports = {
  init
}
