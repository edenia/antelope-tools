/* eslint camelcase: 0 */
import React, { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { makeStyles } from '@mui/styles'

import styles from './styles'

import { formatWithThousandSeparator, rangeOptions } from '../../utils'
import { CPU_BENCHMARK } from '../../gql'

const useStyles = makeStyles(styles)

const options = {
  chart: {
    type: 'spline',
    zoomType: 'x'
  },
  time: {
    timezoneOffset: new Date().getTimezoneOffset(),
  },
  title: {
    text: ' ',
  },
  xAxis: {
    type: 'datetime',
  },
  yAxis: {
    title: {
      text: ' ',
    },
    labels: {
      format: '{text} μs',
    },
  },
  tooltip: {
    pointFormat: '{series.name}: <b>{point.y} μs<b>',
  },
  credits: {
    enabled: false,
  },
  plotOptions: {
    series: {
      label: {
        connectorAllowed: false,
      },
      events: {},
    },
  },
  series: [],
}

const CPUBenchmark = () => {
  const { t } = useTranslation('cpuBenchmarkRoute')
  const [range, setRange] = useState(rangeOptions[0])
  const [series, setSeries] = useState([])
  const [producers, setProducers] = useState([])
  const [load, { loading, data }] = useLazyQuery(CPU_BENCHMARK)
  const classes = useStyles()

  const updateSeries = (name, visible) => {
    const targetIndex = series.findIndex(set => set.name === name)
    const seriesCopy = [...series]

    seriesCopy[targetIndex].visible = visible
    setSeries(seriesCopy)
  }

  options.plotOptions.series.events.hide = event => {
    updateSeries(event.target.getName(), false)
  }

  options.plotOptions.series.events.show = event => {
    updateSeries(event.target.getName(), true)
  }

  const areAllHidden = () => {
    return Boolean(series.length) && !series.some(set => set.visible)
  }

  const toggleAll = () => {
    setSeries(prev => {
      const visible = areAllHidden()

      return prev.map(set => {
        set.visible = visible
        return set
      })
    })
  }

  const getFixedNumber = (string, number) => {
    const index = string.indexOf(".")
    
    return parseFloat(string.substring(0,index) + "." + string.substring(index+1,index+1+number)) 
  }

  useEffect(() => {
    load({
      variables: { range },
    })
  }, [load, range])

  useEffect(() => {
    if (!data?.items) return

    const info = {}
    const summary = {}

    for (const item of data.items) {
      if (!info[item.account]) {
        const set = series.find(set => set.name === item.account)

        info[item.account] = {
          name: item.account,
          data: [],
          visible: set ? Boolean(set?.visible) : true,
        }
        summary[item.account] = {
          name: item.account,
          count: 0,
          index: 0,
          total: 0,
          average: 0,
          lowest: parseInt(item.usage),
          highest: 0,
        }
      }

      summary[item.account].count++
      info[item.account].data.push([
        new Date(item.datetime).getTime(),
        getFixedNumber(item.usage, 4),
      ])
    }

    setSeries(Object.values(info))

    for (const item of data.items) {
      const usage = parseInt(item.usage)

      summary[item.account].total += usage
      summary[item.account].index++
      summary[item.account].lowest =
        usage < summary[item.account].lowest
          ? usage
          : summary[item.account].lowest
      summary[item.account].highest =
        usage > summary[item.account].highest
          ? usage
          : summary[item.account].highest

      if (summary[item.account].index === summary[item.account].count) {
        summary[item.account].average =
          summary[item.account].total / summary[item.account].count
      }
    }

    setProducers(
      Object.values(summary).sort((a, b) => (a.average > b.average ? 1 : -1)),
    )
  }, [data])

  return (
    <Card className={classes.cardShadow}>
      <CardContent>
        <div className={classes.textDiv}>
          <Typography component="p" variant="h6">
            {t('title')}
          </Typography>
          <FormControl variant="standard">
            <InputLabel id="demo-simple-select-label">
              {t('timeFrame')}
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              value={range}
              onChange={event => setRange(event.target.value)}
              fullWidth
            >
              {rangeOptions.map(option => (
                <MenuItem key={option} value={option}>
                  {t(option)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        {loading && <LinearProgress />}
        {!loading && data?.items.length > 0 && (
          <>
            <HighchartsReact
              highcharts={Highcharts}
              options={{ ...options, series }}
            />
            <div className={classes.infoContainer}>
              {t('selectTo')}
              <Button onClick={toggleAll}>
                {Boolean(series.length) && !series.some(set => set.visible) ? t('showAll') : t('hideAll')}
              </Button>
              {t('zoomTo')}.
            </div>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('account')}</TableCell>
                    <TableCell align="right">{t('lowest')}</TableCell>
                    <TableCell align="right">{t('highest')}</TableCell>
                    <TableCell align="right">{t('average')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {producers.map((item, index) => (
                    <TableRow key={`${item.name}-cpu-benchmark-${index}`}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell align="right">
                        {formatWithThousandSeparator(item.lowest, 2)} μs
                      </TableCell>
                      <TableCell align="right">
                        {formatWithThousandSeparator(item.highest, 2)} μs
                      </TableCell>
                      <TableCell align="right">
                        {formatWithThousandSeparator(item.average, 2)} μs
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default CPUBenchmark
