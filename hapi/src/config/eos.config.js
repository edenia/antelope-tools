module.exports = {
  apiEndpoint: process.env.HAPI_EOS_API_ENDPOINT,
  chainId: process.env.HAPI_EOS_API_CHAIN_ID,
  baseAccount: process.env.HAPI_EOS_BASE_ACCOUNT,
  baseAccountPassword: process.env.HAPI_EOS_BASE_ACCOUNT_PASSWORD,
  walletUrl: process.env.HAPI_EOS_WALLET_URL,
  bpJsonOnChain: process.env.HAPI_EOS_BP_JSON_ON_CHAIN === 'true',
  bpJsonOnChainContract: process.env.HAPI_EOS_BP_JSON_ON_CHAIN_CONTRACT,
  bpJsonOnChainTable: process.env.HAPI_EOS_BP_JSON_ON_CHAIN_TABLE,
  bpJsonOnChainScope: process.env.HAPI_EOS_BP_JSON_ON_CHAIN_SCOPE
}
