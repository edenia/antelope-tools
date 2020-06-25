import React from 'react'
import { makeStyles } from '@material-ui/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Button from '@material-ui/core/Button'
import * as colors from '@material-ui/core/colors'
import StorageIcon from '@material-ui/icons/Storage'
import CloudIcon from '@material-ui/icons/Language'
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet'

import CustomRouterLink from '../../components/CustomRouterLink'

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
    color: colors.blueGrey[800],
    padding: '10px 8px',
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
    color: theme.palette.primary.main,
    fontWeight: theme.typography.fontWeightMedium,
    '& $icon': {
      color: theme.palette.primary.main
    }
  }
}))

const DashboardSidebarContent = () => {
  const classes = useStyles()

  const pages = [
    {
      title: 'Block Producers',
      href: '/dashboard/producers',
      icon: <StorageIcon />
    },
    {
      title: 'Node distribution',
      href: '/dashboard/nodes',
      icon: <CloudIcon />
    },
    {
      title: 'Reward distribution',
      href: '/dashboard/rewards',
      icon: <AccountBalanceWalletIcon />
    }
  ]

  return (
    <>
      <List className={classes.nav}>
        {pages.map((page) => (
          <ListItem className={classes.item} disableGutters key={page.title}>
            <Button
              activeClassName={classes.active}
              className={classes.button}
              component={CustomRouterLink}
              to={page.href}
            >
              <div className={classes.icon}>{page.icon}</div>
              {page.title}
            </Button>
          </ListItem>
        ))}
      </List>
    </>
  )
}

DashboardSidebarContent.propTypes = {}

export default DashboardSidebarContent
