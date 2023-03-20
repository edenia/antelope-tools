/* eslint camelcase: 0 */
import React from 'react'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'
import MenuItem from '@mui/material/MenuItem'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import moment from 'moment'
import Select from '@mui/material/Select'
import { makeStyles } from '@mui/styles'

import useHealthCheckState from '../../hooks/customHooks/useHealthCheckHistoryState'

import styles from './styles'
import EndpointsTable from './EndpointStatsTable'

const useStyles = makeStyles(styles)

const EndpointsStats = () => {
  const { t } = useTranslation('EndpointsStatsRoute')
  const classes = useStyles()
  const [{fastestEndpoints,producersNames,historyData,dates,statsAverage,selected,loading},{setSelected}] = useHealthCheckState()

  const options = {
    xAxis: {
      categories: dates,
    },
    credits: {
      enabled: false,
    },
    title: {
      text: t('avgTime'),
    },
    yAxis: {
      title: {
        text: t('timeInSecs'),
      },
      labels: {
        format: '{text} s',
      },
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.y} s<b>',
    },
  }

  return (
    <>
      <Card className={classes.cardShadow}>
        <CardContent>
          {loading && <LinearProgress />}
          {!loading && (
          <EndpointsTable
            title={t('fastest')}
            endpoints={fastestEndpoints || []}
          />
          )}
        </CardContent>
      </Card>
      <Card className={`${classes.cardByProducer} ${classes.cardShadow}`}>
        <CardContent>
          <Typography component="p" variant="h6">
            {t('byProducer')}
          </Typography>
          <br />
          {producersNames?.length && (
            <Select value={selected} onChange={(event) => setSelected(event.target.value)}>
              {producersNames.map(producer => (
                <MenuItem key={producer.id} value={producer.id}>{producer.name}</MenuItem>
              ))}
            </Select>
          )}
          {historyData && (
          <HighchartsReact
            highcharts={Highcharts}
            options={{ ...options,xAxis: {
              categories: dates.map(x => moment(x).format('ll')),
            }, series: historyData }}
          />
          )}
          {statsAverage && (
          <EndpointsTable
            title={t('list')}
            endpoints={statsAverage}
          />
          )}
        </CardContent>
      </Card>
    </>
  )
}

export default EndpointsStats
