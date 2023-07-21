export const evmEndpoint =
  process.env.HAPI_EVM_ENDPOINT || 'http://localhost/evm'
export const chainId = process.env.HAPI_NETWORK_CHAIN_ID || 'chainid1'
export const evmAccount = process.env.HAPI_EVM_EOS_EVM_ACCOUNT || 'eosio.evm'
export const eosEndpoints =
  process.env.HAPI_EVM_EOS_EVM_ACCOUNT?.split(',') || []
export const blockIntervalSec = parseFloat(
  process.env.HAPI_BLOCK_INTERVAL_SEC || '0.5'
)
