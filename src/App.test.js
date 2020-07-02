import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import { ThemeProvider } from '@material-ui/core/styles'

import App from './App'
import theme from './theme'

const mockStore = configureStore()

it('renders without crashing', () => {
  const div = document.createElement('div')
  const initialState = {
    user: {},
    loading: { effects: { user: { login: false } } }
  }
  const store = mockStore(initialState)

  ReactDOM.render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Provider>,
    div
  )
  ReactDOM.unmountComponentAtNode(div)
})
