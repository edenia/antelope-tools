import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'

import { countries } from '../../utils/countries'
import Tooltip from '../Tooltip'
import NodeCard from '../NodeCard'

import HighMapsWrapper from './HighMapsWrapper'

const ClusterMap = ({ data, map, mapCode }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [pointData, setPointData] = useState({})
  const myRef = useRef()

  const handlePopoverOpen = (target, values) => {
    setPointData(values)
    setAnchorEl(target)
  }

  const handlePopoverClose = () => {
    setAnchorEl(null)
  }

  const setupMapData = (data, map, mapCode = '') => {
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
        enabled: true,
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
              handlePopoverOpen(e.target, {
                node: e.point.node,
                producer: e.point.producer
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
  }

  useEffect(() => {
    if (myRef.current) {
      setupMapData(data, map, mapCode)
    }
    // eslint-disable-next-line
  }, [data, map, mapCode])

  return (
    <>
      <div ref={myRef} style={{ height: '100vh' }} />
      <Tooltip
        anchorEl={anchorEl}
        open={anchorEl !== null}
        onClose={handlePopoverClose}
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
