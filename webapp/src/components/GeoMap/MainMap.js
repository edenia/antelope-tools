import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

import { countries } from '../../utils/countries'

import HighMapsWrapper from './HighMapsWrapper'

const MainMap = ({ data, map, setMap }) => {
  const myRef = useRef()

  const setupMapData = (data = [], map) => {
    const options = {
      title: {
        text: ''
      },
      colorAxis: {
        min: 0,
        max: 19170
      },
      legend: {
        enabled: false
      },
      exporting: {
        enabled: false
      },
      credits: {
        enabled: false
      },
      mapNavigation: {
        enabled: false
      },
      tooltip: {
        headerFormat: '<b>{series.name}</b><br>'
      },
      series: [
        {
          data,
          mapData: map,
          joinBy: ['iso-a2', 'country'],
          name: 'Number of Nodes',
          cursor: 'pointer',
          borderColor: '#8F9DA4',
          nullColor: '#EEEEEE',
          point: {
            events: {
              click: function (e) {
                setMap((e.point.country || '').toLowerCase())
              }
            }
          },
          states: {
            hover: {
              color: '#1565C0'
            }
          },
          dataLabels: {
            enabled: true,
            useHTML: true,
            formatter: function () {
              const node = data.find(
                ({ country }) => country === this.point.country
              )

              return this.point.country
                ? `${
                    countries[this.point.country]?.flag || this.point.country
                  } ${node.value}`
                : null
            }
          }
        }
      ]
    }

    const highMap = new HighMapsWrapper['Map'](myRef.current, options)
    highMap.redraw()
  }

  useEffect(() => {
    if (myRef.current) {
      setupMapData(data, map)
    }
  }, [data, map])

  return <div ref={myRef} style={{ height: '100vh' }} />
}

MainMap.propTypes = {
  data: PropTypes.array,
  map: PropTypes.object,
  setMap: PropTypes.func
}

export default MainMap
