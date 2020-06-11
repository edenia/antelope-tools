import React, { useEffect, useState, useCallback } from 'react'
import { makeStyles } from '@material-ui/styles'
import { useDispatch, useSelector } from 'react-redux'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Popover from '@material-ui/core/Popover'
import CloseIcon from '@material-ui/icons/Close'
import Link from '@material-ui/core/Link'
import Skeleton from '@material-ui/lab/Skeleton'
import { scaleQuantile } from 'd3-scale'
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker
} from 'react-simple-maps'

import UnknowFlagIcon from '../../components/UnknowFlagIcon'
import { countries, formatWithThousandSeparator } from '../../utils'

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
      marginTop: theme.spacing(4)
    }
  },
  geography: {
    outline: 'none'
  },
  marker: {
    cursor: 'pointer'
  }
}))

const Rewards = () => {
  const dispatch = useDispatch()
  const [anchorEl, setAnchorEl] = useState(null)
  const [currentNode, setCurrentNode] = useState(null)
  const [summary, setSummary] = useState(null)
  const producers = useSelector((state) => state.eos.producers)
  const [nodes, setNodes] = useState([])
  const classes = useStyles()

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
    scaleQuantile()
      .domain(nodes.map((stat) => stat.quantity))
      .range([
        '#ffedea',
        '#ffcec5',
        '#ffad9f',
        '#ff8a75',
        '#ff5533',
        '#e2492d',
        '#be3d26',
        '#9a311f',
        '#782618'
      ]),
    [nodes]
  )

  useEffect(() => {
    dispatch.eos.getProducers()
  }, [dispatch])

  useEffect(() => {
    let stats = {}
    let daylyRewars = 0

    producers.rows.forEach((producer) => {
      daylyRewars += producer.total_reward || 0

      if (!producer?.bp_json?.org?.location?.country) {
        if (!stats['N/A']) {
          stats = {
            ...stats,
            'N/A': {
              code: 'N/A',
              name: 'Bermuda Triangle',
              quantity: 1,
              coordinates: [-77.0877282, 25.003077],
              items: [producer],
              rewards: producer.total_reward
            }
          }
        } else {
          stats['N/A'].items.push(producer)
          stats['N/A'].rewards += producer.total_reward
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
            rewards: producer.total_reward
          }
        }
      } else {
        stats[producer.bp_json.org.location.country].items.push(producer)
        stats[producer.bp_json.org.location.country].rewards +=
          producer.total_reward
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
    const topCountryByRewards = nodes.reduce((prev, current) => {
      return prev.rewards > current.rewards ? prev : current
    }, {})

    setSummary({
      daylyRewars,
      topCountryByRewards,
      producersWithoutProperBpJson: stats['N/A']
    })
    setNodes(nodes)
  }, [producers])

  return (
    <>
      <Grid item xl={3} lg={3} sm={6} xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6">Daily rewards</Typography>
            <Typography variant="h3">
              {!nodes.length > 0 && (
                <Skeleton variant="text" width={'100%'} animation="wave" />
              )}
              {nodes.length > 0 &&
                formatWithThousandSeparator(summary.daylyRewars, 2)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xl={3} lg={3} sm={6} xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6">Top country by rewards</Typography>
            <Typography
              variant="h3"
              className={classes.action}
              onClick={handlePopoverOpen(summary?.topCountryByRewards)}
            >
              {!nodes.length > 0 && (
                <Skeleton variant="text" width={'100%'} animation="wave" />
              )}
              {nodes.length > 0 && (
                <>
                  <span className={classes.countryFlag}>
                    {summary.topCountryByRewards.flag}
                  </span>
                  {summary.topCountryByRewards.name}{' '}
                  {formatWithThousandSeparator(
                    summary.topCountryByRewards.rewards,
                    2
                  )}
                </>
              )}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xl={3} lg={3} sm={6} xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6">
              Producers without a proper bpjson
            </Typography>
            <Typography
              variant="h3"
              className={classes.action}
              onClick={handlePopoverOpen(summary?.producersWithoutProperBpJson)}
            >
              {!nodes.length > 0 && (
                <Skeleton variant="text" width={'100%'} animation="wave" />
              )}
              {nodes.length > 0 &&
                summary.producersWithoutProperBpJson.quantity}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xl={3} lg={3} sm={6} xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6">Producers analyzed</Typography>
            <Typography variant="h3">
              {!nodes.length > 0 && (
                <Skeleton variant="text" width={'100%'} animation="wave" />
              )}
              {nodes.length > 0 && producers.rows.length}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item sm={12} className={classes.mapWrapper}>
        <ComposableMap
          projection="geoEqualEarth"
          projectionConfig={{
            scale: 170
          }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo, i) => {
                const nodeData = nodes.find(
                  (node) => node.code === geo.properties.ISO_A2
                )

                return (
                  <Geography
                    className={classes.geography}
                    key={geo.rsmKey}
                    geography={geo}
                    stroke="#D6D6DA"
                    fill={nodeData ? colorScale(nodeData.quantity) : '#EEE'}
                  />
                )
              })
            }
          </Geographies>
          {nodes.map(({ coordinates, ...node }, i) => (
            <Marker
              key={`marker-${i}`}
              coordinates={coordinates}
              onClick={handlePopoverOpen(node)}
              className={classes.marker}
            >
              <g
                strokeLinecap="round"
                strokeLinejoin="round"
                transform="translate(-12, -24)"
              >
                <path d="M12 21.7 C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 12z" />
                <circle cx="12" cy="10" r="3" fill="white" />
              </g>
            </Marker>
          ))}
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
            <span className={classes.popoverItem}>Country: </span>
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
            <span className={classes.popoverItem}>Rewards: </span>
            <span>
              {formatWithThousandSeparator(currentNode?.rewards, 2)} EOS
            </span>
          </Typography>
          <Typography className={classes.popoverItem}>Producers:</Typography>
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
