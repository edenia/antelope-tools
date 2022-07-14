import React from 'react'
import HighchartsReact from 'highcharts-react-official'
import PropTypes from 'prop-types'
import Highcharts from 'highcharts'
import Box from '@mui/material/Box'

const TransactionsLineChart = ({ data, xAxisProps, title, yAxisProps }) => {
  const options = {
    time: {
      timezoneOffset: new Date().getTimezoneOffset()
    },
    title: {
      text: title
    },
    chart: {
      animation: false,
      type: 'spline'
    },
    credits: {
      enabled: false
    },
    xAxis: xAxisProps,
    yAxis: yAxisProps
  }

  return (
    <Box>
      <HighchartsReact
        highcharts={Highcharts}
        options={{
          ...options,
          series: data
        }}
      />
    </Box>
  )
}

TransactionsLineChart.propTypes = {
  data: PropTypes.array,
  xAxisProps: PropTypes.object,
  yAxisProps: PropTypes.object,
  title: PropTypes.string
}

TransactionsLineChart.defaultProps = {
  data: [],
  xAxisProps: { xAxisVisible: false },
  yAxisProps: {},
  title: ''
}

export default TransactionsLineChart
