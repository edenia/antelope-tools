/* eslint camelcase: 0 */
import React, { useEffect, useState, useCallback } from 'react'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@apollo/client'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import Skeleton from '@mui/material/Skeleton'
import LinearProgress from '@mui/material/LinearProgress'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Popper from '@mui/material/Popper'

import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from 'react-simple-maps'
import { scaleLinear } from 'd3-scale'
import { interpolateHcl } from 'd3-interpolate'

import UnknowFlagIcon from '../../components/UnknowFlagIcon'
import { formatWithThousandSeparator } from '../../utils'
import { countries } from '../../utils/countries'
import { PRODUCERS_QUERY, SETTING_QUERY } from '../../gql'
import CountryFlag from '../../components/CountryFlag'
import Tooltip from '../../components/Tooltip'
import { eosConfig } from '../../config'

import styles from './styles'

const lowestRewardsColor = '#B6EBF3'
const highestRewardsColor = '#265F63'
const geoUrl =
  'https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/v2/topojson-maps/world-110m.json'

const useStyles = makeStyles((theme) =>
  styles(theme, lowestRewardsColor, highestRewardsColor),
)

const RewardsDistribution = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [currentNode, setCurrentNode] = useState(null)
  const [summary, setSummary] = useState(null)
  const [show, setShow] = React.useState(false)
  const { loading = true, data: { producers } = {} } = useQuery(
    PRODUCERS_QUERY,
    { variables: { limit: 2100, where: { total_rewards: { _gte: 100 } } } },
  )
  const { data: { setting } = {} } = useQuery(SETTING_QUERY)
  const [nodes, setNodes] = useState([])
  const classes = useStyles()
  const { t } = useTranslation('rewardsDistributionRoute')

  const handlePopoverOpen = (node) => (event) => {
    if (!nodes.length > 0) {
      return
    }
    console.log(node)
    setCurrentNode(node)
    setAnchorEl(event.currentTarget)
  }

  const open = Boolean(anchorEl);

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };


  const colorScale = useCallback(
    scaleLinear()
      .domain([0, summary?.topCountryByRewards?.rewards - 1])
      .range([lowestRewardsColor, highestRewardsColor])
      .interpolate(interpolateHcl),
    [summary],
  )

  useEffect(() => {
    let stats = {
      'N/A': {
        code: 'N/A',
        name: t('notAvailable'),
        quantity: 0,
        items: [],
        rewards: 0,
      },
    }
    let daylyRewars = 0
    const items = producers || []
    const handleInvalidCountry = (producer) => {
      stats['N/A'].items.push(producer)
      stats['N/A'].rewards += producer.total_rewards
      stats['N/A'].quantity += 1
    }
    const handleValidCountry = (producer) => {
      if (!stats[producer.bp_json.org.location.country]) {
        stats = {
          ...stats,
          [producer.bp_json.org.location.country]: {
            code: producer.bp_json.org.location.country,
            name: countries[producer.bp_json.org.location.country]?.name,
            flag: countries[producer.bp_json.org.location.country]?.flag,
            quantity: 1,
            coordinates: [
              producer.bp_json.org.location.longitude,
              producer.bp_json.org.location.latitude,
            ],
            items: [producer],
            rewards: producer.total_rewards,
          },
        }
      } else {
        stats[producer.bp_json.org.location.country].items.push(producer)
        stats[producer.bp_json.org.location.country].rewards +=
          producer.total_rewards
        stats[producer.bp_json.org.location.country].quantity += 1
        if (
          producer.bp_json.org.location.longitude &&
          producer.bp_json.org.location.latitude
        ) {
          stats[producer.bp_json.org.location.country].coordinates = [
            producer.bp_json.org.location.longitude,
            producer.bp_json.org.location.latitude,
          ]
        }
      }
    }

    items
      .filter((a) => a.total_rewards >= 100)
      .forEach((producer) => {
        daylyRewars += producer.total_rewards || 0

        if (!producer?.bp_json?.org?.location?.country) {
          handleInvalidCountry(producer)
          return
        }

        handleValidCountry(producer)
      })

    const nodes = Object.values(stats)
    const topCountryByRewards = nodes.reduce(
      (prev, current) => {
        return current.rewards > prev.rewards && current.code !== 'N/A'
          ? current
          : prev
      },
      { rewards: 0 },
    )

    setSummary({
      daylyRewars,
      topCountryByRewards,
      producersWithoutProperBpJson: stats['N/A'],
    })
    setNodes(nodes)
  }, [producers, t])

  return (
    <Box
    onMouseEnter={handlePopoverOpen}
    onMouseLeave={handlePopoverClose}
    aria-owns={open ? 'mouse-over-popover' : undefined}
    aria-haspopup="true">
      <Popper 
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'left',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        open={open}
        onClose={handlePopoverClose}
        disableRestoreFocus
        id="mouse-over-popover"
        sx={{
          pointerEvents: 'none',
        }}
      >
          <Box>
            <Typography>
              <span className={classes.popoverItem}>{t('country')}: </span>
              {!currentNode?.flag && (
                <span className={classes.countryFlagUnknown}>
                  <UnknowFlagIcon />
                </span>
              )}
              {currentNode?.flag && (
                <span className={classes.countryFlag}>{currentNode?.flag}</span>
              )}
              <span>{currentNode?.name}</span>
            </Typography>
            {summary && (
              <Typography>
                <span className={classes.popoverItem}>
                  {t('rewardsPercentage')}:{' '}
                </span>
                <span>
                  {formatWithThousandSeparator(
                    (currentNode?.rewards / summary.daylyRewars) * 100,
                    2,
                  )}
                  %
                </span>
              </Typography>
            )}
            <Typography>
              <span className={classes.popoverItem}>{t('rewards')}: </span>
              <span>
                {formatWithThousandSeparator(currentNode?.rewards, 2)}{' '}
                {eosConfig.tokenSymbol}
              </span>
            </Typography>
            <Typography className={classes.popoverItem}>
              {t('producers')}:
            </Typography>
            <ul className={classes.producersList}>
              {currentNode?.items?.map((producer, i) => (
                <li key={`node-${i}`}>
                  <Link
                    href={`${
                      producer.owner === 'eosrainbowbp' ? 'http://' : ''
                    }${
                      producer?.bp_json?.org?.website || producer.url
                    }/bp.json`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {producer?.bp_json?.org?.candidate_name || producer.owner}
                  </Link>
                  <br />
                  {formatWithThousandSeparator(producer.total_rewards, 2)}{' '}
                  {eosConfig.tokenSymbol}
                </li>
              ))}
            </ul>
          </Box>

      </Popper >
      {loading && <LinearProgress className={classes.linearLoader} />}
      <Grid container spacing={2}>
        <Grid item xl={3} lg={3} sm={6} xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6">{t('dailyRewards')}</Typography>
              <Typography variant="subtitle1">
                {!nodes.length > 0 && (
                  <Skeleton variant="text" width="100%" animation="wave" />
                )}
                {nodes.length > 0 && (
                  <span>
                    {formatWithThousandSeparator(summary.daylyRewars, 2)}{' '}
                    {eosConfig.tokenSymbol}
                  </span>
                )}
              </Typography>
              <Typography variant="subtitle1">
                {!nodes.length > 0 && (
                  <Skeleton variant="text" width="100%" animation="wave" />
                )}
                {nodes.length > 0 && setting?.token_price && (
                  <span>
                    $
                    {formatWithThousandSeparator(
                      summary.daylyRewars * setting?.token_price,
                      0,
                    )}{' '}
                    USD
                  </span>
                )}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xl={3} lg={3} sm={6} xs={12}>
          <Card
            className={classes.action}
            onClick={handlePopoverOpen(summary?.topCountryByRewards)}
            // onMouseLeave={handlePopoverClose}
          >
            <CardContent>
              <Typography variant="h6">{t('topCountryDailyRwards')}</Typography>
              <Typography variant="subtitle1">
                {!nodes.length > 0 && (
                  <Skeleton variant="text" width="100%" animation="wave" />
                )}
                {nodes.length > 0 && (
                  <>
                    <CountryFlag code={summary.topCountryByRewards.code} />
                    {summary.topCountryByRewards.name}
                  </>
                )}
              </Typography>
              <Typography variant="subtitle1">
                {!nodes?.length > 0 && (
                  <Skeleton variant="text" width="100%" animation="wave" />
                )}
                {nodes?.length > 0 && setting?.token_price && (
                  <>
                    {formatWithThousandSeparator(
                      summary.topCountryByRewards.rewards,
                      0,
                    )}{' '}
                    {eosConfig.tokenSymbol} / $
                    {formatWithThousandSeparator(
                      summary.topCountryByRewards.rewards *
                        setting?.token_price,
                      0,
                    )}{' '}
                    USD
                  </>
                )}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xl={3} lg={3} sm={6} xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6">{t('paidProducers')}</Typography>
              <Typography
                variant="subtitle1"
                className={classes.action}
                onMouseOver={handlePopoverOpen(
                  summary?.producersWithoutProperBpJson,
                )}
                onMouseLeave={handlePopoverClose}
              >
                {!nodes.length > 0 && (
                  <Skeleton variant="text" width="100%" animation="wave" />
                )}
                {nodes.length > 0 &&
                  summary.producersWithoutProperBpJson.quantity}
              </Typography>
              <Typography
                variant="subtitle1"
                className={classes.action}
                onMouseOver={handlePopoverOpen(
                  summary?.producersWithoutProperBpJson,
                )}
                onMouseLeave={handlePopoverClose}

              >
                {t('clickToViewBPs')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xl={3} lg={3} sm={6} xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" className={classes.rewardsColorSchema}>
                <span className={classes.itemLabel}>
                  {t('lowestRewards')}:{' '}
                </span>
                <span className={classes.lowestRewards} />
              </Typography>
              <Typography variant="h6" className={classes.rewardsColorSchema}>
                <span className={classes.itemLabel}>
                  {t('highestRewards')}:{' '}
                </span>
                <span className={classes.highestRewards} />
              </Typography>
              {setting?.token_price && (
                <Typography variant="h6" className={classes.rewardsColorSchema}>
                  <span className={classes.itemLabel}>
                    {t('exchangeRate')}:{' '}
                  </span>{' '}
                  ${formatWithThousandSeparator(setting.token_price, 4)}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      {!loading && (
        <Paper className={classes.mapWrapper}>
          <ComposableMap
            projectionConfig={{
              scale: 170,
            }}
          >
            <ZoomableGroup maxZoom={1}>
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
                        stroke="#8F9DA4"
                        fill={
                          nodeData && nodeData.rewards > 0
                            ? colorScale(parseInt(nodeData.rewards))
                            : '#EEEEEE'
                        }
                      />
                    )
                  })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>
        </Paper>
      )}
    </Box>
  )
}

RewardsDistribution.propTypes = {}

export default RewardsDistribution
