module.exports = {
  syncProducersInterval: parseInt(process.env.SYNC_PRODUCERS_INTERVAL || 86400),
  syncBPJsonInterval: parseInt(process.env.SYNC_BP_JSON_INTERVAL || 86400),
  syncProducerInfoInterval: parseInt(
    process.env.SYNC_PRODUCER_INFO_INTERVAL || 1
  )
}
