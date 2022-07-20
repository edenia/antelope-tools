import React, { useEffect, useRef, useState, useCallback } from 'react'
import { makeStyles } from '@mui/styles'
import PropTypes from 'prop-types'

import { countries } from '../../utils/countries'
import Tooltip from '../Tooltip'
import NodeCard from '../NodeCard'

import HighMapsWrapper from './HighMapsWrapper'
import styles from './styles'

const useStyles = makeStyles(styles)

const ClusterMap = ({ data, map, mapCode }) => {
  const classes = useStyles()
  const myRef = useRef()
  const [openTooltip, setOpenTooltip] = useState(false)
  const [pointData, setPointData] = useState({
    vertical: 'center',
    horizontal: 'center'
  })

  const handlePopoverOpen = useCallback((values) => {
    setPointData(values)
    setOpenTooltip(true)
  }, [])

  const handlePopoverClose = () => {
    setOpenTooltip(false)
  }

  const setupMapData = useCallback(
    (data, map, mapCode = '') => {
      const options = {
        chart: {
          map
        },
        legend: {
          enabled: false
        },
        title: {
          text: countries[mapCode].name
        },
        mapNavigation: {
          enableButtons: false,
          enabled: false,
          enableDoubleClickZoom: false,
          enableDoubleClickZoomTo: false,
          enableMouseWheelZoom: false,
          enableTouchZoom: false
        },
        tooltip: {
          enabled: false
        },
        colorAxis: {
          min: 0,
          max: 20
        },
        credits: {
          enabled: false
        },
        plotOptions: {
          series: {
            events: {
              click: function (e) {
                handlePopoverOpen({
                  node: e.point.node,
                  producer: e.point.producer,
                  horizontal: e.screenX,
                  vertical: e.screenY
                })
              }
            }
          }
        },
        series: [
          {
            name: 'NodeDistribution',
            borderColor: '#8F9DA4',
            nullColor: '#EEEEEE',
            showInLegend: false
          },
          {
            cursor: 'pointer',
            type: 'mappoint',
            enableMouseTracking: true,
            colorKey: 'clusterPointsAmount',
            name: 'Countries',
            data: data || []
          }
        ]
      }

      // eslint-disable-next-line
      const highMap = new HighMapsWrapper['Map'](myRef.current, options)
      highMap.redraw()
    },
    [handlePopoverOpen]
  )

  useEffect(() => {
    if (myRef.current) {
      setupMapData(data, map, mapCode)
    }
  }, [data, map, mapCode, setupMapData])

  return (
    <>
      <div ref={myRef} className={classes.divRef} />
      <Tooltip
        open={openTooltip}
        onClose={handlePopoverClose}
        anchorEl={null}
        anchorOrigin={{
          vertical: pointData.vertical,
          horizontal: pointData.horizontal
        }}
      >
        <NodeCard node={pointData?.node} producer={pointData?.producer} />
      </Tooltip>
    </>
  )
}

ClusterMap.propTypes = {
  data: PropTypes.array,
  map: PropTypes.object,
  mapCode: PropTypes.string
}

export default ClusterMap
