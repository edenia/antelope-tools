/* eslint camelcase: 0 */
import React, { useEffect, useState, useCallback } from 'react'
import { makeStyles } from '@material-ui/styles'
import { useTranslation } from 'react-i18next'
import { useSubscription } from '@apollo/react-hooks'
import { useDispatch, useSelector } from 'react-redux'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Popover from '@material-ui/core/Popover'
import CloseIcon from '@material-ui/icons/Close'
import Link from '@material-ui/core/Link'
import Skeleton from '@material-ui/lab/Skeleton'
import LinearProgress from '@material-ui/core/LinearProgress'
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup
} from 'react-simple-maps'
import { scaleLinear } from 'd3-scale'
import { interpolateHcl } from 'd3-interpolate'

import UnknowFlagIcon from '../../components/UnknowFlagIcon'
import { countries, formatWithThousandSeparator } from '../../utils'
import { PRODUCERS_SUBSCRIPTION } from '../../gql'

const lowestRewardsColor = '#B6EBF3'
const highestRewardsColor = '#265F63'
const geoUrl =
  'https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json'

const useStyles = makeStyles((theme) => ({
  action: {
    cursor: 'pointer'
  },
  popover: {
    padding: theme.spacing(2),
    paddingTop: 0
  },
  popoverItem: {
    fontWeight: 'bold'
  },
  popoverClose: {
    textAlign: 'right',
    position: 'sticky',
    background: 'white',
    paddingTop: theme.spacing(2),

    top: 0
  },
  popoverCloseIcon: {
    cursor: 'pointer'
  },
  countryFlag: {
    marginRight: theme.spacing(1)
  },
  countryFlagUnknown: {
    marginRight: theme.spacing(0.5)
  },
  producersList: {
    margin: 0
  },
  mapWrapper: {
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      position: 'absolute',
      zIndex: -999,
      marginTop: theme.spacing(24)
    },
    [theme.breakpoints.up('md')]: {
      marginTop: theme.spacing(20)
    },
    [theme.breakpoints.up('lg')]: {
      width: 'calc(100% - 288px)',
      marginTop: theme.spacing(8)
    }
  },
  geography: {
    outline: 'none',
    cursor: 'pointer'
  },
  lowestRewards: {
    backgroundColor: lowestRewardsColor,
    width: 16,
    height: 16,
    borderRadius: 4,
    display: 'inline-block'
  },
  highestRewards: {
    backgroundColor: highestRewardsColor,
    width: 16,
    height: 16,
    borderRadius: 4,
    display: 'inline-block'
  },
  rewardsColorSchema: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 4
  },
  linearLoader: {
    width: 'calc(100% - 32px)',
    marginTop: -16,
    marginLeft: 16
  },
  itemLabel: {
    minWidth: 120
  }
}))

const Rewards = () => {
  const dispatch = useDispatch()
  const [anchorEl, setAnchorEl] = useState(null)
  const [currentNode, setCurrentNode] = useState(null)
  const [summary, setSummary] = useState(null)
  const {
    data: { producer: producers = [] } = { producers: [] }
  } = useSubscription(PRODUCERS_SUBSCRIPTION)
  const [nodes, setNodes] = useState([])
  const classes = useStyles()
  const { t } = useTranslation('dashboardRewards')
  const rate = useSelector((state) => state.eos.rate)

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
      .range([lowestRewardsColor, highestRewardsColor])
      .interpolate(interpolateHcl),
    [summary]
  )

  useEffect(() => {
    dispatch.eos.getRate()
  }, [dispatch])

  useEffect(() => {
    let stats = {}
    let daylyRewars = 0

    producers
      .filter((a) => a.total_rewards >= 100)
      .forEach((producer) => {
        daylyRewars += producer.total_rewards || 0

        if (!producer?.bp_json?.org?.location?.country) {
          if (!stats['N/A']) {
            stats = {
              ...stats,
              'N/A': {
                code: 'N/A',
                name: t('notAvailable'),
                quantity: 1,
                items: [producer],
                rewards: producer.total_rewards
              }
            }
          } else {
            stats['N/A'].items.push(producer)
            stats['N/A'].rewards += producer.total_rewards
            stats['N/A'].quantity += 1
          }
          return
        }

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
                producer.bp_json.org.location.latitude
              ],
              items: [producer],
              rewards: producer.total_rewards
            }
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
              producer.bp_json.org.location.latitude
            ]
          }
        }
      })

    const nodes = Object.values(stats)
    const topCountryByRewards = nodes.reduce(
      (prev, current) => {
        return current.rewards > prev.rewards && current.code !== 'N/A'
          ? current
          : prev
      },
      { rewards: 0 }
    )

    setSummary({
      daylyRewars,
      topCountryByRewards,
      producersWithoutProperBpJson: stats['N/A']
    })
    setNodes(nodes)
  }, [producers, t])

  return (
    <>
      <Grid item xl={3} lg={3} sm={6} xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6">{t('dailyRewards')}</Typography>
            <Typography variant="h3">
              {!nodes.length > 0 && (
                <Skeleton variant="text" width="100%" animation="wave" />
              )}
              {nodes.length > 0 && (
                <span>
                  {formatWithThousandSeparator(summary.daylyRewars, 2)} EOS
                </span>
              )}
            </Typography>
            <Typography variant="subtitle1">
              {!nodes.length > 0 && (
                <Skeleton variant="text" width="100%" animation="wave" />
              )}
              {nodes.length > 0 && (
                <span>
                  ${formatWithThousandSeparator(summary.daylyRewars * rate, 0)}{' '}
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
        >
          <CardContent>
            <Typography variant="h6">{t('TopCountryDailyRwards')}</Typography>
            <Typography variant="h3">
              {!nodes.length > 0 && (
                <Skeleton variant="text" width="100%" animation="wave" />
              )}
              {nodes.length > 0 && (
                <>
                  <span className={classes.countryFlag}>
                    {summary.topCountryByRewards.flag}
                  </span>
                  {summary.topCountryByRewards.name}{' '}
                </>
              )}
            </Typography>
            <Typography variant="subtitle1">
              {!nodes.length > 0 && (
                <Skeleton variant="text" width="100%" animation="wave" />
              )}
              {nodes.length > 0 && (
                <>
                  {formatWithThousandSeparator(
                    summary.topCountryByRewards.rewards,
                    0
                  )}{' '}
                  EOS / $
                  {formatWithThousandSeparator(
                    summary.topCountryByRewards.rewards * rate,
                    0
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
              variant="h3"
              className={classes.action}
              onClick={handlePopoverOpen(summary?.producersWithoutProperBpJson)}
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
              onClick={handlePopoverOpen(summary?.producersWithoutProperBpJson)}
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
              <span className={classes.itemLabel}>{t('lowestRewards')}: </span>
              <span className={classes.lowestRewards} />
            </Typography>
            <Typography variant="h6" className={classes.rewardsColorSchema}>
              <span className={classes.itemLabel}>{t('highestRewards')}: </span>
              <span className={classes.highestRewards} />
            </Typography>
            {rate && (
              <Typography
                variant="subtitle1"
                className={classes.rewardsColorSchema}
              >
                <span className={classes.itemLabel}>{t('exchangeRate')}: </span>{' '}
                ${formatWithThousandSeparator(rate, 2)}
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
      {!nodes.length && <LinearProgress className={classes.linearLoader} />}
      <Grid item sm={12} className={classes.mapWrapper}>
        <ComposableMap
          projectionConfig={{
            scale: 170
          }}
        >
          <ZoomableGroup maxZoom={1}>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo, i) => {
                  const nodeData = nodes.find(
                    (node) => node.code === geo.properties.ISO_A2
                  )

                  return (
                    <Geography
                      onClick={
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
      </Grid>
      <Popover
        open={anchorEl !== null}
        onClose={handlePopoverClose}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'center'
        }}
      >
        <div className={classes.popover}>
          <div className={classes.popoverClose}>
            <CloseIcon
              className={classes.popoverCloseIcon}
              onClick={handlePopoverClose}
            />
          </div>
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
          <Typography>
            <span className={classes.popoverItem}>{t('rewards')}: </span>
            <span>
              {formatWithThousandSeparator(currentNode?.rewards, 2)} EOS
            </span>
          </Typography>
          <Typography className={classes.popoverItem}>
            {t('producers')}:
          </Typography>
          <ul className={classes.producersList}>
            {currentNode?.items?.map((producer, i) => (
              <li key={`node-${i}`}>
                <Link
                  href={`${producer.owner === 'eosrainbowbp' ? 'http://' : ''}${
                    producer.url
                  }/bp.json`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {producer?.bp_json?.org?.candidate_name || producer.owner}
                </Link>
                <br />
                {formatWithThousandSeparator(producer.total_rewards, 2)} EOS
              </li>
            ))}
          </ul>
        </div>
      </Popover>
    </>
  )
}

Rewards.propTypes = {}

export default Rewards
