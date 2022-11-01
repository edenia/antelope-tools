module.exports = {
  networkName: process.env.HAPI_EOS_API_NETWORK_NAME,
  apiEndpoints: process.env.HAPI_EOS_API_ENDPOINTS
  ? JSON.parse(process.env.HAPI_EOS_API_ENDPOINTS)
  : [],
  apiEndpoint: process.env.HAPI_EOS_API_ENDPOINTS
  ? JSON.parse(process.env.HAPI_EOS_API_ENDPOINTS)[0]
  : '',
  stateHistoryPluginEndpoint:
    process.env.HAPI_EOS_STATE_HISTORY_PLUGIN_ENDPOINT,
  chainId: process.env.HAPI_EOS_API_CHAIN_ID,
  baseAccount: process.env.HAPI_EOS_BASE_ACCOUNT,
  baseAccountPassword: process.env.HAPI_EOS_BASE_ACCOUNT_PASSWORD,
  faucet: {
    account: process.env.HAPI_EOS_FAUCET_ACCOUNT,
    getFaucetAccount: process.env.HAPI_EOS_GET_FAUCET_ACCOUNT,
    password: process.env.HAPI_EOS_FAUCET_ACCOUNT_PASSWORD,
    createAccountActionName: process.env.HAPI_CREATE_ACCOUNT_ACTION_NAME
  },
  eosmechanics: {
    account: process.env.HAPI_EOS_MECHANICS_ACCOUNT,
    password: process.env.HAPI_EOS_MECHANICS_PASSWORD,
    includeTransaction: process.env.HAPI_EOS_MECHANICS_INCLUDE_TRANSACTION
      ? JSON.parse(process.env.HAPI_EOS_MECHANICS_INCLUDE_TRANSACTION)
      : ''
  },
  walletUrl: process.env.HAPI_EOS_WALLET_URL,
  exchangeRateApi: process.env.HAPI_EOS_EXCHANGE_RATE_API,
  coingeckoApiTokenId: process.env.HAPI_COINGECKO_API_TOKEN_ID,
  bpJsonOnChain: process.env.HAPI_EOS_BP_JSON_ON_CHAIN === 'true',
  bpJsonOnChainContract: process.env.HAPI_EOS_BP_JSON_ON_CHAIN_CONTRACT,
  bpJsonOnChainTable: process.env.HAPI_EOS_BP_JSON_ON_CHAIN_TABLE,
  bpJsonOnChainScope: process.env.HAPI_EOS_BP_JSON_ON_CHAIN_SCOPE,
  lacchain: {
    account: process.env.HAPI_EOS_BP_JSON_ON_CHAIN_TABLE2 || 'eosio',
    entityTable: process.env.HAPI_EOS_BP_JSON_ON_CHAIN_TABLE2 || 'entity',
    nodeTable: process.env.HAPI_EOS_BP_JSON_ON_CHAIN_TABLE2 || 'node'
  },
  knownNetworks: {
    lacchain: 'lacchain'
  },
  rewardsToken: process.env.HAPI_REWARDS_TOKEN
}
