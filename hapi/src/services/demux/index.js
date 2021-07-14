const { BaseActionWatcher } = require('demux')
const { NodeosActionReader } = require('demux-eos')

const { eosConfig, hasuraConfig } = require('../../config')
const { axiosUtil, sleepFor } = require('../../utils')

const ActionHandler = require('./action-handler')
const handlerVersion = require('./handler-version')

const init = async () => {
  const actionHandler = new ActionHandler([handlerVersion])
  const actionReader = new NodeosActionReader({
    onlyIrreversible: true,
    // @todo: get start from env variable.
    startAtBlock: 1,
    nodeosEndpoint: eosConfig.apiEndpoint
  })
  const watcher = new BaseActionWatcher(actionReader, actionHandler, 250)
  let hasuraReady = false

  while (!hasuraReady) {
    try {
      await axiosUtil.instance.get(
        hasuraConfig.url.replace('/v1/graphql', '/healthz')
      )
      hasuraReady = true
    } catch (error) {
      hasuraReady = false
      console.log(
        'waiting for hasura...',
        hasuraConfig.url.replace('/v1/graphql', '/healthz')
      )
      await sleepFor(3)
    }
  }

  watcher.watch()
}

module.exports = {
  init
}
