/* eslint camelcase: 0 */
import React, { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import { useTranslation } from 'react-i18next'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import LinearProgress from '@material-ui/core/LinearProgress'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Box from '@material-ui/core/Box'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

import { formatWithThousandSeparator, rangeOptions } from '../utils'
import { CPU_BENCHMARK } from '../gql'

const options = {
  time: {
    timezoneOffset: new Date().getTimezoneOffset()
  },
  title: {
    text: ' '
  },
  xAxis: {
    type: 'datetime'
  },
  yAxis: {
    title: {
      text: ' '
    }
  },
  credits: {
    enabled: false
  },
  plotOptions: {
    series: {
      label: {
        connectorAllowed: false
      }
    }
  },

  series: []
}

const CPUBenchmark = () => {
  const { t } = useTranslation('cpuBenchmarkRoute')
  const [range, setRange] = useState(rangeOptions[0])
  const [series, setSeries] = useState([])
  const [producers, setProducers] = useState([])
  const [load, { loading, data }] = useLazyQuery(CPU_BENCHMARK)

  useEffect(() => {
    load({
      variables: { range }
    })
  }, [load, range])

  useEffect(() => {
    if (!data?.items) {
      return
    }

    const info = {}
    const summary = {}

    for (let index = 0; index < data.items.length; index++) {
      const item = data.items[index]

      if (!info[item.account]) {
        summary[item.account] = {
          name: item.account,
          transactions: 0,
          count: 0,
          total: 0,
          average: 0,
          lowest: parseInt(item.usage),
          highest: 0
        }
        info[item.account] = {
          name: item.account,
          data: []
        }
      }

      summary[item.account].total += parseInt(item.usage)
      summary[item.account].count++
      summary[item.account].average =
        summary[item.account].total / summary[item.account].count
      summary[item.account].lowest =
        parseInt(item.usage) < summary[item.account].lowest
          ? parseInt(item.usage)
          : summary[item.account].lowest
      summary[item.account].highest =
        parseInt(item.usage) > summary[item.account].highest
          ? parseInt(item.usage)
          : summary[item.account].highest

      info[item.account].data.push([
        new Date(item.datetime).getTime(),
        parseFloat(item.usage)
      ])
    }
    setProducers(
      Object.values(summary).sort((a, b) => (a.average > b.average ? 1 : -1))
    )

    setSeries(Object.values(info))
  }, [data])

  return (
    <Grid item xs={12}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                p={1}
              >
                <Typography component="p" variant="h6">
                  {t('title')}
                </Typography>
                <FormControl>
                  <InputLabel id="demo-simple-select-label">
                    {t('timeFrame')}
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    value={range}
                    onChange={(e) => setRange(e.target.value)}
                    fullWidth
                  >
                    {rangeOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {t(option)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              {loading && <LinearProgress />}
              {!loading && data?.items.length > 0 && (
                <>
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={{ ...options, series }}
                  />
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
                          <TableRow key={index}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell align="right">
                              {formatWithThousandSeparator(item.lowest, 2)}
                            </TableCell>
                            <TableCell align="right">
                              {formatWithThousandSeparator(item.highest, 2)}
                            </TableCell>
                            <TableCell align="right">
                              {formatWithThousandSeparator(item.average, 2)}
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
        </Grid>
      </Grid>
    </Grid>
  )
}

CPUBenchmark.propTypes = {}

export default CPUBenchmark
