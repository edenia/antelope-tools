import React, { lazy } from 'react'
import {
  Activity as ActivityIcon,
  Grid as GridIcon,
  Users as UsersIcon,
  Server as ServerIcon,
  Sliders as SlidersIcon,
  User as UserIcon,
  UserX as UserXIcon,
  Info as InfoIcon,
  HelpCircle as HelpIcon,
  Inbox as InboxIcon,
  Cpu as CpuIcon,
  BarChart as BarChartIcon,
} from 'react-feather'
import QueryStatsIcon from '@mui/icons-material/QueryStats'
import StackedLineChartIcon from '@mui/icons-material/StackedLineChart'
import ListAltOutlined from '@mui/icons-material/ListAltOutlined';

import { eosConfig, generalConfig } from '../config'
import {
  BlockDistributionSvg,
  ConfigSvg,
  RewardsDistributionSvg,
  BPJsonSvg,
  EndpointSvg,
  MissingBlocksSvg,
  TopologySvg,
  RewardsSvg,
} from '../components/Icons'

const Home = lazy(() => import('./Home'))
const CPUBenchmark = lazy(() => import('./CPUBenchmark'))
const EndpointsStats = lazy(() => import('./EndpointsStats'))
const BlockProducers = lazy(() => import('./BlockProducers'))
const RewardsDistribution = lazy(() => import('./RewardsDistribution'))
const Nodes = lazy(() => import('./Nodes'))
const NodesDistribution = lazy(() => import('./NodesDistribution'))
const Accounts = lazy(() => import('./Accounts'))
const BPJson = lazy(() => import('./BPJson'))
const Faucet = lazy(() => import('./Faucet'))
const RicardianContract = lazy(() => import('./RicardianContract'))
const About = lazy(() => import('./About'))
const Help = lazy(() => import('./Help'))
const Page404 = lazy(() => import('./Page404'))
const BlockDistribution = lazy(() => import('./BlockDistribution'))
const MissedBlocks = lazy(() => import('./MissedBlocks'))
const EndpointsList = lazy(() => import('./EndpointsList'))
const NonCompliantBPs = lazy(() => import('./NonCompliantBPs'))
const StressTestDashboard = lazy(() => import('./StressTestDashboard'))
const EVMDashboard = lazy(() => import('./EVMDashboard'))
const EVMEndpointsList = lazy(() => import('./EVMEndpointsList'))
const LacchainNetwork = lazy(() => import('./Lacchain/LacchainNetwork'))
const LacchainManagement = lazy(() => import('./Lacchain/LacchainManagement'))
const LacchainNodeConfig = lazy(() => import('./Lacchain/LacchainNodeConfig'))

const defaultRoutes = [
  {
    header: 'networkInformation',
    name: 'home',
    icon: <GridIcon />,
    component: Home,
    path: '/',
    exact: true,
  },
  {
    name: 'blockProducers',
    icon: <UsersIcon />,
    component: BlockProducers,
    path: '/block-producers',
    exact: true,
  },
  {
    name: 'nonCompliantBPs',
    icon: <UserXIcon />,
    component: NonCompliantBPs,
    path: '/undiscoverable-bps',
    exact: true,
  },
  {
    name: 'nodes',
    icon: <ServerIcon />,
    component: Nodes,
    path: '/nodes',
    exact: true,
  },
  {
    name: 'endpointsList',
    icon: <EndpointSvg />,
    component: EndpointsList,
    path: '/endpoints',
    exact: true,
  },
  {
    name: 'nodesDistribution',
    icon: <RewardsDistributionSvg />,
    component: NodesDistribution,
    path: '/nodes-distribution',
    exact: true,
  },
  {
    name: 'rewardsDistribution',
    icon: <RewardsSvg />,
    component: RewardsDistribution,
    path: '/rewards-distribution',
    exact: true,
  },
  {
    name: 'blockDistribution',
    icon: <BlockDistributionSvg />,
    component: BlockDistribution,
    path: '/block-distribution',
    exact: true,
  },
  {
    name: 'missedBlocks',
    icon: <InboxIcon />,
    component: MissedBlocks,
    path: '/missed-blocks',
    exact: true,
  },
  {
    name: 'stressTest',
    icon: <BarChartIcon />,
    component: StressTestDashboard,
    path: '/stress-test',
    exact: true,
  },
  {
    name: 'cpuBenchmark',
    icon: <ActivityIcon />,
    component: CPUBenchmark,
    path: '/cpu-benchmark',
    exact: true,
  },
  {
    name: 'endpointsStats',
    icon: <QueryStatsIcon />,
    component: EndpointsStats,
    path: '/endpoints-stats',
    exact: true,
  },
  {
    name: 'ricardianContract',
    icon: <InfoIcon />,
    component: RicardianContract,
    path: '/ricardian-contract',
    exact: true,
  },
  {
    header: 'EVM',
    name: 'evm',
    icon: <StackedLineChartIcon />,
    component: EVMDashboard,
    path: '/evm',
    exact: true,
  },
  {
    name: 'evm-rpc-endpoints',
    icon: <ListAltOutlined />,
    component: EVMEndpointsList,
    path: '/evm-rpc-endpoints',
    exact: true,
  },
  {
    header: 'tools',
    name: 'accounts',
    icon: <UserIcon />,
    component: Accounts,
    path: '/accounts',
    exact: true,
  },
  {
    name: 'bpJson',
    icon: <BPJsonSvg />,
    component: BPJson,
    path: '/bpjson',
    exact: true,
  },
]

const lacchainRoutes = [
  {
    header: 'networkInformation',
    name: 'home',
    icon: <GridIcon />,
    component: Home,
    path: '/',
    exact: true,
  },
  {
    name: 'entities',
    icon: <UsersIcon />,
    component: BlockProducers,
    path: '/entities',
    exact: true,
  },
  {
    name: 'nodes',
    icon: <ServerIcon />,
    component: Nodes,
    path: '/nodes',
    exact: true,
  },
  {
    name: 'endpointsList',
    icon: <EndpointSvg />,
    component: EndpointsList,
    path: '/endpoints',
    exact: true,
  },
  {
    name: 'endpointsStats',
    icon: <QueryStatsIcon />,
    component: EndpointsStats,
    path: '/endpoints-stats',
    exact: true,
  },
  {
    name: 'lacchainNetwork',
    icon: <TopologySvg />,
    component: LacchainNetwork,
    path: '/lacchain/network',
    exact: true,
  },
  {
    name: 'nodesDistribution',
    icon: <RewardsDistributionSvg />,
    component: NodesDistribution,
    path: '/nodes-distribution',
    exact: true,
  },
  {
    name: 'blockDistribution',
    icon: <BlockDistributionSvg />,
    component: BlockDistribution,
    path: '/block-distribution',
    exact: true,
  },
  {
    name: 'missedBlocks',
    icon: <MissingBlocksSvg />,
    component: MissedBlocks,
    path: '/missed-blocks',
    exact: true,
  },
  {
    name: 'cpuBenchmark',
    icon: <ActivityIcon />,
    component: CPUBenchmark,
    path: '/cpu-benchmark',
    exact: true,
  },
  {
    name: 'ricardianContract',
    icon: <InfoIcon />,
    component: RicardianContract,
    path: '/ricardian-contract',
    exact: true,
  },
  {
    header: 'tools',
    name: 'accounts',
    icon: <UserIcon />,
    component: Accounts,
    path: '/accounts',
    exact: true,
  },
  {
    name: 'lacchainManagement',
    icon: <SlidersIcon />,
    component: LacchainManagement,
    path: '/management',
    exact: true,
  },
  {
    name: 'lacchainNodeConfig',
    icon: <ConfigSvg />,
    component: LacchainNodeConfig,
    path: '/node-config',
    exact: true,
  },
]
const advanceRoutes = [
  {
    name: 'faucet',
    icon: <CpuIcon />,
    component: Faucet,
    path: '/faucet',
    exact: true,
  },
]
const helpRoutes = [
  {
    header: 'docs',
    name: 'About',
    icon: <InfoIcon />,
    component: About,
    path: '/about',
    exact: true,
  },
  {
    name: 'Help',
    icon: <HelpIcon />,
    component: Help,
    path: '/help',
    exact: true,
  },
  {
    component: Page404,
    path: '*',
  },
]

let routes = []

switch (eosConfig.networkName) {
  case 'lacchain':
    routes = [...lacchainRoutes, ...helpRoutes]
    break
  case 'ultra-testnet':
  case 'libre-testnet':
    routes = [...defaultRoutes, ...advanceRoutes, ...helpRoutes]
    break
  default:
    routes = [...defaultRoutes, ...helpRoutes]
    break
}
routes = routes.filter(
  (route) => !generalConfig.disabledMenuItems.includes(route.path),
)

export default routes
