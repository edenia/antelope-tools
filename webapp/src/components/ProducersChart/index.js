/* eslint camelcase: 0 */
import React, { useState, useEffect, memo } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@mui/styles'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'

import { formatWithThousandSeparator, onImgError } from '../../utils'
import { eosConfig, generalConfig } from '../../config'
import LocaleLink from 'components/LocaleLink'

import styles from './styles'

const RADIAN = Math.PI / 180

const polarToCartesian = (cx, cy, radius, angle) => ({
  x: cx + Math.cos(-RADIAN * angle) * radius,
  y: cy + Math.sin(-RADIAN * angle) * radius,
})

const useStyles = makeStyles(styles)

const CustomBarLabel = memo(
  ({ x, cx, cy, payload, outerRadius, midAngle, fill }) => {
    const theme = useTheme()
    const sm = useMediaQuery(theme.breakpoints.up('sm'), {
      defaultMatches: true,
    })
    const md = useMediaQuery(theme.breakpoints.up('md'), {
      defaultMatches: true,
    })
    const lg = useMediaQuery(theme.breakpoints.up('lg'), {
      defaultMatches: true,
    })
    const xl = useMediaQuery(theme.breakpoints.up('xl'), {
      defaultMatches: true,
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
      midAngle,
    )
    const spacing = sm ? 16 : 12
    const cartesianText = polarToCartesian(
      cx,
      cy,
      outerRadius + spacing,
      midAngle,
    )
    const link = `/${eosConfig.producersRoute}/${payload.owner}`

    const getNameTextAnchor = (x, cx) => {
      if (x + 30 >= cx && x < cx) {
        return 'middle'
      } else if (x > cx) {
        return 'start'
      } else {
        return 'end'
      }
    }

    const ProfileLink = ({ link, owner, Content }) => {
      return (
        <Link
          to={link}
          underline="none"
          component={LocaleLink}
          aria-label={`BP ${owner} Profile Page`}
        >
          <Content />
        </Link>
      )
    }

    const ProducerName = () => {
      const isProducing = fill === theme.palette.primary.main

      const Content = () => (
        <text
          transform={`translate(${cartesianText.x}, ${cartesianText.y})`}
          textAnchor={getNameTextAnchor(x, cx)}
          dominantBaseline="central"
          fill={isProducing ? fill : theme.palette.text.primary}
          fontSize={sm ? 14 : 12}
          fontFamily="Roboto, Helvetica, Arial, sans-serif;"
          fontWeight={isProducing ? 'bold' : 'normal'}
        >
          {payload.name ? payload.name?.replace('@fiotestnet','')?.substring(0, 12) + '...' : payload.owner}
        </text>
      )

      return <ProfileLink link={link} owner={payload.owner} Content={Content} />
    }

    const ProducerLogo = () => {
      const Content = () => (
        <circle
          id={`${payload.value}-ds`}
          r="3%"
          fill={`url(#image${payload.owner})`}
          stroke={fill}
        />
      )

      return <ProfileLink link={link} owner={payload.owner} Content={Content} />
    }

    return (
      <>
        <ProducerName />
        <g transform={`translate(${cartesianCircle.x}, ${cartesianCircle.y})`}>
          <defs>
            <pattern
              id={`image${payload.owner}`}
              height="100%"
              width="100%"
              viewBox="0 0 100 100"
            >
              <rect
                height="100"
                width="100"
                fill={theme.palette.common.white}
              />
              <image
                x="0"
                y="0"
                width="100"
                height="100"
                href={
                  payload.logo?.startsWith('https')
                    ? payload.logo
                    : generalConfig.defaultProducerLogo
                }
                onError={onImgError(generalConfig.defaultProducerLogo)}
              />
            </pattern>
          </defs>
          <ProducerLogo />
        </g>
      </>
    )
  },
)

CustomBarLabel.propTypes = {
  x: PropTypes.number,
  fill: PropTypes.string,
  cx: PropTypes.number,
  cy: PropTypes.number,
  payload: PropTypes.object,
  outerRadius: PropTypes.number,
  midAngle: PropTypes.number,
}

const CustomTooltip = memo(({ active, payload }) => {
  const classes = useStyles()
  const { t } = useTranslation('producersChartComponent')

  if (active && payload.length > 0) {
    return (
      <div className={classes.tooltip}>
        <Typography variant="h6">
          {t('name')}:{' '}
          <span className={classes.description}>
            {' '}
            {payload[0].payload.name || payload[0].payload.owner}
          </span>
        </Typography>
        {generalConfig.useRewards && (
          <Typography variant="h6">
            {t('rewards')}:{' '}
            <span className={classes.description}>
              {' '}
              {`${formatWithThousandSeparator(payload[0].payload.rewards, 2)} ${
                eosConfig.tokenSymbol
              }`}
            </span>
          </Typography>
        )}
        {generalConfig.useVotes && (
          <Typography variant="h6">
            {t('votes')}:{' '}
            <span className={classes.description}>
              {' '}
              {formatWithThousandSeparator(
                payload[0].payload.total_votes_percent,
                3,
              )}
              %
            </span>
          </Typography>
        )}
      </div>
    )
  }

  return null
})

CustomTooltip.displayName = 'CustomTooltip'

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array,
}

const ProducersChart = ({ producers, info }) => {
  const [entries, setEntries] = useState([])
  const classes = useStyles()
  const theme = useTheme()

  useEffect(() => {
    setEntries(producers.reverse())
  }, [producers])

  return (
    <ResponsiveContainer
      width="100%"
      aspect={1.45}
      className={classes.chartContainer}
    >
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
                style={{ cursor: 'pointer' }}
                key={`cell-${index}`}
                fill={
                  entry.owner === info.head_block_producer
                    ? theme.palette.primary.main
                    : theme.palette.primary.light
                }
                stroke={theme.palette.background.default}
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
  info: PropTypes.object,
}

export default memo(ProducersChart)
