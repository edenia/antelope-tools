import React from 'react'
import HighchartsReact from 'highcharts-react-official'
import PropTypes from 'prop-types'
import Highcharts from 'highcharts'
import Box from '@material-ui/core/Box'

const LineChart = ({ data, xAxisProps, title }) => {
  const options = {
    title: {
      text: title
    },
    chart: {
      animation: false,
      type: 'spline'
    },
    xAxis: xAxisProps
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
  title: PropTypes.string
}

LineChart.defaultProps = {
  data: [],
  xAxisProps: { xAxisVisible: false },
  title: ''
}

export default LineChart
