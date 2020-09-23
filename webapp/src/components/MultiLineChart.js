/* eslint camelcase: 0 */
import React, { useState, memo, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@material-ui/core/styles'
import {
  LineChart,
  Line,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Legend
} from 'recharts'
import moment from 'moment'

const MultiLineChart = ({ producers, dataKey, valueKey }) => {
  const theme = useTheme()
  const colors = [theme.palette.secondary[100], theme.palette.secondary[800]]
  const [minDate, setMinDate] = useState()
  const [maxDate, setMaxDate] = useState()
  const [series, setSeries] = useState([])

  useEffect(() => {
    let allDates = []
    const series = producers.map((producer) => {
      const newModel = {
        ...producer,
        [dataKey]: producer[dataKey].map((item) => ({
          ...item,
          created_at: moment(item.created_at).unix()
        }))
      }
      allDates = [
        ...allDates,
        ...newModel[dataKey].map((item) => item.created_at)
      ]

      return newModel
    })

    allDates.sort((a, b) => a - b)
    setMinDate(allDates[0])
    setMaxDate(allDates[allDates.length - 1])
    setSeries(series)
  }, [producers, dataKey])

  return (
    <ResponsiveContainer width="100%" aspect={1}>
      <LineChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          domain={[minDate, maxDate]}
          dataKey="created_at"
          type="number"
          tickFormatter={(time) => moment.unix(time).format('HH:mm')}
        />
        <YAxis dataKey={valueKey} />
        <Legend />
        {series.map((s, i) => (
          <Line
            dataKey={valueKey}
            data={s[dataKey]}
            name={s.owner}
            key={s.owner}
            stroke={colors[i] || theme.palette.secondary[100]}
            strokeWidth={2}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

MultiLineChart.propTypes = {
  producers: PropTypes.array,
  dataKey: PropTypes.string,
  valueKey: PropTypes.string
}

export default memo(MultiLineChart)
