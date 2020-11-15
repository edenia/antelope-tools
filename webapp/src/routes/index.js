import React, { lazy } from 'react'
import { Redirect } from 'react-router-dom'
import DashboardIcon from '@material-ui/icons/Dashboard'
import LiveHelpIcon from '@material-ui/icons/LiveHelp'
import StorageIcon from '@material-ui/icons/Storage'
import CloudIcon from '@material-ui/icons/Language'
import ListAltIcon from '@material-ui/icons/ListAlt'
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import DeveloperBoardIcon from '@material-ui/icons/DeveloperBoard'
import SettingsInputAntennaIcon from '@material-ui/icons/SettingsInputAntenna'

import { eosConfig } from '../config'
import { DashboardLayout, StandAloneLayout } from '../layouts'

const Dashboard = lazy(() => import('./Dashboard'))
const Network = lazy(() => import('./Network'))
const Producers = lazy(() => import('./Producers'))
const NodesDistribution = lazy(() => import('./NodesDistribution'))
const SmartContract = lazy(() => import('./SmartContract'))
const Rewards = lazy(() => import('./Rewards'))
const EditBPJson = lazy(() => import('./EditBPJson'))
const About = lazy(() => import('./About'))
const BlockProducerAgreementContract = lazy(() =>
  import('./BlockProducerAgreementContract')
)
const Help = lazy(() => import('./Help'))
const Page404 = lazy(() => import('./Page404'))
const LacchainBoard = lazy(() => import('./Lacchain/LacchainBoard'))
const LacchainNetwork = lazy(() => import('./Lacchain/LacchainNetwork'))
const Nodes = lazy(() => import('./Nodes'))

const defaultRoutes = [
  {
    component: () => <Redirect to="/dashboard" />,
    path: '/',
    exact: true
  },
  {
    name: 'dashboard',
    icon: <DashboardIcon />,
    layout: DashboardLayout,
    component: Dashboard,
    path: '/dashboard',
    exact: true
  },
  {
    name: 'networkInfo',
    icon: <LiveHelpIcon />,
    layout: DashboardLayout,
    component: Network,
    path: '/network',
    exact: true
  },
  {
    name: 'blockProducer',
    icon: <StorageIcon />,
    layout: DashboardLayout,
    component: Producers,
    path: '/producers',
    exact: true
  },
  {
    name: 'rewardDistribution',
    icon: <AccountBalanceWalletIcon />,
    layout: DashboardLayout,
    component: Rewards,
    path: '/rewards',
    exact: true
  },
  {
    name: 'nodes',
    icon: <StorageIcon />,
    layout: DashboardLayout,
    component: Nodes,
    path: '/nodes',
    exact: true
  },
  {
    name: 'nodesDistribution',
    icon: <CloudIcon />,
    layout: DashboardLayout,
    component: NodesDistribution,
    path: '/nodes-distribution',
    exact: true
  },
  {
    name: 'nodeInfo',
    icon: <FileCopyIcon />,
    layout: DashboardLayout,
    component: EditBPJson,
    path: '/bpjson',
    exact: true
  },
  {
    name: 'smartContract',
    icon: <ListAltIcon />,
    layout: DashboardLayout,
    component: SmartContract,
    path: '/smart-contract',
    exact: true
  },
  {
    name: 'ricardianContract',
    layout: DashboardLayout,
    component: BlockProducerAgreementContract,
    path: '/ricardian-contract',
    exact: true
  }
]
const lacchainRoutes = [
  {
    component: () => <Redirect to="/dashboard" />,
    path: '/',
    exact: true
  },
  {
    name: 'dashboard',
    icon: <DashboardIcon />,
    layout: DashboardLayout,
    component: Dashboard,
    path: '/dashboard',
    exact: true
  },
  {
    name: 'networkInfo',
    icon: <LiveHelpIcon />,
    layout: DashboardLayout,
    component: Network,
    path: '/network',
    exact: true
  },
  {
    name: 'blockProducer',
    icon: <StorageIcon />,
    layout: DashboardLayout,
    component: Producers,
    path: '/entities',
    exact: true
  },
  {
    name: 'nodes',
    icon: <StorageIcon />,
    layout: DashboardLayout,
    component: Nodes,
    path: '/nodes',
    exact: true
  },
  {
    name: 'nodesDistribution',
    icon: <CloudIcon />,
    layout: DashboardLayout,
    component: NodesDistribution,
    path: '/nodes-distribution',
    exact: true
  },
  {
    name: 'nodesNetwork',
    icon: <SettingsInputAntennaIcon />,
    layout: DashboardLayout,
    component: LacchainNetwork,
    path: '/lacchain/network',
    exact: true
  },
  {
    name: 'lacchainBoard',
    icon: <DeveloperBoardIcon />,
    layout: DashboardLayout,
    component: LacchainBoard,
    path: '/lacchain/board',
    exact: true
  },
  {
    name: 'smartContract',
    icon: <ListAltIcon />,
    layout: DashboardLayout,
    component: SmartContract,
    path: '/smart-contract',
    exact: true
  }
]
const helpRoutes = [
  {
    name: 'About',
    layout: DashboardLayout,
    component: About,
    path: '/about',
    exact: true
  },
  {
    name: 'Help',
    layout: DashboardLayout,
    component: Help,
    path: '/help',
    exact: true
  },
  {
    layout: StandAloneLayout,
    component: Page404
  }
]

let routes = []

switch (eosConfig.networkName) {
  case 'lacchain':
    routes = [...lacchainRoutes, ...helpRoutes]
    break
  default:
    routes = [...defaultRoutes, ...helpRoutes]
    break
}

export default routes
