import React from 'react'
import { createRoot } from 'react-dom/client'
import { ApolloProvider } from '@apollo/client'
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import { StylesProvider } from '@mui/styles'
import { ThemeProvider } from 'styled-components'

import App from './App'
import theme from './theme'
import { client } from './graphql'
import * as serviceWorker from './serviceWorker'
import './i18n'

const container = document.getElementById('root')
const root = createRoot(container)

root.render(
  <ApolloProvider client={client}>
    <StylesProvider injectFirst>
      <MuiThemeProvider theme={theme[0]}>
        <ThemeProvider theme={theme[0]}>
          <App />
        </ThemeProvider>
      </MuiThemeProvider>
    </StylesProvider>
  </ApolloProvider>,
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register()
