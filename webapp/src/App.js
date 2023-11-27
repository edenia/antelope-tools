import React, { Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'

import { SharedStateProvider } from './context/state.context'
import { SnackbarMessageProvider } from './context/snackbar-message.context'
import routes from './routes'
import Loader from './components/Loader'
import DashboardLayout from './layouts/Dashboard'

import { recaptchaConfig } from './config'
import { localizeRoutes } from 'utils/url-localization'

const App = () => {
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
    index,
  ) => (
    <Route
      key={`path-${name}-${index}`}
      path={path}
      {...props}
      state={{ a: true }}
      element={<Component {...props} />}
    />
  )

  return (
    <SharedStateProvider>
      <SnackbarMessageProvider>
        <BrowserRouter>
          <GoogleReCaptchaProvider
            reCaptchaKey={recaptchaConfig.key}
            useEnterprise={true}
          >
            <DashboardLayout>
              <Suspense fallback={<Loader />}>
                <Routes>
                  {localizeRoutes(routes)
                    .filter((route) => !route?.path?.includes('http'))
                    .map(renderRoutes)}
                </Routes>
              </Suspense>
            </DashboardLayout>
          </GoogleReCaptchaProvider>
        </BrowserRouter>
      </SnackbarMessageProvider>
    </SharedStateProvider>
  )
}

export default App
