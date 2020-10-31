import React, { useState } from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import { spacing } from '@material-ui/system'
import {
  Hidden,
  CssBaseline,
  Paper as MuiPaper,
  withWidth
} from '@material-ui/core'
import { isWidthUp } from '@material-ui/core/withWidth'

import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import Footer from '../components/Footer'

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

const Dashboard = ({ children, width, ual }) => {
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  return (
    <Root>
      <CssBaseline />
      <GlobalStyle />
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
        <MainContent p={isWidthUp('lg', width) ? 10 : 5}>
          {children}
        </MainContent>
        <Footer />
      </AppContent>
    </Root>
  )
}

export default withWidth()(Dashboard)
