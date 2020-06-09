import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/styles'
import { useDispatch, useSelector } from 'react-redux'
import Grid from '@material-ui/core/Grid'
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker
} from 'react-simple-maps'

const geoUrl =
  'https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json'

const useStyles = makeStyles(() => ({
  map: {
    margin: '-64px 0'
  }
}))

const Producers = () => {
  const dispatch = useDispatch()
  const producers = useSelector((state) => state.eos.producers)
  const [nodes, setNodes] = useState([])
  const classes = useStyles()

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
          coordinates: [node.location.longitude, node.location.latitude]
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
                fill="#EAEAEC"
                stroke="#D6D6DA"
              />
            ))
          }
        </Geographies>
        {nodes.map(({ name, coordinates, markerOffset }, i) => (
          <Marker key={`marker-${i}`} coordinates={coordinates}>
            <g
              fill="none"
              stroke="#3CBDD5"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              transform="translate(-12, -24)"
            >
              <circle cx="12" cy="10" r="3" />
              <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z" />
            </g>
            <text
              textAnchor="middle"
              y={markerOffset}
              style={{ fontFamily: 'system-ui', fill: '#5D5A6D' }}
            >
              {name}
            </text>
          </Marker>
        ))}
      </ComposableMap>
    </Grid>
  )
}

Producers.propTypes = {}

export default Producers
