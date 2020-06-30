import React, { Suspense } from 'react'
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'
import { useSelector } from 'react-redux'

import routes from './routes'
import { MainContainer } from './containers'
import Snackbar from './components/Snackbar'
import Topbar from './components/Topbar'
import Sidebar from './components/Sidebar'

export default () => {
  const snackbarState = useSelector((state) => state.snackbar)

  return (
    <BrowserRouter>
      <Snackbar {...snackbarState} />
      <MainContainer topbarContent={<Topbar />} sidebarContent={<Sidebar />}>
        <Suspense fallback={<div>Loading...</div>}>
          <Switch>
            {routes.map((route, index) => (
              <Route {...route} key={`route-${index}`} />
            ))}
            <Redirect exact from="/" to="/dashboard" />
            <Redirect to="/" />
          </Switch>
        </Suspense>
      </MainContainer>
    </BrowserRouter>
  )
}
