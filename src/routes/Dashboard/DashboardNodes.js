/* eslint camelcase: 0 */
import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/styles'
import { useDispatch, useSelector } from 'react-redux'
import Grid from '@material-ui/core/Grid'
import Popover from '@material-ui/core/Popover'
import CloseIcon from '@material-ui/icons/Close'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup
} from 'react-simple-maps'
import { geoTimes } from 'd3-geo-projection'
import { geoPath } from 'd3-geo'

import { countries, formatWithThousandSeparator } from '../../utils'

const defaultScale = 170
const maxZoom = 3
const projection = geoTimes()
const geoUrl =
  'https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json'

const useStyles = makeStyles((theme) => ({
  map: {
    margin: '-64px 0'
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
    fontWeight: 'bold'
  },
  popoverCapitalize: {
    textTransform: 'capitalize'
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
  }
}))

const Producers = () => {
  const dispatch = useDispatch()
  const producers = useSelector((state) => state.eos.producers)
  const [nodes, setNodes] = useState([])
  const [currentNode, setCurrentNode] = useState(null)
  const [anchorEl, setAnchorEl] = useState(null)
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
    setNodes(items)
  }, [producers])

  return (
    <Grid item sm={12} className={classes.map}>
      <ComposableMap
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
                <path d="M12 21.7 C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 12z" />
                <circle cx="12" cy="10" r="3" fill="white" />
              </g>
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>
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
            <span className={classes.popoverItem}>Account: </span>
            <span>{currentNode?.owner}</span>
          </Typography>
          <Typography>
            <span className={classes.popoverItem}>Website: </span>
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
            <span className={classes.popoverItem}>Votes: </span>
            <span>
              {formatWithThousandSeparator(currentNode?.total_votes_eos, 2)}
            </span>
          </Typography>
          <Typography>
            <span className={classes.popoverItem}>Rewards: </span>
            <span>
              {formatWithThousandSeparator(currentNode?.total_reward, 2)}
            </span>
          </Typography>
          <Typography>
            <span className={classes.popoverItem}>Producer country: </span>
            <span className={classes.countryFlag}>
              {currentNode?.country?.flag}
            </span>
            <span>{currentNode?.country?.name}</span>
          </Typography>
          <Typography>
            <span className={classes.popoverItem}>Node type: </span>
            <span className={classes.popoverCapitalize}>
              {currentNode?.node_type || 'N/A'}
            </span>
          </Typography>
        </div>
      </Popover>
    </Grid>
  )
}

Producers.propTypes = {}

export default Producers
