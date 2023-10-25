import React from 'react'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import PropTypes from 'prop-types'
import LinearProgress from '@mui/material/LinearProgress'

import ChartHeader from '../../components/ChartHeader'
import TransactionsLineChart from '../../components/TransactionsLineChart'

const TransactionsChartContainer = ({
  title,
  ariaLabel,
  loading,
  data,
  isPaused,
  handlePause,
  chartLabelFormat,
  historyState,
}) => {
  const { t } = useTranslation()

  return (
    <Card>
      <ChartHeader
        title={title}
        ariaLabel={ariaLabel}
        handlePause={handlePause}
        isPaused={isPaused}
        {...historyState}
      />
      {loading && <LinearProgress color="primary" />}
      <TransactionsLineChart
        zoomEnabled={!historyState?.isLive}
        yAxisProps={{
          reversed: false,
          title: {
            text: chartLabelFormat?.yAxisText,
            enabled: true,
          },
          maxPadding: 0.05,
        }}
        xAxisProps={{
          type: 'datetime',
          reversed: historyState?.isLive,
          title: {
            enabled: historyState?.isLive,
            text: t('secondsAgo'),
          },
          labels: {
            formatter() {
              return historyState?.isLive && this?.value
                ? `${this.value * chartLabelFormat?.blockTime}s`
                : null
            },
          },
          maxPadding: 0.05,
        }}
        data={data}
        shared={chartLabelFormat?.shared}
        customFormatter={chartLabelFormat?.customFormatter}
      />
    </Card>
  )
}

TransactionsChartContainer.propTypes = {
  ariaLabel: PropTypes.string,
  title: PropTypes.string,
  loading: PropTypes.bool,
  isPaused: PropTypes.bool,
  data: PropTypes.array,
  handlePause: PropTypes.func,
  chartLabelFormat: PropTypes.shape({
    yAxisText: PropTypes.string,
    shared: PropTypes.bool,
    blockTime: PropTypes.number,
    customFormatter: PropTypes.func,
  }),
  historyState: PropTypes.shape({
    value: PropTypes.string,
    options: PropTypes.array,
    isLive: PropTypes.bool,
    isHistoryEnabled: PropTypes.bool,
    onSelect: PropTypes.func,
  }),
}

TransactionsChartContainer.defaultProps = {
  title: '',
  ariaLabel: '',
  loading: false,
  isPaused: false,
  handlePause: undefined,
}

export default TransactionsChartContainer
