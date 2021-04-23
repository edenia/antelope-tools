/* eslint camelcase: 0 */
import React, { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/react-hooks'
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

import { formatWithThousandSeparator } from '../utils'
import { BLOCK_DISTRIBUTION_QUERY } from '../gql'

const options = {
  title: {
    text: ' '
  },
  chart: {
    plotBackgroundColor: null,
    plotBorderWidth: null,
    plotShadow: false,
    type: 'pie'
  },
  tooltip: {
    pointFormat: '<b>{point.percentage:.1f}%</b>',
    backgroundColor: '#fff',
    borderColor: '#fff',
    borderRadius: 10,
    borderWidth: 1
  },
  plotOptions: {
    pie: {
      allowPointSelect: true,
      cursor: 'pointer',
      dataLabels: {
        enabled: true,
        format: '<b>{point.name}</b>: {point.percentage:.1f} %'
      }
    }
  },
  series: []
}
const rangeOptions = [
  '3 Hours',
  '6 Hours',
  '12 Hours',
  '1 Day',
  '2 Days',
  '4 Days',
  '7 Days',
  '14 Days',
  '1 Month',
  '2 Months',
  '3 Months',
  '6 Months',
  '1 Year',
  'all'
]

const BlockDistribution = () => {
  const { t } = useTranslation('blockDistributionRoute')
  const [range, setRange] = useState(rangeOptions[0])
  const [series, setSeries] = useState([])
  const [load, { loading, data }] = useLazyQuery(BLOCK_DISTRIBUTION_QUERY)

  useEffect(() => {
    load({
      variables: {
        range
      }
    })
  }, [load, range])

  useEffect(() => {
    if (!data?.items) {
      return
    }

    setSeries([
      {
        innerSize: '80%',
        data: data.items.map((item) => ({
          name: item.account,
          y: item.percent * 100
        }))
      }
    ])
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
                            {t('blocksProduced')}
                          </TableCell>
                          <TableCell align="right">{t('percent')}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data?.items.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.account}</TableCell>
                            <TableCell align="right">
                              {formatWithThousandSeparator(item.blocks)}
                            </TableCell>
                            <TableCell align="right">
                              {formatWithThousandSeparator(
                                Math.ceil(item.percent * 100),
                                1
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
