import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled, { createGlobalStyle } from 'styled-components'
import { spacing } from '@material-ui/system'
import {
  Hidden,
  CssBaseline,
  Paper as MuiPaper,
  withWidth
} from '@material-ui/core'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import { isWidthUp } from '@material-ui/core/withWidth'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import Footer from '../components/Footer'
import PageTitle from '../components/PageTitle'
import { eosConfig } from '../config'

const drawerWidth = 260

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

const Root = styled.div`
  display: flex;
  min-height: 100vh;
`

const Drawer = styled.div`
  ${(props) => props.theme.breakpoints.up('md')} {
    width: ${drawerWidth}px;
    flex-shrink: 0;
  }
`

const AppContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 100%;
  overflow: hidden;
`

const Paper = styled(MuiPaper)(spacing)

const MainContent = styled(Paper)`
  flex: 1;
  background: ${(props) => props.theme.body.background};

  @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
    flex: none;
  }

  .MuiPaper-root .MuiPaper-root {
    box-shadow: none;
  }
`

const SubHeader = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${(props) => props.theme.spacing(4)}px;
`

const Network = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${(props) => props.theme.palette.primary.main};
  img {
    width: 56px;
    height: 56px;
    border-radius: 100%;
    background-color: ${(props) => props.theme.palette.primary.contrastText};
  }
  border-radius: 8px 16px 16px 8px;
  padding-left: 24px;
  min-width: 220px;
  color: ${(props) => props.theme.palette.primary.contrastText};
`

const Dashboard = ({ children, width, ual }) => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { t } = useTranslation('routes')
  const location = useLocation()

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  return (
    <Root>
      <CssBaseline />
      <GlobalStyle />
      <PageTitle title={t(`${location.pathname}>title`)} />
      <Drawer>
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
      </Drawer>
      <AppContent>
        <Header onDrawerToggle={handleDrawerToggle} ual={ual} />
        <MainContent p={isWidthUp('lg', width) ? 6 : 4}>
          <SubHeader>
            <Typography variant="h3">
              {t(`${location.pathname}>heading`)}
            </Typography>
            <Network>
              <Typography component="p" variant="h5">
                {eosConfig.networkLabel}
              </Typography>
              <img src={eosConfig.networkLogo} alt="network logo" />
            </Network>
          </SubHeader>
          {children}
        </MainContent>
        <Footer />
      </AppContent>
    </Root>
  )
}

Dashboard.propTypes = {
  children: PropTypes.node,
  width: PropTypes.any,
  ual: PropTypes.any
}

export default withWidth()(Dashboard)
