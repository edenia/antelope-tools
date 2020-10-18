import React from 'react'
import { makeStyles } from '@material-ui/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Button from '@material-ui/core/Button'
import * as colors from '@material-ui/core/colors'
import StorageIcon from '@material-ui/icons/Storage'
import CloudIcon from '@material-ui/icons/Language'
import DashboardIcon from '@material-ui/icons/Dashboard'
import LiveHelpIcon from '@material-ui/icons/LiveHelp'
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet'
import ListAltIcon from '@material-ui/icons/ListAlt'
import Divider from '@material-ui/core/Divider'
import DeveloperBoardIcon from '@material-ui/icons/DeveloperBoard'
import SettingsInputAntennaIcon from '@material-ui/icons/SettingsInputAntenna'
import { useTranslation } from 'react-i18next'

import { generalConfig } from '../config'
import CustomRouterLink from './CustomRouterLink'

const useStyles = makeStyles((theme) => ({
  nav: {
    marginBottom: theme.spacing(2)
  },
  divider: {
    margin: theme.spacing(2, 0)
  },
  item: {
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0
  },
  button: {
    padding: theme.spacing(1, 2),
    color: colors.blueGrey[800],
    justifyContent: 'flex-start',
    textTransform: 'none',
    letterSpacing: 0,
    width: '100%',
    fontWeight: theme.typography.fontWeightMedium
  },
  icon: {
    color: theme.palette.icon,
    width: 24,
    height: 24,
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(1)
  },
  active: {
    backgroundColor: theme.palette.primary[200],
    borderRadius: 0,
    color: theme.palette.primary.main,
    fontWeight: theme.typography.fontWeightMedium,
    '& $icon': {
      color: theme.palette.primary.main
    },
    '&:hover': {
      backgroundColor: theme.palette.primary[200]
    }
  }
}))

const DashboardSidebarContent = () => {
  const classes = useStyles()
  const { t } = useTranslation('sidebar')

  const mainPages = [
    {
      title: t('dashboard'),
      href: '/dashboard/home',
      icon: <DashboardIcon />
    },
    {
      title: t('networkInfo'),
      href: '/dashboard/network',
      icon: <LiveHelpIcon />
    },
    {
      title: t('blockProducer'),
      href: '/dashboard/producers',
      icon: <StorageIcon />
    },
    {
      title: t('nodeDistribution'),
      href: '/dashboard/nodes',
      icon: <CloudIcon />
    }
  ]

  if (generalConfig.useLanguageSufix === 'lacchain') {
    mainPages.push({
      title: t('nodesNetwork'),
      href: '/lacchain-nodes-network',
      icon: <SettingsInputAntennaIcon />
    })
    mainPages.push({
      title: t('lacchainBoard'),
      href: '/lacchain',
      icon: <DeveloperBoardIcon />
    })
  }

  mainPages.push({
    title: t('smartContract'),
    href: '/smart-contract',
    icon: <ListAltIcon />
  })

  if (generalConfig.useRewards) {
    mainPages.push({
      title: t('rewardDistribution'),
      href: '/dashboard/rewards',
      icon: <AccountBalanceWalletIcon />
    })
  }

  const helperPages = [
    {
      title: t('nodeInfo'),
      href: '/bpjson'
    },
    {
      title: t('about'),
      href: '/about'
    }
  ]

  if (generalConfig.useBlockProducerAgreementContract) {
    helperPages.push({
      title: t('ricardianContract'),
      href: '/ricardian-contract'
    })
  }

  helperPages.push({
    title: t('help'),
    href: '/help'
  })

  return (
    <List className={classes.nav}>
      {mainPages.map((page) => (
        <ListItem className={classes.item} disableGutters key={page.title}>
          <Button
            activeClassName={classes.active}
            className={classes.button}
            component={CustomRouterLink}
            to={page.href}
          >
            {page.icon && <div className={classes.icon}>{page.icon}</div>}
            {page.title}
          </Button>
        </ListItem>
      ))}
      <Divider className={classes.divider} />
      {helperPages.map((page) => (
        <ListItem className={classes.item} disableGutters key={page.title}>
          <Button
            activeClassName={classes.active}
            className={classes.button}
            component={CustomRouterLink}
            to={page.href}
          >
            {page.icon && <div className={classes.icon}>{page.icon}</div>}
            {page.title}
          </Button>
        </ListItem>
      ))}
    </List>
  )
}

DashboardSidebarContent.propTypes = {}

export default DashboardSidebarContent
