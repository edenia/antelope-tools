import React, { lazy, Suspense } from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'

import { generalConfig } from '../../config'

const DashboardRewards = lazy(() => import('./DashboardRewards'))
const DashboardProducers = lazy(() => import('./DashboardProducers'))
const DashboardNodes = lazy(() => import('./DashboardNodes'))
const DashboardHome = lazy(() => import('./DashboardHome'))

const Dashboard = () => (
  <Grid container spacing={4}>
    <Suspense fallback={<></>}>
      <Switch>
        <Route exact path="/dashboard/home" component={DashboardHome} />
        <Route
          exact
          path="/dashboard/producers"
          component={DashboardProducers}
        />
        <Route exact path="/dashboard/nodes" component={DashboardNodes} />
        {generalConfig.useRewards && (
          <Route exact path="/dashboard/rewards" component={DashboardRewards} />
        )}
        <Redirect from="/dashboard" to="/dashboard/home" />
      </Switch>
    </Suspense>
  </Grid>
)

export default Dashboard
