import React, { lazy } from 'react'
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import SettingsInputAntennaIcon from '@material-ui/icons/SettingsInputAntenna'
import {
  Activity as ActivityIcon,
  Grid as GridIcon,
  Users as UsersIcon,
  Server as ServerIcon,
  Map as MapIcon,
  Sliders as SlidersIcon,
  User as UserIcon,
  Info as InfoIcon,
  HelpCircle as HelpIcon,
  GitMerge as GitMergeIcon,
  GitHub as GitHubIcon,
  Send as TelegramIcon
} from 'react-feather'

import { eosConfig, generalConfig } from '../config'

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
    name: 'home',
    icon: <GridIcon />,
    component: Home,
    path: '/',
    exact: true
  },
  {
    name: 'networkInfo',
    icon: <ActivityIcon />,
    component: NetworkInfo,
    path: '/node-performance',
    exact: true
  },
  {
    name: 'blockProducers',
    icon: <UsersIcon />,
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
    icon: <ServerIcon />,
    component: Nodes,
    path: '/nodes',
    exact: true
  },
  {
    name: 'nodesDistribution',
    icon: <MapIcon />,
    component: NodesDistribution,
    path: '/nodes-distribution',
    exact: true
  },
  {
    name: 'accounts',
    icon: <UserIcon />,
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
    header: 'networkInformation',
    name: 'home',
    icon: <GridIcon />,
    component: Home,
    path: '/',
    exact: true
  },
  {
    name: 'networkInfo',
    icon: <ActivityIcon />,
    component: NetworkInfo,
    path: '/node-performance',
    exact: true
  },
  {
    name: 'entities',
    icon: <UsersIcon />,
    component: BlockProducers,
    path: '/entities',
    exact: true
  },
  {
    name: 'nodes',
    icon: <ServerIcon />,
    component: Nodes,
    path: '/nodes',
    exact: true
  },
  {
    name: 'nodesDistribution',
    icon: <MapIcon />,
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
    header: 'tools',
    name: 'lacchainManagement',
    icon: <SlidersIcon />,
    component: LacchainManagement,
    path: '/management',
    exact: true
  },
  {
    name: 'accounts',
    icon: <UserIcon />,
    component: Accounts,
    path: '/accounts',
    exact: true
  }
]
const helpRoutes = [
  {
    header: 'docs',
    name: 'About',
    icon: <InfoIcon />,
    component: About,
    path: '/about',
    exact: true
  },
  {
    name: 'Help',
    icon: <HelpIcon />,
    component: Help,
    path: '/help',
    exact: true
  },
  {
    name: 'changelog',
    badge: generalConfig.appVersion,
    path: 'https://github.com/eoscostarica/eosio-dashboard/tags',
    icon: <GitMergeIcon />,
    exact: true
  },
  {
    header: 'external',
    name: 'github',
    path: 'https://github.com/eoscostarica/eosio-dashboard',
    icon: <GitHubIcon />
  },
  {
    name: 'telegram',
    path: 'https://github.com/eoscostarica/eosio-dashboard',
    icon: <TelegramIcon />
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
