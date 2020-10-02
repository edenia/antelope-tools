import { Scatter } from 'ual-scatter'
import { Ledger } from 'ual-ledger'
import { Lynx } from 'ual-lynx'
import { TokenPocket } from 'ual-token-pocket'
import { MeetOne } from 'ual-meetone'
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
  new Lynx([network]),
  new Ledger([network]),
  new Scatter([network], { appName }),
  new TokenPocket([network.chainId]),
  new MeetOne([network.chainId]),
  new Anchor([network], { appName })
]

export const ualConfig = {
  appName,
  network,
  authenticators
}
