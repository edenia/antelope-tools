import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@mui/material/styles'

import { RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts'

const ResourceUsage = ({ percent, title, label }) => {
  const theme = useTheme()
  const circleSize = 225

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
        fill={theme.palette.text.primary}
      >
        {title} {(percent * 100).toFixed(2)}%
      </text>
      <text
        x={circleSize / 2}
        y={circleSize / 2 - 10}
        textAnchor="middle"
        dominantBaseline="middle"
        className="progress-label"
        fill={theme.palette.text.primary}
      >
        {label}
      </text>
    </RadialBarChart>
  )
}

ResourceUsage.propTypes = {
  percent: PropTypes.number,
  title: PropTypes.string,
  label: PropTypes.string,
}

export default memo(ResourceUsage)
