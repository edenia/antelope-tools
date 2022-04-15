import { TokenPocket } from 'ual-token-pocket'
import { Anchor } from 'ual-anchor'

const appName = process.env.REACT_APP_EOS_APP_NAME || 'eosiodashboard'
const network = {
  chainId:
    process.env.REACT_APP_EOS_CHAIN_ID ||
    '73e4385a2708e6d7048834fbc1079f2fabb17b3c125b146af438971e90716c4d',
  rpcEndpoints: [
    {
      blockchain: 'eos',
      protocol: process.env.REACT_APP_EOS_API_PROTOCOL || 'https',
      host: process.env.REACT_APP_EOS_API_HOST || 'jungle.edenia.cloud',
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
