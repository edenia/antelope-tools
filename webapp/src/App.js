import React, { Suspense } from 'react'
import PropTypes from 'prop-types'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import { SharedStateProvider } from './context/state.context'
import routes from './routes'
import Loader from './components/Loader'

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
      icon,
      path,
      layout: Layout = ({ children }) => <>{children}</>,
      component: Component,
      ...props
    },
    index
  ) => (
    <Route
      key={`path-${name}-${index}`}
      path={path}
      {...props}
      render={(props) => (
        <Layout ual={ual}>
          <Suspense fallback={<Loader />}>
            <Component ual={ual} {...props} />
          </Suspense>
        </Layout>
      )}
    />
  )

  return (
    <SharedStateProvider>
      <BrowserRouter>
        <Switch>{routes.map(renderRoutes)}</Switch>
      </BrowserRouter>
    </SharedStateProvider>
  )
}

App.propTypes = {
  ual: PropTypes.object
}

export default App
