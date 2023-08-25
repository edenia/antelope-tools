export const evmEndpoint =
  process.env.HAPI_EVM_ENDPOINT || 'http://localhost/evm'
export const chainId = process.env.HAPI_EVM_NETWORK_CHAIN_ID || 'chainid1'
export const evmAccount = process.env.HAPI_EVM_EOS_EVM_ACCOUNT || 'eosio.evm'
export const eosEndpoints =
  process.env.HAPI_EVM_EOS_EVM_ACCOUNT?.split(',') || []
export const blockIntervalSec = parseFloat(
  process.env.HAPI_EVM_BLOCK_INTERVAL_SEC || '0.5'
)
export const oldBlockIntervalSec = parseFloat(
  process.env.HAPI_EVM_OLD_BLOCK_INTERVAL_SEC || '0.1'
)
export const ATHIntervalSec = parseFloat(
  process.env.HAPI_EVM_ATH_INTERVAL_SEC || '60'
)
export const cleanOldBlockIntervalSec = parseFloat(
  process.env.HAPI_EVM_CLEAN_OLD_BLOCK_INTERVAL_SEC || '86400'
)
export const cleanOldTransferIntervalSec = parseFloat(
  process.env.HAPI_EVM_CLEAN_OLD_TRANSFER_INTERVAL_SEC || '86400'
)
export const keepHistoryForYears = parseInt(
  process.env.HAPI_EVM_KEEP_HISTORY_FOR_YEARS || '1'
)
