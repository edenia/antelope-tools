import { lazy } from 'react'

import { generalConfig } from '../config'

const Dashboard = lazy(() => import('./Dashboard'))
const Login = lazy(() => import('./Login'))
const About = lazy(() => import('./About'))
const Help = lazy(() => import('./Help'))
const BlockProducerAgreementContract = lazy(() =>
  import('./BlockProducerAgreementContract')
)

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
  }
]

if (generalConfig.useBlockProducerAgreementContract) {
  routes.push({
    path: '/ricardian-contract',
    component: BlockProducerAgreementContract
  })
}

export default routes
