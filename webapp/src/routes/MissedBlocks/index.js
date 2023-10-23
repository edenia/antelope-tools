/* eslint camelcase: 0 */
import React, { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import LinearProgress from '@mui/material/LinearProgress'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

import { formatWithThousandSeparator, rangeOptions } from '../../utils'
import { MISSED_BLOCKS } from '../../gql'
import HighchartsWrapper from '../../components/HighChartsWrapper'
import ChartHeader from 'components/ChartHeader'

const options = {
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
  },
  credits: {
    enabled: false,
  },
  plotOptions: {
    series: {
      label: {
        connectorAllowed: false,
      },
    },
  },

  series: [],
}

const BlockDistribution = () => {
  const { t } = useTranslation('missedBlocksRoute')
  const [range, setRange] = useState(rangeOptions[0])
  const [series, setSeries] = useState([])
  const [producers, setProducers] = useState([])
  const [load, { loading, data }] = useLazyQuery(MISSED_BLOCKS)

  useEffect(() => {
    load({
      variables: { range },
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
          scheduled: 0,
        }
        info[item.account] = {
          name: item.account,
          data: [],
        }
      }
      summary[item.account].missed += parseInt(item.missed)
      summary[item.account].produced += parseInt(item.produced)
      summary[item.account].scheduled += parseInt(item.scheduled)
      summary[item.account].availability =
        (summary[item.account].produced / summary[item.account].scheduled) * 100
      info[item.account].data.push([
        new Date(item.datetime).getTime(),
        parseInt(item.missed),
      ])
    }
    setProducers(
      Object.values(summary).sort((a, b) =>
        a.availability > b.availability ? -1 : 1,
      ),
    )

    setSeries(Object.values(info))
  }, [data])

  return (
    <Card>
      <ChartHeader
        title={t('title')}
        ariaLabel={'missed-blocks-time-range-label'}
        value={range}
        onSelect={setRange}
        options={rangeOptions}
        isHistoryEnabled
      />
      {loading && <LinearProgress />}
      {!loading && data?.items.length > 0 && (
        <>
          <HighchartsWrapper
            options={{ ...options, series }}
          />
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('account')}</TableCell>
                  <TableCell align="right">{t('scheduledBlocks')}</TableCell>
                  <TableCell align="right">{t('producedBlocks')}</TableCell>
                  <TableCell align="right">{t('missedBlocks')}</TableCell>
                  <TableCell align="right">{t('availability')}</TableCell>
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
                      {formatWithThousandSeparator(item.availability, 2)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Card>
  )
}

BlockDistribution.propTypes = {}

export default BlockDistribution
