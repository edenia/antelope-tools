/* eslint camelcase: 0 */
import React, { useState, useCallback } from 'react'
import { makeStyles } from '@mui/styles'
import { useTheme } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import LinearProgress from '@mui/material/LinearProgress'
import Paper from '@mui/material/Paper'
import Popover from '@mui/material/Popover'

import {
  ComposableMap,
  Geographies,
  Geography,
} from 'react-simple-maps'
import { scaleLinear } from 'd3-scale'
import { interpolateHcl } from 'd3-interpolate'

import UnknowFlagIcon from '../../components/UnknowFlagIcon'
import { formatWithThousandSeparator } from '../../utils'

import styles from './styles'
import RewardsDistributionStats from './RewardsDistributionStats'
import TokenToUSD from './TokenToUSD'
import useRewardsDistributionState from 'hooks/customHooks/useRewardsDistributionState'

const geoUrl =
  'https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/v2/topojson-maps/world-110m.json'

const useStyles = makeStyles(styles)

const RewardsDistribution = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [currentNode, setCurrentNode] = useState(null)
  const classes = useStyles()
  const theme = useTheme()
  const { t } = useTranslation('rewardsDistributionRoute')
  const open = Boolean(anchorEl)
  const [{ loading, nodes, setting, summary }] = useRewardsDistributionState()

  const handlePopoverOpen = (node) => (event) => {
    if (!nodes.length > 0) {
      return
    }
    setCurrentNode(node)
    setAnchorEl(event.currentTarget)
  }

  const handlePopoverClose = () => {
    setAnchorEl(null)
  }

  const colorScale = useCallback(
    scaleLinear()
      .domain([0, summary?.topCountryByRewards?.rewards - 1])
      .range([theme.palette.primary.light, theme.palette.primary.dark])
      .interpolate(interpolateHcl),
    [summary, theme.palette.primary],
  )

  return (
    <div
      aria-owns={open ? 'mouse-over-popover' : undefined}
      aria-haspopup="true"
    >
      <Popover
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        PaperProps={{ onMouseLeave: handlePopoverClose }}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
        open={open}
        onClose={handlePopoverClose}
        id="mouse-over-popover"
      >
        <div className={classes.boxPadding}>
          <Typography>
            <span className={classes.popoverItem}>{t('country')}: </span>
            {!currentNode?.flag && (
              <span className={classes.countryFlagUnknown}>
                <UnknowFlagIcon />
              </span>
            )}
            <span>{currentNode?.name}</span>
            {currentNode?.flag && (
              <span className={classes.countryFlag}>{currentNode?.flag}</span>
            )}
          </Typography>
          {summary && (
            <Typography>
              <span className={classes.popoverItem}>
                {t('rewardsPercentage')}:{' '}
              </span>
              <span>
                {formatWithThousandSeparator(
                  (currentNode?.rewards / summary.dailyRewards) * 100,
                  2,
                )}
                %
              </span>
            </Typography>
          )}
          <Typography>
            <span className={classes.popoverItem}>{t('rewards')}: </span>
            <TokenToUSD
              amount={currentNode?.rewards}
              tokenPrice={setting?.token_price}
            />
          </Typography>
          <span className={classes.popoverItem}>{t('producers')}:</span>
          <ul className={classes.producersList}>
            {currentNode?.items?.map((producer, i) => (
              <li key={`node-${i}`}>
                <Link
                  href={producer?.bp_json_url ?? ''}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {producer?.bp_json?.org?.candidate_name || producer.owner}
                </Link>
                <br />
                <TokenToUSD
                  amount={producer?.total_rewards}
                  tokenPrice={setting?.token_price}
                />
              </li>
            ))}
          </ul>
        </div>
      </Popover>
      {loading && <LinearProgress className={classes.linearLoader} />}
      <RewardsDistributionStats
        summary={summary}
        nodes={nodes}
        setting={setting}
        handlePopoverOpen={handlePopoverOpen}
      />
      {!loading && (
        <Paper className={classes.mapWrapper}>
          <ComposableMap
            projectionConfig={{
              scale: 170,
            }}
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo, i) => {
                  const nodeData = nodes.find(
                    (node) => node.code === geo.properties.ISO_A2,
                  )

                  return (
                    <Geography
                      onMouseOver={
                        nodeData ? handlePopoverOpen(nodeData) : () => {}
                      }
                      className={classes.geography}
                      key={geo.rsmKey}
                      geography={geo}
                      stroke={theme.palette.neutral.main}
                      fill={
                        nodeData && nodeData.rewards > 0
                          ? colorScale(parseInt(nodeData.rewards))
                          : theme.palette.neutral.light
                      }
                    />
                  )
                })
              }
            </Geographies>
          </ComposableMap>
        </Paper>
      )}
    </div>
  )
}

RewardsDistribution.propTypes = {}

export default RewardsDistribution
