export const endpoint = process.env.HAPI_NETWORK_API || 'http://localhost:8888'
export const chainId = process.env.HAPI_NETWORK_CHAIN_ID || 'chainid1'
export const baseAccount =
  process.env.HAPI_NETWORK_BASE_ACCOUNT || 'accountname1'
export const baseAccountPassword =
  process.env.HAPI_NETWORK_BASE_PASSWORD || 'PW...'
export const walletUrl =
  process.env.HAPI_NETWORK_WALLET_URL || 'http://localhost:8888'
