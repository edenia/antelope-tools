/* eslint camelcase: 0 */
import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@material-ui/core/styles'
import { makeStyles } from '@material-ui/styles'
import Typography from '@material-ui/core/Typography'
import { ResponsiveContainer, BarChart, Bar, Tooltip } from 'recharts'

const useStyles = makeStyles((theme) => ({
  wrapper: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    boxShadow:
      '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)'
  },
  label: {
    fontWeight: 'bold'
  },
  description: {
    fontWeight: 'normal'
  }
}))

const CustomTooltip = memo(({ active, payload }) => {
  const classes = useStyles()

  if (!active || !payload.length > 0) {
    return null
  }

  return (
    <div className={classes.wrapper}>
      <Typography variant="body1">
        <span className={classes.label}>us: </span>
        <span className={classes.description}>{payload[0].payload.usage}</span>
      </Typography>
    </div>
  )
})

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array
}

const UsageChart = ({ items }) => {
  const theme = useTheme()

  return (
    <ResponsiveContainer width="100%" height={40}>
      <BarChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }} data={items}>
        <Tooltip content={<CustomTooltip />} />
        <Bar
          dataKey="usage"
          stroke={theme.palette.primary.dark}
          fill={theme.palette.primary.light}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

UsageChart.propTypes = {
  items: PropTypes.array
}

export default memo(UsageChart)
