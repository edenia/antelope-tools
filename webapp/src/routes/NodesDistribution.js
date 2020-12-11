/* eslint camelcase: 0 */
import React, { useEffect, useState, lazy } from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/styles'
import { useLazyQuery } from '@apollo/react-hooks'
import LinearProgress from '@material-ui/core/LinearProgress'
import Box from '@material-ui/core/Box'
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup
} from 'react-simple-maps'
import { geoTimes } from 'd3-geo-projection'
import { geoPath } from 'd3-geo'

import { eosConfig } from '../config'
import { NODES_QUERY } from '../gql'
import Tooltip from '../components/Tooltip'
import NodeCard from '../components/NodeCard'

const Pagination = lazy(() => import('@material-ui/lab/Pagination'))
const NodeSearch = lazy(() => import('../components/NodeSearch'))

const defaultScale = 170
const maxZoom = 3
const projection = geoTimes()
const geoUrl =
  'https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json'

const useStyles = makeStyles((theme) => ({
  mapWrapper: {
    width: '100%'
  },
  geography: {
    outline: 'none',
    cursor: 'zoom-in'
  },
  geographyZoomOut: {
    cursor: 'zoom-out'
  },
  pagination: {
    padding: theme.spacing(3),
    display: 'flex',
    justifyContent: 'center'
  },
  marker: {
    cursor: 'pointer'
  }
}))

const Nodes = () => {
  const [
    loadProducers,
    { loading = true, data: { producers, info } = {} }
  ] = useLazyQuery(NODES_QUERY)
  const [nodes, setNodes] = useState([])
  const [current, setCurrent] = useState(null)
  const [anchorEl, setAnchorEl] = useState(null)
  const [filters, setFilters] = useState({ nodeType: 'all' })
  const [allNodes, setAllNodes] = useState([])
  const [pagination, setPagination] = useState({ page: 1, pages: 1, limit: 28 })
  const classes = useStyles()
  const [mapState, setMapState] = useState({
    scale: defaultScale,
    center: [0, 0],
    zoom: 1
  })

  const handleOnFiltersChange = (newFilters) => {
    if (!newFilters.owner && filters.owner) {
      setPagination((prev) => ({ ...prev, page: 1, where: null }))
    }

    if (newFilters.owner) {
      setPagination((prev) => ({
        ...prev,
        page: 1,
        where: { owner: { _like: `%${newFilters.owner}%` } }
      }))
    }

    setFilters(newFilters)
  }

  const handleOnPageChange = (_, page) => {
    setPagination((prev) => ({
      ...prev,
      page
    }))
  }

  const handlePopoverOpen = (node) => (event) => {
    setCurrent(node)
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
    loadProducers({
      variables: {
        where: pagination.where,
        offset: (pagination.page - 1) * pagination.limit,
        limit: pagination.limit
      }
    })
    // eslint-disable-next-line
  }, [pagination.where, pagination.page, pagination.limit])

  useEffect(() => {
    if (!info) {
      return
    }

    setPagination((prev) => ({
      ...prev,
      pages: Math.ceil(info.producers?.count / pagination.limit)
    }))
  }, [info, pagination.limit])

  useEffect(() => {
    if (!producers?.length) {
      return
    }

    const items = []
    producers.forEach((producer) => {
      if (!producer?.bp_json?.nodes) {
        return
      }

      producer.bp_json.nodes.forEach((node) => {
        if (!node?.location?.latitude || !node?.location?.longitude) {
          return
        }

        items.push({
          node,
          producer,
          coordinates: [node.location.longitude, node.location.latitude]
        })
      })
    })

    setAllNodes(items)
  }, [producers])

  useEffect(() => {
    let items = allNodes

    if (filters.nodeType !== 'all') {
      items = items.filter(
        (current) => current.node.node_type === filters.nodeType
      )
    }

    setNodes(items)
  }, [allNodes, filters])

  return (
    <Box>
      <NodeSearch
        producers={producers}
        filters={filters}
        onChange={handleOnFiltersChange}
      />
      {loading && <LinearProgress />}
      {!loading && (
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
            {nodes.map(({ coordinates, ...current }, i) => (
              <Marker
                key={`marker-${i}`}
                coordinates={coordinates}
                className={classes.marker}
                onClick={handlePopoverOpen(current)}
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
                          (noteType) => noteType.name === current.node.node_type
                        ) || {}
                      ).color || '#f58a42'
                    }
                  />
                  <circle cx="12" cy="10" r="3" fill="white" />
                </g>
              </Marker>
            ))}
          </ZoomableGroup>
        </ComposableMap>
      )}
      <Tooltip
        anchorEl={anchorEl}
        open={anchorEl !== null}
        onClose={handlePopoverClose}
      >
        <NodeCard node={current?.node} producer={current?.producer} />
      </Tooltip>
      {!loading && pagination.pages > 1 && (
        <Pagination
          className={classes.pagination}
          count={pagination.pages}
          page={pagination.page}
          onChange={handleOnPageChange}
          variant="outlined"
          shape="rounded"
        />
      )}
    </Box>
  )
}

Nodes.propTypes = {}

export default Nodes
