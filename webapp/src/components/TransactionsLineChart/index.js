import React from 'react'
import HighchartsReact from 'highcharts-react-official'
import PropTypes from 'prop-types'
import Highcharts from 'highcharts'

const TransactionsLineChart = ({
  data,
  xAxisProps,
  title,
  yAxisProps,
  zoomEnabled,
  shared,
  customFormatter
}) => {
  const options = {
    time: {
      timezoneOffset: new Date().getTimezoneOffset(),
    },
    title: {
      text: title,
    },
    chart: {
      animation: false,
      type: 'spline',
      zoomType: zoomEnabled ? 'x' : '',
    },
    credits: {
      enabled: false,
    },
    xAxis: xAxisProps,
    yAxis: yAxisProps,
    tooltip: {
      shared,
      ...(customFormatter && { formatter() { return customFormatter(this) } })
    },
  }

  return (
    <div>
      <HighchartsReact
        highcharts={Highcharts}
        options={{
          ...options,
          series: data,
        }}
      />
    </div>
  )
}

TransactionsLineChart.propTypes = {
  data: PropTypes.array,
  xAxisProps: PropTypes.object,
  yAxisProps: PropTypes.object,
  title: PropTypes.string,
  zoomEnabled: PropTypes.bool,
  shared: PropTypes.bool,
  customFormatter: PropTypes.func
}

TransactionsLineChart.defaultProps = {
  data: [],
  xAxisProps: { xAxisVisible: false },
  yAxisProps: {},
  title: '',
  zoomEnabled: false,
  shared: false,
  customFormatter: undefined
}

export default TransactionsLineChart
