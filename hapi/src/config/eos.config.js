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
  missedBlocksServiceEnabled:
    Boolean(process.env.HAPI_EOS_MISSED_BLOCKS_ENABLED) || false,
  keepBlockHistoryForDays:
    parseInt(process.env.HAPI_EOS_BLOCK_HISTORY_DAYS) || 0,
  chainId: process.env.HAPI_EOS_API_CHAIN_ID,
  eosChainId:
    'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
  eosTopLimit: 150,
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
    customPermission:
      process.env.HAPI_EOS_MECHANICS_CUSTOM_PERMISSION || 'active',
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
    fio: 'fio',
    lacchain: 'lacchain',
    libre: 'libre',
    telos: 'telos',
    wax: 'wax'
  },
  healthCheckAPIs: [
    { pattern: /^chain-api$/, api: '/v1/chain/get_info' },
    { pattern: /^atomic-assets-api$/, api: '/atomicassets/v1/config' },
    { pattern: /^hyperion-v2$/, api: '/v2/health' },
    { pattern: /^light-api$/, api: '/api/status' },
    { pattern: /^libre-.+$/, api: ''},
  ],
  rewardsToken: process.env.HAPI_REWARDS_TOKEN,
  eosRateUrl: process.env.HAPI_EOSRATE_GET_STATS_URL,
  eosRateUser: process.env.HAPI_EOSRATE_GET_STATS_USER,
  eosRatePassword: process.env.HAPI_EOSRATE_GET_STATS_PASSWORD,
  maxBlockNetUsage: parseInt(process.env.HAPI_EOS_MAX_NET_BLOCK) || 1048576,
  maxBlockCpuUsage: parseInt(process.env.HAPI_EOS_MAX_CPU_BLOCK) || 100000
}
