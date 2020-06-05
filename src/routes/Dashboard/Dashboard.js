import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Route, Redirect, Switch } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'

import { MainContainer } from '../../containers'
import { formatWithThousandSeparator } from '../../utils'

import DashboardCountries from './DashboardCountries'
import DashboardTopbar from './DashboardTopbar'
import DashboardSidebar from './DashboardSidebar'
import DashboardProducers from './DashboardProducers'
import DashboardNodes from './DashboardNodes'

const Dashboard = () => {
  const dispatch = useDispatch()
  const info = useSelector((state) => state.eos.info)

  useEffect(() => {
    dispatch.eos.startTrackingInfo({ interval: 1000 })
  }, [dispatch])

  return (
    <MainContainer
      topbarContent={<DashboardTopbar />}
      sidebarContent={<DashboardSidebar />}
    >
      <Grid container spacing={4}>
        <Grid item xl={3} lg={3} sm={6} xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6">Last Block</Typography>
              <Typography variant="h3">
                {formatWithThousandSeparator(info.head_block_num)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xl={3} lg={3} sm={6} xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6">Produced by</Typography>
              <Typography variant="h3">{info.head_block_producer}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xl={3} lg={3} sm={6} xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6">Last irreversible block</Typography>
              <Typography variant="h3">
                {formatWithThousandSeparator(info.last_irreversible_block_num)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xl={3} lg={3} sm={6} xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6">Server version</Typography>
              <Typography variant="h3">{info.server_version_string}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Switch>
          <Route
            exact
            path="/dashboard/producers"
            component={DashboardProducers}
          />
          <Route exact path="/dashboard/nodes" component={DashboardNodes} />
          <Route
            exact
            path="/dashboard/countries"
            component={DashboardCountries}
          />
          <Redirect from="/dashboard" to="/dashboard/producers" />
        </Switch>
      </Grid>
    </MainContainer>
  )
}

export default Dashboard
