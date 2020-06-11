import React, { useEffect, lazy, Suspense } from 'react'
import { useDispatch } from 'react-redux'
import { Route, Redirect, Switch } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'

import { MainContainer } from '../../containers'

import DashboardTopbar from './DashboardTopbar'
import DashboardSidebar from './DashboardSidebar'

const DashboardRewards = lazy(() => import('./DashboardRewards'))
const DashboardProducers = lazy(() => import('./DashboardProducers'))
const DashboardNodes = lazy(() => import('./DashboardNodes'))

const Dashboard = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch.eos.startTrackingInfo({ interval: 1000 })
  }, [dispatch])

  return (
    <MainContainer
      topbarContent={<DashboardTopbar />}
      sidebarContent={<DashboardSidebar />}
    >
      <Grid container spacing={4}>
        <Suspense fallback={<></>}>
          <Switch>
            <Route
              exact
              path="/dashboard/producers"
              component={DashboardProducers}
            />
            <Route exact path="/dashboard/nodes" component={DashboardNodes} />
            <Route
              exact
              path="/dashboard/rewards"
              component={DashboardRewards}
            />
            <Redirect from="/dashboard" to="/dashboard/producers" />
          </Switch>
        </Suspense>
      </Grid>
    </MainContainer>
  )
}

export default Dashboard
