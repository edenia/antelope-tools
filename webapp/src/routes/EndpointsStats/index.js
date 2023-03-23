/* eslint camelcase: 0 */
import React from 'react'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import Autocomplete from '@mui/material/Autocomplete'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import LinearProgress from '@mui/material/LinearProgress'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import useHealthCheckState from '../../hooks/customHooks/useHealthCheckHistoryState'

import styles from './styles'
import EndpointsTable from './EndpointStatsTable'

const useStyles = makeStyles(styles)

const EndpointsStats = () => {
  const { t } = useTranslation('EndpointsStatsRoute')
  const classes = useStyles()
  const [
    {
      fastestEndpoints,
      producersNames,
      historyData,
      dates,
      statsAverage,
      selectedName,
      loading,
    },
    { setSelected, setSelectedName },
  ] = useHealthCheckState()

  const options = {
    xAxis: {
      categories: dates,
    },
    credits: {
      enabled: false,
    },
    title: {
      text: t('charTitle'),
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
          {producersNames?.length && (
            <Autocomplete
              className={classes.select}
              options={producersNames.map(producer => producer.name)}
              value={selectedName}
              onChange={(_event, newValue) => {
                const producer = producersNames.find(
                  producer => producer.name === newValue,
                )

                if (!producer) return

                setSelected(producer.id)
              }}
              inputValue={selectedName}
              onInputChange={(_event, newInputValue) => {
                setSelectedName(newInputValue)
              }}
              renderInput={params => (
                <TextField {...params} label={t('producerName')} />
              )}
            />
          )}
          {historyData && (
            <HighchartsReact
              highcharts={Highcharts}
              options={{
                ...options,
                xAxis: {
                  categories: dates,
                },
                series: historyData,
              }}
            />
          )}
          {statsAverage && (
            <EndpointsTable title={t('list')} endpoints={statsAverage} />
          )}
        </CardContent>
      </Card>
    </>
  )
}

export default EndpointsStats
