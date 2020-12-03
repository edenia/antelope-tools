/* eslint camelcase: 0 */
import React, { useState, memo, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
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
  .recharts-tooltip {
    font-family: Roboto;
    font-style: normal;
    font-weight: 500;
    color: #fff;
    background-color: #616161;
    border-radius: ${(props) => props.theme.spacing(1)}px;
    padding: ${(props) => props.theme.spacing(2)}px;
  }
  .recharts-tooltip-label {
    margin: 0px;
  }
  .recharts-tooltip-list {
    margin: 0;
    padding: 0;
  }
  .recharts-tooltip-list-item {
  }
`

const TooltipContent = (item) => {
  if (!item.active || item.payload === null || item.payload[0] === null) {
    return <></>
  }

  return (
    <div className="recharts-tooltip">
      <p className="recharts-tooltip-label">
        {moment.unix(item.label).format('HH:mm:ss A')}
      </p>
      <ul className="recharts-tooltip-list">
        {item.payload.map((data, i) => (
          <li key={i} className="recharts-tooltip-list-item">
            <span className="recharts-tooltip-list-item-name">{data.name}</span>
            <span className="recharts-tooltip-list-item-separator">
              {item.separator}
            </span>
            <span className="recharts-tooltip-list-item-value">
              {item.formatter(data.value)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

TooltipContent.propTypes = {
  item: PropTypes.any
}

const MultiLineChart = ({ data, valueKey, tooltipFormatter }) => {
  const [lines, setLines] = useState([])
  const [records, setRecords] = useState([])
  const [minDate, setMinDate] = useState()
  const [maxDate, setMaxDate] = useState()

  const color = useCallback(
    scaleLinear()
      .domain([0, series.length])
      .range([theme.palette.success.main, theme.palette.error.main])
      .interpolate(interpolateHcl),
    [series]
  )

  useEffect(() => {
    let lines = {}
    let records = {}

    data.forEach((item) => {
      const { account, ...record } = item
      const time = moment(record.created_at).unix()

      if (!records[time]) {
        records = {
          ...records,
          [time]: {
            time
          }
        }
      }

      records = {
        ...records,
        [time]: {
          ...records[time],
          [account]: record[valueKey]
        }
      }
      lines = {
        ...lines,
        [account]: true
      }
    })

    const allDates = Object.keys(records)
      .map((key) => parseInt(key))
      .sort((a, b) => a - b)
    setMinDate(allDates[0])
    setMaxDate(allDates[allDates.length - 1])

    setLines(Object.keys(lines))
    setRecords(Object.values(records))
  }, [data, valueKey])

  return (
    <ResponsiveContainerWrapper width="100%" aspect={2.5}>
      <LineChart
        data={records}
        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="1 1" stroke="#E4E7EB" />
        <XAxis
          dataKey="time"
          domain={[minDate, maxDate]}
          name="Time"
          tickFormatter={(time) => moment.unix(time).format('HH:mm')}
          type="number"
          axisLine={false}
        />
        <YAxis axisLine={false} />
        <Tooltip
          formatter={tooltipFormatter}
          separator=" - "
          content={TooltipContent}
        />
        <Legend />
        {lines.map((line, i) => (
          <Line
            key={`line-${line}`}
            dataKey={line}
            name={line}
            stroke={color(i)}
            strokeWidth={2}
            connectNulls
            dot={false}
            type="monotone"
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
