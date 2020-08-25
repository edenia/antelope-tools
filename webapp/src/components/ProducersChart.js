/* eslint camelcase: 0 */
import React, { useState, useEffect, memo } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'
import Typography from '@material-ui/core/Typography'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useTheme } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'

import { formatWithThousandSeparator, onImgError } from '../utils'
import { generalConfig } from '../config'

const RADIAN = Math.PI / 180

const polarToCartesian = (cx, cy, radius, angle) => ({
  x: cx + Math.cos(-RADIAN * angle) * radius,
  y: cy + Math.sin(-RADIAN * angle) * radius
})

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

const CustomBarLabel = memo(
  ({ x, cx, cy, payload, outerRadius, midAngle, fill }) => {
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

    if (sm || md) {
      gap = 32
    }

    if (lg) {
      gap = 40
    }

    if (xl) {
      gap = 52
    }

    const cartesianCircle = polarToCartesian(
      cx,
      cy,
      outerRadius - gap,
      midAngle
    )
    const cartesianText = polarToCartesian(cx, cy, outerRadius + 8, midAngle)
    const link = generalConfig.eosRateLink
      ? `${generalConfig.eosRateLink}/block-producers/${payload.owner}`
      : payload.url

    return (
      <>
        <a href={link} target="_blank" rel="noopener noreferrer">
          <text
            transform={`translate(${cartesianText.x}, ${cartesianText.y})`}
            textAnchor={x > cx ? 'start' : 'end'}
            dominantBaseline="central"
            fill={
              fill === theme.palette.secondary[900]
                ? theme.palette.secondary[900]
                : theme.palette.primary[300]
            }
            fontFamily="Roboto, Helvetica, Arial, sans-serif;"
            fontWeight={
              fill === theme.palette.secondary[900] ? 'bold' : 'normal'
            }
          >
            {payload.owner}
          </text>
        </a>
        <g transform={`translate(${cartesianCircle.x}, ${cartesianCircle.y})`}>
          <defs>
            <pattern
              id={`image${payload.owner}`}
              height="100%"
              width="100%"
              viewBox="0 0 100 100"
            >
              <rect height="100" width="100" fill="#fff" />
              <image
                x="0"
                y="0"
                width="100"
                height="100"
                href={payload.logo || generalConfig.defaultProducerLogo}
                onError={onImgError(generalConfig.defaultProducerLogo)}
              />
            </pattern>
          </defs>

          <a href={link} target="_blank" rel="noopener noreferrer">
            <circle
              id={`${payload.value}-ds`}
              r="3%"
              fill={`url(#image${payload.owner})`}
              stroke={fill}
            />
          </a>
        </g>
      </>
    )
  }
)

CustomBarLabel.propTypes = {
  x: PropTypes.number,
  fill: PropTypes.string,
  cx: PropTypes.number,
  cy: PropTypes.number,
  payload: PropTypes.object,
  outerRadius: PropTypes.number,
  midAngle: PropTypes.number
}

const CustomTooltip = memo(({ active, payload }) => {
  const classes = useStyles()
  const { t } = useTranslation('producersChartToolTip')

  if (active && payload.length > 0) {
    return (
      <div className={classes.wrapper}>
        <Typography variant="h6">
          {t('name')}:{' '}
          <span className={classes.description}>
            {' '}
            {payload[0].payload.owner}
          </span>
        </Typography>
        <Typography variant="h6">
          {t('rewards')}:{' '}
          <span className={classes.description}>
            {' '}
            {formatWithThousandSeparator(payload[0].payload.rewards, 2)}
          </span>
        </Typography>
        <Typography variant="h6">
          {t('votes')}:{' '}
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
})

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array
}

const ProducersChart = ({ producers, info }) => {
  const [entries, setEntries] = useState([])
  const theme = useTheme()

  useEffect(() => {
    setEntries(producers.reverse())
  }, [producers])

  return (
    <ResponsiveContainer width="100%" aspect={1.45}>
      <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <Tooltip content={<CustomTooltip />} />
        <Pie
          data={producers}
          innerRadius="75%"
          label={<CustomBarLabel />}
          paddingAngle={1}
          dataKey="value"
          isAnimationActive={false}
          labelLine={false}
        >
          {entries.map((entry, index) => {
            return (
              <Cell
                key={`cell-${index}`}
                fill={
                  entry.owner === info.head_block_producer
                    ? theme.palette.secondary[900]
                    : theme.palette.secondary[100]
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

export default memo(ProducersChart)
