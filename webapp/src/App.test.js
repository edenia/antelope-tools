import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { ApolloProvider } from '@apollo/react-hooks'
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles'
import { StylesProvider } from '@material-ui/styles'
import { ThemeProvider } from 'styled-components'
import configureStore from 'redux-mock-store'

import App from './App'
import theme from './theme'
import { client } from './graphql'
import './i18n'

const mockStore = configureStore()

it('renders without crashing', () => {
  const div = document.createElement('div')
  const initialState = {
    user: {},
    loading: { effects: { user: { login: false } } }
  }
  const store = mockStore(initialState)

  ReactDOM.render(
    <ApolloProvider client={client}>
      <Provider store={store}>
        <StylesProvider injectFirst>
          <MuiThemeProvider theme={theme[0]}>
            <ThemeProvider theme={theme[0]}>
              <App />
            </ThemeProvider>
          </MuiThemeProvider>
        </StylesProvider>
      </Provider>
    </ApolloProvider>,
    div
  )
  ReactDOM.unmountComponentAtNode(div)
})
