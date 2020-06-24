/* eslint camelcase: 0 */
import React, { useEffect, useState } from 'react'
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
  Marker
} from 'react-simple-maps'

import { countries, formatWithThousandSeparator } from '../../utils'
const geoUrl =
  'https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json'

const useStyles = makeStyles((theme) => ({
  map: {
    margin: '-64px 0'
  },
  geography: {
    outline: 'none'
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

  const handlePopoverOpen = (node) => (event) => {
    setCurrentNode(node)
    setAnchorEl(event.currentTarget)
  }

  const handlePopoverClose = () => {
    setAnchorEl(null)
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
        projection="geoEqualEarth"
        projectionConfig={{
          scale: 170
        }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                className={classes.geography}
                fill="#EAEAEC"
                stroke="#D6D6DA"
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
            <span>{currentNode?.url}</span>
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
            <span className={classes.popoverItem}>Country: </span>
            <span className={classes.countryFlag}>
              {currentNode?.country?.flag}
            </span>
            <span>{currentNode?.country?.name}</span>
          </Typography>
          <Typography>
            <span className={classes.popoverItem}>Location: </span>
            <span>{currentNode?.bp_json?.org?.location?.name || 'N/A'}</span>
          </Typography>
          <Typography>
            <span className={classes.popoverItem}>Data from: </span>
            <Link
              href={`${currentNode?.owner === 'eosrainbowbp' ? 'http://' : ''}${
                currentNode?.url
              }/bp.json`}
              target="_blank"
              rel="noopener noreferrer"
            >
              bp.json
            </Link>
          </Typography>
        </div>
      </Popover>
    </Grid>
  )
}

Producers.propTypes = {}

export default Producers
