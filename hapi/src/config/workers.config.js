module.exports = {
  syncProducersInterval: parseInt(
    process.env.HAPI_SYNC_PRODUCERS_INTERVAL || 86400
  ),
  syncProducerInfoInterval: parseInt(
    process.env.HAPI_SYNC_PRODUCER_INFO_INTERVAL || 1
  ),
  syncProducerCpuInterval: parseInt(
    process.env.HAPI_SYNC_PRODUCER_CPU_INTERVAL || 6
  )
}
