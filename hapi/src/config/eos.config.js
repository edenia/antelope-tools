module.exports = {
  apiEndpoint: process.env.EOS_API_ENDPOINT,
  chainId: process.env.EOS_API_CHAIN_ID,
  baseAccount: process.env.EOS_BASE_ACCOUNT,
  baseAccountPassword: process.env.EOS_BASE_ACCOUNT_PASSWORD,
  walletUrl: process.env.EOS_WALLET_URL,
  bpJsonOnChain: process.env.EOS_BP_JSON_ON_CHAIN === 'true',
  bpJsonOnChainContract: process.env.EOS_BP_JSON_ON_CHAIN_CONTRACT,
  bpJsonOnChainTable: process.env.EOS_BP_JSON_ON_CHAIN_TABLE,
  bpJsonOnChainScope: process.env.EOS_BP_JSON_ON_CHAIN_SCOPE
}
