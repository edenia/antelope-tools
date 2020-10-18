import { lazy } from 'react'

import { generalConfig } from '../config'

const Dashboard = lazy(() => import('./Dashboard'))
const Login = lazy(() => import('./Login'))
const About = lazy(() => import('./About'))
const Help = lazy(() => import('./Help'))
const BlockProducerAgreementContract = lazy(() =>
  import('./BlockProducerAgreementContract')
)
const EditBPJson = lazy(() => import('./EditBPJson'))
const SmartContract = lazy(() => import('./SmartContract'))
const Lacchain = lazy(() => import('./Lacchain'))
const LacchainNodesNetwork = lazy(() => import('./LacchainNodesNetwork'))

const routes = [
  {
    path: '/dashboard',
    component: Dashboard
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/about',
    component: About
  },
  {
    path: '/help',
    component: Help
  },
  {
    path: '/bpjson',
    component: EditBPJson
  },
  {
    path: '/smart-contract',
    component: SmartContract
  }
]

if (generalConfig.useLanguageSufix === 'lacchain') {
  routes.push({
    path: '/lacchain',
    component: Lacchain
  })
  routes.push({
    path: '/lacchain-nodes-network',
    component: LacchainNodesNetwork
  })
}

if (generalConfig.useBlockProducerAgreementContract) {
  routes.push({
    path: '/ricardian-contract',
    component: BlockProducerAgreementContract
  })
}

export default routes
