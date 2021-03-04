import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { UALProvider, withUAL } from '@eoscostarica/ual-reactjs-renderer'
import { ApolloProvider } from '@apollo/react-hooks'
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles'
import { StylesProvider } from '@material-ui/styles'
import { ThemeProvider } from 'styled-components'

import App from './App'
import store from './store'
import theme from './theme'
import { client } from './graphql'
import * as serviceWorker from './serviceWorker'
import './i18n'
import { ualConfig } from './config'

const AppWithUAL = withUAL(App)

render(
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
  </UALProvider>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register()
