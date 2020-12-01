/* eslint camelcase: 0 */
import React, { useState, memo, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@material-ui/core/styles'
import {
  LineChart,
  Line,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Legend,
  Tooltip
} from 'recharts'
import { scaleLinear } from 'd3-scale'
import { interpolateHcl } from 'd3-interpolate'
import moment from 'moment'
import styled from 'styled-components'

const ResponsiveContainerWrapper = styled(ResponsiveContainer)`
  .recharts-tooltip-label {
    display: none;
  }
`

const MultiLineChart = ({ data, valueKey, tooltipFormatter }) => {
  const theme = useTheme()
  const [minDate, setMinDate] = useState()
  const [maxDate, setMaxDate] = useState()
  const [series, setSeries] = useState([])

  const color = useCallback(
    scaleLinear()
      .domain([0, series.length])
      .range([theme.palette.success.main, theme.palette.error.main])
      .interpolate(interpolateHcl),
    [series]
  )

  useEffect(() => {
    const allDates = []
    let tempSeries = {}

    data.forEach((item) => {
      const { account, ...data } = item
      if (!tempSeries[account]) {
        tempSeries = {
          ...tempSeries,
          [account]: {
            account,
            data: []
          }
        }
      }

      tempSeries = {
        ...tempSeries,
        [item.account]: {
          account: item.account,
          data: [
            ...tempSeries[account].data,
            {
              ...data,
              created_at: moment(item.created_at).unix()
            }
          ]
        }
      }
    })

    const series = Object.values(tempSeries).map((item) => {
      item.data.forEach((element) => {
        allDates.push(element.created_at)
      })

      return item
    })

    allDates.sort((a, b) => a - b)
    setMinDate(allDates[0])
    setMaxDate(allDates[allDates.length - 1])
    setSeries(series)
  }, [data])

  return (
    <ResponsiveContainerWrapper width="100%" aspect={1}>
      <LineChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          domain={[minDate, maxDate]}
          dataKey="created_at"
          type="number"
          tickFormatter={(time) => moment.unix(time).format('HH:mm')}
        />
        <YAxis dataKey={valueKey} />
        <Tooltip formatter={tooltipFormatter} />
        <Legend />
        {series.map((item, i) => (
          <Line
            dataKey={valueKey}
            data={item.data}
            name={item.account}
            key={item.account}
            stroke={color(i)}
            strokeWidth={2}
          />
        ))}
      </LineChart>
    </ResponsiveContainerWrapper>
  )
}

MultiLineChart.propTypes = {
  data: PropTypes.any,
  valueKey: PropTypes.string,
  tooltipFormatter: PropTypes.func
}

export default memo(MultiLineChart)
