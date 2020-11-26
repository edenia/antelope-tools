import React, { Suspense } from 'react'
import PropTypes from 'prop-types'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import { SharedStateProvider } from './context/state.context'
import routes from './routes'
import Loader from './components/Loader'
import DashboardLayout from './layouts/Dashboard'

const App = ({ ual = {} }) => {
  const renderRoutes = ({ children, component, ...props }, index) => {
    if (Array.isArray(children) && children.length > 0) {
      return children.map(renderRoute)
    }

    if (component) {
      return renderRoute({ ...props, component }, index)
    }

    return <></>
  }

  const renderRoute = (
    {
      name,
      header,
      icon,
      path,
      // layout: Layout = ({ children }) => <>{children}</>,
      component: Component,
      ...props
    },
    index
  ) => (
    <Route
      key={`path-${name}-${index}`}
      path={path}
      {...props}
      state={{ a: true }}
      // render={(props) => (

      // )}
    >
      <Component ual={ual} {...props} />
    </Route>
  )

  return (
    <SharedStateProvider>
      <BrowserRouter>
        <DashboardLayout ual={ual}>
          <Suspense fallback={<Loader />}>
            <Switch>{routes.map(renderRoutes)}</Switch>
          </Suspense>
        </DashboardLayout>
      </BrowserRouter>
    </SharedStateProvider>
  )
}

App.propTypes = {
  ual: PropTypes.object
}

export default App
