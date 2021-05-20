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
  Send as TelegramIcon,
  Inbox as InboxIcon
} from 'react-feather'

import { eosConfig, generalConfig } from '../config'

const Home = lazy(() => import('./Home'))
const CPUBenchmark = lazy(() => import('./CPUBenchmark'))
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
const BlockDistribution = lazy(() => import('./BlockDistribution'))
const MissedBlocks = lazy(() => import('./MissedBlocks'))
const EndpointsList = lazy(() => import('./EndpointsList'))
const LacchainNetwork = lazy(() => import('./Lacchain/LacchainNetwork'))
const LacchainManagement = lazy(() => import('./Lacchain/LacchainManagement'))
const LacchainNodeConfig = lazy(() => import('./Lacchain/LacchainNodeConfig'))

const defaultRoutes = [
  {
    name: 'home',
    icon: <GridIcon />,
    component: Home,
    path: '/',
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
    name: 'nodes',
    icon: <ServerIcon />,
    component: Nodes,
    path: '/nodes',
    exact: true
  },
  {
    name: 'endpointsList',
    icon: <InboxIcon />,
    component: EndpointsList,
    path: '/endpoints',
    exact: true
  },
  {
    name: 'cpuBenchmark',
    icon: <ActivityIcon />,
    component: CPUBenchmark,
    path: '/cpu-benchmark',
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
    name: 'blockDistribution',
    icon: <InboxIcon />,
    component: BlockDistribution,
    path: '/block-distribution',
    exact: true
  },
  {
    name: 'missedBlocks',
    icon: <InboxIcon />,
    component: MissedBlocks,
    path: '/missed-blocks',
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
    icon: <InfoIcon />,
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
    name: 'endpointsList',
    icon: <InboxIcon />,
    component: EndpointsList,
    path: '/endpoints',
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
    name: 'nodesDistribution',
    icon: <MapIcon />,
    component: NodesDistribution,
    path: '/nodes-distribution',
    exact: true
  },
  {
    name: 'blockDistribution',
    icon: <InboxIcon />,
    component: BlockDistribution,
    path: '/block-distribution',
    exact: true
  },
  {
    name: 'missedBlocks',
    icon: <InboxIcon />,
    component: MissedBlocks,
    path: '/missed-blocks',
    exact: true
  },
  {
    name: 'cpuBenchmark',
    icon: <ActivityIcon />,
    component: CPUBenchmark,
    path: '/cpu-benchmark',
    exact: true
  },
  {
    name: 'ricardianContract',
    icon: <InfoIcon />,
    component: RicardianContract,
    path: '/ricardian-contract',
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
    name: 'lacchainNodeConfig',
    icon: <SlidersIcon />,
    component: LacchainNodeConfig,
    path: '/node-config',
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
    path: 'https://github.com/eoscostarica/eosio-dashboard/releases',
    icon: <GitMergeIcon />,
    exact: true
  },
  {
    header: 'community',
    name: 'github',
    path: 'https://github.com/eoscostarica/eosio-dashboard',
    icon: <GitHubIcon />
  },
  {
    name: 'telegram',
    path: 'https://t.me/blockchaincostarica',
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
routes = routes.filter(
  (route) => !generalConfig.disabledMenuItems.includes(route.path)
)

export default routes
