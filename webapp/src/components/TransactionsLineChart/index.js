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
      formatter() {
        const { series, point } = this
        const resourcesString =
          point?.net && point?.cpu
            ? `<br/>Net usage:<b>${point.net} %</b><br/>CPU usage:<b>${point.cpu} %</b>`
            : ''

        return `${series.name}: <b>${point.y}</b>` + resourcesString
      },
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
}

TransactionsLineChart.defaultProps = {
  data: [],
  xAxisProps: { xAxisVisible: false },
  yAxisProps: {},
  title: '',
  zoomEnabled: false,
}

export default TransactionsLineChart
