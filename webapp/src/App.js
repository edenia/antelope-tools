import React, { Suspense } from 'react'
import PropTypes from 'prop-types'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'

import { SharedStateProvider } from './context/state.context'
import { SnackbarMessageProvider } from './context/snackbar-message.context'
import routes from './routes'
import Loader from './components/Loader'
import DashboardLayout from './layouts/Dashboard'

import { recaptchaConfig } from './config'

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
    { name, header, icon, path, component: Component, ...props },
    index
  ) => (
    <Route
      key={`path-${name}-${index}`}
      path={path}
      {...props}
      state={{ a: true }}
    >
      <Component ual={ual} {...props} />
    </Route>
  )

  return (
    <SharedStateProvider>
      <SnackbarMessageProvider>
        <BrowserRouter>
          <GoogleReCaptchaProvider
            reCaptchaKey={recaptchaConfig.key}
            useEnterprise={true}
          >
            <DashboardLayout ual={ual}>
              <Suspense fallback={<Loader />}>
                <Switch>
                  {routes
                    .filter((route) => !route?.path?.includes('http'))
                    .map(renderRoutes)}
                </Switch>
              </Suspense>
            </DashboardLayout>
          </GoogleReCaptchaProvider>
        </BrowserRouter>
      </SnackbarMessageProvider>
    </SharedStateProvider>
  )
}

App.propTypes = {
  ual: PropTypes.object
}

export default App
