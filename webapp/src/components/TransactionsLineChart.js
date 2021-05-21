import React from 'react'
import HighchartsReact from 'highcharts-react-official'
import PropTypes from 'prop-types'
import Highcharts from 'highcharts'
import Box from '@material-ui/core/Box'

const LineChart = ({ data, xAxisProps, title, yAxisProps }) => {
  const options = {
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
        options={{ ...options, series: data }}
      />
    </Box>
  )
}

LineChart.propTypes = {
  data: PropTypes.array,
  xAxisProps: PropTypes.object,
  yAxisProps: PropTypes.object,
  title: PropTypes.string
}

LineChart.defaultProps = {
  data: [],
  xAxisProps: { xAxisVisible: false },
  yAxisProps: {},
  title: ''
}

export default LineChart
