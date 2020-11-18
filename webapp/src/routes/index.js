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

const Home = lazy(() => import('./Home'))
const NetworkInfo = lazy(() => import('./NetworkInfo'))
const BlockProducers = lazy(() => import('./BlockProducers'))
const RewardsDistribution = lazy(() => import('./RewardsDistribution'))
const Nodes = lazy(() => import('./Nodes'))
const NodesDistribution = lazy(() => import('./NodesDistribution'))
const Accounts = lazy(() => import('./Accounts'))
const BPJson = lazy(() => import('./BPJson'))
const RicardianContract = lazy(() => import('./RicardianContract'))
const About = lazy(() => import('./About'))
const Help = lazy(() => import('./Help'))
const Page404 = lazy(() => import('./Page404'))
const LacchainNetwork = lazy(() => import('./Lacchain/LacchainNetwork'))
const LacchainManagement = lazy(() => import('./Lacchain/LacchainManagement'))

const defaultRoutes = [
  {
    component: () => <Redirect to="/dashboard" />,
    path: '/',
    exact: true
  },
  {
    name: 'home',
    icon: <DashboardIcon />,
    component: Home,
    path: '/dashboard',
    exact: true
  },
  {
    name: 'networkInfo',
    icon: <LiveHelpIcon />,
    component: NetworkInfo,
    path: '/network-info',
    exact: true
  },
  {
    name: 'blockProducers',
    icon: <StorageIcon />,
    component: BlockProducers,
    path: '/block-producers',
    exact: true
  },
  {
    name: 'rewardsDistribution',
    icon: <AccountBalanceWalletIcon />,
    component: RewardsDistribution,
    path: '/rewards-distribution',
    exact: true
  },
  {
    name: 'nodes',
    icon: <StorageIcon />,
    component: Nodes,
    path: '/nodes',
    exact: true
  },
  {
    name: 'nodesDistribution',
    icon: <CloudIcon />,
    component: NodesDistribution,
    path: '/nodes-distribution',
    exact: true
  },
  {
    name: 'accounts',
    icon: <ListAltIcon />,
    component: Accounts,
    path: '/accounts',
    exact: true
  },
  {
    name: 'bpJson',
    icon: <FileCopyIcon />,
    component: BPJson,
    path: '/bpjson',
    exact: true
  },
  {
    name: 'ricardianContract',
    component: RicardianContract,
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
    name: 'home',
    icon: <DashboardIcon />,
    component: Home,
    path: '/dashboard',
    exact: true
  },
  {
    name: 'networkInfo',
    icon: <LiveHelpIcon />,
    component: NetworkInfo,
    path: '/network-info',
    exact: true
  },
  {
    name: 'entities',
    icon: <StorageIcon />,
    component: BlockProducers,
    path: '/entities',
    exact: true
  },
  {
    name: 'nodes',
    icon: <StorageIcon />,
    component: Nodes,
    path: '/nodes',
    exact: true
  },
  {
    name: 'nodesDistribution',
    icon: <CloudIcon />,
    component: NodesDistribution,
    path: '/nodes-distribution',
    exact: true
  },
  {
    name: 'lacchainNetwork',
    icon: <SettingsInputAntennaIcon />,
    component: LacchainNetwork,
    path: '/lacchain/network',
    exact: true
  },
  {
    name: 'lacchainManagement',
    icon: <DeveloperBoardIcon />,
    component: LacchainManagement,
    path: '/lacchain/management',
    exact: true
  },
  {
    name: 'accounts',
    icon: <ListAltIcon />,
    component: Accounts,
    path: '/accounts',
    exact: true
  }
]
const helpRoutes = [
  {
    name: 'About',
    component: About,
    path: '/about',
    exact: true
  },
  {
    name: 'Help',
    component: Help,
    path: '/help',
    exact: true
  },
  {
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
