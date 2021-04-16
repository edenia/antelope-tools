import React from 'react'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import { makeStyles } from '@material-ui/styles'
import { useTheme } from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import {
  LineChart,
  Line,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

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
  const { t } = useTranslation('transactionsChartComponent')

  if (active && payload && payload?.length > 0) {
    return (
      <Box className={classes.wrapper}>
        <Typography variant="h6">{t('transactions')}</Typography>
        <Divider />
        <Typography variant="subtitle1">{t('perSecond')}</Typography>
        <Typography variant="subtitle2">
          {t('amount')}:{' '}
          <span className={classes.description}> {payload[0].payload.tps}</span>
        </Typography>
        <Typography variant="subtitle2">
          {t('blocks')}:{' '}
          <span className={classes.description}>
            {' '}
            {payload[0].payload.blocks.tps.join(', ')}
          </span>
        </Typography>
        <Typography variant="subtitle1">{t('perBlock')}</Typography>
        <Typography variant="subtitle2">
          {t('amount')}:{' '}
          <span className={classes.description}> {payload[0].payload.tpb}</span>
        </Typography>
        <Typography variant="subtitle2">
          {t('blocks')}:{' '}
          <span className={classes.description}>
            {' '}
            {payload[0].payload.blocks.tpb.join(', ')}
          </span>
        </Typography>
      </Box>
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
  const { t } = useTranslation('transactionsChartComponent')

  return (
    <ResponsiveContainer width="100%" maxHeight={300} aspect={1.6}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5
        }}
      >
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend iconType="circle" wrapperStyle={{ bottom: '0' }} />
        <Line
          type="monotone"
          dataKey="tps"
          name={t('transactionsPerSecond')}
          stroke={theme.palette.primary.main}
          activeDot={{ r: 8 }}
          isAnimationActive={false}
        />
        <Line
          type="monotone"
          dataKey="tpb"
          name={t('transactionsPerBlock')}
          stroke={theme.palette.success.main}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

TransactionsChart.propTypes = {
  data: PropTypes.array
}

export default TransactionsChart
