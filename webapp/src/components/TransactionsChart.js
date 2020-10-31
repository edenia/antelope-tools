import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'
import Typography from '@material-ui/core/Typography'
import { useTheme } from '@material-ui/core/styles'
import { ResponsiveContainer, YAxis, Tooltip, BarChart, Bar } from 'recharts'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles((theme) => ({
  wrapper: {
    backgroundColor: theme.palette.white,
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    boxShadow:
      '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)'
  },
  description: {
    fontWeight: 'normal'
  }
}))

const CustomTooltip = ({ active, payload }) => {
  const classes = useStyles()
  const { t } = useTranslation('transactionsChartToolTip')

  if (active && payload && payload.length > 0) {
    return (
      <div className={classes.wrapper}>
        <Typography variant="h6">
          {t('block')}
          {`${payload[0].payload.blocks.length > 1 ? 's:' : ''} `}
          <span className={classes.description}>
            {' '}
            {payload[0].payload.blocks.join(', ')}
          </span>
        </Typography>
        <Typography variant="h6">
          {t('transactions')}:{' '}
          <span className={classes.description}>
            {' '}
            {payload[0].payload.transactions}
          </span>
        </Typography>
      </div>
    )
  }

  return null
}

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array
}

const TransactionsChart = ({ data }) => {
  const theme = useTheme()

  return (
    <ResponsiveContainer width="100%" aspect={1.6}>
      <BarChart
        data={data}
        margin={{ top: 16, right: 16, left: 16, bottom: 16 }}
      >
        <Tooltip content={<CustomTooltip />} />
        <YAxis />
        <Bar
          isAnimationActive
          dataKey="transactions"
          stroke={theme.palette.primary.dark}
          fill={theme.palette.primary.light}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

TransactionsChart.propTypes = {
  data: PropTypes.array
}

export default TransactionsChart
