module.exports = {
  syncProducersInterval: parseInt(
    process.env.HAPI_SYNC_PRODUCERS_INTERVAL || 14400
  ),
  syncProducerInfoInterval: parseInt(
    process.env.HAPI_SYNC_PRODUCER_INFO_INTERVAL || 1
  ),
  cpuWorkerInterval: parseInt(process.env.HAPI_SYNC_PRODUCER_CPU_INTERVAL),
  syncStatsInterval: parseInt(process.env.HAPI_SYNC_STATS_INTERVAL || 3600),
  syncExchangeRate: parseInt(process.env.HAPI_SYNC_EXCHANGE_RATE || 86400),
  syncScheduleHistoryInterval: parseInt(
    process.env.HAPI_SYNC_SCHEDULE_HISTORY_INTERVAL || 0
  )
}
