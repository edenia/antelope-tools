import React, { useEffect, useState } from 'react'
import { makeStyles } from '@mui/styles'
import { useTheme } from '@mui/material/styles'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

import styles from './styles'

const useStyles = makeStyles(styles)

const HighchartsWrapper = ({ options }) => {
  const classes = useStyles()
  const theme = useTheme()
  const [colors, setColors] = useState(theme.palette.charts.colors)

  useEffect(() => {
    setColors(theme.palette.charts.colors)
  }, [theme])

  options.time = {
    timezoneOffset: new Date().getTimezoneOffset(),
    ...options?.time,
  }

  options.tooltip = {
    ...options?.tooltip,
    borderRadius: 10,
    borderWidth: 1,
  }

  return (
    <div className={classes.chart}>
      <HighchartsReact
        highcharts={Highcharts}
        options={{ ...options, colors }}
      />
    </div>
  )
}

export default HighchartsWrapper
