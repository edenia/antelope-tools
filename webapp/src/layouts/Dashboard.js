import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { createGlobalStyle } from 'styled-components'
import { makeStyles } from '@mui/styles'
import Hidden from '@mui/material/Hidden'
import CssBaseline from '@mui/material/CssBaseline'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import Grid from '@mui/material/Grid'
import useMediaQuery from '@mui/material/useMediaQuery'

import Sidebar from '../components/Sidebar'
import NetworkSelector from '../components/NetworkSelector'
import Header from '../components/Header'
import Footer from '../components/Footer'
import PageTitle from '../components/PageTitle'
import SnackbarMessage from '../components/SnackbarMessage'
import { eosConfig, generalConfig } from '../config'
import { useSharedState } from '../context/state.context'
import routes from '../routes'

import styles from './styles'

const drawerWidth = 260
const INIT_VALUES = {
  dynamicTitle: '',
  networkTitle: '',
  pathname: null,
}
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
  const [lacchain] = useSharedState()
  const [routeName, setRouteName] = useState(INIT_VALUES)
  const isTablet = useMediaQuery('(min-width:767px)')
  const [xsSize, setXsSize] = useState(12)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  useEffect(() => {
    isTablet ? setXsSize(6) : setXsSize(12)
  }, [isTablet])

  useEffect(() => {
    if (routes.some((route) => route.path === location.pathname)) {
      const managementCardTitle = lacchain.dynamicTitle || ''

      setRouteName({
        dynamicTitle:
          location.pathname === '/management'
            ? managementCardTitle
            : t(`${location.pathname}>heading`),
        networkTitle: location.pathname === '/' ? eosConfig.networkLabel : '',
        pathname: location.pathname,
        pageTitle: `${location.pathname}>title`,
      })
    } else {
      setRouteName(INIT_VALUES)
    }
    // eslint-disable-next-line
  }, [location.pathname, lacchain.dynamicTitle, t])

  return (
    <div className={classes.root}>
      <CssBaseline />
      <GlobalStyle />
      <PageTitle title={t(routeName.pageTitle)} />
      <div className={classes.drawer}>
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
      </div>
      <div className={classes.appContent}>
        <Header onDrawerToggle={handleDrawerToggle} ual={ual} />
        <div className={classes.mainContent}>
          <div className={classes.subHeader}>
            <div className={classes.boxHeader}>
              <Grid container>
                <Grid item md={12} xs={xsSize}>
                  <Typography
                    variant="h3"
                    className={clsx(
                      classes.textAlignReadMore,
                      classes.marginBottom
                    )}
                  >
                    {routeName.pathname
                      ? `${routeName.dynamicTitle} ${routeName.networkTitle}`
                      : ''}
                  </Typography>
                </Grid>
                <Grid item md={12} xs={12}>
                  <Typography className={classes.textAlignReadMore}>
                    {t(`${location.pathname}>moreDescription`)}
                  </Typography>
                </Grid>
              </Grid>
            </div>
            <NetworkSelector
              title={eosConfig.networkLabel}
              networkLogo={eosConfig.networkLogo}
              options={generalConfig.networkLinks}
            />
          </div>
          {children}
        </div>
        <Footer />
      </div>
      <SnackbarMessage />
    </div>
  )
}

Dashboard.propTypes = {
  children: PropTypes.node,
  width: PropTypes.any,
  ual: PropTypes.any,
}

export default Dashboard
