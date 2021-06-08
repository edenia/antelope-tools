import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'

import Tooltip from '../Tooltip'
import NodeCard from '../NodeCard'

import HighMapsWrapper from './HighMapsWrapper'
import { mapWorld } from './mapWorld'

const ClusterMap = ({ data }) => {
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

  const setupMapData = (data) => {
    const options = {
      chart: {
        map: mapWorld
      },

      legend: {
        enabled: false
      },
      title: {
        text: ''
      },
      mapNavigation: {
        enabled: true,
        enableMouseWheelZoom: false
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
              if (!e.point.category || e.point.clusteredData) return

              handlePopoverOpen(e.target, e.point.dataGroup.options)
            }
          }
        },
        mappoint: {
          cluster: {
            enabled: true,
            allowOverlap: true,
            marker: {
              fillColor: '#1565c0'
            },
            animation: {
              duration: 450
            },
            layoutAlgorithm: {
              type: 'grid',
              gridSize: 40
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
      setupMapData()
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (myRef.current) {
      setupMapData(data)
    }
    // eslint-disable-next-line
  }, [data])

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
  data: PropTypes.array
}

export default ClusterMap
