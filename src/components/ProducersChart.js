/* eslint camelcase: 0 */
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'
import Typography from '@material-ui/core/Typography'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useTheme } from '@material-ui/core/styles'

import { formatWithThousandSeparator } from '../utils'

const defaultLogo = 'https://bloks.io/img/eosio.png'

const RADIAN = Math.PI / 180

const polarToCartesian = (cx, cy, radius, angle) => ({
  x: cx + Math.cos(-RADIAN * angle) * radius,
  y: cy + Math.sin(-RADIAN * angle) * radius
})

const useStyles = makeStyles((theme) => ({
  wrapper: {
    backgroundColor: '#fff',
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    boxShadow:
      '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)'
  },
  description: {
    fontWeight: 'normal'
  }
}))

const CustomBarLabel = ({ cx, cy, payload, outerRadius, midAngle }) => {
  const theme = useTheme()
  const sm = useMediaQuery(theme.breakpoints.up('sm'), {
    defaultMatches: true
  })
  const md = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true
  })
  const lg = useMediaQuery(theme.breakpoints.up('lg'), {
    defaultMatches: true
  })
  const xl = useMediaQuery(theme.breakpoints.up('xl'), {
    defaultMatches: true
  })

  let gap = 16

  if (sm) {
    gap = 32
  }

  if (md) {
    gap = 24
  }

  if (lg) {
    gap = 32
  }

  if (xl) {
    gap = 48
  }

  const cartesian = polarToCartesian(cx, cy, outerRadius + gap, midAngle)

  return (
    <g transform={`translate(${cartesian.x}, ${cartesian.y})`}>
      <defs>
        <pattern
          id={`image${payload.owner}`}
          height="100%"
          width="100%"
          viewBox="0 0 512 512"
        >
          <rect height="512" width="512" fill="#fff" />
          <image
            x="0"
            y="0"
            width="512"
            height="512"
            href={payload.logo || defaultLogo}
          />
        </pattern>
      </defs>

      <circle
        id={`${payload.value}-ds`}
        r="5%"
        fill={`url(#image${payload.owner})`}
        stroke="grey"
      />
    </g>
  )
}

CustomBarLabel.propTypes = {
  cx: PropTypes.number,
  cy: PropTypes.number,
  payload: PropTypes.object,
  outerRadius: PropTypes.number,
  midAngle: PropTypes.number
}

const CustomTooltip = ({ active, payload }) => {
  const classes = useStyles()

  if (active) {
    return (
      <div className={classes.wrapper}>
        <Typography variant="h6">
          Name:{' '}
          <span className={classes.description}>
            {' '}
            {payload[0].payload.owner}
          </span>
        </Typography>
        <Typography variant="h6">
          Rewards:{' '}
          <span className={classes.description}>
            {' '}
            {formatWithThousandSeparator(payload[0].payload.rewards, 2)}
          </span>
        </Typography>
        <Typography variant="h6">
          Votes:{' '}
          <span className={classes.description}>
            {' '}
            {formatWithThousandSeparator(
              payload[0].payload.total_votes_percent,
              3
            )}
            %
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

const ProducersChart = ({ producers, info }) => {
  const [entries, setEntries] = useState([])

  useEffect(() => {
    setEntries(
      producers
        .filter((a) => a.isBlockProducer)
        .sort((a, b) => {
          if (a.owner < b.owner) {
            return 1
          }

          if (a.owner > b.owner) {
            return -1
          }

          return 0
        })
        .map((producer) => ({
          logo: producer?.bp_json?.org?.branding?.logo_256,
          owner: producer.owner,
          rewards: producer.total_reward,
          total_votes_percent: producer.total_votes_percent * 100,
          value: 20
        }))
    )
  }, [producers, info])

  return (
    <ResponsiveContainer width="100%" aspect={1}>
      <PieChart margin={{ top: 16, right: 16, left: 16, bottom: 16 }}>
        <Tooltip content={<CustomTooltip />} />
        <Pie
          data={entries}
          innerRadius="75%"
          fill="#8884d8"
          label={<CustomBarLabel />}
          paddingAngle={1}
          dataKey="value"
          isAnimationActive={false}
        >
          {entries.map((entry, index) => {
            return (
              <Cell
                key={`cell-${index}`}
                fill={
                  entry.owner === info.head_block_producer
                    ? '#265F63'
                    : '#B6EBF3'
                }
              />
            )
          })}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  )
}

ProducersChart.propTypes = {
  producers: PropTypes.array,
  info: PropTypes.object
}

export default ProducersChart
