import React from 'react'
import PropTypes from 'prop-types'
import styled, { createGlobalStyle } from 'styled-components'

import { CssBaseline } from '@mui/material'

const GlobalStyle = createGlobalStyle`
  html,
  body,
  #root {
    height: 100%;
  }

  body {
    background: ${(props) => props.theme.background.light};
  }
`

const Root = styled.div`
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  display: flex;
  min-height: 100%;
`

const StandAlone = ({ children }) => (
  <Root>
    <CssBaseline />
    <GlobalStyle />
    {children}
  </Root>
)

StandAlone.propTypes = {
  children: PropTypes.node
}

export default StandAlone
