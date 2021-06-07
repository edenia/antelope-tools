import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { findDOMNode } from 'react-dom'
import HighMapsWrapper from './HighMapsWrapper'
import { mapWorld } from './mapWorld'
import { EUROPE_DATA } from './europeData'

const ClusterMap = ({ data }) => {
  const myRef = useRef()

  const setupMapData = (data) => {
    const options = {
      chart: {
        map: mapWorld
      },

      legend: {
        enabled: false
      },
      title: {
        text: 'European Train Stations Near Airports'
      },
      subtitle: {
        text:
          'Source: <a href="https://github.com/trainline-eu/stations">' +
          'github.com/trainline-eu/stations</a>'
      },
      mapNavigation: {
        enabled: true,
        enableMouseWheelZoom: false
      },
      tooltip: {
        formatter: function () {
          const point = this.point

          console.log(point)

          // return '<b>{point.name}</b><br>Lat: {point.lat:.2f}, Lon: {point.lon:.2f}'
          return '<div style="border=1px solid red; width=100px; height=100px background-color=blue"></div>'
        }
        // headerFormat: '',
        // pointFormat:
        //   '<b>{point.name}</b><br>Lat: {point.lat:.2f}, Lon: {point.lon:.2f}'
      },
      colorAxis: {
        min: 0,
        max: 20
      },
      plotOptions: {
        mappoint: {
          cluster: {
            enabled: true,
            layoutAlgorithm: {
              type: 'optimalizedKmeans'
            },
            allowOverlap: true,
            animation: {
              duration: 450
            }
          }
        }
      },
      series: [
        {
          name: 'Basemap',
          borderColor: '#A0A0A0',
          // nullColor: 'rgba(177, 244, 177, 0.5)',
          showInLegend: false
        },
        {
          type: 'mappoint',
          enableMouseTracking: true,
          colorKey: 'clusterPointsAmount',
          name: 'Countries',
          data: data || [] //EUROPE_DATA
        }
      ]
    }

    new HighMapsWrapper['Map'](findDOMNode(myRef.current), options)
  }

  useEffect(() => {
    if (myRef.current) {
      setupMapData()
    }
  }, [])

  useEffect(() => {
    if (myRef.current) {
      setupMapData(data)
    }
  }, [data])

  return (
    <div ref={myRef} style={{ border: '1px solid green', height: '100vh' }} />
  )
}

ClusterMap.propTypes = {
  data: PropTypes.array
}

export default ClusterMap
