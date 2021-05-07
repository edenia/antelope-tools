import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { createGlobalStyle } from 'styled-components'
import { makeStyles } from '@material-ui/styles'
import Hidden from '@material-ui/core/Hidden'
import CssBaseline from '@material-ui/core/CssBaseline'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import { isWidthUp } from '@material-ui/core/withWidth'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

import Sidebar from '../components/Sidebar'
import NetworkSelector from '../components/NetworkSelector'
import Header from '../components/Header'
import Footer from '../components/Footer'
import PageTitle from '../components/PageTitle'
import { eosConfig, generalConfig } from '../config'

import styles from './styles'

const drawerWidth = 260
const useStyles = makeStyles((theme) => styles(theme, drawerWidth))

const GlobalStyle = createGlobalStyle`
  html,
  body,
  #root {
    height: 100%;
  }

  body {
    background: ${(props) => props.theme.body.background};
  }

  .MuiCardHeader-action .MuiIconButton-root {
    padding: 4px;
    width: 28px;
    height: 28px;
  }
`

const Dashboard = ({ children, width, ual }) => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const classes = useStyles()
  const { t } = useTranslation('routes')
  const location = useLocation()

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  return (
    <Box className={classes.root}>
      <CssBaseline />
      <GlobalStyle />
      <PageTitle title={t(`${location.pathname}>title`)} />
      <Box className={classes.drawer}>
        <Hidden mdUp implementation="js">
          <Sidebar
            PaperProps={{ style: { width: drawerWidth } }}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
          />
        </Hidden>
        <Hidden smDown implementation="css">
          <Sidebar PaperProps={{ style: { width: drawerWidth } }} />
        </Hidden>
      </Box>
      <Box className={classes.appContent}>
        <Header onDrawerToggle={handleDrawerToggle} ual={ual} />
        <Box className={classes.mainContent} p={isWidthUp('lg', width) ? 6 : 4}>
          <Box className={classes.subHeader}>
            <Typography variant="h3">
              {`${t(`${location.pathname}>heading`)} ${
                location.pathname === '/' ? generalConfig.title : ''
              }`}
            </Typography>
            <NetworkSelector
              title={eosConfig.networkLabel}
              networkLogo={eosConfig.networkLogo}
              options={[
                { label: 'EOS Mainnet', value: generalConfig.eosMainnet },
                { label: 'Jungle Testnet', value: generalConfig.jungleTestnet },
                {
                  label: 'LACChain Testnet',
                  value: generalConfig.lacchainTestnet
                }
              ]}
            />
          </Box>
          {children}
        </Box>
        <Footer />
      </Box>
    </Box>
  )
}

Dashboard.propTypes = {
  children: PropTypes.node,
  width: PropTypes.any,
  ual: PropTypes.any
}

export default Dashboard
