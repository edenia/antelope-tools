/* eslint camelcase: 0 */
import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/styles'
import { useDispatch, useSelector } from 'react-redux'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Grid from '@material-ui/core/Grid'
import Popover from '@material-ui/core/Popover'
import CloseIcon from '@material-ui/icons/Close'
import Typography from '@material-ui/core/Typography'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import Link from '@material-ui/core/Link'
import LinearProgress from '@material-ui/core/LinearProgress'
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup
} from 'react-simple-maps'
import { geoTimes } from 'd3-geo-projection'
import { geoPath } from 'd3-geo'

import { countries, formatWithThousandSeparator, onImgError } from '../../utils'
import { eosConfig, generalConfig } from '../../config'

const defaultScale = 170
const maxZoom = 3
const projection = geoTimes()
const geoUrl =
  'https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json'

const useStyles = makeStyles((theme) => ({
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
    outline: 'none',
    cursor: 'zoom-in'
  },
  geographyZoomOut: {
    cursor: 'zoom-out'
  },
  marker: {
    cursor: 'pointer'
  },
  popover: {
    padding: theme.spacing(2),
    paddingTop: 0
  },
  popoverItem: {
    fontWeight: 'bold',
    marginRight: 4
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
    marginRight: 4
  },
  formControl: {
    width: '100%'
  },
  nodeTypeColorWrapper: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  nodeTypeColorItem: {
    display: 'flex',
    alignItems: 'center',
    width: '50%',
    cursor: 'pointer'
  },
  producer: {
    backgroundColor: eosConfig.nodeTypes[0].color,
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 4
  },
  full: {
    backgroundColor: eosConfig.nodeTypes[1].color,
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 4
  },
  query: {
    backgroundColor: eosConfig.nodeTypes[2].color,
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 4
  },
  seed: {
    backgroundColor: eosConfig.nodeTypes[3].color,
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 4
  },
  logo: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    display: 'inline-block',
    width: '2em',
    height: '2em',
    borderRadius: '500rem'
  },
  capitalize: {
    textTransform: 'capitalize'
  },
  centerVertically: {
    display: 'flex',
    alignItems: 'center'
  }
}))

const Producers = () => {
  const dispatch = useDispatch()
  const producers = useSelector((state) => state.eos.producers)
  const [nodes, setNodes] = useState([])
  const [currentNode, setCurrentNode] = useState(null)
  const [anchorEl, setAnchorEl] = useState(null)
  const [nodeTypeFilter, setNodeTypeFilter] = useState('all')
  const [producerFilter, setProducerFilter] = useState('all')
  const [allNodes, setAllNodes] = useState([])
  const classes = useStyles()
  const [mapState, setMapState] = useState({
    scale: defaultScale,
    center: [0, 0],
    zoom: 1
  })

  const handlePopoverOpen = (node) => (event) => {
    setCurrentNode(node)
    setAnchorEl(event.currentTarget)
  }

  const handlePopoverClose = () => {
    setAnchorEl(null)
  }

  const toogleZoom = (geography) => {
    if (mapState.zoom === maxZoom) {
      setMapState((state) => ({
        ...state,
        center: [0, 0],
        zoom: 1,
        scale: defaultScale
      }))

      return
    }

    const path = geoPath().projection(projection)
    const center = projection.invert(path.centroid(geography))

    setMapState((state) => ({
      ...state,
      center,
      zoom: maxZoom,
      scale: defaultScale * maxZoom
    }))
  }

  useEffect(() => {
    dispatch.eos.getProducers()
  }, [dispatch])

  useEffect(() => {
    const items = []
    producers.rows.forEach((producer) => {
      if (!producer?.bp_json?.nodes) {
        return
      }

      producer.bp_json.nodes.forEach((node) => {
        if (!node?.location?.latitude || !node?.location?.longitude) {
          return
        }

        items.push({
          coordinates: [node.location.longitude, node.location.latitude],
          node_type: node.node_type,
          country: {
            name: countries[producer.bp_json.org.location.country]?.name,
            flag: countries[producer.bp_json.org.location.country]?.flag
          },
          ...producer
        })
      })
    })

    setAllNodes(items)
  }, [producers])

  useEffect(() => {
    let items = allNodes

    if (nodeTypeFilter !== 'all') {
      items = items.filter((node) => node.node_type === nodeTypeFilter)
    }

    if (producerFilter !== 'all') {
      items = items.filter((node) => node.owner === producerFilter)
    }

    setNodes(items)
  }, [allNodes, nodeTypeFilter, producerFilter])

  return (
    <>
      <Grid item sm={12}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <FormControl className={classes.formControl}>
                  <InputLabel id="producerFilterLabel">Producer</InputLabel>
                  <Select
                    classes={{
                      root: classes.centerVertically
                    }}
                    labelId="producerFilterLabel"
                    id="producerFilter"
                    value={producerFilter}
                    onChange={(e) => setProducerFilter(e.target.value)}
                  >
                    <MenuItem value="all">All</MenuItem>
                    {producers.rows.map((producer) => (
                      <MenuItem
                        key={`menu-item-${producer.owner}`}
                        value={producer.owner}
                        className={classes.centerVertically}
                      >
                        <img
                          className={classes.logo}
                          src={
                            producer?.bp_json?.org?.branding?.logo_256 ||
                            generalConfig.defaultProducerLogo
                          }
                          onError={onImgError(
                            generalConfig.defaultProducerLogo
                          )}
                          alt="logo"
                        />
                        {producer.owner}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <FormControl className={classes.formControl}>
                  <InputLabel id="nodeTypeFilterLabel">Node type</InputLabel>
                  <Select
                    classes={{
                      root: classes.capitalize
                    }}
                    labelId="nodeTypeFilterLabel"
                    id="nodeTypeFilter"
                    value={nodeTypeFilter}
                    onChange={(e) => setNodeTypeFilter(e.target.value)}
                  >
                    <MenuItem value="all">All</MenuItem>
                    {eosConfig.nodeTypes.map((nodeType) => (
                      <MenuItem
                        key={`menu-item-${nodeType.name}`}
                        className={classes.centerVertically}
                        value={nodeType.name}
                      >
                        <span className={classes[nodeType.name]} />
                        <span className={classes.capitalize}>
                          {nodeType.name}
                        </span>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent className={classes.nodeTypeColorWrapper}>
                {eosConfig.nodeTypes.map((nodeType) => (
                  <Typography
                    key={`node-type=${nodeType.name}`}
                    variant="h6"
                    className={classes.nodeTypeColorItem}
                    onClick={handlePopoverOpen(nodeType)}
                  >
                    <span className={classes[nodeType.name]} />
                    <span className={classes.capitalize}>{nodeType.name}</span>
                  </Typography>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        {!nodes.length && <LinearProgress />}
      </Grid>
      <Grid item sm={12} className={classes.mapWrapper}>
        <ComposableMap
          className={classes.map}
          projectionConfig={{
            scale: mapState.scale
          }}
        >
          <ZoomableGroup center={mapState.center} maxZoom={1}>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    onClick={() => toogleZoom(geo)}
                    className={clsx({
                      [classes.geography]: true,
                      [classes.geographyZoomOut]: mapState.zoom === maxZoom
                    })}
                    key={geo.rsmKey}
                    geography={geo}
                    stroke="#8F9DA4"
                    fill="#EEEEEE"
                  />
                ))
              }
            </Geographies>
            {nodes.map(({ coordinates, ...node }, i) => (
              <Marker
                key={`marker-${i}`}
                coordinates={coordinates}
                className={classes.marker}
                onClick={handlePopoverOpen(node)}
              >
                <g
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  transform="translate(-12, -24)"
                >
                  <path
                    d="M12 21.7 C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 12z"
                    fill={
                      (
                        eosConfig.nodeTypes.find(
                          (noteType) => noteType.name === node.node_type
                        ) || {}
                      ).color
                    }
                  />
                  <circle cx="12" cy="10" r="3" fill="white" />
                </g>
              </Marker>
            ))}
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
          {currentNode?.color && (
            <>
              <Typography>
                <span className={classes.popoverItem}>Type:</span>
                <span className={classes.capitalize}>{currentNode?.name}</span>
              </Typography>
              <Typography>
                <span className={classes.popoverItem}>Description:</span>
                <span>{currentNode?.description}</span>
              </Typography>
              <Typography className={classes.centerVertically}>
                <span className={classes.popoverItem}>Color:</span>
                <span className={classes[currentNode?.name]} />
              </Typography>
            </>
          )}
          {currentNode?.owner && (
            <>
              <Typography>
                <span className={classes.popoverItem}>Account:</span>
                <Link
                  href={`${generalConfig.eosRateLink}/block-producers/${currentNode?.owner}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {currentNode?.owner}
                </Link>
              </Typography>
              <Typography>
                <span className={classes.popoverItem}>Website:</span>
                <span>
                  <Link
                    href={currentNode?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {currentNode?.url}
                  </Link>
                </span>
              </Typography>
              <Typography>
                <span className={classes.popoverItem}>Votes:</span>
                <span>
                  {formatWithThousandSeparator(currentNode?.total_votes_eos, 2)}
                </span>
              </Typography>
              <Typography>
                <span className={classes.popoverItem}>Rewards:</span>
                <span>
                  {formatWithThousandSeparator(currentNode?.total_reward, 2)}
                </span>
              </Typography>
              <Typography>
                <span className={classes.popoverItem}>Producer country:</span>
                <span className={classes.countryFlag}>
                  {currentNode?.country?.flag}
                </span>
                <span>{currentNode?.country?.name}</span>
              </Typography>
              <Typography>
                <span className={classes.popoverItem}>Node type:</span>
                <span className={classes.capitalize}>
                  {currentNode?.node_type || 'N/A'}
                </span>
              </Typography>
            </>
          )}
        </div>
      </Popover>
    </>
  )
}

Producers.propTypes = {}

export default Producers
