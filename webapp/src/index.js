import React from 'react'
import { Provider } from 'react-redux'
import { createRoot } from 'react-dom/client'
import { UALProvider, withUAL } from '@eoscostarica/ual-reactjs-renderer'
import { ApolloProvider } from '@apollo/client'
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import { StylesProvider } from '@mui/styles'
import { ThemeProvider } from 'styled-components'

import App from './App'
import store from './store'
import theme from './theme'
import { client } from './graphql'
import * as serviceWorker from './serviceWorker'
import './i18n'
import { ualConfig } from './config'

const AppWithUAL = withUAL(App)
const container = document.getElementById('root')
const root = createRoot(container)

root.render(
  <UALProvider
    chains={[ualConfig.network]}
    authenticators={ualConfig.authenticators}
    appName={ualConfig.appName}
  >
    <ApolloProvider client={client}>
      <Provider store={store}>
        <StylesProvider injectFirst>
          <MuiThemeProvider theme={theme[0]}>
            <ThemeProvider theme={theme[0]}>
              <AppWithUAL />
            </ThemeProvider>
          </MuiThemeProvider>
        </StylesProvider>
      </Provider>
    </ApolloProvider>
  </UALProvider>
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register()
