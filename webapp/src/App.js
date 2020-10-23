import React, { Suspense } from 'react'
import PropTypes from 'prop-types'
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { SharedStateProvider } from './context/state.context'
import routes from './routes'
import { MainContainer } from './containers'
import Snackbar from './components/Snackbar'
import Topbar from './components/Topbar'
import Sidebar from './components/Sidebar'

const App = ({ ual = {} }) => {
  const snackbarState = useSelector((state) => state.snackbar)
  const handleOnLogout = () => ual.logout()
  const handleOnLogin = () => ual.showModal()

  return (
    <BrowserRouter>
      <SharedStateProvider>
        <Snackbar {...snackbarState} />
        <MainContainer
          topbarContent={
            <Topbar
              user={ual.activeUser}
              onLogout={handleOnLogout}
              onLogin={handleOnLogin}
            />
          }
          sidebarContent={<Sidebar />}
        >
          <Suspense fallback={<div>Loading...</div>}>
            <Switch>
              {routes.map(({ path, component: Component }) => (
                <Route key={`path-${path}`} path={path}>
                  <Component ual={ual} />
                </Route>
              ))}
              <Redirect exact from="/" to="/dashboard" />
              <Redirect to="/" />
            </Switch>
          </Suspense>
        </MainContainer>
      </SharedStateProvider>
    </BrowserRouter>
  )
}

App.propTypes = {
  ual: PropTypes.object
}

export default App
