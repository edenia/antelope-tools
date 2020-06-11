import React, { Suspense } from 'react'
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'
import { useSelector } from 'react-redux'

import routes from './routes'
import Snackbar from './components/Snackbar'

export default () => {
  const snackbarState = useSelector((state) => state.snackbar)

  return (
    <BrowserRouter>
      <Snackbar {...snackbarState} />
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          {routes.map((route, index) => (
            <Route {...route} key={`route-${index}`} />
          ))}
          <Redirect exact from="/" to="/dashboard" />
          <Redirect to="/" />
        </Switch>
      </Suspense>
    </BrowserRouter>
  )
}
