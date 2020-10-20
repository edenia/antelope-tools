import { TokenPocket } from 'ual-token-pocket'
import { Anchor } from 'ual-anchor'

const appName = process.env.REACT_APP_EOS_APP_NAME || 'eosiodashboard'
const network = {
  chainId:
    process.env.REACT_APP_EOS_CHAIN_ID ||
    'e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c41473',
  rpcEndpoints: [
    {
      blockchain: 'eos',
      protocol: process.env.REACT_APP_EOS_API_PROTOCOL || 'https',
      host: process.env.REACT_APP_EOS_API_HOST || 'jungle.eosio.cr',
      port: parseInt(process.env.REACT_APP_EOS_API_PORT || '443')
    }
  ]
}
const authenticators = [
  new TokenPocket([network]),
  new Anchor([network], { appName })
]

export const ualConfig = {
  appName,
  network,
  authenticators
}
