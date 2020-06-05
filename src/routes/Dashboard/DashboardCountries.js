import React, { useEffect, useState, useCallback } from 'react'
import { makeStyles } from '@material-ui/styles'
import { useDispatch, useSelector } from 'react-redux'
import Grid from '@material-ui/core/Grid'
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker
} from 'react-simple-maps'
import { scaleQuantile } from 'd3-scale'
import TreeView from '@material-ui/lab/TreeView'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import TreeItem from '@material-ui/lab/TreeItem'
import Tooltip from '@material-ui/core/Tooltip'

const geoUrl =
  'https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json'

const useStyles = makeStyles(() => ({
  map: {
    margin: '-112px 0'
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'row'
  },
  item: {
    flex: 1
  },
  ul: {
    marginTop: 104
  },
  path: {
    outline: 'none'
  }
}))

const Countries = () => {
  const dispatch = useDispatch()
  const producers = useSelector((state) => state.eos.producers)
  const [nodes, setNodes] = useState([])
  const classes = useStyles()

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
    dispatch.eos.startTrackingProducers({ interval: 60000 })
  }, [dispatch])

  useEffect(() => {
    let stats = {}
    producers.rows.forEach((producer) => {
      if (!producer?.bpJSON?.org?.location?.country) {
        return
      }

      if (!stats[producer.bpJSON.org.location.country]) {
        stats = {
          ...stats,
          [producer.bpJSON.org.location.country]: {
            code: producer.bpJSON.org.location.country,
            name: producer.bpJSON.org.location.name,
            quantity: 1,
            coordinates: [
              producer.bpJSON.org.location.longitude,
              producer.bpJSON.org.location.latitude
            ],
            items: [producer.bpJSON.org.candidate_name]
          }
        }
      } else {
        stats[producer.bpJSON.org.location.country].items.push(
          producer.bpJSON.org.candidate_name
        )
        stats[producer.bpJSON.org.location.country].quantity += 1
        stats[producer.bpJSON.org.location.country].coordinates = [
          producer.bpJSON.org.location.longitude,
          producer.bpJSON.org.location.latitude
        ]
      }
    })

    setNodes(Object.values(stats))
  }, [producers])

  return (
    <Grid item sm={12} className={classes.map}>
      <div className={classes.wrapper}>
        <TreeView
          className={classes.ul}
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
        >
          {nodes.map((node, i) => (
            <TreeItem
              key={`tree-${i}`}
              nodeId={`tree-${i}`}
              label={`${node.code} (${node.quantity})`}
            >
              {node.items.map((label, j) => (
                <TreeItem
                  nodeId={`tree-${i}-${j}`}
                  key={`tree-${i}-${j}`}
                  label={label}
                />
              ))}
            </TreeItem>
          ))}
        </TreeView>
        <ComposableMap
          className={classes.item}
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
                  <Tooltip
                    key={`toltip-geo-${i}`}
                    title={nodeData ? nodeData.items.join(', ') : ''}
                  >
                    <Geography
                      className={classes.path}
                      key={geo.rsmKey}
                      geography={geo}
                      stroke="#D6D6DA"
                      fill={nodeData ? colorScale(nodeData.quantity) : '#EEE'}
                      style={{
                        hover: {
                          fill: 'blue',
                          outline: 'none'
                        }
                      }}
                    />
                  </Tooltip>
                )
              })
            }
          </Geographies>
          {nodes.map(({ code, quantity, coordinates }, i) => (
            <Marker key={`marker-${i}`} coordinates={coordinates}>
              <g
                fill="none"
                stroke="#000"
                fontSize="16px"
                strokeWidth="0.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                transform="translate(-12, -24)"
              >
                <text
                  textAnchor="middle"
                  y={15}
                  x={12}
                  style={{ fontFamily: 'system-ui', fill: '#000' }}
                >
                  {code} ({quantity})
                </text>
              </g>
            </Marker>
          ))}
        </ComposableMap>
      </div>
    </Grid>
  )
}

Countries.propTypes = {}

export default Countries
