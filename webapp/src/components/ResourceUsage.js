import React, { memo, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import { RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts'

const ResourceUsage = ({ percent, title, label }) => {
  const theme = useTheme()
  const [circleSize, setCircleSize] = useState(250)
  const smallRadial = useMediaQuery(theme.breakpoints.up('lg'))
  const bigRadial = useMediaQuery(theme.breakpoints.up('xl'))

  useEffect(() => {
    if (bigRadial) {
      setCircleSize(250)

      return
    }

    if (smallRadial) {
      setCircleSize(180)

      return
    }

    setCircleSize(250)
  }, [smallRadial, bigRadial])

  return (
    <RadialBarChart
      width={circleSize}
      height={circleSize / 2}
      cx={circleSize / 2}
      cy={circleSize / 2}
      innerRadius={circleSize / 2 - 10}
      outerRadius={circleSize / 2}
      data={[{ value: percent }]}
      startAngle={180}
      endAngle={0}
    >
      <PolarAngleAxis
        type="number"
        domain={[0, 1]}
        angleAxisId={0}
        tick={false}
      />
      <RadialBar
        background
        clockWise
        dataKey="value"
        fill={theme.palette.primary.main}
      />
      <text
        x={circleSize / 2}
        y={circleSize / 2 - 30}
        textAnchor="middle"
        dominantBaseline="middle"
        className="progress-label"
      >
        {title} {(percent * 100).toFixed(2)}%
      </text>
      <text
        x={circleSize / 2}
        y={circleSize / 2 - 10}
        textAnchor="middle"
        dominantBaseline="middle"
        className="progress-label"
      >
        {label}
      </text>
    </RadialBarChart>
  )
}

ResourceUsage.propTypes = {
  percent: PropTypes.number,
  title: PropTypes.string,
  label: PropTypes.string
}

export default memo(ResourceUsage)
