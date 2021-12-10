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
import { MISSED_BLOCKS } from '../gql'

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

const BlockDistribution = () => {
  const { t } = useTranslation('missedBlocksRoute')
  const [range, setRange] = useState(rangeOptions[0])
  const [series, setSeries] = useState([])
  const [producers, setProducers] = useState([])
  const [load, { loading, data }] = useLazyQuery(MISSED_BLOCKS)

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
          missed: 0,
          produced: 0,
          scheduled: 0
        }
        info[item.account] = {
          name: item.account,
          data: []
        }
      }
      summary[item.account].missed += parseInt(item.missed)
      summary[item.account].produced += parseInt(item.produced)
      summary[item.account].scheduled += parseInt(item.scheduled)
      summary[item.account].availability =
        (summary[item.account].produced / summary[item.account].scheduled) * 100
      info[item.account].data.push([
        new Date(item.datetime).getTime(),
        parseInt(item.missed)
      ])
    }
    setProducers(
      Object.values(summary).sort((a, b) =>
        a.availability > b.availability ? -1 : 1
      )
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
                          <TableCell align="right">
                            {t('scheduledBlocks')}
                          </TableCell>
                          <TableCell align="right">
                            {t('producedBlocks')}
                          </TableCell>
                          <TableCell align="right">
                            {t('missedBlocks')}
                          </TableCell>
                          <TableCell align="right">
                            {t('availability')}
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {producers.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell align="right">
                              {formatWithThousandSeparator(item.scheduled)}
                            </TableCell>
                            <TableCell align="right">
                              {formatWithThousandSeparator(item.produced)}
                            </TableCell>
                            <TableCell align="right">
                              {formatWithThousandSeparator(item.missed)}
                            </TableCell>
                            <TableCell align="right">
                              {formatWithThousandSeparator(
                                item.availability,
                                2
                              )}
                              %
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

BlockDistribution.propTypes = {}

export default BlockDistribution
