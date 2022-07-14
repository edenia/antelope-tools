/* eslint camelcase: 0 */
import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@mui/material/styles'
import { ResponsiveContainer, BarChart, Bar, Tooltip } from 'recharts'
import styled from 'styled-components'

const ResponsiveContainerWrapper = styled(ResponsiveContainer)`
  .recharts-tooltip-label,
  .recharts-tooltip-item-name,
  .recharts-tooltip-item-separator {
    display: none;
  }
`

const UsageChart = ({ items }) => {
  const theme = useTheme()

  return (
    <ResponsiveContainerWrapper width="100%" height={40}>
      <BarChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }} data={items}>
        <Tooltip formatter={(value) => `${value}us`} />
        <Bar
          dataKey="usage"
          stroke={theme.palette.primary.dark}
          fill={theme.palette.primary.light}
        />
      </BarChart>
    </ResponsiveContainerWrapper>
  )
}

UsageChart.propTypes = {
  items: PropTypes.array
}

export default memo(UsageChart)
