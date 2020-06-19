import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/styles'
import Typography from '@material-ui/core/Typography'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

import { formatWithThousandSeparator } from '../utils'

const defaultLogo = 'https://bloks.io/img/eosio.png'

export const RADIAN = Math.PI / 180

export const polarToCartesian = (cx, cy, radius, angle) => ({
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

const ProducersChart = ({ producers, info }) => {
  const [entries, setEntries] = useState([])
  const classes = useStyles()

  const renderCustomBarLabel = ({ cx, cy, payload, outerRadius, midAngle }) => {
    const cartesian = polarToCartesian(cx, cy, outerRadius + 30, midAngle)

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
            ></image>
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

  const renderCustomTooltip = ({ active, payload }) => {
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

  useEffect(() => {
    setEntries(
      producers
        .filter((a) => a.isBlockProducer)
        .sort((a, b) => {
          if (a.owner < b.owner) {
            return -1
          }

          if (a.owner > b.owner) {
            return 1
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
      <PieChart margin={{ top: 24, right: 24, left: 24, bottom: 24 }}>
        <Tooltip content={renderCustomTooltip} />
        <Pie
          data={entries}
          innerRadius={'75%'}
          fill="#8884d8"
          label={renderCustomBarLabel}
          // labelLine={false}
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

export default ProducersChart
